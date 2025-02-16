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
