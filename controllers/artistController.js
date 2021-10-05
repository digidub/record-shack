var Artist = require('../models/artist');
var Record = require('../models/book');
var async = require('async');

exports.author_list = function (req, res, next) {
  Artist.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_artists) {
      if (err) {
        return next(err);
      }
      res.render('artist_list', { title: 'Artist List', artist_list: list_artists });
    });
};
