const Record = require('../models/record');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Label = require('../models/label');
const Format = require('../models/format');
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
        let err = new Error('record not found');
        err.status = 404;
        return next(err);
      }
      res.render('record_detail', { title: results.title, record: results });
    });
};

exports.record_create_get = async function (req, res, next) {
  const findGenres = async () => await Genre.find();
  const findFormats = async () => await Format.find();

  await Promise.all([findGenres(), findFormats()])
    .then((data) => res.render('record_form', { title: 'Add new record to database', genres: data[0], formats: data[1] }))
    .catch(console.log);
};

exports.record_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape().unescape(),
  body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('label', 'Label must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('condition', 'Condition must not be empty').trim().isLength({ min: 1 }).escape(),
  body('format', 'Format must not be empty').trim().isLength({ min: 1 }).escape(),
  body('quantity', 'Quantity must be positive').trim().isFloat({ min: 1 }).escape(),
  body('genre.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.mapped());

    const record = new Record({
      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label,
      condition: req.body.condition,
      quantity: req.body.quantity,
      format: req.body.format,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      let genres = await Genre.find();
      let formats = await Format.find();
      for (let i = 0; i < genres.length; i++) {
        if (record.genre.indexOf(genres[i]._id) > -1) {
          genres[i].checked = 'true';
        }
        await res.render('record_form', {
          title: 'Create record',
          genres: genres,
          record: record,
          errors: errors.array(),
          formats: formats,
        });
        return;
      }
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
      const findLabel = await Label.findOne({ name: req.body.label });
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

exports.record_update_get = async function (req, res, next) {
  const findGenres = async () => await Genre.find();
  const findFormats = async () => await Format.find();
  const findRecordToUpdate = async () => await Record.findById(req.params.id).populate('artist').populate('genre').populate('label');

  const genres = await findGenres();
  const recordToUpdate = await findRecordToUpdate();
  const formats = await findFormats();
  console.log(recordToUpdate);

  for (let allGenres = 0; allGenres < genres.length; allGenres++) {
    for (let recordsGenres = 0; recordsGenres < recordToUpdate.genre.length; recordsGenres++) {
      if (genres[allGenres]._id.toString() === recordToUpdate.genre[recordsGenres]._id.toString()) {
        genres[allGenres].checked = 'true';
      }
    }
  }
  await res.render('record_form', { title: 'Update existing record', genres, formats, record: recordToUpdate });
};

exports.record_update_post = [
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
  body('quantity', 'Quantity must be positive').trim().isFloat({ min: 1 }).escape(),
  body('genre.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const record = new Record({
      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label,
      condition: req.body.condition,
      quantity: req.body.quantity,
      format: req.body.format,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      let genres = await Genre.find();
      let formats = await Format.find();
      for (let i = 0; i < genres.length; i++) {
        if (record.genre.indexOf(genres[i]._id) > -1) {
          genres[i].checked = 'true';
        }
        await res.render('record_form', {
          title: 'Create record',
          genres: genres,
          record: record,
          errors: errors.array(),
          formats: formats,
        });
        return;
      }
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
      if (!findArtist) await artist.save();

      const findLabel = await Label.findOne({ name: req.body.label });
      if (findLabel === null) {
        label = new Label({ name: req.body.label });
        record.label = label._id;
      } else {
        record.label = findLabel._id;
      }
      if (!findLabel) await label.save();

      Record.findByIdAndUpdate(req.params.id, record, {}, function (err, therecord) {
        if (err) {
          return next(err);
        }
        res.redirect(therecord.url);
      });
    }
  },
];

exports.record_delete_get = async function (req, res, next) {
  const recordToDelete = await Record.findById(req.params.id);
  console.log(recordToDelete);

  if (recordToDelete == null) {
    res.redirect('/catalog/records');
  }
  res.render('record_delete', { title: 'Delete record', record: recordToDelete });
};

exports.record_delete_post = async function (req, res, next) {
  const recordToDelete = Record.findById(req.body.recordid);
  Record.findByIdAndRemove(req.body.recordid, function deleteRecord(err) {
    res.redirect('/catalog/records');
  });
};
