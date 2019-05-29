const mongoose = require('mongoose');
const VisitSchema = new mongoose.Schema({
    Adress: {
        type: Array,
        unique: true
    },
    Device: {
        type: String
    }
});
module.exports = mongoose.model('Visitors', VisitSchema);