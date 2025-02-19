const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require('../models/review.js');
const Listing=require('../models/listingmodel');
const {validateReview}=require('../middleware.js')



router.post("/",validateReview,wrapAsync(async(req,res) => {
    let {id}=req.params;
    let listing=await Listing.findById(id)
    let reviews=req.body.reviews;
    const newreview=new Review(reviews)
    listing.review.push(newreview);
    await newreview.save()
    await listing.save();
    req.flash("success","review added");
    res.redirect(`/lists/${id}`);
}))


//Delete review route

router.delete("/:reviewId",async(req,res) => {
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/lists/${id}`);
})

module.exports=router;