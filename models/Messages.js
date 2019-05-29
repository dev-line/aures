const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Phone: {
        type: String
    },
    Msg: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true,
    }

});

module.exports = mongoose.model('Messages', MsgSchema);