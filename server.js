console.log("Servidor Node iniciando...");

var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var autenticacao = require("./lib/seguranca/autenticacao.js");
var aluno = require("./api/aluno.js");
var alunos = require("./api/alunos.js");
var login = require("./api/login.js");
var trabalho = require("./api/trabalho.js");

//Configuracao
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'client')));
app.use(function(req, res, next) {
   //Permite acesso de qualquer dispositivo ou cliente (cross browser)
   res.setHeader('Access-Control-Allow-Origin', '*');
   //Padrão de comunicação JSON
   res.setHeader('Content-Type', 'application/json; charset=utf-8');
   //Cabeçalhos Permitidos
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
   return next();
});
 
//Conecta ao banco de dados
require("./db").conectar('prointer');

//WEBSERVICES
//Recurso: Aluno
app.get('/api/alunos/:matricula', autenticacao.verificarAutenticacao, aluno.consultar);
app.post('/api/alunos', aluno.registrar);
app.delete('/api/alunos/:matricula', autenticacao.verificarAutenticacao, aluno.excluirConta);
app.get('/api/alunos', autenticacao.verificarAutenticacao, alunos.listar);
//Recurso: Login   
app.post('/api/login', login.logar);
//Recurso: trabalho
app.post('/trabalhos', autenticacao.verificarAutenticacao, trabalho.postar);
app.get('/api/grupos/:grupo/alunos/:matricula/trabalho', trabalho.getTrabalhoAluno);

//Impede que o node caia por uma falha não tratada
process.on('uncaughtException', function(err) {
   console.log(err);
}); 

//Inicia a escuta na porta da aplicação
app.listen(process.env.PORT || 3000);
console.log("Servidor Node iniciado!");