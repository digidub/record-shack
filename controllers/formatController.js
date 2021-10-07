var Format = require('../models/format');
var Record = require('../models/record');
var async = require('async');

exports.format_list = function (req, res, next) {
  Format.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_formats) {
      if (err) {
        return next(err);
      }
      res.render('format_list', { title: 'Format List', format_list: list_formats });
    });
};

exports.format_detail = function (req, res, next) {
  async.parallel(
    {
      format: function (callback) {
        Format.findById(req.params.id).exec(callback);
      },
      format_records: function (callback) {
        Record.find({ format: req.params.id }).populate('artist genre format').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.format == null) {
        var err = new Error('Format not found');
        err.status = 404;
        return next(err);
      }
      res.render('format_detail', { title: 'Format Detail', format: results.format, format_records: results.format_records });
    }
  );
};
