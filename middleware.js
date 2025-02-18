module.exports.isLoggedIn=(req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash("error","you have to log in first!!");
        return res.redirect("/login");
     }
     next();
}