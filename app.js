require('dotenv').config();

const express = require("express")

const app = express()
const path = require("path")
const mongoose = require('mongoose');
let methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");


const dbUrl = process.env.ALTASDB_URL
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
// middleware 
// used to parse incoming URL-encoded form data from POST requests.
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
// set ejs as a view engin
app.set("view engine", "ejs");
// define views folder location  
app.set("views", path.join(__dirname, "views"))
// set ejs mate as a ejs engine
app.engine('ejs', ejsMate);
// for static file 
app.use(express.static(path.join(__dirname, '/public')));

// Setup mongostore to store session in mongodb
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto :{
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60, // time in seconds  
})
store.on("error", function (e) {
  console.log("session store error", e)
})
// Setup session middleware
app.use(session({
  store: store,          // store session in mongodb
  secret:  process.env.SESSION_SECRET, // important for signing the session ID cookie
  resave: false,             // don't save session if unmodified
  saveUninitialized: true,   // save new sessions
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 day
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    httpOnly: true,
  }
}));

// route 
app.get("/", (req, res) => {
  res.send("Root Is Work")
})
app.use(flash());
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // use session for passport  
passport.use(new LocalStrategy(User.authenticate())); // use local strategy for passport
passport.serializeUser(User.serializeUser()); // serialize user for passport
passport.deserializeUser(User.deserializeUser()); // deserialize user for passport

app.use((req, res, next) => {
  res.locals.success = req.flash('success'); // for flash message
  res.locals.error = req.flash('error'); // for flash message
  res.locals.currUser = req.user;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND"))
})
app.use((err, req, res, next) => {

  let { statusCode = 500, message = "Something went Wrong" } = err
  res.status(statusCode).render("error.ejs", { message });
})
// port 
app.listen(8080, () => {
  console.log("app is listing")
})