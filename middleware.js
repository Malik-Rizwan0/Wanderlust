const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema , reviewSchema } = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // log the request path 
        req.flash("error", "You must be  Login to do that!"); // flash message
        return res.redirect("/login"); // redirect to login page
    }
    next(); // if user is authenticated, go to next middleware
}
module.exports.saveOrignalUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
       res.locals.redirectUrl = req.session.redirectUrl; // log the request path and method
    }
    next(); // if user is authenticated, go to next middleware
}
module.exports.isAuthor = async (req , res , next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser.equals(listing.author)) {
        req.flash("error" , "You are not allow to perform this task!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req , res ,next)=>{
  let {error} = listingSchema.validate(req.body)
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400 , errMsg)
  }else{
    next()
  }
}
module.exports.validatereview = (req , res ,next)=>{
  let {error} = reviewSchema.validate(req.body)
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400 , errMsg)
  }else{
    next()
  }
}
module.exports.isReviewAuthor = async (req , res , next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser.id)) {
        req.flash("error" , "You are not allow to perform this task!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}