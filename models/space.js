var mongoose = require('mongoose');

var spaceSchema = new mongoose.Schema({
    name: String,
    maxCapacity: Number,
    price: Number,
    scheduledDates: [{
        scheduledDates: String
    }]
});

module.exports = mongoose.model('Space', spaceSchema);