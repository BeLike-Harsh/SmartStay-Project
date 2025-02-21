const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport=require('passport');
const {saveRedirectUrl}=require('../middleware.js');
const userController=require('../controllers/user.js');



router.get("/signup",userController.signupPage)


router.post("/signup",wrapAsync(userController.signupPost))

//Login Page

router.get("/login",userController.loginPage);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.loginPost
)

//logout

router.get("/logout",userController.logoutPost);
    

module.exports=router;