//******************************************************************************
// Aplicacao: API de trabalhos em grupo
// Autor....: RA6791430009 - Anderson Marques de Oliveira Carvalho
// Data.....: 12.06.2015
//******************************************************************************
console.info("Servidor Node iniciando...");

var app = config();

mongoDB('prointer');
apiRest();
iniciar();

console.info("Servidor Node iniciado!");
//******************************************************************************

/* -------------------------------------------------------------------------- */
/* -------------------------- FUNCOES PRINCIPAIS ---------------------------- */
/* -------------------------------------------------------------------------- */

// 1. Define as configuracoes iniciais da aplicacao
function config() {
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
function mongoDB(nomeBD) {
   require("./db").conectar(nomeBD);
}

// 3. Inicia a API de Webservices REST
function apiRest() {
   var aluno = require("./api/aluno.js");
   var atividade = require("./api/atividade.js");
   var login = require("./api/login.js");
   var autenticacao = require("./lib/seguranca/autenticacao.js");

   //Login da aplicacao
   app.post('/api/login'
      , login.entrar);
   
   //Novo aluno
   app.post('/api/alunos',
      aluno.registrar);
      
   //Excluir aluno      
   app.delete('/api/alunos/:matricula',
      autenticacao.verificarAutenticacao,
      aluno.excluir);
      
   //Listar atividades de um aluno
   app.get('/api/alunos/:matricula/atividades',
      autenticacao.verificarAutenticacao,
      atividade.listarAtividadesPorAluno
      );
      
   //Nova atividade
   app.post('/api/atividades',
      autenticacao.verificarAutenticacao,
      atividade.novaAtividade
      );
      
   //Excluir atividade
   app.delete('/api/atividades/:atividade',
      autenticacao.verificarAutenticacao,
      atividade.excluir
      );
   
   //Consultar atividade com seus integrantes e contribuições
   app.get('/api/atividades/:atividade',
      autenticacao.verificarAutenticacao,
      atividade.consultar);
      
   //Consultar integrante de uma atividade
   app.get('/api/atividades/:atividade/integrantes/:matricula',
      autenticacao.verificarAutenticacao,
      atividade.consultarIntegrante);
      
   //Novo integrante   
   app.post('/api/atividades/:atividade/integrantes',
      autenticacao.verificarAutenticacao,
      atividade.novoIntegrante);
   
   //Excluir integrante
   app.delete('/api/atividades/:atividade/integrantes/:matricula',
      autenticacao.verificarAutenticacao,
      atividade.excluirIntegrante
   );
      
   //Listar contribuições em uma atividade de um integrante
   app.get('/api/atividade/:atividade/integrantes/:matricula/contribuicoes',
      autenticacao.verificarAutenticacao,
      atividade.listarContribuicoesPorIntegrante);
      
   //Postar contribuicao em uma atividade   
   app.post('/api/atividade/:atividade/contribuicoes',
      autenticacao.verificarAutenticacao,
      atividade.postarContribuicao);
      
   //Baixar uma contribuicao de uma atividade   
   app.get('/api/atividade/:atividade/contribuicoes/:contribuicao',
      autenticacao.verificarAutenticacao,
      atividade.baixarContribuicao);
}

//4. Inicia a aplicacao na porta definida nas configuracoes
function iniciar() {
   var config = require("./config");
   
   //Captura exceções de forma impedir a interrupção do processo
   process.on('uncaughtException', function(err) {
      console.error(err);
   });
   
   app.listen(process.env.PORT || config.PORTA_APLICACAO);
}