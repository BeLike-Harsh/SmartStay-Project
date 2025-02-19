const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport=require('passport');
const {saveRedirectUrl}=require('../middleware.js')



router.get("/signup",(req,res) => {
    res.render("./user/signup.ejs");
})


router.post("/signup",wrapAsync(async(req,res) => {
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        let usernew=await User.register(newUser,password);
        req.login(usernew,(err) => {
            if(err){
    
             return next(err);
            
            }
            req.flash("success","you registered successfully");
            res.redirect("/lists");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
}))

//Login Page

router.get("/login",(req,res) => {
    res.render("./user/login.ejs")
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
     async(req,res) => {
        req.flash("success","welcome User");
        let redirectUrl=res.locals.RedirectUrl || "/lists";
        res.redirect(redirectUrl);
     }
)

//logout

router.get("/logout",(req,res,next) => {
    req.logout((err) => {
        if(err){

          next(err);
        
        }
    req.flash("success","you logged out");
    res.redirect("/lists")
    })
})
    

module.exports=router;