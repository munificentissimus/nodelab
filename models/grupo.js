module.exports = function(mongoose){
	
	//Define o esquema de um grupo
	var GrupoSchema = new mongoose.Schema({
		materia : { type : String},
		nome  : { type:String , unique: true },
		atividade : { type:String },
		quantidadeMinimaAlunos : { type : Number },
		quantidadeMaximaAlunos : { type : Number },
		dataInicio : { type : Date },
		dataFim : {type : Date},
		situacao : {type : String},
		arquivo : 
			{ 
				nome : { type : String}, 
				extensao : { type : String }
			},
		alunos : {
			matricula : { type : Number }
		}
	});
	
	//Cria o modelo de um grupo
	var Grupo = mongoose.model('Grupo', GrupoSchema );
	
	return {
		Grupo : Grupo
	};
};