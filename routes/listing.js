const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing.js");
const methodOverride = require("method-override");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");



//server side  validation
const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted !");
    res.redirect("/listings");
}));

//Update Route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated !");
  res.redirect(`/listings/${id}`);
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Create Route
router.post("/",validateListing, wrapAsync(async (req, res,next ) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}));

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    
    if(!listing){
    req.flash("error", "Listing you requested for does not exist! ");
    res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}));

//Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));
module.exports = router;