var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var passport=require("passport");
var authUser= new passport.Passport();
var authEmployer= new passport.Passport();
var authTrainer= new passport.Passport();
var session = require('express-session');


//mongodb connection
mongoose.connect("mongodb://localhost/sih");
// require('./config/passport')(passport);

// schema

var models = require("./models/userSchema");
var models2 = require("./models/employerSchema");
var models3 = require("./models/trainerSchema");
var routes = require('./routes/router');
var employers=require('./routes/employers');
var trainers=require('./routes/trainers');
var users=require('./routes/users');
var LocalStrategy=require("passport-local").Strategy;
var passportLocalMongoose=require("passport-local-mongoose");
var mongo = require('mongodb');
var path=require('path');

//express app
var app= express();

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view enjine
app.set('view engine','ejs');

//static files
app.use(express.static(path.join(__dirname,'public')));


//sessions
// app.use(passport.initialize());
// app.use(passport.session());
app.use(authUser.initialize());
app.use(authUser.session());
app.use(authEmployer.initialize());
app.use(authEmployer.session());
app.use(authTrainer.initialize());
app.use(authTrainer.session());


app.use(function(req, res, next) {
    req.resources = req.resources || {};
   // res.locals.app = config.app;
    res.locals.currentUser = req.user;
    res.locals._t = function (value) { return value; };
    res.locals._s = function (obj) { return JSON.stringify(obj); };
    next();
})



app.get('/', function(req, res){
	res.render("t_home");
})

app.get('/information', function(req, res){
	res.render("t_info");
})

app.get('/information/test', function(req, res){
	res.render("t_info_test");
})

app.get('/information/schedule', function(req, res){
	res.render("t_info_schedule");
})

app.get('/information/interview', function(req, res){
	res.render("t_info_interview");
})

//routes

app.use('/', routes);
app.use('/users',users);
app.use('/employers', employers);
app.use('/trainers', trainers);



//hosting
app.listen(2008,function(){
    console.log("2000");
})

//https://ibb.co/qBgM32G
//https://ibb.co/c2Zgqjf
// https://ibb.co/yfknydL
// https://ibb.co/SmphWPQ
// https://ibb.co/Jnb7GbQ
// https://ibb.co/LrYgL7b
// https://ibb.co/b7v571K