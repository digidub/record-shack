var Genre = require('../models/genre');
var Record = require('../models/record');
var Artist = require('../models/artist');

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

exports.genre_detail = async function (req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id);
    const genresRecords = await Record.find({ genre: req.params.id }).populate('artist genre label');
    res.render('genre_detail', { title: 'Genre Detail', genre, genre_records: genresRecords });
  } catch (err) {
    console.error(err);
  }
};
