const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");
const listingController=require('../controllers/list.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage });


//Index Route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateSchema,wrapAsync(listingController.listsPostNew));

router.get("/new",isLoggedIn,listingController.listsNew);
//Show route

router
.route("/:id")
.get(wrapAsync(listingController.listShow))
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateSchema,wrapAsync(listingController.listsPatch))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.listsDelete));



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.listsEdit))



module.exports=router;