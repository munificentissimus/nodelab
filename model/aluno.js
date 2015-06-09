module.exports = function(mongoose){
	
	//Define o esquema de uma conta
	var AlunoSchema = new mongoose.Schema({
		matricula : { type : Number , unique : true},
		senha : { type:String },
		nome : { type : String}
	});
	
	//Cria o modelo de uma conta
	var Aluno = mongoose.model('Aluno', AlunoSchema );
	
	return {
		Aluno : Aluno
	};
};