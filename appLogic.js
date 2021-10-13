const Record = require('../models/record');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Label = require('../models/label');
const Format = require('../models/format');
const { body, validationResult } = require('express-validator');

const recordCount = async () => await Record.countDocuments({});
const artistCount = async () => await Artist.countDocuments({});
const labelCount = async () => await Label.countDocuments({});
const genreCount = async () => await Genre.countDocuments({});
const formatCount = async () => await Format.countDocuments({});

const findGenres = async () => await Genre.find();
const findFormats = async () => await Format.find();
const findRecordToUpdate = async () => await Record.findById(req.params.id).populate('artist genre label format');

const find = async () => {
  genres = () => await Genre.find();
  formats = () => await Formats.find();
  return {
    genres,
    formats,
  };
};

const repopulatePage = async () => {
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
};

// record_create_post

// } else {
//     let artist;
//     let label;

//     const findArtist = await Artist.findOne({ name: req.body.artist });
//     if (findArtist === null) {
//       artist = new Artist({ name: req.body.artist });
//       record.artist = artist._id;
//     } else {
//       record.artist = findArtist._id;
//     }
//     const findLabel = await Label.findOne({ name: req.body.label });
//     if (findLabel === null) {
//       label = new Label({ name: req.body.label });
//       record.label = label._id;
//     } else {
//       record.label = findLabel._id;
//     }
//     if (!findArtist) await artist.save();
//     if (!findLabel) await label.save();
//     await record.save();
//     res.redirect(record.url);

//     let genres = await Genre.find();
//   let formats = await Format.find();
//   for (let i = 0; i < genres.length; i++) {
//     if (record.genre.indexOf(genres[i]._id) > -1) {
//       genres[i].checked = 'true';
//     }
//     await res.render('record_form', {
//       title: 'Create record',
//       genres: genres,
//       record: record,
//       errors: errors.array(),
//       formats: formats,
//     });
//     return;
//   }
// } else {
//   let artist;
//   let label;
//   const findArtist = await Artist.findOne({ name: req.body.artist });
//   if (findArtist === null) {
//     artist = new Artist({ name: req.body.artist });
//     record.artist = artist._id;
//   } else {
//     record.artist = findArtist._id;
//   }
//   if (!findArtist) await artist.save();

//   const findLabel = await Label.findOne({ name: req.body.label });
//   if (findLabel === null) {
//     label = new Label({ name: req.body.label });
//     record.label = label._id;
//   } else {
//     record.label = findLabel._id;
//   }
//   if (!findLabel) await label.save();
