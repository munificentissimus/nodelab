/*exports.listarDoAluno = function(req, res) {
	console.log('listar atividades do aluno')
};
exports.listarIntegrantes = function(req, res) {
	console.log('listar integrantes da atividade')
};
exports.listarContribuicoesDaAtividade = function(req, res) {
	console.log('listar contribuicoes na atividade')
};
exports.listarContribuicoesDeIntegrante = function(req, res) {
	console.log('listar atividades do aluno')
};
exports.consultar = function(req, res) {
	console.log('consultar atividade')
};*/

var fs = require("fs");
var S = require("string");
var formidable = require("formidable");
var dateTime = require("../lib/utils/dateTime");
var mime = require("mime");
var path = require("path");



exports.baixarContribuicao = function(req, res) {
	var atividade = req.params.atividade;
	var contribuicao = req.params.contribuicao;
	var pastaDaAtividade = "./contribuicoes/" + atividade;

	var contribuicoesNaAtividade = fs.readdirSync(pastaDaAtividade);

	var arquivosUsuario = [];
	var caminhoArquivo = "";

	contribuicoesNaAtividade.forEach(function(file) {
		if (file === contribuicao) {
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

exports.consultar = function(req, res) {};

exports.consultarIntegrante = function(req, res) {};

exports.excluir = function(req, res) {};

exports.excluirIntegrante = function(req, res) {};

// GET https://prointeriv-munificentissimus1.c9.io/api/aluno/:matricula/atividades
exports.listarAtividadesPorAluno = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	var Atividade = require("../models/atividade");
	var Aluno = require("../models/aluno");

	var matricula = req.params.matricula;

	if (!matricula) {
		serviceResponse.requisicaoNaoAtendida("Matricula inválida!");
	}

	if (isNaN(matricula)) {
		serviceResponse.requisicaoNaoAtendida("Matricula não numérica!");
	}

	Aluno.findOne({
		'matricula': matricula
	}, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Falha buscando aluno");
		}
		else {
			if (!aluno) {
				serviceResponse.inexistente("Não existe aluno com a matricula informada");
			}
			var criterio = {
				'integrantes.matricula': matricula
			};

			Atividade.find(criterio, function(err, atividades) {
				if (err) {
					serviceResponse.falha('Falha pesquisando atividades de aluno');
				}
				else {
					if (atividades) {
						serviceResponse.sucesso(atividades);
					}
				}
			});
		}
	});
};

exports.listarContribuicoesPorIntegrante = function(req, res) {};

// POST https://prointeriv-munificentissimus1.c9.io/api/atividades
exports.novaAtividade = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	var dateTime = require("../lib/utils/dateTime");

	var Aluno = require("../models/aluno");
	var Atividade = require("../models/atividade");

	var tokenRecebido = req.headers["authorization"].split(" ")[1];

	var pAtividade = req.body.atividade.replace(/\W+/g, '-').toLowerCase();
	var pDataFim = req.body.dataFim;

	Aluno.findOne({
		token: tokenRecebido
	}, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (!aluno) {
			serviceResponse.proibido("Aluno não encontrado!");
		}
		else {
			Atividade.findOne({
				atividade: pAtividade
			}, function(err, atividade) {
				if (err) {
					serviceResponse.falha("Falha buscando atividade");
				}
				else {
					if (atividade) {
						serviceResponse.duplicidade("Já existe atividade com mesmo nome");
					}
					else {

						var novaAtividade = new Atividade({
							atividade: pAtividade,
							criadaPor: aluno.matricula,
							dataInicio: dateTime.getDate(),
							dataFim: pDataFim,
							contribuicoes: [],
							integrantes: [{
								matricula: aluno.matricula,
								nome: aluno.nome
							}]
						});

						novaAtividade.save(function(err) {
							if (err) {
								serviceResponse.falha('Erro salvando atividade');
							}
							else {
								serviceResponse.criado(novaAtividade);
							}
						});
					}
				}
			});
		}
	});
};

exports.novoIntegrante = function(req, res) {};

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