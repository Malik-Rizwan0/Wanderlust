const Listing = require('../models/listing');

// module.exports.listingIndex = async(req, res)=>{
//     let allListings = await Listing.find({})
//     res.render("listings/index.ejs" , {allListings})
//   }
module.exports.listingIndex = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }else{
    // filter.category = {""}
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, currentCategory: category || "" });
};
module.exports.newListingForm = async(req , res)=>{
    res.render("listings/new.ejs");
  }

module.exports.newListing = async (req ,res)=>{
    console.log(req.body.listing)
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing (req.body.listing);
    console.log(req.user.id)
    newListing.author = req.user.id;
    newListing.image = {
      url : url,
      filename : filename
    }
    
    
    await newListing.save();
    req.flash("success", "Successfully Created A New Listing")
    res.redirect("/listings")
  } 


module.exports.listingDetails =async(req , res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path : 'reviews' ,  populate : {path: "author"},} ).populate("author");
    if (!listing) {
      req.flash("error", "Listing Not Found")
      res.redirect("/listings")
    }else{
    res.render ("listings/show.ejs" , {listing})
    }
  }

module.exports.listingEditForm = async (req, res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found")
    res.redirect("/listings")
  }else{
  let img = listing.image.url;  
  img.replace('/upload' , '/upload/w_250')
  res.render("listings/edit.ejs" , {listing , img})
  }
} 

module.exports.updateListing = async (req, res)=>{
    if (!req.body.listing) {
      throw new ExpressError(400 , "Please Enter Valid Data For Listing")
    }
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing} );
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      console.log(url , filename)
      listing.image = {url , filename }
      await listing.save();    
    }
    req.flash("success", "Successfully Updated The Listing")
    res.redirect(`/listings/${id}`)
  }

module.exports.destoryListing = async (req ,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    req.flash("success", "Successfully Deleted The Listing")
    res.redirect("/listings")
  }

  module.exports.searchListing =  async (req, res) => {
    const { q } = req.query;
    try {
      const listings = await Listing.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { location: { $regex: q, $options: 'i' } },
          { country: { $regex: q, $options: 'i' } }
        ]
      });
  
      res.render('listings/search-results', {
        listings,
        searchQuery: q
      });
    } catch (err) {
      res.status(500).send('Search failed');
    }
  }