var mongoose = require('mongoose');

var apartmentSchema = new mongoose.Schema({
    number: Number,
    floor: Number,
    dwellers: String
});

module.exports = mongoose.model('Apartment', apartmentSchema);