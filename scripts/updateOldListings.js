require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to DB"))
.catch(err => console.log("DB connection error:", err));

async function updateOldListings() {
    const listings = await Listing.find({});

    for (let listing of listings) {
        if (!listing.geometry || listing.geometry.coordinates[0] === 0) {
            console.log("Updating listing:", listing.title);

            const geoData = await geocode(listing.location);
            if (geoData) {
                listing.geometry = geoData;
                await listing.save();
                console.log("Updated:", listing.title, geoData.coordinates);
            } else {
                console.warn("Geocoding failed for:", listing.title);
            }
        }
    }

    console.log("All old listings updated!");
    mongoose.connection.close();
}

updateOldListings();
