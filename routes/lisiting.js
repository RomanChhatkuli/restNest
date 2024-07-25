const express = require("express");
const router = express.Router();
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {index, newForm, createListing, showListing, editListing, deleteListing, editForm} = require("../controllers/listings.js");

router  
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, upload.single('image'), wrapAsync(createListing));

router.get("/new", isLoggedIn, newForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(editListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editForm));

module.exports = router;
