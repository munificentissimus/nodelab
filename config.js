
//Configura os ambientes;
var desenvolvimento = true;
var homologacao = true;

var ambiente = ( desenvolvimento ? "DS" : ( homologacao ? "HM" : "PD" ));

exports.AMBIENTE = ambiente;

exports.dificultador = "munificentissimusSeguro";
//Utilizado na autenticação de usuários
exports.SEGREDO_TOKEN = "r36jb9dt";
//MongoDB URL (IP)
exports.MONGODB_URL = "munificentissimus1-prointeriv-1576013";
//MongoDB URL (PORTA)
exports.MONGODB_PORT = "27017";
//Configura o ambiente
exports.ENV_DEV = true;