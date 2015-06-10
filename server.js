var http = require("http");
var path = require("path");
var express = require('express')
var app = express();
var bodyParser = require('body-parser');

var aluno = require("./api/aluno.js");
var alunos = require("./api/alunos.js");

module.exports = app;

//Configuracao
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname,'client')));
app.use(function(req, res, next) {
   res.setHeader('Content-Type', 'application/json; charset=utf-8');
   return next();
});

//Conecta ao banco de dados
require("./db").conectar('prointer');

//WEBSERVICES
app.get('/alunos/:matricula',aluno.consultar);
app.post('/alunos',aluno.registrar);
app.delete('/alunos/:matricula',aluno.excluirConta);
app.get('/alunos',alunos.listar);

app.listen(process.env.PORT || 3000);

// var server = http.createServer(app);

// //Modelo 
// var Aluno = require("./modelo/aluno.js"); // Modelo

// //Services
// var registroService = require("./lib/services/registroService.js")();
// var serviceResponse = require("./lib/utils/serviceResponse.js");

// //ExpressJS - Content-type padrão application/json
// app.use(function(req, res, next) {
//   res.setHeader('Content-Type', 'application/json; charset=utf-8');
//   return next();
// });

// //ExpressJS - Prover arquivos estaticos na pasta client
// app.use(express.static(path.resolve(__dirname,'client')));

// app.get('/alunos/:matricula', alunoResource.consultar);

// //ExpressJS - rotas 
// app.use(require('./controllers'));

// // create application/json parser
// var jsonParser = bodyParser.json();

// // REST Web Service - POST https://prointeriv-munificentissimus1.c9.io/alunos
// // Cadastrar novo aluno
// app.post('/alunos', bodyParser.json() , function(requisicao,resposta){
//   var dadosRecebidos = requisicao.body;
  
//   registroService.registrarAluno(dadosRecebidos.matricula, dadosRecebidos.nome, dadosRecebidos.senha, function(erro , aluno){
//     if(erro){
//       if (erro.tipoErro === "duplicidade"){
//         serviceResponse.erroDuplicidade(resposta,"Já existe aluno registrado com matricula: " + dadosRecebidos.matricula);
//       } else {
//         serviceResponse.falhaServidor(resposta, "Erro ao registrar aluno: " + erro );
//       }
//     } else {
//       serviceResponse.sucesso(resposta, "Seja bem vindo " + aluno.nome + "!");
//     }
//   });
// });

// // REST Web Service - GET https://prointeriv-munificentissimus1.c9.io/alunos 
// // Listar todos os alunos cadastrados
// app.get('/alunos', jsonParser, function(requisicao,resposta){
//   //Define o conteúdo a ser devolvido ao cliente
//   resposta.setHeader('Content-Type', 'application/json; charset=utf-8');
  
//   var alunosService = require("./lib/services/alunosService.js")(Aluno);
  
//   alunosService.listarAlunos(function(err,alunos){
//       if (err){
//         console.log(err);
//         responderErro(resposta, 500 , "Erro ao listar alunos: " + err );
//       }
//       serviceResponse.sucesso(resposta, alunos);
//   });
// });

// // REST Web Service - GET https://prointeriv-munificentissimus1.c9.io/alunos/:matricula 
// // Consultar alunos cadastrado específico
// app.get('/alunos/:matricula',jsonParser,function(requisicao, resposta) {
//     var alunosService = require("./services/alunosService.js")(Aluno);
//     var matricula = requisicao.params.matricula;
    
//     alunosService.pesquisarAluno(matricula,function(erro,aluno){
//       if (erro){
//         console.log(erro);
//         responderErro(resposta, 500 , "Erro ao listar alunos: " + erro );
//       }
      
//       responderSucesso(resposta, aluno);
//     });
// });

// function responderErro(resposta, statusCode, mensagem){
//   var serviceResponse = { "statusCode" : statusCode , "dados" : null , "mensagem" : mensagem  };
//   resposta.statusCode = statusCode;
//   resposta.end(JSON.stringify(serviceResponse));
// }

// function responderSucesso(resposta, dados){
//   resposta.statusCode = 200;
//   resposta.end(JSON.stringify(dados));
// }


// server.listen(process.env.PORT || 3000,process.env.IP || "0.0.0.0", 
// function(){
//   console.log("Servidor rodando em ", server.address() + ":" + server.address().port);
// });