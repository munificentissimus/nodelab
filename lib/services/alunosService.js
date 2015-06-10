/**
 * MODULO RESPONSAVEL POR PROVER SERVICOS A ENTIDADE ALUNO.
*/
module.exports = function (Aluno){
	
	/**
	 * Lista todos os alunos
	*/
	var listarAlunos = function(callback){
		
		Aluno.find({} , function(err, alunos){
			//Aconteceu um erro buscando o aluno
			if (err){
    			callback(err,null);
  			}
  			
  			//Retorna uma lista de alunos (sem a propriedade id e senha
  			//, logicamente)
  			if (alunos){
  				var listaAlunosParcial = [];
  				alunos.forEach(function(aluno){
  					var alunoParcial = {};
  					alunoParcial.matricula = aluno.matricula;
  					alunoParcial.nome = aluno.nome;
  					listaAlunosParcial.push(alunoParcial);
  				});
  				callback(null,listaAlunosParcial);
  			}
		});
	};
	
	/**
	 * Perquisar por um aluno
	*/
	var pesquisarAluno = function(matricula,callback){
		var criterio = { "matricula" : matricula };
		Aluno.findOne(criterio,function(erro,aluno){
			//Aconteceu um erro buscando o aluno
			if (erro){
    			callback(erro,null);
  			} 
  			
  			//Se aluno nao encontrado
  			if (aluno === null){
  				var inexistente = new Error();
				inexistente.tipoErro = "inexistente";
				inexistente.messagem = "Aluno inexistente";
				callback(inexistente,null);
  			} else {
  				
  				var alunoParcial = {
  					matricula : aluno.matricula,
  					nome      : aluno.nome
  				};
  				
  				callback(null,alunoParcial);
  			}
		});
	};
	
	return {
		listarAlunos : listarAlunos,
		pesquisarAluno : pesquisarAluno
	};
};