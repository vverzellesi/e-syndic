var mongoose = require('mongoose');

var condoSchema = new mongoose.Schema({
    name: String,
    address: String,
    towers: Number
});

module.exports = mongoose.model('Condo', condoSchema);