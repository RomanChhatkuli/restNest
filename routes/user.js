const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const User = require("../Model/user.js");

// User signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to restNest.");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", `${err.message}`);
    res.redirect("/signup");
  }
});

// routes for login page
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  async (req, res) => {
    req.flash("success","Welcome to rentNest.")
    res.redirect("/listings");
  }
);

module.exports = router;
