const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Model/listing.js");

// Validation of lisitng error handeling middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });
  })
);

// Create Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body;
    await new Listing(listing).save();
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id, listing, { new: true }).then((res) => {
      console.log(res);
    });
    res.redirect(`/listings/${id}`);
  })
);

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Delete Route
router.delete(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res) => {
      console.log(res);
    });
    res.redirect("/listings");
  })
);

module.exports = router;
