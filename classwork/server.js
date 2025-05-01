const express = require('express');

const session = require('express-session');
const app = express();

// Setup session middleware
app.use(session({
  secret: 'your_secret_key', // important for signing the session ID cookie
  resave: false,             // don't save session if unmodified
  saveUninitialized: true,   // save new sessions
  cookie: { secure: false }  // should be true in production with HTTPS
}));  

app.get('/', (req, res) => {
  req.session.username = 'Rizwan'; // Storing data in session
  res.send('Session created for Rizwan');
} );
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });