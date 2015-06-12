var mongoose = require("mongoose");
	
//Define o esquema de um grupo
var AtividadeSchema = new mongoose.Schema({
	atividade : { type:String , unique: true },
	criadaPor : { type:Number},
	dataInicio : { type : String },
	dataFim : {type : String},
	contribuicoes : [{ 
			nomeArquivo : { type : String }, 
			caminhoArquivo : { type : String }, 
			mimetype : { type : String },
			postadoPorMatricula : { type : Number},
			postadoPorNome : { type : String }
		}],
	integrantes : [{
		matricula : { type : Number },
		nome      : { type : String }
	}]
});
	
module.exports = mongoose.model('Atividade', AtividadeSchema );