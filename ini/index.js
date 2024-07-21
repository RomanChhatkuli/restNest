const mongoose = require("mongoose");
const Listing = require("../Model/listing.js");


const initData =  require('./data.js')
require('dotenv').config()

// const dbUrl = process.env.ATLASDB_URL
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
   const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: '669d05121c929dbd38ccbf89'  // Assuming this is the correct owner ObjectId
  }));

  // Insert the updated data into the database
  await Listing.insertMany(updatedData);
}

initDB();