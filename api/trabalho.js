var fs = require("fs");
var S = require("string");
var formidable = require("formidable");
var dateTime = require("../utils/dateTime");
var mime = require("mime");
var path = require("path");


function ehTipoArquivoValido(tipoArquivo) {
	var tiposPermitidos = ["application/msword",
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

function saoCamposValidos(campos) {
	var campoMatriculaOk = false;
	var campoGrupoOk = false;

	campos.forEach(function(campo) {
		if (campo.nome === "matricula" && campo.valor.length > 0) {
			campoMatriculaOk = true;
		}
		if (campo.nome === "grupo" && campo.valor.length > 0) {
			campoGrupoOk = true;
		}
	});

	if (campoMatriculaOk && campoGrupoOk) {
		return true;
	}

	return false;
}

exports.postar = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);
	var form = new formidable.IncomingForm(),
		files = [],
		fields = [];

	form.uploadDir = "./uploads";
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

			if (!saoCamposValidos(fields)) {
				uploadCancelado = true;
				motivoCancelamento = "matricula e grupo obrigatórios";
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
				var nomeGrupo = "";
				var nomeMatricula = "";

				fields.forEach(function(campo) {
					if (campo.nome === "grupo") {
						nomeGrupo = campo.valor;
					}
					if (campo.nome === "matricula") {
						nomeMatricula = campo.valor;
					}
				});

				var pastaDoGrupo = form.uploadDir + "/" + nomeGrupo;
				if (!fs.existsSync(pastaDoGrupo)) {
					fs.mkdir(pastaDoGrupo, function(error) {
						console.log(error);
					});
				}
				var versao = dateTime.getDateTimeNumber();
				var nomeArquivo = file.name;
				//Grava a ultima versao do trabalho do grupo
				//fs.rename(file.path, pastaDoGrupo + "/" + file.name + "v" + versao + nomeGrupo); 
				//Grava a versão atual do trabalho do usuario
				var arquivoUsuario = pastaDoGrupo + "/user_" + nomeMatricula + "-" + nomeArquivo;
				if (fs.existsSync(arquivoUsuario)) {
					fs.unlink(arquivoUsuario);
				}
				fs.createReadStream(file.path).pipe(fs.createWriteStream(arquivoUsuario));
				//Grava a versão do trabalho em grupo
				var arquivoGrupo = pastaDoGrupo + "/" + versao + "-" + nomeArquivo;
				fs.createReadStream(file.path).pipe(fs.createWriteStream(arquivoGrupo));
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

exports.getTrabalhoAluno = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);
	var matricula = req.params.matricula;
	var grupo = req.params.grupo;
	var pastaDoGrupo = "./uploads/" + grupo;

	var arquivosGrupo = fs.readdirSync(pastaDoGrupo);

	var arquivosUsuario = [];
	var caminhoArquivo = "";

	arquivosGrupo.forEach(function(file) {
		if (S(file).startsWith("user_" + matricula)) {
			console.dir(file);
			caminhoArquivo = pastaDoGrupo + "/" + file;
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


	//	res.sendfile(caminhoArquivo); 
};