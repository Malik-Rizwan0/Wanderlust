const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAcync.js");
const passport = require("passport");
const { saveOrignalUrl } = require("../middleware.js"); // import middleware
const userController = require("../controllers/user.js"); // import user controller

router.route("/signup")
.get(userController.renderSignupForm) // render signup page
.post(warpAsync(userController.signUp)); // handle signup form submission
router.route("/login")
.get(userController.renderLoginForm) // render login page
.post(
  saveOrignalUrl,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  userController.Login // handle login form submission
);


router.get("/logout", userController.logOut); // handle logout


module.exports = router;