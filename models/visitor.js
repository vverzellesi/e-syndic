var mongoose = require('mongoose');

var dwellerSchema = new mongoose.Schema({
    name: String,
    cpf: String,
    rg: String,
    birthday: String,
    phone: String,
    relationship: String
});

module.exports = mongoose.model('Visitor', dwellerSchema);