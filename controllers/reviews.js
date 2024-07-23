const Review = require("../Model/review.js");
const Listing = require("../Model/listing.js");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully.")
    res.redirect(`/listings/${listing.id}`);
    console.log(listing);
  }

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully.")
    res.redirect(`/listings/${id}`);
  }