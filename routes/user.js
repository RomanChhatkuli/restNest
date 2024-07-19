const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../Model/user.js")

// User signup form 
router.get("/signup",(req,res)=>{
  res.render("users/signup.ejs")
})
router.post("/signup", async (req,res)=>{
  let {username,email,password} = req.body;
  console.log(email)
})

module.exports = router;