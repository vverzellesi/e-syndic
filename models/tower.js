var mongoose = require('mongoose');

var towerSchema = new mongoose.Schema({
    name: String,
    floors: Number,
    apartmentsPerFloor: Number,
    apartments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    }]
});

module.exports = mongoose.model('Tower', towerSchema);