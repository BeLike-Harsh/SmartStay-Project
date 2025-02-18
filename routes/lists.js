const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const {listingitem}=require("../schema.js");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn}=require("../middleware.js");



const validateSchema=(req,res,next) => {
   let {error}=listingitem.validate(req.body);
   if(error){
       let errMsg=error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,errMsg);
   }else{
       next();
   }
}




//Index Route
router.get("/",wrapAsync(async(req,res) =>{
 const allList=await Listing.find({});

 res.render("./listing/index.ejs",{allList});
}))

router.get("/new",isLoggedIn,(req,res) => {
   res.render("./listing/create.ejs");
})
//Show route
router.get("/:id",wrapAsync(async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id).populate("review");
   if(!data){
      req.flash("error","the page you requested does not exist");
      res.redirect("/lists");
   }
   res.render("./listing/data.ejs",{data})
}))


//New Route
router.post("/",isLoggedIn,validateSchema,wrapAsync(async(req,res,next) => {
       let listing=req.body.listing;
       const New=new Listing(listing)
       await New.save();
       req.flash("success","new Pg added");
       res.redirect("/lists");
   
}))

router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id);
   res.render("./listing/edit.ejs",{data});
}))

//Update Route
router.patch("/:id",isLoggedIn,validateSchema,wrapAsync(async(req,res) => {
    let {id}=req.params;
    let listing=req.body.listing;
    await Listing.findByIdAndUpdate(id,
       listing
    )
    req.flash("success","Lists updated");
    res.redirect(`/lists/${id}`)
}))


//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res) => {
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","lists deleted");
   res.redirect("/lists");

}))



module.exports=router;