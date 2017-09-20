var mongoose = require('mongoose');

var dwellerSchema = new mongoose.Schema({
    name: String,
    cpf: Number,
    rg: String,
    birthday: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Dweller', dwellerSchema);