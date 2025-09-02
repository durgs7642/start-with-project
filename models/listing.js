const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
     url : String,
     filename : String, 
    },
    price : Number,
    location : String,
    country : String,
    reviews:[{
      type : Schema.Types.ObjectId,
      ref : "Review",
    }
  ],
  geometry : {
    type : {
      type : String,
      enum : ["Point"],
      
    },
    coordinates : {
      type : [Number],
      default : [0, 0],
      required : true
    }
  },
  category : {
    type : String,
    enum : ["Mountains", "Arctic", "Rooms", "Iconic cities", "Castles", "Farms", "Camping", "Domes", "Boats", "Amazing Pools", "Trending"],
  },
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ; 