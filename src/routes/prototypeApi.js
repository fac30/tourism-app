const express = require('express');
const router = express.Router();
const needle = require('needle');

router.get('/', (req, res) => {
    res.json({ success: true});
})

module.exports = router