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
router.use(authTrainer.initialize());
router.use(authTrainer.session());
 authTrainer.use(new LocalStrategy(models3.Trainer.authenticate()));

authTrainer.serializeUser(function(trainer, done) {
    done(null, trainer.id);
  });

   authTrainer.deserializeUser(function(id, done) {
    models3.Trainer.findById(id, function(err, trainer) {
      done(err, trainer);
    });
  });

router.use(require("express-session")({
    secret: "pig",
    resave:false,
    saveUninitialized:false
    }));

router.get("/logout",function(req,res)
{
    req.session.reload(function(err){
        console.log("success");
    })
})


  //passport function for authentication checking

  function isloggedin(req,res,next){
    if(req.isAuthenticated()){
      return  next();
    }
    res.redirect("/login");
}





  //registeration page 

router.get("/register",function(req,res){
    res.render("registertrainer");
});



//post method
  router.post("/register", function(req,res){
      
    // req.body.username
    // req.body.password

    models3.Trainer.register(new models3.Trainer({
     username: req.body.username, 
     contactperson1: req.body.contactperson1,
     contactperson2: req.body.contactperson2,
     certificatenumber: req.body.certificatenumber,
     pannumber: req.body.pannumber,
     approvingemail: req.body.approvingemail
    }), req.body.password, function(err, trainer){

        if (err) {
      console.log('error while trainer register!', err);
     // return next(err);
    }

//console message
    console.log('trainer registered!');

    //redirecting with object id
    models3.Trainer.findOne({username: req.body.username}, function(err, trainer){
      var redirectUrl='/trainers/'+trainer._id;
      res.redirect(redirectUrl);
          })
          

  });
});


// login
//get method
router.get("/login",function(req,res)
{
    res.render("logintrainer");
})


router.post("/login", authTrainer.authenticate("local",{
 // successRedirect: "/secret",
  failureRedirect: "/trainers/login"
}) ,function(req,res){

  //redirecting to user
  models3.Trainer.findOne({username: req.body.username}, function(err, trainer){
    console.log(req.body.username);
    var redirectUrl='/trainers/'+trainer._id+"/trainings/new";
    res.redirect(redirectUrl);
       })

});



//jobs listing for a particular employer

router.get("/:id/trainings",function(req,res){
// res.render("jobs",{
//     jo:req.parms.id
// })
models3.Trainer.findOne({_id:req.params.id},function(err,trainer)
{
   
    models3.Training.find({  '_id': { $in: trainer.trainings} }, function(err, trainings){
            
             res.render("postedtraining",{
                
                alltrainings:trainings
             })

        });

})
})


router.post("/:id/trainings",function(req,res){
// res.render("jobs",{
//     jo:req.parms.id
// })
models3.Trainer.findOne({_id:req.params.id},function(err,trainer)
{
   
    models3.Training.find({  '_id': { $in: trainer.trainings},'city':req.body.city , 'institution':req.body.institutiontype }, function(err, trainings){
            
             res.render("postedtraining",{
                
                alltrainings:trainings
             })

        });

})
})





// adding a new job 

router.get("/:id/trainings/new",function(req,res){
res.render("newtraining", {tr:req.params.id});
})

router.post("/:id/trainings/new",function(req,res){
      models3.Training.create({


      trainingtitle: req.body.trainingtitle,
      trainingtype: req.body.trainingtype,
      trainingcategory: req.body.trainingcategory,
      traininglocation: req.body.location,
      institution: req.body.institution,
      city: req.body.city,
      trainingstartdate: req.body.startdate,
      trainingenddate: req.body.enddate,
      trainingdeadlinedate : req.body.deadlinedate,
      trainingpositions: req.body.positions,
      trainingabout : req.body.about,
      trainingskillsrequired: req.body.skillsrequired,
      trainingresponsibilities: req.body.responsibilities,

      // minsalary: req.body.minsalary,
      // maxsalary: req.body.maxsalary
           
            
        }, function(err, training){
                models3.Trainer.findOne({_id: req.params.id}, function(err, foundTrainer){
                    if(err){
                        console.log(err);
                    } else {
                        foundTrainer.trainings.push(training);
                        foundTrainer.save(function(err, data){
                            if(err){
                                console.log(err);
                            } else {
                                console.log(data);
                            }
                        })
                    }
                })

       
        
         })
      var redirectUrl='/trainers/'+req.params.id+"/trainings";
    res.redirect(redirectUrl);

})


//exports
module.exports = router;

