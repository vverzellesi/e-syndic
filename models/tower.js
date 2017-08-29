var mongoose = require('mongoose');

var towerSchema = new mongoose.Schema({
    name: String,
    floors: Number,
    apartmentsPerFloor: Number
});

module.exports = mongoose.model('Tower', towerSchema);