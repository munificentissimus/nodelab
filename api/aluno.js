exports.consultar = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	var Aluno = require("../models/aluno");

	var matricula = req.params.matricula;

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

exports.excluir = function(req, res) {
	var Aluno = require("../models/aluno");
	var serviceResponse = require("../lib/utils/serviceResponse")(res);

	//TokenAutenticacao
	var tokenRecebido = req.headers["authorization"].split(" ")[1];

	//Verifica se o usuario ja eh registrado
	var criterio = {
		matricula: req.params.matricula,
		token: tokenRecebido
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (!aluno) {
			serviceResponse.proibido("Somente o próprio aluno pode excluir a conta!");
		}
		else {
			Aluno.find(criterio).remove().exec();
			serviceResponse.sucesso("Conta excluída com sucesso!");
		}
	});
};

exports.listar = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	var Aluno = require("../models/aluno");

	var criterio = {};

	if (req.query.nome) {
		criterio.nome = req.query.nome;
	}

	if (req.query.matricula) {
		criterio.matricula = req.query.matricula;
	}

	Aluno.find(criterio, function(err, alunos) {
		if (err) {
			serviceResponse.falha("Erro pesquisando alunos");
		}
		else {
			var alunosParcial = [];
			alunos.forEach(function(aluno) {
				var alunoParcial = {
					matricula: aluno.matricula,
					nome: aluno.nome
				};
				alunosParcial.push(alunoParcial);
			});
			serviceResponse.sucesso(alunosParcial);
		}
	});
};

exports.registrar = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	var jwt = require("jsonwebtoken");
	var Aluno = require("../models/aluno");
	var criptografia = require("../lib/seguranca/criptografia");
	var config = require("../config");

	//Valida a requisicao
	if (!req.body.matricula || !req.body.nome || !req.body.senha) {
		serviceResponse.requisicaoNaoAtendida('Matricula, nome e senha obrigatorios');
	}

	//Verifica se o usuario ja eh registrado
	var criterio = {
		matricula: req.body.matricula
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (aluno) {
			serviceResponse.duplicidade("Aluno já registrado!");
		}
		else {
			//Cria o objeto aluno à partir do Esquema (modelo) mongoose	
			var baseToken = {
				"a": req.body.matricula,
				"b": req.body.nome,
				"c": req.body.senha
			};
			var novoAluno = new Aluno({
				"matricula": req.body.matricula,
				"nome": req.body.nome,
				"senha": criptografia.encriptarSha256(req.body.senha),
				"token": jwt.sign(baseToken, config.SEGREDO_TOKEN)
			});

			//Aciona a funcao salvar de aluno
			novoAluno.save(function(err) {
				if (err) {
					serviceResponse.falha("Erro salvando dados do aluno " +
						req.body.nome);
				}
				else {
					var criterio = {
						"matricula": novoAluno.matricula
					};
					Aluno.findOne(criterio, function(err, alunoCriado) {
						if (err) {
							serviceResponse.falha("Erro buscando aluno " + alunoCriado.matricula);
						}
						else {
							alunoCriado.senha = " ";
							serviceResponse.criado(alunoCriado);
						}
					});
				}
			});
		} 
	});
};