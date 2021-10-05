var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  condition: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

RecordSchema.virtual('url').get(function () {
  return '/catalog/record/' + this._id;
});

module.exports = mongoose.model('Record', RecordSchema);
