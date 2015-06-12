exports.listarDoAluno = function (req,res){console.log('listar atividades do aluno')};
exports.listarIntegrantes = function (req,res){console.log('listar integrantes da atividade')};
exports.listarContribuicoesDaAtividade = function (req,res){console.log('listar contribuicoes na atividade')};
exports.listarContribuicoesDeIntegrante = function (req,res){console.log('listar atividades do aluno')};
exports.consultar = function (req,res){console.log('consultar atividade')};

var fs = require("fs");
var S = require("string");
var formidable = require("formidable");
var dateTime = require("../lib/utils/dateTime");
var mime = require("mime");
var path = require("path");

function ehTipoArquivoValido(tipoArquivo) {
	var tiposPermitidos = [
		"application/msword",
		"text/xml",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	];

	var valido = false;

	tiposPermitidos.forEach(function(tipoPermitido) {
		if (tipoArquivo === tipoPermitido) {
			valido = true;
		}
	});

	return valido;
}

exports.postarContribuicao = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	
	var atividade = req.params.atividade;
	var matricula = req.params.matricula;
	
	var form = new formidable.IncomingForm(),
		files = [],
		fields = [];

	form.uploadDir = "./contribuicoes";
	form.keepExtensions = true;

	var MB = 1024 * 1024;
	var tamanhoMaximoArquivo = 2 * MB; //2MB
	var uploadCancelado = false;
	var motivoCancelamento = "";

	form
		.on('field', function(field, value) {
			fields.push({
				"nome": field,
				"valor": value
			});
		})
		.on('file', function(field, file) {

			if (!(atividade && matricula)) {
				uploadCancelado = true;
				motivoCancelamento = "matricula e atividade obrigatórios";
			}

			if (!ehTipoArquivoValido(file.type)) {
				uploadCancelado = true;
				motivoCancelamento = "Formato de arquivo não permitido";
			}

			if (uploadCancelado) {
				fs.unlink(file.path);
				serviceResponse.requisicaoNaoAtendida(motivoCancelamento);
			}
			else {
				var nomeAtividade = "";
				var nomeMatricula = "";

				fields.forEach(function(campo) {
					if (campo.nome === "atividade") {
						nomeAtividade = campo.valor;
					}
					if (campo.nome === "matricula") {
						nomeMatricula = campo.valor;
					}
				});

				var pastaDaAtividade = form.uploadDir + "/" + nomeAtividade;
				if (!fs.existsSync(pastaDaAtividade)) {
					fs.mkdir(pastaDaAtividade, function(error) {
						console.log(error);
					});
				}
				var versao = dateTime.getDateTimeNumber();
				var nomeArquivo = file.name.replace(/\W+/g, '-').toLowerCase();
				//Grava a versão atual da contribuição do aluno
				var arquivoUsuario = pastaDaAtividade + "/user_" + nomeMatricula + "-" + nomeArquivo;
				if (fs.existsSync(arquivoUsuario)) {
					fs.unlink(arquivoUsuario);
				}
				fs.createReadStream(file.path).pipe(fs.createWriteStream(arquivoUsuario));
				//Grava a versão da contribuição na atividade
				var arquivoatividade = pastaDaAtividade + "/" + versao + "-" + nomeArquivo;
				fs.createReadStream(file.path).pipe(fs.createWriteStream(arquivoatividade));
				//Exclui o arquivo temporario
				fs.unlink(file.path);

			}

			files.push([field, file]);
		})
		.on('progress', function(bytesReceived, bytesExpected) {
			if (bytesExpected > tamanhoMaximoArquivo && !uploadCancelado) {
				uploadCancelado = true;
				motivoCancelamento = 'Arquivo maior que o tamanho máximo permitido: 2MB';
			}
		})
		.on('end', function() {
			res.json({
				mensagem: "Upload finalizado"
			});
		});
	form.parse(req);
};

exports.baixarContribuicao = function(req, res) {
	var atividade = req.params.atividade;
	var contribuicao = req.params.contribuicao;
	var pastaDaAtividade = "./contribuicoes/" + atividade;

	var contribuicoesNaAtividade = fs.readdirSync(pastaDaAtividade);

	var arquivosUsuario = [];
	var caminhoArquivo = "";

	contribuicoesNaAtividade.forEach(function(file) {
		if (file === contribuicao){
			console.dir(file);
			caminhoArquivo = pastaDaAtividade + "/" + file;
			arquivosUsuario.push({
				"nomeDoArquivo": file
			});
		}
	});

	var filename = path.basename(caminhoArquivo);
	var mimetype = mime.lookup(caminhoArquivo);

	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	res.setHeader('Content-type', mimetype);

	var filestream = fs.createReadStream(caminhoArquivo);
	filestream.pipe(res);
};
