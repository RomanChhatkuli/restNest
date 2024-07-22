const Listing = require("./Model/listing.js")
const Review = require("./Model/review.js")
const expressError = require("./utils/expressError.js")
const { listingSchema, reviewSchema } = require("./schema.js") 

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first!")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let { id } = req.params;
    let listing =await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.userInfo._id)){ 
      req.flash("error","You dont have permission.")
      return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.isAuthor = async (req,res,next) =>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId) 
    if (!review.author.equals(res.locals.userInfo._id)){ 
      req.flash("error","You dont have permission to do so.")
      return res.redirect(`/listings/${id}`);
    }
    next()
}

// Validation of lisitng error handeling middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      throw new expressError(400, error);
    } else {
      next();
    } 
  };

  // Validation of reviews error handeling middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new expressError(400, error);
    } else {
      next();
    }
  };