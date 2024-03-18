let map, directionsService, directionsRenderer;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 7,
        center: { lat: 51.509865, lng: -0.118092 }, // Example: London
    });
    directionsRenderer.setMap(map);
}

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

async function loadGoogleMapsAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/maps-api-key');
        const data = await response.json();
        const apiKey = data.apiKey;

        var script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } catch (error) {
        console.error("Failed to load the Google Maps API key.", error);
    }
}

loadGoogleMapsAPI();
