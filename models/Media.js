const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    _id: String,
    fb: {
        type: String,
        default: '#'
    },
    Insta: {
        type: String,
        default: '#'
    },
    YouTube: {
        type: String,
        default: '#'
    },
    Live: {
        type: String,
        default: '#'
    },
    Twitter: {
        type: String,
        default: '#'
    },
    rss: {
        type: String,
        default: '#'
    }
}, {
    _id: false
});

module.exports = mongoose.model('Media', MediaSchema);