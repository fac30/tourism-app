// Function to handle the menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    menuToggle.addEventListener("click", function () {
        nav.classList.toggle("collapsed");
        menuToggle.classList.toggle("active");
    });
});

// Define global variables for map and directions
let map, directionsService, directionsRenderer;

// Define function to initialize Google Map
function initMap() {
    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Create a new map centered at a specific location (Example: London)
    map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 7,
        center: { lat: 51.509865, lng: -0.118092 } // Example: London
    });

    // Set the DirectionsRenderer to render directions on the map
    directionsRenderer.setMap(map);

    // Initialize autocomplete for origin input field - restricted to the UK
    const originInput = document.getElementById("from");
    const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        types: ['geocode'],
        componentRestrictions: { country: "uk" }
    });

    // Initialize autocomplete for destination input field - restricted to the UK
    const destinationInput = document.getElementById("to");
    const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
        types: ['geocode'],
        componentRestrictions: { country: "uk" }
    });
}

// Define function to load Google Maps API
async function loadGoogleMapsAPI() {
    try {
        // Fetch Google Maps API key
        const response = await fetch('http://localhost:3000/api/maps-api-key');
        const data = await response.json();
        const apiKey = data.apiKey;

        // Create script element to load Google Maps API with key
        const script = document.createElement('script');
        const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.src = url;
        script.async = true;
        script.defer = true;

        // Append script element to document head
        document.head.appendChild(script);
    } catch (error) {
        console.error("Failed to load the Google Maps API key.", error);
    }
}

// Define function to get coordinates by location using Google Geocoding API
async function getCoordinatesByLocation(location) {
    try {
        // Fetch Google Maps API key
        const response = await fetch('http://localhost:3000/api/maps-api-key');
        const data = await response.json();
        const apiKey = data.apiKey;

        // Fetch coordinates using Geocoding API
        console.log("Fetching coordinates for:", location);
        const response1 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
        const data1 = await response1.json();

        // Check if response is OK
        if (data1.status === "OK") {
            // Extract latitude and longitude from response
            const { lat, lng } = data1.results[0].geometry.location;
            console.log("Coordinates:", lat, lng);
            return { lat, lng }; // Return coordinates as an object
        } else {
            console.error("Geocoding API request failed:", data1.status);
            throw new Error("Geocoding API request failed");
        }
    } catch (error) {
        console.error("Failed to get coordinates by location:", error);
        return null; // Return null if there's an error
    }
}

// Function to fetch nearby places
async function fetchNearbyPlaces(location, radius) {
    try {
        // Add class to map container
        const mapContainer = document.getElementById('googleMap');
        mapContainer.classList.add('map-fixed');

        // Get coordinates by location
        console.log("Fetching nearby places for location:", location);
        const coordinates = await getCoordinatesByLocation(location);
        if (!coordinates) return; // If coordinates are null, exit the function

        // Construct the request URL with latitude and longitude
        const { lat, lng } = coordinates;
        console.log("Latitude:", lat, "Longitude:", lng);

        // Append a unique parameter to bypass caching
        const uniqueParam = new Date().getTime(); // Current timestamp
        const url = `http://localhost:3000/places?location=${lat},${lng}&type=museum&radius=${radius}&unique=${uniqueParam}`;
        console.log(url);

        // Fetch nearby places from server
        const res = await fetch(url);
        const data = await res.json(); // Parse response data as JSON
        console.log("Nearby places:", data);

        // Clear previous list items
        const placesList = document.getElementById("touristic-places-list");
        placesList.innerHTML = "";

        // Iterate through the nearby places and create list items
        data.results.forEach(place => {
            const listItem = document.createElement("li");
            listItem.textContent = place.name;
            listItem.classList.add("nearby-place"); // Add nearby-place class
            placesList.appendChild(listItem);
        });

        // Show the touristic-places section
        document.getElementById("touristic-places").style.display = "block";

    } catch (error) {
        console.error("Failed to fetch nearby places:", error);
        // Handle error, e.g., show a message to the user
        // Throw the error again if you want to propagate it further!!
        throw error;
    }
}



// Function to calculate route and fetch nearby places
async function calculateRouteAndDisplayTouristicPlaces() {
    await calcRoute(); // Calculate route
    const origin = document.getElementById("from").value; // Get origin value
    const destination = document.getElementById("to").value; // Get destination value
    const radius = 10000; // Example radius (adjust as needed)
    await fetchNearbyPlaces(destination, radius); // Fetch nearby places using destination
}


// Function to calculate route
async function calcRoute() {
    const origin = document.getElementById("from").value;
    const destination = document.getElementById("to").value;
    const output = document.querySelector('#output');

    const request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            output.innerHTML = `<div class='alert-info'>From: ${origin}.<br />To: ${destination}.<br />Driving distance <i class='fas fa-road'></i> : ${route.distance.text}.<br />Duration <i class='fas fa-hourglass-start'></i> : ${route.duration.text}.</div>`;
        } else {
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not display the map route.</div>";
        }
    });
}

// Call function to load Google Maps API
loadGoogleMapsAPI();



// =====================================================
// // Function to handle the menu toggle
// document.addEventListener("DOMContentLoaded", function () {
//     const menuToggle = document.querySelector(".menu-toggle");
//     const nav = document.querySelector("nav");

//     menuToggle.addEventListener("click", function () {
//         nav.classList.toggle("collapsed");
//         menuToggle.classList.toggle("active");
//     });
// });


// // google maps directions and places of interest

// let map, directionsService, directionsRenderer;

// function initMap() {
//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     map = new google.maps.Map(document.getElementById("googleMap"), {
//         zoom: 7,
//         center: { lat: 51.509865, lng: -0.118092 }, // Example: London
//     });
//     directionsRenderer.setMap(map);

//     // Initialize autocomplete for origin input field - restricted to the UK!
//     const originInput = document.getElementById("from");
//     const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
//         types: ['geocode'], // Specify the type of input (geocode for addresses)
//         componentRestrictions: { country: "uk" }
//     });

//     // Initialize autocomplete for destination input field - restricted to the UK!
//     const destinationInput = document.getElementById("to");
//     const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
//         types: ['geocode'],
//         componentRestrictions: { country: "uk" }
//     });
// }

// async function calcRoute() {
//     const origin = document.getElementById("from").value;
//     const destination = document.getElementById("to").value;
//     const output = document.querySelector('#output');

//     const request = {
//         origin: origin,
//         destination: destination,
//         travelMode: 'DRIVING'
//     };

//     directionsService.route(request, function (result, status) {
//         if (status === 'OK') {
//             directionsRenderer.setDirections(result);
//             const route = result.routes[0].legs[0];
//             output.innerHTML = `<div class='alert-info'>From: ${origin}.<br />To: ${destination}.<br />Driving distance <i class='fas fa-road'></i> : ${route.distance.text}.<br />Duration <i class='fas fa-hourglass-start'></i> : ${route.duration.text}.</div>`;
//         } else {
//             output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not display the map route.</div>";
//         }
//     });
// }

// async function loadGoogleMapsAPI() {
//     try {
//         const response = await fetch('http://localhost:3000/api/maps-api-key');
//         const data = await response.json();
//         const apiKey = data.apiKey;

//         const script = document.createElement('script');
//         const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
//         script.src = url;
//         script.async = true;
//         script.defer = true;
//         document.head.appendChild(script);
//     } catch (error) {
//         console.error("Failed to load the Google Maps API key.", error);
//     }
// }

// loadGoogleMapsAPI();


// async function fetchNearbyPlaces(location, radius) {
//     try {
//         const response = await fetch(`http://localhost:3000/places?location=${location}&radius=${radius}`);
//         const data = await response.json();

//         // Clear previous results
//         document.getElementById('touristic-places-list').innerHTML = '';

//         // Display each place in the list
//         data.results.forEach(place => {
//             const li = document.createElement('li');
//             li.textContent = place.name;
//             document.getElementById('touristic-places-list').appendChild(li);
//         });
//     } catch (error) {
//         console.error("Failed to fetch nearby places:", error);
//     }
// }





// async function displayTouristAttractionsAlongRoute(route) {
//     try {
//         // Fetch the API key
//         const apiKeyResponse = await fetch('http://localhost:3000/api/maps-api-key');

//         // Check if the API key fetch was successful
//         if (!apiKeyResponse.ok) {
//             throw new Error(`Failed to fetch API key: ${apiKeyResponse.statusText}`);
//         }

//         // Extract the API key from the response
//         const apiKeyData = await apiKeyResponse.json();
//         const apiKey = apiKeyData.apiKey;

//         // Array to store fetched attractions
//         const attractions = [];

//         // Iterate over each step in the route
//         for (const step of route.steps) {
//             const lat = step.start_location.lat();
//             const lng = step.start_location.lng();

//             // Construct the API URL for fetching attractions
//             const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=point_of_interest&key=${apiKey}`;

//             // Log the URL for debugging
//             console.log('Fetching attractions from:', apiUrl);

//             // Fetch attractions data
//             // const response = await fetch(apiUrl);
//             const response = await fetch(apiUrl, { 'mode': 'no-cors' });

//             // Check if the fetch was successful
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch: ${response.statusText}`);
//             }

//             // Parse the JSON response
//             const data = await response.json();

//             // Push attractions to the array
//             attractions.push(...data.results);
//         }

//         // Return the array of attractions
//         return attractions;
//     } catch (error) {
//         // Log the error details
//         console.error('Error fetching tourist attractions along the route:', error.message);
//         console.error('Error status:', error.response ? error.response.status : 'Unknown');
//         console.error('Error details:', error.response ? await error.response.text() : 'Unknown');

//         // Return an empty array in case of error
//         return [];
//     }
// }

// async function calcRouteWithTouristAttractions() {
//     const origin = document.getElementById("from").value;
//     const destination = document.getElementById("to").value;
//     const output = document.querySelector('#output');

//     const request = {
//         origin: origin,
//         destination: destination,
//         travelMode: 'DRIVING'
//     };

//     // Call the directions service to get the route
//     directionsService.route(request, async function (result, status) {
//         if (status === 'OK') {
//             // Set the directions on the map
//             directionsRenderer.setDirections(result);
//             const route = result.routes[0].legs[0];

//             // Fetch tourist attractions along the route
//             const attractions = await displayTouristAttractionsAlongRoute(route);

//             // Update the output HTML with route information
//             output.innerHTML = `<div class='alert-info'>From: ${origin}.<br />To: ${destination}.<br />Driving distance <i class='fas fa-road'></i> : ${route.distance.text}.<br />Duration <i class='fas fa-hourglass-start'></i> : ${route.duration.text}.</div>`;

//             // Update the attractions list
//             const attractionsList = document.getElementById("touristic-places-list");
//             attractionsList.innerHTML = "";

//             if (attractions.length > 0) {
//                 attractions.forEach(attraction => {
//                     const listItem = document.createElement('li');
//                     listItem.textContent = attraction.name;
//                     attractionsList.appendChild(listItem);
//                 });
//             } else {
//                 output.innerHTML += "<br />No tourist attractions found along the route.";
//             }
//         } else {
//             // Display error message if route calculation fails
//             output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not display the map route.</div>";
//         }
//     });
// }

// async function calculateRouteAndDisplayTouristicPlaces() {
//     await calcRouteWithTouristAttractions();
// }


// ============================================================================
// OLD ORIGINAL CODE //

// let map, directionsService, directionsRenderer;

// function initMap() {
//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     map = new google.maps.Map(document.getElementById("googleMap"), {
//         zoom: 7,
//         center: { lat: 51.509865, lng: -0.118092 }, // Example: London
//     });
//     directionsRenderer.setMap(map);
// }

// async function calcRoute() {
//     const origin = document.getElementById("from").value;
//     const destination = document.getElementById("to").value;
//     const output = document.querySelector('#output');

//     const request = {
//         origin: origin,
//         destination: destination,
//         travelMode: 'DRIVING'
//     };

//     directionsService.route(request, function (result, status) {
//         if (status === 'OK') {
//             directionsRenderer.setDirections(result);
//             const route = result.routes[0].legs[0];
//             output.innerHTML = `<div class='alert-info'>From: ${origin}.<br />To: ${destination}.<br />Driving distance <i class='fas fa-road'></i> : ${route.distance.text}.<br />Duration <i class='fas fa-hourglass-start'></i> : ${route.duration.text}.</div>`;
//         } else {
//             output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not display the map route.</div>";
//         }
//     });
// }

// async function loadGoogleMapsAPI() {
//     try {
//         const response = await fetch('http://localhost:3000/api/maps-api-key');
//         const data = await response.json();
//         const apiKey = data.apiKey;

//         var script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
//         script.async = true;
//         script.defer = true;
//         document.head.appendChild(script);
//     } catch (error) {
//         console.error("Failed to load the Google Maps API key.", error);
//     }
// }

// loadGoogleMapsAPI();
