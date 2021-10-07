var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormatSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 3 },
});

FormatSchema.virtual('url').get(function () {
  return '/catalog/format/' + this._id;
});

module.exports = mongoose.model('Format', FormatSchema);
