const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user.id; // add author to review
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully added a new review")
    res.redirect(`/listings/${id}`)
}
module.exports.destoryReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review")
    res.redirect(`/listings/${id}`)
}