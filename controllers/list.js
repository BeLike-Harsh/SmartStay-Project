const Listing=require('../models/listingmodel.js');
const Review=require('../models/review.js');
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

module.exports.index=async(req,res) =>{
 const allList=await Listing.find({});
 res.render("./listing/index.ejs",{allList});
}


module.exports.listsNew=(req,res) => {
    res.render("./listing/create.ejs");
 }

module.exports.listShow=async(req,res) => {
    let {id}=req.params;
    const data=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!data){
       req.flash("error","the page you requested does not exist");
       res.redirect("/lists");
    }
    res.render("./listing/data.ejs",{data})
 }
 

 module.exports.listsPostNew=async(req,res,next) => {
   let url=req.file.path;
   let filename=req.file.filename;
    let listing=req.body.listing;
    const New=new Listing(listing);
    New.owner=req.user._id;
    New.image={url,filename};
    await New.save();
    req.flash("success","new Pg added");
    res.redirect("/lists");

}


module.exports.listsEdit=async(req,res) => {
   let {id}=req.params;
   const data=await Listing.findById(id);
   if(!data){
      req.flash("error","the page you requested does not exist");
      res.redirect("/lists");
   }
   let originalImageUrl=data.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
   res.render("./listing/edit.ejs",{data,originalImageUrl});
}


module.exports.listsPatch=async(req,res) => {
    let {id}=req.params;
    let listing=req.body.listing;
    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
    }
    await Listing.findByIdAndUpdate(id,
       listing
    )
    req.flash("success","Lists updated");
    res.redirect(`/lists/${id}`)
}


module.exports.listsDelete=async(req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","lists deleted");
    res.redirect("/lists");
 
 }