const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");
const listingController=require('../controllers/list.js');

//Index Route
router.get("/",wrapAsync(listingController.index));

router.get("/new",isLoggedIn,listingController.listsNew);
//Show route
router.get("/:id",wrapAsync(listingController.listShow));


//New Route
router.post("/",isLoggedIn,validateSchema,wrapAsync(listingController.listsPostNew))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.listsEdit))

//Update Route
router.patch("/:id",isLoggedIn,isOwner,validateSchema,wrapAsync(listingController.listsPatch));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.listsDelete));



module.exports=router;