const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
});
userSchema.plugin(passportLocalMongoose); //to add username . hash salt etc 
// This line makes your schema Passport-ready with minimal effort — especially helpful for username/password authentication using Passport.js.
module.exports = mongoose.model('User', userSchema);
