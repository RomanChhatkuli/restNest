const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./Model/listing.js");
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine("ejs",ejsMate); 

// Connecting to database wanderlust in mongodb
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then((res) => { 
    console.log("Connected to mongodb successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

// Root route
app.get("/", (req, res) => {
  res.send("Working root");
});

// index route
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find();
  res.render("listings/index.ejs", { allListing });
});

// Create Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings",(req,res)=>{
  let listing = req.body
  new Listing(listing).save()
  res.redirect('/listings')
})


// Edit Router 
app.get("/listings/:id/edit",async (req,res)=>{
  let {id} = req.params
  const listing = await Listing.findById(id)
  res.render("listings/edit.ejs",{listing})
})

app.put("/listings/:id",async (req,res)=>{
  let {id} = req.params
  let listing = req.body
  await Listing.findByIdAndUpdate(id,listing,{new: true}).then((res)=>{
    console.log(res)
  })
  res.redirect(`/listings/${id}`)
})    

// Delete Route 
app.delete("/listings/:id/delete",async (req,res)=>{
  let {id} = req.params
  await Listing.findByIdAndDelete(id).then((res)=>{
    console.log(res)
  })
  res.redirect('/listings')
})


// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});


app.listen("8080", () => {
  console.log("Listening at port 8080.");
});
