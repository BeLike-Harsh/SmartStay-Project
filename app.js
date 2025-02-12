const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listingmodel');
const path=require('path');
const methodOveride=require('method-override');
const ejsMate=require('ejs-mate');
const MongoUrl="mongodb://127.0.0.1:27017/smartstay";



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
//Index Route
app.get("/lists",async(req,res) =>{
  const allList=await Listing.find({});

  res.render("./listing/index.ejs",{allList});
})

app.get("/lists/new",(req,res) => {
    res.render("./listing/create.ejs");
})
//Show route
app.get("/lists/:id",async(req,res) => {
    let {id}=req.params;
    const data=await Listing.findById(id);
    res.render("./listing/data.ejs",{data})
})


//New Route
app.post("/lists",async(req,res) => {
    let listing=req.body.listing;
    const New=new Listing(listing)
   await New.save();
        res.redirect("/lists");
})

app.get("/lists/:id/edit",async(req,res) => {
    let {id}=req.params;
    const data=await Listing.findById(id);
    res.render("./listing/edit.ejs",{data});
})


app.patch("/lists/:id",async(req,res) => {
     let {id}=req.params;
     let listing=req.body.listing;
     await Listing.findByIdAndUpdate(id,
        listing
     )
     res.redirect(`/lists/${id}`)
})

app.delete("/lists/:id",async(req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/lists");

})

app.listen(8080,() => {
    console.log("Server started at 8080");
})
