const fetch = require("node-fetch");

async function geocode(location) {

    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.MAP_TOKEN}&q=${encodeURIComponent(location)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();

  if(data && data[0] ){
    return {
       type : "Point",
       coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
       display_name: data[0].display_name
    };
  }else{
   console.warn("Geocoding failed: returning default coordinates (Delhi)");
            return {
                type: "Point",
                coordinates: [77.1025, 28.7041], // Delhi fallback
                display_name: "Delhi, India (Fallback)"
            };
  }
}

module.exports = geocode;