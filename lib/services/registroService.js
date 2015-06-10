/**
 * MODULO RESPONSAVEL PELA LOGICA DE REGISTRO DE UM NOVO ALUNO (USUARIO) NA APP.
*/
module.exports = function (){
	
	var Aluno = require("../../modelo/aluno.js"); // Modelo
		
	
	//Registra um aluno
	var registrarAluno = function( matricula , nome , senha , callback){
		
		
	};
	
	return {
		registrarAluno : registrarAluno
	};
};