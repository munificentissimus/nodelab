var Aluno = require("../models/aluno");


var alunoMock = {
	"nome": "teste",
	"sobrenome": "teste"
};


exports.listar = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);
	
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

exports.registrar = function(req, res) {
	var serviceResponse = require("../utils/serviceResponse")(res);

	//Modulo de criptografia
	var crypto = require("crypto");

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
			//Técnica de segurança - incluir um dificultador antes de encriptar
			var dificultador = 'munificentissimus';

			//Cria o objeto aluno à partir do Esquema (modelo) mongoose	
			var novoAluno = new Aluno({
				"matricula": req.body.matricula,
				"nome": req.body.nome,
				"senha": crypto.createHash('sha256')
					.update(req.body.senha + dificultador, 'utf-8')
					.digest("hex")
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