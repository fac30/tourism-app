require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./src/routes/api');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

app.get('/api/maps-api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.post('/calculate-route', async (req, res) => {
    const { origin, destination } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        // Send back the entire response or part of it depending on your need
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
