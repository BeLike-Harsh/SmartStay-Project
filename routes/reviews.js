const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewsValid}=require('../schema.js');
const Review=require('../models/review.js');
const Listing=require('../models/listingmodel');


//Validation for schema

const validateReview=(req,res,next) => {
    let {error}=reviewsValid.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}



router.post("/",validateReview,wrapAsync(async(req,res) => {
    let {id}=req.params;
    let listing=await Listing.findById(id)
    let reviews=req.body.reviews;
    const newreview=new Review(reviews)
    listing.review.push(newreview);
    await newreview.save()
    await listing.save();
    res.redirect(`/lists/${id}`);
}))


//Delete review route

router.delete("/:reviewId",async(req,res) => {
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ review: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/lists/${id}`);
})

module.exports=router;