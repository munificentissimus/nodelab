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
	
	return {
		listarAlunos : listarAlunos
	};
};