#! /usr/bin/env node

var dotenv = require('dotenv').config();

console.log(
  'This script populates some test records, artists, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

var async = require('async');
var Record = require('./models/record');
var Artist = require('./models/artist');
var Genre = require('./models/genre');
var Label = require('./models/label');

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var artists = [];
var genres = [];
var records = [];
var labels = [];

function artistCreate(name, cb) {
  artistdetail = { name };

  var artist = new Artist(artistdetail);

  artist.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New artist: ' + artist);
    artists.push(artist);
    cb(null, artist);
  });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function labelCreate(name, cb) {
  labeldetail = { name };

  var label = new Label(labeldetail);

  label.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New label: ' + label);
    labels.push(label);
    cb(null, label);
  });
}

function recordCreate(title, artist, year, condition, genre, label, quantity, cb) {
  recorddetail = {
    title: title,
    artist: artist,
    year: year,
    condition: condition,
    genre: genre,
    label: label,
    quantity: quantity,
  };
  if (genre != false) recorddetail.genre = genre;

  var record = new Record(recorddetail);
  record.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New record: ' + record);
    records.push(record);
    cb(null, record);
  });
}

function createGenresLabelsArtists(cb) {
  async.series(
    [
      function (callback) {
        artistCreate('Leroy Gibbon', callback);
      },
      function (callback) {
        artistCreate('Yami Bolo', callback);
      },
      function (callback) {
        artistCreate('Barrington Levy', callback);
      },
      function (callback) {
        artistCreate('John Coltrane', callback);
      },
      function (callback) {
        artistCreate('Ian Foster', callback);
      },
      function (callback) {
        genreCreate('Reggae', callback);
      },
      function (callback) {
        genreCreate('Jazz', callback);
      },
      function (callback) {
        genreCreate('Soul', callback);
      },
      function (callback) {
        labelCreate('Yam Euphony Music', callback);
      },
      function (callback) {
        labelCreate('Marle', callback);
      },
      function (callback) {
        labelCreate('Time 1 Records', callback);
      },
      function (callback) {
        labelCreate('Not On Label', callback);
      },
      function (callback) {
        labelCreate('Random Label', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createRecords(cb) {
  async.parallel(
    [
      function (callback) {
        recordCreate('Love Conquers All', artists[1], 2001, 'VG+', genres[0], labels[0], 3, callback);
      },
      function (callback) {
        recordCreate('Lady', artists[0], 1983, 'NM', genres[0], labels[1], 1, callback);
      },
      function (callback) {
        recordCreate('Lipstick / The Vibe Is Right', artists[2], 1988, 'G+', genres[0], labels[2], 2, callback);
      },
      function (callback) {
        recordCreate('Untitled Jazz LP', artists[3], 1969, 'NM', genres[1], labels[3], 1, callback);
      },
      function (callback) {
        recordCreate("Tell me It's True", artists[4], 1990, 'VG', genres[2], labels[4], 0, callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenresLabelsArtists, createRecords],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('records: ' + records);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
