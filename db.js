var mongoose = require("mongoose");
var config = require("./config");

exports.conectar = function(banco) {
	mongoose.connect('mongodb://' + config.MONGODB_URL + ':' + config.MONGODB_PORT + '/' + banco);
};