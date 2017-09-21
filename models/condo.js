var mongoose = require('mongoose');

var condoSchema = new mongoose.Schema({
    name: String,
    address: String,
    towers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tower'
    }],
    spaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space'
    }]
});

module.exports = mongoose.model('Condo', condoSchema);