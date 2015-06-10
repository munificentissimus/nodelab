var Aluno = require("../models/aluno");
var seguranca = require("../utils/seguranca");

var alunoMock = {
	"nome": "teste",
	"sobrenome": "teste"
};


exports.consultar = function(req, res) {
	var matricula = req.params.matricula;
	var serviceResponse = require("../utils/serviceResponse")(res);

	var criterio = {
		"matricula": matricula
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + matricula);
		}
		else {
			if (aluno === null) {
				serviceResponse.inexistente("Aluno não encontrado");
			}
			else {
				var alunoParcial = {
					matricula: aluno.matricula,
					nome: aluno.nome
				};
				serviceResponse.sucesso(alunoParcial);
			}
		}
	});
};

exports.registrar = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);

	//Verifica se o usuario ja eh registrado
	var criterio = {
		matricula: req.body.matricula
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (aluno) {
			serviceResponse.duplicidade("Aluno já matriculado!");
		}
		else {
			//Cria o objeto aluno à partir do Esquema (modelo) mongoose	
			var novoAluno = new Aluno({
				"matricula": req.body.matricula,
				"nome": req.body.nome,
				"senha": seguranca.encriptarSha256(req.body.senha)
			});

			//Aciona a funcao salvar de aluno
			novoAluno.save(function(err) {
				if (err) {
					serviceResponse.falha("Erro salvando dados do aluno " +
						req.body.nome);
				}
				else {
					serviceResponse.criado(novoAluno.matricula);
				}
			});
		}
	});
};


exports.excluirConta = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);

	//Verifica se o usuario ja eh registrado
	var criterio = {
		matricula: req.params.matricula
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (!aluno) {
			serviceResponse.inexistente("Aluno não encontrado!");
		}
		else {
			if (aluno.senha !== seguranca.encriptarSha256(req.body.senha)){
				serviceResponse.proibido("Senha inválida! Exclusão não realizada!");
			} else {
				Aluno.find(criterio).remove().exec();
				serviceResponse.sucesso("Conta excluída com sucesso!");
			}
		}
	});
};