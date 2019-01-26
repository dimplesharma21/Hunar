var mongoose = require('mongoose');
var models = require('./userSchema');
var models2 = require('./employerSchema');
var passportLocalMongoose = require("passport-local-mongoose");

var trainingSchema = mongoose.Schema({

      trainingtitle: String,
      proposingorganization : String,
      implementingagency : String,
      nooftrainersin10years : Number,
     noofcenters : Number,
     trainingcategory : String,
     schedule : String,
     projectcost: String,
     trainingdescription : String,
     trainingaddressline1: String,
     trainingaddressline2: String,
     state: String,
     city: String,
     postalcode: Number,
trainercontactnumber: Number,
      trainingtype: String,
      trainingcategory: String,
      institution: String,
      traininglocation: String,
      trainingstartdate: Date,
      trainingenddate: Date,
      trainingdeadlinedate : Date,
      trainingpositions: Number,
      trainingabout : String,
      trainingskillsrequired: String,
      trainingresponsibilities: String,
      trainingapplicants_details: [{
        ref: "models.User",
        type: mongoose.Schema.Types.ObjectId
      }]


});

var Training = mongoose.model("Training",trainingSchema);

var trainerSchema = mongoose.Schema({   
    
    username:{type: String, unique: true},   
     password : { type: String}, 
     confirmpassword : { type: String},
     contactperson1: String,
     contactperson2: String,
     certificatenumber: Number,
     
     pannumber: String,
     approvingemail: String,
     trainings:[{
        ref: "Training",
        type: mongoose.Schema.Types.ObjectId
       }] 

});

trainerSchema.plugin(passportLocalMongoose);
var Trainer = mongoose.model('Trainer',trainerSchema);

module.exports = {
  Trainer:Trainer,
  Training: Training
}