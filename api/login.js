var seguranca = require("../utils/seguranca");
var Aluno = require("../models/aluno");

exports.logar = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);

	//Verifica se o usuario ja eh registrado
	var criterio = {
		matricula: req.body.matricula,
		senha    : seguranca.encriptarSha256(req.body.senha)
	};
	Aluno.findOne(criterio, function(err, aluno) {
		if (err) {
			serviceResponse.falha("Erro buscando aluno " + req.body.matricula);
		}

		if (aluno) {
			serviceResponse.sucesso({ "matricula" : aluno.matricula, "autorizacao": aluno.token });
		}
		else {
			serviceResponse.naoAutorizado("Matricula ou senha inválidos!");
		}
	});
};