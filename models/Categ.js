const mongoose = require('mongoose');

const CtegSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Categ', CtegSchema);