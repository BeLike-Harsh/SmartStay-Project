const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");


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
   const data=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
   if(!data){
      req.flash("error","the page you requested does not exist");
      res.redirect("/lists");
   }
   res.render("./listing/data.ejs",{data})
}))


//New Route
router.post("/",isLoggedIn,validateSchema,wrapAsync(async(req,res,next) => {
       let listing=req.body.listing;
       const New=new Listing(listing);
       New.owner=req.user._id;
       await New.save();
       req.flash("success","new Pg added");
       res.redirect("/lists");
   
}))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id);
   res.render("./listing/edit.ejs",{data});
}))

//Update Route
router.patch("/:id",isLoggedIn,isOwner,validateSchema,wrapAsync(async(req,res) => {
    let {id}=req.params;
    let listing=req.body.listing;
    await Listing.findByIdAndUpdate(id,
       listing
    )
    req.flash("success","Lists updated");
    res.redirect(`/lists/${id}`)
}))


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res) => {
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","lists deleted");
   res.redirect("/lists");

}))



module.exports=router;