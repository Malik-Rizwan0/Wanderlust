const express = require("express");
const router = express.Router({mergeParams: true});
const warpAsync = require("../utils/warpAcync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controllers/review.js")


router.post("/", validatereview, isLoggedIn, warpAsync(reviewController.createReview))

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  warpAsync(reviewController.destoryReview))

module.exports = router;