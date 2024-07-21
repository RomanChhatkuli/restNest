const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const User = require("../Model/user.js");
const {saveRedirectUrl} = require("../middleware.js")

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

    // to automatically login after signup 
    req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }

      req.flash("success", "Welcome to restNest.");
      return res.redirect("/listings");
    })

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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  async (req, res) => {
    req.flash("success","Welcome to rentNest.")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl); 
  }
);

// for user logout 
router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Successfully Logout.")
    return res.redirect("/listings")
  })
});

module.exports = router;
