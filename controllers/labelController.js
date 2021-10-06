var Label = require('../models/label');
var Record = require('../models/record');
var async = require('async');

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

exports.label_detail = function (req, res, next) {
  async.parallel(
    {
      label: function (callback) {
        Label.findById(req.params.id).exec(callback);
      },
      label_records: function (callback) {
        Record.find({ label: req.params.id }).populate('artist genre label').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.label == null) {
        var err = new Error('Label not found');
        err.status = 404;
        return next(err);
      }
      res.render('label_detail', { title: 'Label Detail', label: results.label, label_records: results.label_records });
    }
  );
};
