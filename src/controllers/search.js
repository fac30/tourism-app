
// this is the google Dynamic import methods for API reccomended by the google documentation

(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: apiKey,
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // I'm assuming weekly suggest the reference data for this library is a stable version updated weekly
    // Add other bootstrap parameters as needed, using camel case. (I have no idea what paramaters are avaliable or can do 😅)
});

let map;
let search;


// a revised version of init map in conjunction with the dynamic import method

async function initMap() {
    const {Map} = await google.maps.importLibrary('maps'); // google dynamic import allows modular import of only the necessary api components for each function
    map = new Map(document.getElementById('googleMap'), {
        zoom: 7,
        center: { lat: 51.509865, lng: -0.118092 }, // Example: London
    });
}

async function searchPlace() {
    const { Place } = await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

    const searchQuery = getElementById('search').value;
    console.log(`The search query: ${searchQuery}`);

    const request = {
        textQuery: searchQuery,
        fields: ['name'],
    };

    const { places } = await Place.searchByText(request);

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
}