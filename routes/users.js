var express = require('express');
var models = require('../models/userSchema');
var models2 =require('../models/employerSchema');
var router = express.Router();
// var employers= require('./employers')
var bodyParser = require('body-parser');
var passport=require("passport");
var authUser= new passport.Passport();
var authEmployer= new passport.Passport();
var LocalStrategy=require("passport-local").Strategy;
var passportLocalMongoose=require("passport-local-mongoose");
const multer = require('multer');
var path = require('path');
var session = require('express-session');

//body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


//middleware for multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending .jpg
  }
});

var upload = multer({ storage: storage });

router.use(require("express-session")({
    secret: "cat",
    resave:false,
    saveUninitialized:false
    }));

// passport middleware
router.use(authUser.initialize());
router.use(authUser.session());

authUser.use(new LocalStrategy(models.User.authenticate()));
authUser.serializeUser(function(user, done) {
    done(null, user.id);
  });

  
  authUser.deserializeUser(function(id, done) {
    models.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//registeration form
router.get("/register",function(req,res){
    res.render("u_register");
});

//post method
  router.post("/register", upload.array('file-to-upload',2),function(req,res){
      
    // req.body.username
    // req.body.password

    models.User.register(new models.User({
        mobileNum : req.body.mobileno,   
        username:req.body.username,
     confpassword : req.body.confirmpasssword, 
     firstName: req.body.firstname,
     middName:req.body.middlename,
     lastname:req.body.lastname,
       fathName:req.body.fathersname,
       curentLoc:req.body.curentlocation,
       add1:req.body.addressline1,
       add2:req.body.addressline2,
       additional:req.body.locality,
       country:req.body.country,
       state:req.body.state,
       dist:req.body.district,
       city:req.body.city,
       postCode:req.body.postalcode,
       landNumber:req.body.landlinenumber,
       dob:req.body.dob,
       gender: req.body.gender,
       adharNum:req.body.aadharcardnumber,
       nationality:req.body.nationality,
       category:req.body.category,
       community:req.body.community,
       typeOfDisability:req.body.typeofdisability,
       disabilitySubtype:req.body.disabilitysubtype,
       disabilityPerc:req.body.disabilitypercentage,
       disabilityCertNum:req.body.disabilitycertificatenumber,
       //uploadedDisCerti:req.files[0].filename,
       certiIssuedBy:req.body.certiissuedby,
       //candiPhoto:req.files[1].filename,
       nhfdcbenificiary:req.body.nhfdcbenificiary,
    
    }), req.body.password, function(err, user){

        if (err) {
      console.log('error while user register!', err);
     // return next(err);
    }

//console message
    console.log('user registered!');

    //redirecting with object id
    models.User.findOne({username: req.body.username}, function(err, user){
      var redirectUrl='/users/'+user._id;
      res.redirect(redirectUrl);
          })
          

  });
});

// login
//get method
router.get("/login",function(req,res)
{
    res.render("u_login");
})

router.post("/login",authUser.authenticate("local",{
 // successRedirect: "/secret",
  failureRedirect: "/users/login"
}) ,function(req,res){
  //redirecting to user
  models.User.findOne({username: req.body.username}, function(err, user){
    console.log(req.body.username);
    var redirectUrl='/users/'+user._id;
    res.redirect(redirectUrl);
       })
});

router.get("/:id", function(req, res){
  models.User.findOne({'_id':req.params.id},function(err,user){
    res.render("t_uhome", {firstname: user.firstName,
      lastname: user.lastname,
      gender: user.gender,
      mobile: user.mobileNum,
      images: user.candiPhoto,
      username: user.username,
      userid:req.params.id

    });
  })
})

// userprofile
 router.get("/:id/profile",function(req,res)
 {
   models.User.findOne({'_id':req.params.id},function(err,user){
    res.render("u_profile", {
      firstname: user.firstName,
      lastname: user.lastname,
      gender: user.gender,
      mobile: user.mobileNum,
      images: user.candiPhoto,
      username: user.username

    });
  })
 })

//education
router.get("/:id/education",function(req,res){
   res.render("education",{
        ed:req.params.id
   });
    })

router.post("/:id/education",function(req,res){
    models.Education.create({
        skills:req.body.skills,
        tenthpass:req.body.tenthpass,
        twelthpass:req.body.twelthpass,
        ugpass:req.body.ugpass,
        pgpass:req.body.pgpass,
        tenthpassyear:req.body.tenthpassyear,
        twelthpassyear:req.body.twelthpassyear,
        ugpassyear:req.body.ugpassyear,
        pgpassyear:req.body.pgpassyear,
        ugcollege:req.body.ugcollege,
        pgcollege:req.body.pgcollege,
    }, function(err, edu){
            models.User.findOne({_id: req.params.id}, function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    foundUser.education=edu;
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            //console.log(data);
                        }
                    })
                }
            })
     })
    })

// //filter jobs

// router.get("/:id/jobfilter",function(req,res)
// {
//   res.render("u_jobfilter",{
//     id:req.params.id
//   });
// })

// //filter training

// router.get("/:id/trainingfilter",function(req,res)
// {
//   res.render("u_trainingfilter");
// })


//all posted jobs
router.get("/:id/jobs", function(req, res){ 
       var data = []; 
       models.User.findOne({_id: req.params.id},function(err,users){    
        models2.Job.find({'_id': {$in: users.applied_jobs} }, function(err, docs){
            data=docs;
            var checkid = [];
            for(var i=0; i<docs.length; i++)
              checkid.push(JSON.stringify(docs[i]._id));
            console.log(checkid);
            // console.log(typeof (checkid[0]));
            {
              var alljobs = [];
              models2.Job.find({}, function(err, jobs){
                // console.log(typeof( jobs[0]._id));
                for(var i=0; i<jobs.length; i++)
                {
                  if(!checkid.includes(JSON.stringify(jobs[i]._id)))
                    alljobs.push(jobs[i]);
                    // console.log(jobs[i]._id)
                }
                // var n = checkid.indexOf(JSON.stringify(jobs[0]._id));
                // console.log(n);
                res.render("t_jobs",{
                 alljobs:alljobs, userid:req.params.id

              })
            })
             }
        });
        console.log(data);
      })   
    });

router.post("/:id/jobs",function(req,res){
     models2.Job.findOne({_id: req.body.jobid},function(err,job){    
         models.User.findOne({_id: req.body.userid}, function(err, user){
            if(err){
                console.log(err);
            }
           else{ job.applicants_details.push(user);
            job.save();
        }
        })
     })
         models.User.findOne({_id: req.body.userid},function(err,user){    
         models2.Job.findOne({_id: req.body.jobid}, function(err,job){
            if(err){
                console.log(err);
            }
           else{ user.applied_jobs.push(job);
            user.save();
            var redirectUrl='/users/'+user._id+'/jobs/applied';
            console.log(redirectUrl);
            res.redirect(redirectUrl);
        }
        })
     })
})

//applied jobs
router.get("/:id/jobs/applied", function(req, res){ 
       var data = []; 
       models.User.findOne({_id: req.params.id},function(err,users)
       {    
        models2.Job.find({'_id': {$in: users.applied_jobs} }, function(err, docs){
            data=docs;
             res.render("t_jobs",{
                 alljobs:docs, userid:req.params.id // for appliedjobs
             })
        });
        console.log(data);
      })   
    });


//full time jobs
router.get("/:id/jobs/fulltime", function(req, res){ 
       var data = []; 
       models.User.findOne({_id: req.params.id},function(err,users){    
        models2.Job.find({'_id': {$in: users.applied_jobs} }, function(err, docs){
            data=docs;
            var checkid = [];
            for(var i=0; i<docs.length; i++)
              checkid.push(JSON.stringify(docs[i]._id));
            console.log(checkid);
            {
              var alljobs = [];
              models2.Job.find({jobtype:"Full Time"}, function(err, jobs){
                for(var i=0; i<jobs.length; i++)
                {
                  if(!checkid.includes(JSON.stringify(jobs[i]._id)))
                    alljobs.push(jobs[i]);   
                }
                res.render("t_jobs",{
                 alljobs:alljobs, userid:req.params.id
              })
            })
             }
        });
        console.log(data);
      })   
    });

//seasonal jobs
router.get("/:id/jobs/seasonal", function(req, res){ 
       var data = []; 
       models.User.findOne({_id: req.params.id},function(err,users){    
        models2.Job.find({'_id': {$in: users.applied_jobs} }, function(err, docs){
            data=docs;
            var checkid = [];
            for(var i=0; i<docs.length; i++)
              checkid.push(JSON.stringify(docs[i]._id));
            console.log(checkid);
            {
              var alljobs = [];
              models2.Job.find({jobtype:"Seasonal"}, function(err, jobs){
                for(var i=0; i<jobs.length; i++)
                {
                  if(!checkid.includes(JSON.stringify(jobs[i]._id)))
                    alljobs.push(jobs[i]);   
                }
                res.render("t_jobs",{
                 alljobs:alljobs, userid:req.params.id
              })
            })
             }
        });
        console.log(data);
      })   
    });

//applied trainings
router.get("/:id/appliedtrainings", function(req, res){

        
    
       var data = []; 
       models.User.findOne({_id: req.params.id},function(err,users)
    {    
       


        models2.Job.find({  '_id': { $in: users.applied_jobs} }, function(err, docs){
            data=docs;
             res.render("u_appliedtrainings",{
                 results:docs // for appliedjobs
                // alljobs:docs // appliedjobs2
             })

        });
console.log(data);
    })
    
    });

//user profile
router.get("/:id/usermyprofile",function(req,res){
   res.render("usermyprofile");
    })

//work (professional details) 
router.get("/:id/work",function(req,res){
   res.render("work",{ 
        wo:req.params.id
   });
    })

    router.post("/:id/work",function(req,res){

        models.Work.create({
            company:req.body.company,
            job:req.body.job,
            joiningdate:req.body.joiningdate,
            leavingdate:req.body.leavingdate,
            description:req.body.description
           
            
        }, function(err, work){
                models.User.findOne({_id: req.params.id}, function(err, foundUser){
                    if(err){
                        console.log(err);
                    } else {
                        foundUser.works.push(work);
                        foundUser.save(function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                //console.log(data);
                            }
                        })
                    }
                })

       
        
         })
        })


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}