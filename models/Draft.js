const mongoose = require("mongoose");

const DraftSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Thumbnail: {
    type: String,
    default: '/public/img/demo-image-01.jpg'
  },
  Content: {
    type: String,
    required: true
  },
  Categ: [],
  Date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Drafts", DraftSchema);