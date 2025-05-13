const mongoose = require('mongoose');
const Review = require('./review');
const { required } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        require : true
    },
    description : String,
    image: {
        url: {
          type: String,
          default: "https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          set: (v) => v === "" ? "https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        },
        filename: {
          type: String,
          default: "default.jpg"
        }
      },
    price : Number ,
    location : String,
    country : String,
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    category : {
        type : String,
        enum : ["Trending" , "Room" ,  "Iconic City" ,  "Mountain" ,  "Castles" ,  "Island" ,  "Tropical" ,  "Camp"],
        required : true
    }
});

listingSchema.post("findOneAndDelete" , async function (listing){
    if (listing) {
        await Review.deleteMany({
            _id : {
                $in : listing.reviews
            }
        })
    }
})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing
