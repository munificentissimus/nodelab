var mongoose = require("mongoose");

exports.conectar = function(banco){
	mongoose.connect('mongodb://munificentissimus1-prointeriv-1576013:27017/' + banco );
};