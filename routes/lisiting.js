const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Model/listing.js");
const { isLoggedIn } = require("../middleware.js")

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

// Create new listing Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body;

    listing.owner = req.user._id
   await new Listing(listing).save();
    req.flash("success","Listing Created Successfully.")
    res.redirect("/listings");
  })
);

// Edit listing Route
router.get(
  "/:id/edit",
  isLoggedIn, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing not found!")
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn, 
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id, listing, { new: true }).then((res) => {
      console.log(res);
    });
    req.flash("success","Listing Edited Successfully.")
    res.redirect(`/listings/${id}`);
  })
);

// show listing route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing not found!")
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Delete listing Route
router.delete(
  "/:id/delete",
  isLoggedIn, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res) => {
      console.log(res);
    });
    req.flash("success","Listing Deleted Successfully.")
    res.redirect("/listings");
  })
);

module.exports = router;
