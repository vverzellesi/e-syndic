var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    plate: String,
    color: String,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);