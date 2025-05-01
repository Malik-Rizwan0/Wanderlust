const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        require : true
    },
    description : String,
    image :{
        type : String,
        // default show when no value came from the user
        default : "https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // if the provided value is null then set any img as default 
        set : (v) => v === "" ? "https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    price : Number ,
    location : String,
    country : String,
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]

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
