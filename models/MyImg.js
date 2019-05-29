const mongoose = require('mongoose');

const ImgSchema = new mongoose.Schema({
    Url: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('MyImg', ImgSchema);