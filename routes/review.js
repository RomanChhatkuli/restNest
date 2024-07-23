const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/reviews.js");

// Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(postReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(deleteReview));

module.exports = router;
