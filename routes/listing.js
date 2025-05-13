const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAcync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isAuthor, validateListing } = require("../middleware.js")
const controller = require("../controllers/listing.js")
const multer = require('multer');
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage })

// index route 
router.route("/")
    .get(warpAsync(controller.listingIndex))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        warpAsync(controller.newListing)
    );

router.get("/new", isLoggedIn, warpAsync(controller.newListingForm));




router.get('/search', controller.searchListing);




router.route("/:id")
    .get(warpAsync(controller.listingDetails))
    .put(isLoggedIn,
        isAuthor,
        upload.single('listing[image]'),
        validateListing, warpAsync(controller.updateListing))
    .delete(isLoggedIn, isAuthor, warpAsync(controller.destoryListing));
router.get("/:id/edit", isLoggedIn, isAuthor, warpAsync(controller.listingEditForm))

module.exports = router;








