var Aluno = require("../models/aluno");


var alunoMock = {
	"nome": "teste",
	"sobrenome": "teste"
};


exports.listar = function(req, res) {
	var serviceResponse = require("../lib/utils/serviceResponse")(res);
	
	var criterio = {};
	
	if (req.query.nome){
		criterio.nome = req.query.nome;
	}
	
	if (req.query.matricula){
		criterio.matricula = req.query.matricula;
	}

	Aluno.find(criterio, function(err, alunos) {
		if (err) {
			serviceResponse.falha("Erro pesquisando alunos");
		}
		else {
			var alunosParcial = [];
			alunos.forEach(function(aluno){
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