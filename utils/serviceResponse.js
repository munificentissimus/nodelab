module.exports = function(res){
	return {
		sucesso : function (dados){
		  res.statusCode = 200;
		  res.json(dados).end();
		},
		criado : function (dados){
		  res.statusCode = 201;
		  res.json(dados).end();
		},
		duplicidade : function (mensagem){
		  res.statusCode = 409;
		  res.json(mensagem).end();
		},
		falha : function (mensagem){
		  res.statusCode = 500;	
		  res.json(mensagem).end();
		},
		inexistente : function (mensagem){
		  res.statusCode = 404;
		  res.json(mensagem).end();;
		},
		proibido : function (mensagem){
		  res.statusCode = 403;
		  res.json(mensagem).end();
		}
	}
};