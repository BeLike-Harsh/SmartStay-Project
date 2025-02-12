const mongoose=require("mongoose");
const DataB=require('./data');
const Listing=require("../models/listingmodel");
const MongoUrl="mongodb://127.0.0.1:27017/smartstay";

main().then(() => {
 console.log("connected to DB");
}).catch((err) => {console.log(err)})


async function main() {
    await mongoose.connect(MongoUrl);
}


let initDb=async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(DataB.data);
}

initDb();