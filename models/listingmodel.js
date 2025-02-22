const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require('./review.js')


const listingitem=new Schema({
    title:{
        type: String,
       required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String 
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

})


listingitem.post("findOneAndDelete",async(listing) => {
    if(listing){
    await Review.deleteMany({_id:{$in : listing.review}});
    }
})

const Listing=mongoose.model("Listing",listingitem);

module.exports=Listing;