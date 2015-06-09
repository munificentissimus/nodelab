module.exports = function(Conta){
	var crypto = require("crypto");
	var salvar = function(conta){
		
		var sha = crypto.createHash("sha256");
		
		conta.save(function(err){
  			if (err){
    			console.log("Erro criando conta");
  			}
  			console.log('criou a conta');
		});
	};
	
	var excluir = function(usuario){
		Conta.remove({"usuario": usuario },function(err){
			if (err){
    			console.log("Erro removendo conta " + usuario);
  			}
  			console.log('Removeu conta ' + usuario);
		});
	};
	
	var atualizarSenha = function(usuario , novaSenha){
		var querie = { "usuario" : usuario };
		
		Conta.findOne(querie, function(err, conta){
			if (err){
    			console.log("Erro atualizando conta " + usuario);
  			}
  			
  			if (conta.senha === novaSenha){
  				console.error("Senhas são identicas!");
  			} else {
	  			//Atribuir todos os valores da conta passada (menos id)
	  			conta.senha = novaSenha;
	
				conta.save(function(err){
		  			if (err){
		    			console.log("Erro Atualizou senha");
		  			}
	  				console.log('Atualizou a senha');
				});
  			}
		});
	};
	
	return {
		salvar : salvar,
		excluir : excluir,
		atualizarSenha : atualizarSenha
	};
};