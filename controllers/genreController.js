var Genre = require('../models/genre');
var Record = require('../models/record');
var Artist = require('../models/artist');
const { body, validationResult } = require('express-validator');

exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }
      res.render('genre_list', { title: 'Genres', genre_list: list_genres });
    });
};

exports.genre_detail = async function (req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id);
    const genresRecords = await Record.find({ genre: req.params.id }).populate('artist label genre format condition');
    res.render('genre_detail', { title: 'Genre Detail', genre, genre_records: genresRecords });
  } catch (err) {
    console.error(err);
  }
};

exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      Genre.findOne({ name: req.body.name }).exec(function (err, foundGenre) {
        if (err) {
          return next(err);
        }
        if (foundGenre) {
          res.redirect(foundGenre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

exports.genre_delete_get = async function (req, res, next) {
  const genreToDelete = await Genre.findById(req.params.id);
  const genresRecords = await Record.find({ genre: req.params.id });
  console.log(genresRecords);
  if (genreToDelete === null) {
    res.redirect('/catalog/genres');
  }
  res.render('genre_delete', { title: 'Delete Genre', genre: genreToDelete, genre_records: genresRecords });
};

exports.genre_delete_post = async function (req, res, next) {
  const genreToDelete = await Genre.findById(req.body.genreid);
  const genresRecords = await Record.find({ genre: req.body.genreid });

  if (genresRecords.length > 0) {
    res.render('genre_delete', { title: 'Delete Genre', genre: genreToDelete, genre_records: genresRecords });
    return;
  } else {
    Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog/genres');
    });
  }
};
