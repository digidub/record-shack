var Artist = require('../models/artist');
var Record = require('../models/record');
var async = require('async');

exports.artist_list = function (req, res, next) {
  Artist.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_artists) {
      if (err) {
        return next(err);
      }
      res.render('artist_list', { title: 'Artist List', artist_list: list_artists });
    });
};

exports.artist_detail = function (req, res, next) {
  async.parallel(
    {
      artist: function (callback) {
        Artist.findById(req.params.id).exec(callback);
      },
      artists_records: function (callback) {
        Record.find({ artist: req.params.id }, 'title summary').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.artist == null) {
        var err = new Error('artist not found');
        err.status = 404;
        return next(err);
      }
      res.render('artist_detail', { title: 'Artist Detail', artist: results.artist, artist_records: results.artists_records });
    }
  );
};
