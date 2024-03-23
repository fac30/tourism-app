// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const axios = require('axios'); // For making HTTP requests
const cors = require('cors'); // Import the cors middleware
const corsPermissions = require('./cors'); // Import the corsPermissions middleware
const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable if available, otherwise default to 3000

// Serve static files from the public directory
app.use(express.static('public'));

const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    optionsSuccessStatus: 200
}

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(corsPermissions.permission); // Use the corsPermissions middleware
app.use(express.json()); // Parse JSON bodies in requests


// Route for retrieving Google Maps API key
app.get('/api/maps-api-key', cors(corsOptions), (req, res) => {
    // Return the Google Maps API key stored in environment variables
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Route for calculating route between two locations
app.post('/calculate-route', cors(corsOptions), async (req, res) => {
    // Extract origin and destination from request body
    const { origin, destination } = req.body;
    // Retrieve Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // Construct API URL for directions
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        // Make a GET request to Google Directions API using Axios
        const response = await axios.get(apiUrl); // Remove { mode: 'no-cors' }
        // Send back the entire response or part of it depending on your need
        res.json(response.data);
    } catch (error) {
        // Handle errors if request fails
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
});

// Route for fetching nearby places based on location
app.get('/api/places', async (req, res) => {
    // Extract location, radius, type, and key from query parameters
    const { location, radius, type } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // Construct API URL for nearby places search
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
        // Make a GET request to Google Places API using Axios
        const response = await axios.get(apiUrl);
        // Send the fetched data back as JSON response
        res.json(response.data);
    } catch (error) {
        // Handle errors if request fails
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



// !! DO NOT DELETE IT YET !! SECOND VERSION OF THE CODE -- !! DO NOT DELETE THIS YET!!  //
// // Load environment variables from .env file
// require('dotenv').config();

// // Import necessary modules
// const express = require('express');
// const axios = require('axios'); // For making HTTP requests
// const cors = require('cors'); // For enabling CORS
// const corsPermissions = require('./cors');
// const app = express();
// const port = process.env.PORT || 3000; // Use PORT environment variable if available, otherwise default to 3000

// const corsOptions = {
//     origin: 'http://127.0.0.1:3000',
//     optionsSuccessStatus: 200
// }

// // Middleware setup
// app.use(cors()); // Enable CORS for all routes
// app.use(corsPermissions.permission);
// app.use(express.json()); // Parse JSON bodies in requests

// // Route for retrieving Google Maps API key
// app.get('/api/maps-api-key', cors(corsOptions), (req, res) => {
//     // Return the Google Maps API key stored in environment variables
//     res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
// });

// // Route for calculating route between two locations
// app.post('/calculate-route', cors(corsOptions), async (req, res) => {
//     // Extract origin and destination from request body
//     const { origin, destination } = req.body;
//     // Retrieve Google Maps API key from environment variables
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//     // Construct API URL for directions
//     const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

//     try {
//         // Make a GET request to Google Directions API using Axios
//         const response = await axios.get(apiUrl);
//         // Send back the entire response or part of it depending on your need
//         res.json(response.data);
//     } catch (error) {
//         // Handle errors if request fails
//         res.status(500).json({ error: 'Failed to fetch directions' });
//     }
// });

// // Route for fetching nearby places based on location
// app.get('/api/places', cors(corsOptions), async (req, res) => {
//     // Extract location, radius, type, and key from query parameters
//     const { location, radius, type, key } = req.query;
//     // Construct API URL for nearby places search
//     const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${key}`;

//     try {
//         // Make a GET request to Google Places API using axios
//         const response = await axios.get(apiUrl);
//         // Send the fetched data back as JSON response
//         res.json(response.data);
//     } catch (error) {
//         // Handle errors if request fails
//         console.error('Error fetching places:', error);
//         res.status(500).json({ error: 'Failed to fetch places' });
//     }
// });

// // Start the server and listen on the specified port
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
