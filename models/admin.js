var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    name: String,
    cpf: String,
    function: String
});

module.exports = mongoose.model('Admin', adminSchema);