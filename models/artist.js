var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});
ArtistSchema.pre('save', function (next) {
  this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

ArtistSchema.virtual('url').get(function () {
  return '/catalog/artist/' + this._id;
});

module.exports = mongoose.model('Artist', ArtistSchema);
