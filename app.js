const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer'); 
const app = express();

// Passport Config
require('./config/passport')(passport);

//DBCOnfig
const db = require('./config/keys').MongoURI;
mongoose.Promise = global.Promise;
// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true })
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lcsapp.lk@gmail.com',
      pass: 'Test.123'
    }
  });
  
app.set('mailtrans',transporter);
//var app = connect.createServer().use(connect.static(__dirname + '/public'))
//var app = connect.createServer().use(connect.static(__dirname + '/public'));


 
 //app.use('/static', express.static(__dirname + '/public'));


 app.use(express.static((__dirname + '/public')));
 app.use(express.static('./public'));

//BodyPaser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'secret',
        resave: true,        
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');    
    res.locals.link =req.flash('link')
    res.locals.user = req.user;
    next();
  });
  


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/organization', require('./routes/organization'));
app.use('/qualification', require('./routes/qualification'));
app.use('/location',require('./routes/location'));
app.use('/roles',require('./routes/roles'));
app.use('/skills',require('./routes/skills'));
app.use('/teams',require('./routes/teams'));
app.use('/certifications',require('./routes/certifications'));
app.use('/assess',require('./routes/assess'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));
