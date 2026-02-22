const express = require("express");
const router = express.Router({mergeParams:true});///
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/Listing.js");


//server side validation
const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}


//Delete route
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
   let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review Deleted !");
   res.redirect(`/listings/${id}`);
}))



//post route
router.post("/", validateReview ,wrapAsync(async (req, res ) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    newReview.save();
    req.flash("success", "New review Created !");
    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;