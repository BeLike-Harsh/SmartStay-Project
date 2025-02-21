const User=require("../models/user.js");
const passport=require('passport');

module.exports.signupPage=(req,res) => {
    res.render("./user/signup.ejs");
}


module.exports.signupPost=async(req,res) => {
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
   
}

module.exports.loginPage=(req,res) => {
    res.render("./user/login.ejs")
}

module.exports.loginPost=  async(req,res) => {
    req.flash("success","welcome User");
    let redirectUrl=res.locals.RedirectUrl || "/lists";
    res.redirect(redirectUrl);
 }


 module.exports.logoutPost=(req,res,next) => {
    req.logout((err) => {
        if(err){

          next(err);
        
        }
    req.flash("success","you logged out");
    res.redirect("/lists")
    })
}