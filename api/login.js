var criptografia = require("../lib/seguranca/criptografia");
var Aluno = require("../models/aluno");

exports.entrar = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);

	//Verifica se o aluno ja possui conta
	var criterio = {
		matricula: req.body.matricula,
		senha    : criptografia.encriptarSha256(req.body.senha)
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