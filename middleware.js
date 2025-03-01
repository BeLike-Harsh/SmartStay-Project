const Listing=require('./models/listingmodel');
const Review=require('./models/review.js');
const {listingitem,reviewsValid}=require("./schema.js");
const ExpressError=require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you have to log in first!!");
        return res.redirect("/login");
     }
     next();
}

module.exports.saveRedirectUrl=(req,res,next) => {
    if(req.session.redirectUrl){
    res.locals.RedirectUrl=req.session.redirectUrl
   }
     next();
}


module.exports.isOwner=async(req,res,next) => {
    let {id}=req.params;
    let listingUser=await Listing.findById(id);
    if(!listingUser.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You don't have permission");
      return res.redirect(`/lists/${id}`);
    }
    next();
}


//Schema Validation

module.exports.validateSchema=(req,res,next) => {
    let {error}=listingitem.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
 }

// review Schema Validation
 module.exports.validateReview=(req,res,next) => {
    let {error}=reviewsValid.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Author verification
module.exports.isReviewAuthor=async(req,res,next) => {
    let{id,reviewId}=req.params;
    const verifyReview=await Review.findById(reviewId);
    if( !verifyReview.author.equals(res.locals.currUser._id)){
         req.flash("error","You don't have permisssion");
        return res.redirect(`/lists/${id}`);
    }
    next();
}

