// const { axios } = require('axios');
const express = require('express');
// require('dotenv').config();

const app = express();

// const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// let search;

// async function searchPlace() {
//     const { Place } = await google.maps.importLibrary('places');
//     const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

//     const searchQuery = getElementById('search').value;
//     console.log(`The search query: ${searchQuery}`);

//     const request = {
//         textQuery: searchQuery,
//         fields: ['name'],
//     };

//     const places = await Place.searchByText(request);

//     if (places.length) {
//         console.log(places);

//         const { LatLngBounds } = await google.maps.importLibrary("core");
//         const bounds = new LatLngBounds();

//         places.forEach((place) => {
//             const markerView = new AdvancedMarkerElement({
//               map,
//               position: place.location,
//               title: place.displayName,
//             });
      
//             bounds.extend(place.location);
//             console.log(place);
//           });
//           map.setCenter(bounds.getCenter());
//     }   else {
//         console.log('No results');
//     }
// }

exports.searchMap = async (req, res) => {
    const { Place } = await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    
    
    // let search;
    const searchQuery = getElementById('search').value;
    console.log(`The search query: ${searchQuery}`);
    
    
    try {
        const places = await Place.searchByText(request);
        
        if (places.length) {
            console.log(places);
    
            const { LatLngBounds } = await google.maps.importLibrary("core");
            const bounds = new LatLngBounds();
    
            places.forEach((place) => {
                const markerView = new AdvancedMarkerElement({
                  map,
                  position: place.location,
                  title: place.displayName,
                });
          
                bounds.extend(place.location);
                console.log(place);
              });
              map.setCenter(bounds.getCenter());
        }   else {
            console.log('No results');
        }
    } catch (error) {
        console.error(error);
    }
}