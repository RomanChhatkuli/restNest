const mongoose = require("mongoose");
const Listing = require("../Model/listing.js");
const initData =  require('./data.js')

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

const initDB = async ()=>{
   await Listing.deleteMany({})
   await Listing.insertMany(initData.data)
}

initDB();