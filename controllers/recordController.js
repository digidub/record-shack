var Record = require('../models/record');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Label = require('../models/label');
var Format = require('../models/format');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = async function (req, res) {
  const recordCount = async () => await Record.countDocuments({});
  const artistCount = async () => await Artist.countDocuments({});
  const labelCount = async () => await Label.countDocuments({});
  const genreCount = async () => await Genre.countDocuments({});
  const formatCount = async () => await Format.countDocuments({});

  await Promise.all([recordCount(), artistCount(), genreCount(), labelCount(), formatCount()])
    .then((data) => res.render('index', { title: 'Record Shack - Home', data }))
    .catch(console.log);
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
      formats: function (callback) {
        Format.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      console.log(results);
      res.render('record_form', { title: 'Add new record to database', genres: results.genres, formats: results.formats });
    }
  );
};

exports.record_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('label', 'Label must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
  body('format', 'Format must not be empty').trim().isLength({ min: 1 }).escape(),
  body('quantity', 'Quantity must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  async (req, res, next) => {
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
      let artist;
      let label;

      const findArtist = await Artist.findOne({ name: req.body.artist });
      if (findArtist === null) {
        artist = new Artist({ name: req.body.artist });
        record.artist = artist._id;
      } else {
        record.artist = findArtist._id;
      }
      const findLabel = await Label.findOne({ name: req.body.artist });
      if (findLabel === null) {
        label = new Label({ name: req.body.label });
        record.label = label._id;
      } else {
        record.label = findLabel._id;
      }
      if (!findArtist) await artist.save();
      if (!findLabel) await label.save();
      const newRecord = await record.save();
      res.redirect(record.url);
    }
  },
];
