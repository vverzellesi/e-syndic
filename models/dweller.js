var mongoose = require('mongoose');

var dwellerSchema = new mongoose.Schema({
    name: String,
    tower: String,
    apartmentNumber: Number,
    cpf: Number,
    rg: String,
    birthday: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Dweller', dwellerSchema);