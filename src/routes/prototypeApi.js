const express = require('express');
const router = express.Router();
const needle = require('needle');

const baseURL = process.env.prototype_base_url;
const apiKey = process.env.prototype_apikey;

// const prototypeApiFetch = require('../controllers/prototypeApiFetch');

router.get('/', async (req, res) => {
    res.json({ success: true});
    try {
        const apiRes = await needle('get', `${baseURL}`);
        const data = apiRes.body;

        res.status(200).json(data);
    } catch (error) {
        res.send(500).json({error});
    }

})

// router.get('/fetch', prototypeApiFetch)



module.exports = router