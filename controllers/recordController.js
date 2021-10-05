var Record = require('../models/record');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
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
    },
    function (err, results) {
      res.render('index', { title: 'Record Shack - Home', error: err, data: results });
    }
  );
};

exports.record_list = function (req, res, next) {
  Record.find({}, 'title artist')
    .sort({ title: 1 })
    .populate('artist')
    .exec(function (err, list_records) {
      if (err) {
        return next(err);
      }
      res.render('record_list', { title: 'Record Stock', record_list: list_records });
    });
};
