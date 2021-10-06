var Record = require('../models/record');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Label = require('../models/label');
var async = require('async');

exports.index = function (req, res) {
  async.parallel(
    {
      record_count: function (callback) {
        Record.countDocuments({}, callback);
      },
      artist_count: function (callback) {
        Artist.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
      label_count: function (callback) {
        Label.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', { title: 'Record Shack - Home', error: err, data: results });
    }
  );
};

exports.record_list = function (req, res, next) {
  Record.find({}, 'title artist genre label year')
    .sort({ title: 1 })
    .populate('artist genre label')
    .exec(function (err, list_records) {
      if (err) {
        return next(err);
      }
      res.render('record_list', { title: 'Record Stock', record_list: list_records });
    });
};

exports.record_detail = function (req, res, next) {
  async.parallel(
    {
      record: function (callback) {
        Record.findById(req.params.id).populate('artist').populate('genre').populate('label').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.record == null) {
        var err = new Error('record not found');
        err.status = 404;
        return next(err);
      }
      res.render('record_detail', { title: results.record.title, record: results.record, record_instances: results.record_instance });
    }
  );
};
