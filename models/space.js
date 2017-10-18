var mongoose = require('mongoose');

var spaceSchema = new mongoose.Schema({
    name: String,
    maxCapacity: Number,
    price: Number,
    scheduledDates: [{
        scheduledDates: String,
        author: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    }]
});

module.exports = mongoose.model('Space', spaceSchema);