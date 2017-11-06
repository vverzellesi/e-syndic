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
    }],
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }],
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

module.exports = mongoose.model('Condo', condoSchema);