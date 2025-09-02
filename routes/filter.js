const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

router.get("/listings/category/:cat", async (req, res) => {
    try{
    const {cat} = req.params;
    const allListings = await Listing.find({category: cat});
    res.render("./listings/index.ejs", { allListings , cat});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;