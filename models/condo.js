var mongoose = require('mongoose');

var condoSchema = new mongoose.Schema({
    name: String,
    address: String,
    towers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tower'
    }]
});

module.exports = mongoose.model('Condo', condoSchema);