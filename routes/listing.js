const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//Index Route
//Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedin, validateListing, wrapAsync(listingController.createListing));


//New Route
router.get("/new",isLoggedin, listingController.renderNewForm);

//show
//delete
//update
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete( isLoggedin, isOwner, wrapAsync(listingController.destroyListing))
.put( isLoggedin, isOwner, validateListing, wrapAsync(listingController.updateListing));




//Edit Route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;