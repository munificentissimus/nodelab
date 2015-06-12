//Modulo de criptografia
var crypto = require("crypto");
var dificultador = require("../../config").dificultador;

exports.encriptarSha256 = function(dado) {
	return crypto.createHash('sha256').update(dado + dificultador, 'utf-8').digest("hex");
};

