const express = require("express");
const router = express.Router({mergeParams: true});
const warpAsync = require("../utils/warpAcync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


const validatereview = (req , res ,next)=>{
  let {error} = reviewSchema.validate(req.body)
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400 , errMsg)
  }else{
    next()
  }
}

router.post("/", validatereview, warpAsync(async (req, res) => {
    console.log(req.params.id)
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully added a new review")
    res.redirect(`/listings/${id}`)
}))

// delete review route
router.delete("/:reviewId", warpAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review")
    res.redirect(`/listings/${id}`)
}))

module.exports = router;