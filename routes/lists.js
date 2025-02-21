const express=require('express');
const router=express.Router();
const Listing=require('../models/listingmodel');
const Review=require('../models/review.js');
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");
const listingController=require('../controllers/list.js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


//Index Route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateSchema,wrapAsync(listingController.listsPostNew));
// .post(upload.single('listing[image]'),(req,res) => {
//     res.send()
// })


router.get("/new",isLoggedIn,listingController.listsNew);
//Show route

router
.route("/:id")
.get(wrapAsync(listingController.listShow))
.patch(isLoggedIn,isOwner,validateSchema,wrapAsync(listingController.listsPatch))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.listsDelete));



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.listsEdit))



module.exports=router;