const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, 'Uploaded file must be named'],
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
