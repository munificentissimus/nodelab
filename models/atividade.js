module.exports = function(mongoose){
	
	//Define o esquema de um grupo
	var AtividadeSchema = new mongoose.Schema({
		atividade : { type:String , unique: true },
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
	
	//Cria o modelo de uma atividade
	var Atividade = mongoose.model('Atividade', AtividadeSchema );
	
	return {
		Atividade : Atividade
	};
};