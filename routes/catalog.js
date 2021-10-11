var express = require('express');
var router = express.Router();

var record_controller = require('../controllers/recordController');
var artist_controller = require('../controllers/artistController');
var genre_controller = require('../controllers/genreController');
var label_controller = require('../controllers/labelController');
var format_controller = require('../controllers/formatController');

router.get('/', record_controller.index);
router.get('/record/create', record_controller.record_create_get);
router.post('/record/create', record_controller.record_create_post);
router.get('/record/:id/delete', record_controller.record_delete_get);
router.post('/record/:id/delete', record_controller.record_delete_post);
router.get('/record/:id/update', record_controller.record_update_get);
router.post('/record/:id/update', record_controller.record_update_post);
router.get('/record/:id', record_controller.record_detail);
router.get('/records', record_controller.record_list);

// router.get('/artist/:id/delete', artist_controller.artist_delete_get);
// router.post('/artist/:id/delete', artist_controller.artist_delete_post);
router.get('/artist/:id', artist_controller.artist_detail);
router.get('/artists', artist_controller.artist_list);

// router.get('/label/:id/delete', label_controller.label_delete_get);
// router.post('/label/:id/delete', label_controller.label_delete_post);
router.get('/label/:id', label_controller.label_detail);
router.get('/labels', label_controller.label_list);

router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);
// router.get('/genre/:id/delete', genre_controller.genre_delete_get);
// router.post('/genre/:id/delete', genre_controller.genre_delete_post);
// router.get('/genre/:id/update', genre_controller.genre_update_get);
// router.post('/genre/:id/update', genre_controller.genre_update_post);
router.get('/genre/:id', genre_controller.genre_detail);
router.get('/genres', genre_controller.genre_list);

// router.get('/format/:id/delete', format_controller.format_delete_get);
// router.post('/format/:id/delete', format_controller.format_delete_post);
router.get('/format/:id', format_controller.format_detail);
router.get('/formats', format_controller.format_list);

module.exports = router;
