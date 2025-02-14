const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listingmodel');
const Review=require('./models/review')
const path=require('path');
const methodOveride=require('method-override');
const ejsMate=require('ejs-mate');
const MongoUrl="mongodb://127.0.0.1:27017/smartstay";
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingitem}=require("./schema.js");



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


//Validation for schema

const validateSchema=(req,res,next) => {
    let {error}=listingitem.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}



app.get("/",(req,res) => {
     res.send("this is start")
})
//Index Route
app.get("/lists",wrapAsync(async(req,res) =>{
  const allList=await Listing.find({});

  res.render("./listing/index.ejs",{allList});
}))

app.get("/lists/new",(req,res) => {
    res.render("./listing/create.ejs");
})
//Show route
app.get("/lists/:id",wrapAsync(async(req,res) => {
    let {id}=req.params;
    const data=await Listing.findById(id);
    res.render("./listing/data.ejs",{data})
}))


//New Route
app.post("/lists",validateSchema,wrapAsync(async(req,res,next) => {
        let listing=req.body.listing;
        const New=new Listing(listing)
        await New.save();
        res.redirect("/lists");
    
}))

app.get("/lists/:id/edit",wrapAsync(async(req,res) => {
    let {id}=req.params;
    const data=await Listing.findById(id);
    res.render("./listing/edit.ejs",{data});
}))

//Update Route
app.patch("/lists/:id",validateSchema,wrapAsync(async(req,res) => {
     let {id}=req.params;
     let listing=req.body.listing;
     await Listing.findByIdAndUpdate(id,
        listing
     )
     res.redirect(`/lists/${id}`)
}))


//Delete Route
app.delete("/lists/:id",wrapAsync(async(req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/lists");

}))

//Reviews Route

app.post("/lists/:id",async(req,res) => {
    let {id}=req.params;
    let listing=await Listing.findById(id)
    let reviews=req.body.reviews;
    const newreview=new Review({
        reviews
    })
    listing.review.push(newreview);
    await review.save()
    await listing.save();
    res.redirect(`/lists/${id}`);
})



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
