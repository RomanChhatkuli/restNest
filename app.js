const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./Model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Connecting to database
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/restNest");
}
main()
  .then((res) => {
    console.log("Connected to mongodb successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

// Validation error handeling middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

// Root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });
  })
);

// Create Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body;
    await new Listing(listing).save();
    res.redirect("/listings");
  })
);

// Edit Router
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
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

// Delete Route
app.delete(
  "/listings/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res) => {
      console.log(res);
    });
    res.redirect("/listings");
  })
);

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// Handeling invalid route
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// Error handeling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error has occured." } = err;
  res.status(status).render("listings/error.ejs", { err });
});

app.listen("8080", () => {
  console.log("Listening at port 8080.");
});
