var Aluno = require("../../models/aluno");
var config = require("../../config");

exports.verificarAutenticacao = function(req,res,next){
    //Despresa a verificacao de autenticacao se em desenvolvimento
    if (config.AMBIENTE === "DS") {
        next();
    } else {
    	var serviceResponse = require("../../lib/utils/serviceResponse")(res);
    	var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            //Pesquisar se existe usuário na base com o token
            Aluno.findOne({token : req.token},function(err,aluno){
            	if (err){
            		serviceResponse.falha("Falha autenticando usuario!");	
            	}
            	
            	if (aluno){
            		next();
            	} else {
            		serviceResponse.proibido("Acesso não permido!");
            	}
            });
        } else {
        	serviceResponse.proibido("Acesso não permitido!");
        }
        
    }
};