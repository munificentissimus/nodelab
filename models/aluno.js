var mongoose = require("mongoose");

//Define o esquema de um aluno
var AlunoSchema = new mongoose.Schema({
	matricula: {
		type: Number,
		unique: true
	},
	nome: {
		type: String
	},
	senha: {
		type: String
	},
	token: {
		type: String, index:true
	}
});

//Cria o modelo de uma aluno
module.exports = mongoose.model('Aluno', AlunoSchema);