const Listing = require("../Model/listing.js");

module.exports.index = async (req, res) => {
  let allListing = await Listing.find().populate("reviews").populate("owner");
  res.render("listings/index.ejs", { allListing });
};
module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.flash("error", "No files uploaded.");
    return res.redirect("/listings");
  }
  let listing = req.body;
  listing.owner = req.user._id;

  let images = [];
  req.files.forEach((file) => {
    images.push({
      url: file.path,
      filename: file.filename,
    });
  });

  listing.image = images;
  await new Listing(listing).save();
  req.flash("success", "Listing Created Successfully.");
  res.redirect("/listings");
};
module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body, { new: true });
  console.log(req.files);
  if (req.files.length) {
    let images = [];
    req.files.forEach((file) => {
      images.push({
        url: file.path,
        filename: file.filename,
      });
    });
    listing.image = images;
    await listing.save();
  }

  req.flash("success", "Listing Edited Successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id).then((res) => {
    console.log(res);
  });
  req.flash("success", "Listing Deleted Successfully.");
  res.redirect("/listings");
};
