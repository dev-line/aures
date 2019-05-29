const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Comment: {
        type: String,
        required: true
    },
    Post: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true,
    }

});

module.exports = mongoose.model('Comments', CommentSchema);