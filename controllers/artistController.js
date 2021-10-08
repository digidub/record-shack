var Artist = require('../models/artist');
var Record = require('../models/record');

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

exports.artist_detail = async function (req, res, next) {
  const artist = await Artist.findById(req.params.id);
  const artistsRecords = await Record.find({ artist: req.params.id }, 'title summary');
  res.render('artist_detail', { title: 'Artist Detail', artist, artist_records: artistsRecords });
};
