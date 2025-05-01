const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAcync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema , reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")

// joi validation middleware 
const validateListing = (req , res ,next)=>{
  let {error} = listingSchema.validate(req.body)
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400 , errMsg)
  }else{
    next()
  }
}


// index route 
router.get("/" , warpAsync(async(req, res)=>{
  let allListings = await Listing.find({})
  res.render("listings/index.ejs" , {allListings})
}))


// create route 

// new route 
router.get("/new" , warpAsync(async(req , res)=>{
  res.render("listings/new.ejs");
}))
// save route 
router.post ("/" , validateListing , warpAsync( async (req ,res)=>{
  console.log(req.body.listing)
  // if (!req.body.listing) {
  //   throw new ExpressError(400 , "Please Enter Valid Data For Listing")
  // } 
  let newListing = new Listing (req.body.listing);
  await newListing.save();
  req.flash("success", "Successfully Created A New Listing")
  res.redirect("/listings")
}))


// Read route 
router.get("/:id",  warpAsync(async(req , res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash("error", "Listing Not Found")
    res.redirect("/listings")
  }else{
  res.render ("listings/show.ejs" , {listing})
  }
}))


// update route 
// edit 
router.get("/:id/edit" , warpAsync(async (req, res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found")
    res.redirect("/listings")
  }else{
  res.render("listings/edit.ejs" , {listing})
  }
}))

// update route 
router.put ("/:id" , validateListing , warpAsync(async (req, res)=>{
  if (!req.body.listing) {
    throw new ExpressError(400 , "Please Enter Valid Data For Listing")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing} );
  req.flash("success", "Successfully Updated The Listing")
  res.redirect(`/listings/${id}`)
}))

// Delete route
router.delete("/:id", warpAsync(async (req ,res)=>{
  let {id} = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing)
  req.flash("success", "Successfully Deleted The Listing")
  res.redirect("/listings")
}))

module.exports = router;