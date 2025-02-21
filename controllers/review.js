const Review=require('../models/review.js');
const Listing=require('../models/listingmodel');

module.exports.createrReview=async(req,res) => {
    let {id}=req.params;
    let listing=await Listing.findById(id)
    let reviews=req.body.reviews;
    const newreview=new Review(reviews);
    newreview.author=res.locals.currUser._id;
    listing.review.push(newreview);
    await newreview.save()
    await listing.save();
    req.flash("success","review added");
    res.redirect(`/lists/${id}`);
}



module.exports.deleteReview=async(req,res) => {
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/lists/${id}`);
}