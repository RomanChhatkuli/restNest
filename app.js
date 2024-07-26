if(process.env.Node_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listingRouter = require("./routes/lisiting.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./Model/user.js")
const dbUrl = process.env.ATLASDB_URL;
// const dbUrl = "mongodb://127.0.0.1:27017/restNest";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mySecretCode",
  },
  touchAfter: 24*60*60
})
store.on("err",()=>{
  console.log("Error in mongo session store",err)
})

const sessionOption = {
  store,
  secret: "mySecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(flash());
app.use(session(sessionOption));
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

// Connecting to database
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

  app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.userInfo = req.user
    next()
  })

// Root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Middleware for handeling routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Handeling invalid route
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// Error handeling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error has occured." } = err;
  res.status(status).render("listings/error.ejs", { err });
});

app.listen("8080", () => {
  console.log("Listening at port 8080.");
});
