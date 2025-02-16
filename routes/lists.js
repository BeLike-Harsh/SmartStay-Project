const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const {listingitem}=require("../schema.js");
const ExpressError=require("../utils/ExpressError");



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

router.get("/new",(req,res) => {
   res.render("./listing/create.ejs");
})
//Show route
router.get("/:id",wrapAsync(async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id).populate("review");
   let reviews=data.review;
   res.render("./listing/data.ejs",{data,reviews})
}))


//New Route
router.post("/",validateSchema,wrapAsync(async(req,res,next) => {
       let listing=req.body.listing;
       const New=new Listing(listing)
       await New.save();
       res.redirect("/lists");
   
}))

router.get("/:id/edit",wrapAsync(async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id);
   res.render("./listing/edit.ejs",{data});
}))

//Update Route
router.patch("/:id",validateSchema,wrapAsync(async(req,res) => {
    let {id}=req.params;
    let listing=req.body.listing;
    await Listing.findByIdAndUpdate(id,
       listing
    )
    res.redirect(`/lists/${id}`)
}))


//Delete Route
router.delete("/:id",wrapAsync(async(req,res) => {
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/lists");

}))



module.exports=router;