var express = require('express');
var router = express.Router();
var passport=require("passport");
var authUser= new passport.Passport();
var authEmployer= new passport.Passport();
var authTrainer= new passport.Passport();
var LocalStrategy=require("passport-local").Strategy;
var passportLocalMongoose=require("passport-local-mongoose");
var models = require('../models/userSchema');
var models2 = require('../models/employerSchema');
var models3= require('../models/trainerSchema');
var bodyParser = require('body-parser');
var session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//emp passport middleware
router.use(authEmployer.initialize());
router.use(authEmployer.session());
 authEmployer.use(new LocalStrategy(models2.Employer.authenticate()));

authEmployer.serializeUser(function(employer, done) {
    done(null, employer.id);
  });

   authEmployer.deserializeUser(function(id, done) {
    models2.Employer.findById(id, function(err, employer) {
      done(err, employer);
    });
  });

router.use(require("express-session")({
    secret: "dog",
    resave:false,
    saveUninitialized:false
    }));

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//registeration page 
router.get("/register",function(req,res){
    res.render("registeremp");
});



//post method
router.post("/register", function(req,res){
    
  // req.body.username
  // req.body.password

  models2.Employer.register(new models2.Employer({
   username: req.body.username, 
   companyname : req.body.companyname,
   companytype : req.body.companytype,
   companydescription : req.body.companydescription,
   companyaddressline1: req.body.companyaddressline1,
   companyaddressline2: req.body.companyaddressline2,
   state: req.body.state,
   city: req.body.city,
   postalcode: req.body.postalcode,
   companycontactnumber: req.body.companycontactnumber,
   contactperson1: req.body.contactperson1,
   contactperson2: req.body.contactperson2,
   certificatenumber: req.body.certificatenumber,
   audityear: req.body.audityear,
   pannumber: req.body.pannumber,
   approvingemail: req.body.approvingemail
  
  }), req.body.password, function(err, user){

      if (err) {
    console.log('error while employer register!', err);
   // return next(err);
  }

//console message
  console.log('employer registered!');

  //redirecting with object id
  models2.Employer.findOne({username: req.body.username}, function(err, employer){
    var redirectUrl='/employers/'+employer._id;
    res.redirect(redirectUrl);
        })
        

});
});


// login
//get method
router.get("/login",function(req,res)
{
    res.render("e_login");
})

router.post("/login",authEmployer.authenticate("local",{
 // successRedirect: "/secret",
  failureRedirect: "/employers/login"
}) ,function(req,res){

  //redirecting to user
  models2.Employer.findOne({username: req.body.username}, function(err, employer){
    console.log(req.body.username);
    var redirectUrl='/employers/'+employer._id+"/jobs";
    res.redirect(redirectUrl);
       })

});

//put method
// router.post("/login",passport.authenticate("local",{
//  successRedirect: "/secret",
//   failureRedirect: "/employers"
// }) ,function(req,res){
// // console.log(req.body.username);
// //   //redirecting to user
// //   models2.Employer.findOne({username: req.body.username}, function(err, employer){
// //     var redirectUrl='/employers/'+employer._id;
// //     res.redirect(redirectUrl);
// //         })

// });

router.get("/:id", function(req, res){
  models2.Employer.findOne({'_id':req.params.id},function(err,emp){
    res.render("t_ehome", {firstname: emp.contactperson1,
      username: emp.username,
      userid:req.params.id
    });
  })
})



//jobs listing for a particular employer
router.get("/:id/jobs",function(req,res){
// res.render("jobs",{
//     jo:req.parms.id
// })
models2.Employer.findOne({_id:req.params.id},function(err,employer)
{
    models2.Job.find({_id:employer.jobs},function(err,jobs){

        res.render("t_ejobs",{id:req.params.id,
            alljobs:jobs,
            userid:req.params.id
        })

    })
})
})

router.get("/:id/jobs/fulltime",function(req,res){
// res.render("jobs",{
//     jo:req.parms.id
// })
models2.Employer.findOne({_id:req.params.id},function(err,employer)
{
    models2.Job.find({_id:employer.jobs},function(err,alljobs){
      models2.Job.find({jobtype:"Full Time"},function(err,jobs){
        res.render("t_ejobs",{id:req.params.id,
            alljobs:jobs,
            userid:req.params.id
        })
      })      
    })
})
})

router.get("/:id/jobs/seasonal",function(req,res){
// res.render("jobs",{
//     jo:req.parms.id
// })
models2.Employer.findOne({_id:req.params.id},function(err,employer)
{
    models2.Job.find({_id:employer.jobs},function(err,alljobs){
      models2.Job.find({jobtype:"Seasonal"},function(err,jobs){
        res.render("t_ejobs",{id:req.params.id,
            alljobs:jobs,
            userid:req.params.id
        })
      })      
    })
})
})

// adding a new job 

router.get("/:id/jobs/new",function(req,res){
  res.render("newjob", {jo:req.params.id});
})

router.post("/:id/jobs/new",function(req,res){
      models2.Job.create({
            
      jobtitle: req.body.jobtitle,
      jobtype: req.body.jobtype,
      jobcategory: req.body.jobcategory,
      location: req.body.location,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      deadlinedate : req.body.deadlinedate,
      positions: req.body.positions,
      about : req.body.about,
      skillsrequired: req.body.skillsrequired,
      responsibilities: req.body.responsibilities,
      minsalary: req.body.minsalary,
      maxsalary: req.body.maxsalary
           
            
        }, function(err, job){
                models2.Employer.findOne({_id: req.params.id}, function(err, foundEmployer){
                    if(err){
                        console.log(err);
                    } else {
                        foundEmployer.jobs.push(job);
                        foundEmployer.save(function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                console.log(data);
                            }
                        })
                    }
                })

       
        
         })
})

router.get("/:id/jobs/:jid",function(req,res){
  var data = [];
  models2.Job.findOne({_id:req.params.jid}, function(err,job){
    models.User.find({'_id': {$in: job.applicants_details} }, function(err, docs){
      data = docs;
      res.render("t_eapplicants",{
                 allusers:data, userid:req.params.id, job:job
              })
    })
  })
})


//exports
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

