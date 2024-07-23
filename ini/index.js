const mongoose = require("mongoose");
const Listing = require("../Model/listing.js");


const initData =  require('./data.js')
require('dotenv').config()


// const dbUrl = "mongodb://127.0.0.1:27017/restNest";
async function main() {
  await mongoose.connect("mongodb+srv://romanchhatkuli09:romanchhatkuli%407@cluster0.cvi4pgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
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
    owner: '669e5cc28b21e00908bdb937'  // mongoatlas
    // owner: '669d05121c929dbd38ccbf89'  // local
  }));

  // Insert the updated data into the database
  await Listing.insertMany(updatedData);
}

initDB();