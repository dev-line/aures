const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        default: 'بلا عنوان',
    },
    Thumbnail: {
        type: String,
        default: '/public/img/demo-image-01.jpg'
    },
    Content: {
        type: String,
        required: true
    },
    Categ: {
        type: [],
        default: 'أخبار'
    },
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    Views: {
        type: Number,
        default: 0
    },
    Date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Posts', PostSchema);