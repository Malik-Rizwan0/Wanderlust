const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs"); // render register page
} 
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body; // get data from form  
    const newUser = new User({
      email: email,
      username: username,
    });
    const registerUser = await User.register(newUser, password); // register user with password
    console.log(registerUser); // log user data
    req.login(registerUser, (err) => { // login user after registration
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!"); // flash message
      res.redirect("/listings"); // redirect to home page
    });
  } catch (error) {
    req.flash("error", error.message); // flash message
    res.redirect("/signup"); // redirect to register page
  }
}
module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs"); // render register page
  }
module.exports.Login = (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // Flash message
    req.flash("success", "Welcome back on Wanderlust!");

    // If redirected from a review route, redirect back to the listing
    if (redirectUrl.startsWith("/listings/") && redirectUrl.includes("/reviews")) {
      // Extract the listing ID from the URL using regex
      let match = redirectUrl.match(/^\/listings\/([^\/]+)/);
      if (match) {
        let listingId = match[1];
        return res.redirect(`/listings/${listingId}`);
      }
    }

    // Otherwise, go to the original page
    res.redirect(redirectUrl);
  }
module.exports.logOut =  (req, res , next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged You Out!"); // flash message
      res.redirect("/listings"); // redirect to home page
    });
  }