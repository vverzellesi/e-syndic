var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
    text: String,
    category: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);