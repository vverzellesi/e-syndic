var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    name: String,
    rg: String,
    cpf: String,
    role: String
});

module.exports = mongoose.model('Employee', employeeSchema);