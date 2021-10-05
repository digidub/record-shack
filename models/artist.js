var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});

ArtistSchema.virtual('url').get(function () {
  return '/catalog/artist/' + this._id;
});

module.exports = mongoose.model('Artist', ArtistSchema);
