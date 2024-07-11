const mongoose = require("mongoose");
const Listing = require("../Model/listing.js");
const initData =  require('./data.js')
require('dotenv').config()

const dbUrl = process.env.ATLASDB_URL
async function main() {
  await mongoose.connect(dbUrl);
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