var mongoose = require('mongoose');

var spaceSchema = new mongoose.Schema({
    name: String,
    maxCapacity: Number,
    price: Number
});

module.exports = mongoose.model('Space', spaceSchema);