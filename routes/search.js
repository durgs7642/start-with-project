const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");


router.get("/search", async (req, res) => {
  try {
    const { location } = req.query;
    const searchLocation = await Listing.find({ location :{ $regex: location, $options: "i" } });
    // res.json(searchLocation);
    console.log("searchLocation", searchLocation);
    res.render("listings/searchResult", { listings: searchLocation });
  } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  module.exports = router;