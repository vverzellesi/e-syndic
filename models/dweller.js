var mongoose = require('mongoose');

var dwellerSchema = new mongoose.Schema({
    name: String,
    cpf: String,
    rg: String,
    birthday: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Dweller', dwellerSchema);