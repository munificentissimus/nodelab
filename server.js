var http = require("http");
var path = require("path");
var express = require('express');

var router = express();
var server = http.createServer(router);

/*
  Configura o express para provimento de arquivos 
*/
router.use(express.static(path.resolve(__dirname,'client')));

router.get('/teste',function(req,res){
  res.send('Olá mundo');
});

server.listen(process.env.PORT || 3000,process.env.IP || "0.0.0.0", 
function(){
  var addr = server.address();
  console.log("Servidor escutando em ", addr.address + ":" + addr.port);
});