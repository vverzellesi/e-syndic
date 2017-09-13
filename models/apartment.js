var mongoose = require('mongoose');

var apartmentSchema = new mongoose.Schema({
    number: Number,
    floor: Number,
    dwellers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dweller'
    }],
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }]
});

module.exports = mongoose.model('Apartment', apartmentSchema);