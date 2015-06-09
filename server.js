var http = require("http");
var path = require("path");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var mongoose = require("mongoose");

//Modelo 
var Aluno = require("./model/aluno.js")(mongoose).Aluno; // Modelo
var Grupo = require("./model/grupo.js")(mongoose).Grupo; // Modelo

//Services
var registroService = require("./services/registroService.js")(Aluno);

//Conectar ao banco de dados
mongoose.connect('mongodb://munificentissimus1-prointeriv-1576013:27017/test');

/*
  Configura o express para provimento de arquivos 
*/
app.use(express.static(path.resolve(__dirname,'client')));

// create application/json parser
var jsonParser = bodyParser.json();

// REST Web Service - POST https://prointeriv-munificentissimus1.c9.io/alunos
// Cadastrar novo aluno
app.post('/alunos', jsonParser, function(requisicao,resposta){
  //Define o conteúdo a ser devolvido ao cliente
  resposta.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  var dadosRecebidos = requisicao.body;
  
  registroService.registrarAluno(dadosRecebidos.matricula, dadosRecebidos.nome, dadosRecebidos.senha, function(erro , aluno){
    if(erro){
      if (erro.tipoErro === "duplicidade"){
        responderErro(resposta, 409 , "Já existe aluno registrado com matricula: " + dadosRecebidos.matricula );
      } else {
        responderErro(resposta, 500 , "Erro ao registrar aluno: " + erro );
      }
    } else {
      responderSucesso(resposta,"Seja bem vindo " + aluno.nome + "!");
    }
  });
});

// REST Web Service - GET https://prointeriv-munificentissimus1.c9.io/alunos 
// Listar todos os alunos cadastrados
app.get('/alunos', jsonParser, function(req,res){
   //Define o conteúdo a ser devolvido ao cliente
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  var alunosService = require("./services/alunosService.js")(Aluno);
  
  alunosService.listarAlunos(function(err,alunos){
      if (err){
         console.log(err);
         responderErro(res, 500 , "Erro ao listar alunos: " + err );
      }
      
      responderSucesso(res, alunos);
  });
});

// REST Web Service - GET https://prointeriv-munificentissimus1.c9.io/alunos/:matricula 
// Consultar alunos cadastrado específico
app.get('/alunos/:matricula',jsonParser,function(requisicao, resposta) {
     //Define o conteúdo a ser devolvido ao cliente
    resposta.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    var alunosService = require("./services/alunosService.js")(Aluno);
    
    var matricula = requisicao.params.matricula;
    
    alunosService.pesquisarAluno(matricula,function(erro,aluno){
      if (erro){
         console.log(erro);
         responderErro(resposta, 500 , "Erro ao listar alunos: " + erro );
      }
      
      responderSucesso(resposta, aluno);
  });
});

function responderErro(resposta, statusCode, mensagem){
  var serviceResponse = { "statusCode" : statusCode , "dados" : null , "mensagem" : mensagem  };
  resposta.statusCode = statusCode;
  resposta.end(JSON.stringify(serviceResponse));
}

function responderSucesso(resposta, dados){
  //var serviceResponse = { "statusCode" : 200 , "dados" : dados , "mensagem" : null  };
  resposta.statusCode = 200;
  resposta.end(JSON.stringify(dados));
}


server.listen(process.env.PORT || 3000,process.env.IP || "0.0.0.0", 
function(){
  var addr = server.address();
  console.log("Servidor escutando em ", addr.address + ":" + addr.port);
});