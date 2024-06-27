const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image:  {
    type: String,
    default: "https://unsplash.com/photos/exotic-waterfall-and-lake-landscape-of-plitvice-lakes-national-park-unesco-natural-world-heritage-and-famous-travel-destination-of-croatia-the-lakes-are-located-in-central-croatia-croatia-proper-zC-Led1p8wA",
    set: (v) => v=== "" ? "https://unsplash.com/photos/exotic-waterfall-and-lake-landscape-of-plitvice-lakes-national-park-unesco-natural-world-heritage-and-famous-travel-destination-of-croatia-the-lakes-are-located-in-central-croatia-croatia-proper-zC-Led1p8wA":v
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
    