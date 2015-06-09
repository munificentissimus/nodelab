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
app.post('/alunos', jsonParser, function(req,res){
  //Define o conteúdo a ser devolvido ao cliente
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  var json = '';
  registroService.registrarAluno(req.body.matricula, req.body.nome, req.body.nome, function(err){
    if(err){
      if (err.tipoErro === "duplicidade"){
        res.statusCode = 409;
      } else {
        res.statusCode = 500;
      }
      json = JSON.stringify(err);
      res.end(json);
    }
    res.end(JSON.stringify({"mensagem":"Aluno registrado com sucesso!"}));
  });
});

// REST Web Service - GET https://prointeriv-munificentissimus1.c9.io/alunos 
// Listar todos os alunos cadastrados
app.get('/alunos', jsonParser, function(req,res){
  
});

server.listen(process.env.PORT || 3000,process.env.IP || "0.0.0.0", 
function(){
  var addr = server.address();
  console.log("Servidor escutando em ", addr.address + ":" + addr.port);
});