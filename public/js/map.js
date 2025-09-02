 const coords = listing.geometry.coordinates; 
   const API_KEY = mapToken;
console.log(coords);

  // Initialize map
  const map = new maplibregl.Map({
    container: "map",
    style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${API_KEY}`,
    center: coords, // [lng, lat]
    zoom: 9,
  });


  // Marker add karna
new maplibregl.Marker()
  .setLngLat(coords) // [lng, lat]
  .setPopup(
    new maplibregl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>${listing.location}</p>`
    )
  )
  .addTo(map);
