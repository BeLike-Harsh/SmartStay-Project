const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOveride=require('method-override');
const ejsMate=require('ejs-mate');
const MongoUrl="mongodb://127.0.0.1:27017/smartstay";
const ExpressError=require("./utils/ExpressError");
const listing=require("./routes/lists.js");
const reviews=require('./routes/reviews.js');
const session=require('express-session');
const flash=require('connect-flash');



main().then(() => {
 console.log("connected to DB");
}).catch((err) => {console.log(err)})


async function main() {
    await mongoose.connect(MongoUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOveride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOption={
    secret:"LeoLeo",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}




app.use(session(sessionOption));
app.use(flash());



app.use((req,res,next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.get("/",(req,res) => {
    res.send("this is start")
})



//Lists Route 
app.use("/lists",listing);

//Reviews Route

app.use("/lists/:id/reviews",reviews);

//Midlewares

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!!"))
})

app.use((err,req,res,next) => {
    let{status=500,message="Something Went Wrong!"}=err;
    res.status(status).render("error.ejs",{status,message});
})

app.listen(8080,() => {
    console.log("Server started at 8080");
})
