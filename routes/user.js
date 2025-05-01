const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAcync.js")
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs"); // render register page
})
router.post("/signup", warpAsync( async (req, res) => {
   try {
    let {username , email, password} = req.body; // get data from form  
    const newUser = new User({ 
      email: email,
      username: username,
    });
    const registerUser =  await User.register(newUser, password); // register user with password
    console.log(registerUser); // log user data
    req.flash("success", "Welcome to Wanderlust!"); // flash message
    res.redirect("/listings"); // redirect to home page
   } catch (error) {
        req.flash("error", error.message); // flash message
        res.redirect("/signup"); // redirect to register page
   }
}
));

module.exports = router;