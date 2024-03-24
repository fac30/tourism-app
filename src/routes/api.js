const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');
const mapsAPIController = require('../controllers/googleMapsAPI');

router.get('/search', searchController);
router.get('/mapAPI', mapsAPIController);

module.exports = router;
