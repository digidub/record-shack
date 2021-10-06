var Label = require('../models/label');

exports.label_list = function (req, res, next) {
  Label.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_labels) {
      if (err) {
        return next(err);
      }
      res.render('label_list', { title: 'Label List', label_list: list_labels });
    });
};
