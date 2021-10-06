var Genre = require('../models/genre');
var Record = require('../models/record');
var Artist = require('../models/artist');
var async = require('async');

exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }
      res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
    });
};

exports.genre_detail = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_records: function (callback) {
        Record.find({ genre: req.params.id }).populate('artist genre label').exec(callback);
      },
      genre_artists: function (callback) {
        Artist.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      console.log(results);
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_records: results.genre_records,
        genre_artists: results.genre_artists,
      });
    }
  );
};
