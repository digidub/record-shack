var Record = require('../models/record');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Label = require('../models/label');
var async = require('async');
const { body, validationResult } = require('express-validator');

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
  Record.findById(req.params.id)
    .populate('artist')
    .populate('genre')
    .populate('label')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      if (results == null) {
        var err = new Error('record not found');
        err.status = 404;
        return next(err);
      }
      res.render('record_detail', { title: results.title, record: results });
    });
};

exports.record_create_get = function (req, res, next) {
  async.parallel(
    {
      genres: function (callback) {
        Genre.find(callback);
      },
      labels: function (callback) {
        Label.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      console.log(results);
      res.render('record_form', { title: 'Add new record to database', genres: results.genres, labels: results.labels });
    }
  );
};

exports.record_create_post = [
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('artist', 'artist must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('label', 'Label must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('genre', 'Genre must not be empty').trim().isLength({ min: 1 }).escape(),
  body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
  // body('format', 'Format must not be empty').trim().isLength({ min: 1 }).escape(),
  // body('quantity', 'Quantity must not be empty').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var record = new Record({
      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label,
      condition: req.body.condition,
      quantity: req.body.quantity,
      format: req.body.format,
      genre: req.body.genre,
    });
    console.log(record);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.genres.length; i++) {
            if (record.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('record_form', {
            title: 'Create record',
            genres: results.genres,
            record: record,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      async.series(
        [
          function lookupArtist(callback) {
            Artist.findOne({ name: req.body.artist }, function (err, results, next) {
              if (err) {
                console.error(err);
                return next(err);
              } else {
                console.log(results);
                if (results !== null) {
                  (record.artist = results._id), console.log(record);
                } else {
                  // create new artist
                }
              }
            });
          },
          function lookupLabel(callback) {
            Label.findOne({ name: req.body.label }, function (err, results, next) {
              if (err) {
                console.error(err);
                return next(err);
              } else {
                console.log(results);
                if (results !== null) {
                  record.label = results._id;
                } else {
                  // create new label
                }
              }
            });
          },
        ],
        function (err, results, next) {
          if (err) {
            console.error(err);
            return next(err);
          } else {
            console.log(results);
            console.log(results.artist.id);
            record = { ...data, artist: results.artist.id };
            res.redirect(record.url);
          }
        }
      );
    }
  },
];

// {
//   artist: function (callback) {
//     Artist.findOne({ name: req.body.artist }, callback);
//   },
//   label: function (callback) {
//     Label.findOne({ name: req.body.label });
//   },
//   genre: function (callback) {
//     Label.findOne({ name: req.body.genre });
//   },
// },
//   function (err, results) {
//     if (err) {
//       console.log(err);
//       return next(err);
//     }
//     console.log(results.artist);
//     console.log(results.label);
//     console.log(results.genre);
//   }
// );
// record.save(function (err) {
//   if (err) {
//     return next(err);
//   }
//   //successful - redirect to new record record.
//   res.redirect(record.url);
// });
// }
// res.redirect('/catalog/');

// function (err, results) {
//   if (results) {
//     console.log('artist found');
//     console.log(results);
//     // callback('Email already exists');
//   } else {
//     console.log('artist not found');
//     console.log(req.body.artist);
//     callback();
//   }
// }

// , function (err, results) {
//   if (results) {
//     console.log(results);
//     // callback('Email already exists');
//   } else {
//     callback();
//   }
// }

// artist: '615da44f2241bfc76e7f1ad0',
//   label: 'Time 1 Records',
//   condition: 'VG+',
//   genre: '615da44f2241bfc76e7f1ad6'
// }
