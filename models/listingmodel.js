const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const listingitem=new Schema({
    title:{
        type: String,
       required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://content.skyscnr.com/available/1181150204/1181150204_WxH.jpg",
        set:v => v===""?"https://content.skyscnr.com/available/1181150204/1181150204_WxH.jpg":v, 
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
    }]

})


const Listing=mongoose.model("Listing",listingitem);

module.exports=Listing;