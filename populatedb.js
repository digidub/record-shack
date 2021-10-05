#! /usr/bin/env node

var dotenv = require('dotenv').config();

console.log(
  'This script populates some test records, artists, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Record = require('./models/record');
var Artist = require('./models/artist');
var Genre = require('./models/genre');

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var artists = [];
var genres = [];
var records = [];
var bookinstances = [];

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

function recordCreate(title, condition, artist, genre, cb) {
  recorddetail = {
    title: title,
    condition: condition,
    artist: artist,
    genre: genre,
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

function createGenreArtists(cb) {
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
    ],
    // optional callback
    cb
  );
}

function createRecords(cb) {
  async.parallel(
    [
      function (callback) {
        recordCreate('Love Conquers All', 'VG+', artists[1], [genres[0]], callback);
      },
      function (callback) {
        recordCreate('Lady', 'NM', artists[0], [genres[0]], callback);
      },
      function (callback) {
        recordCreate('Lipstick / The Vibe Is Right', 'G+', artists[2], [genres[0]], callback);
      },
      function (callback) {
        recordCreate('Untitled Jazz LP', 'NM', artists[3], [genres[1]], callback);
      },
      function (callback) {
        recordCreate("Tell me It's True", 'VG', artists[4], [genres[2]], callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenreArtists, createRecords],
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
