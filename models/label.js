var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabelSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
});

LabelSchema.virtual('url').get(function () {
  return 'catalog/label/' + this._id;
});

module.exports = mongoose.model('Label', LabelSchema);
