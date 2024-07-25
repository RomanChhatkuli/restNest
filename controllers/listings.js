const Listing = require("../Model/listing.js");

module.exports.index = async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });
  }

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
}

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
}

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body;
  listing.owner = req.user._id;
  listing.image = {url, filename};
 await new Listing(listing).save();
  req.flash("success","Listing Created Successfully.")
  res.redirect("/listings");
}
module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body, { new: true })

  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  
  req.flash("success", "Listing Edited Successfully.");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id).then((res) => {
    console.log(res);
  });
  req.flash("success", "Listing Deleted Successfully.");
  res.redirect("/listings");
}