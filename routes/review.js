const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Model/review.js");
const Listing = require("../Model/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

// Post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully.")
    res.redirect(`/listings/${listing.id}`);
    console.log(listing);
  })
);
// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully.")
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;