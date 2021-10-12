var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    var dateTimeStamp = Date.now();
    cb(null, file.fieldname + '-' + dateTimeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

var record_controller = require('../controllers/recordController');
var artist_controller = require('../controllers/artistController');
var genre_controller = require('../controllers/genreController');
var label_controller = require('../controllers/labelController');
var format_controller = require('../controllers/formatController');

router.get('/', record_controller.index);
router.get('/record/create', record_controller.record_create_get);
router.post('/record/create', upload.single('image'), record_controller.record_create_post);
router.get('/record/:id/delete', record_controller.record_delete_get);
router.post('/record/:id/delete', record_controller.record_delete_post);
router.get('/record/:id/update', record_controller.record_update_get);
router.post('/record/:id/update', record_controller.record_update_post);
router.get('/record/:id', record_controller.record_detail);
router.get('/records', record_controller.record_list);

router.get('/artist/:id', artist_controller.artist_detail);
router.get('/artists', artist_controller.artist_list);

router.get('/label/:id', label_controller.label_detail);
router.get('/labels', label_controller.label_list);

router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);
router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

router.get('/genre/:id', genre_controller.genre_detail);
router.get('/genres', genre_controller.genre_list);

router.get('/format/:id', format_controller.format_detail);
router.get('/formats', format_controller.format_list);

module.exports = router;
