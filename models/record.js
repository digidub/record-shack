var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  year: { type: Number },
  condition: { type: String, enum: ['NM', 'VG+', 'VG', 'G+'], required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
  label: { type: Schema.Types.ObjectId, ref: 'Label', requried: true },
  format: { type: Schema.Types.ObjectId, ref: 'Format', enum: ['12"', '7"', 'LP'], requried: true },
  quantity: { type: Number, min: 0, required: true },
  image: { type: String, default: 'default.jpg' },
});

RecordSchema.virtual('url').get(function () {
  return '/catalog/record/' + this._id;
});

RecordSchema.virtual('image_url').get(function () {
  return '/public/images/' + this.image;
});

module.exports = mongoose.model('Record', RecordSchema);
