var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  year: { type: Number },
  condition: { type: String, enum: ['NM', 'VG+', 'VG', 'G+'], required: true },
  genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
  label: { type: Schema.Types.ObjectId, ref: 'Label', requried: true },
  quantity: { type: Number, min: 1, required: true },
});

RecordSchema.virtual('url').get(function () {
  return '/catalog/record/' + this._id;
});

module.exports = mongoose.model('Record', RecordSchema);
