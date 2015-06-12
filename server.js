//******************************************************************************
// Aplicacao: API de trabalhos em grupo
// Autor....: RA6791430009 - Anderson Marques de Oliveira Carvalho
// Data.....: 12.06.2015
//******************************************************************************
console.info("Servidor Node iniciando...");

var app = configurarAplicacao();
conectarAoBancoDeDados('prointer');
iniciarApiRest();
monitorarErros();
iniciarAplicacao();

console.info("Servidor Node iniciado!");
//******************************************************************************

/* -------------------------------------------------------------------------- */
/* -------------------------- FUNCOES PRINCIPAIS ---------------------------- */
/* -------------------------------------------------------------------------- */

// 1. Define as configuracoes iniciais da aplicacao
function configurarAplicacao() {
   var path = require("path");
   var express = require('express');
   var bodyParser = require('body-parser');

   var app = express();
   //Ativa o recebimento/envio de corpo http com conteúdo json
   app.use(bodyParser.json());
   //Aplicacao cliente web para testes
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

   return app;
}

// 2. Conecta ao banco de dados utilizado pela aplicacao
function conectarAoBancoDeDados(nomeBD) {
   require("./db").conectar(nomeBD);
}

// 3. Inicia a API de Webservices REST
function iniciarApiRest() {
   var aluno = require("./api/aluno.js");
   var alunos = require("./api/alunos.js");
   var login = require("./api/login.js");
   var trabalho = require("./api/trabalho.js");
   var autenticacao = require("./lib/seguranca/autenticacao.js");

   //Consultar aluno
   app.get('/api/alunos/:matricula',
      autenticacao.verificarAutenticacao,
      aluno.consultar);
   //Registrar conta de aluno   
   app.post('/api/alunos',
      aluno.registrar);
   //Excluir conta de aluno   
   app.delete('/api/alunos/:matricula',
      autenticacao.verificarAutenticacao,
      aluno.excluirConta);
   //Listar aluno   
   app.get('/api/alunos',
      autenticacao.verificarAutenticacao,
      alunos.listar);
   //Logar   
   app.post('/api/login', login.logar);
   //Upload trabalho
   app.post('/trabalhos',
      autenticacao.verificarAutenticacao,
      trabalho.postar);
   //Download trabalho
   app.get('/api/grupos/:grupo/alunos/:matricula/trabalho',
      autenticacao.verificarAutenticacao,
      trabalho.getTrabalhoAluno);
   //Listar grupos
   //Criar grupo
   //Incluir aluno em grupo
   //Excluir aluno de grupo
   //Atualizar dados do grupo
}

//4. Captura exceções de forma impedir a interrupção do processo
function monitorarErros() {
   process.on('uncaughtException', function(err) {
      console.error(err);
   });
}

//5. Inicia a aplicacao na porta definida nas configuracoes
function iniciarAplicacao() {
   var config = require("./config");
   app.listen(process.env.PORT || config.PORTA_APLICACAO);
}