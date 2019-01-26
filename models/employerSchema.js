var mongoose = require('mongoose');
var models = require('./userSchema');
var passportLocalMongoose = require("passport-local-mongoose");

var jobSchema = mongoose.Schema({

      jobtitle: String,
      // jobcompany: String,
      jobtype: String,
      jobcategory: String,
      jobsector: String,
      location: String,
      startdate: Date,
      enddate: Date,
      deadlinedate : Date,
      positions: Number,
      about : String,
      skillsrequired: String,
      responsibilities: String,
      minsalary: Number,
      maxsalary: Number,
      // applicants: [String]
      applicants_details: [{
        ref: "models.User",
        type: mongoose.Schema.Types.ObjectId
      }]


});

var Job = mongoose.model("Job",jobSchema);

var employerSchema = mongoose.Schema({   
    
    username:{type: String, unique: true},   
     password : { type: String}, 
     confirmpassword : { type: String}, 
     companyname : String,
     companytype : String,
     companydescription : String,
     companyaddressline1: String,
     companyaddressline2: String,
     state: String,
     city: String,
     postalcode: Number,
     companycontactnumber: Number,
     contactperson1: String,
     contactperson2: String,
     certificatenumber: Number,
     audityear: Number,
     pannumber: String,
     approvingemail: String,
     jobs:[{
        ref: "Job",
        type: mongoose.Schema.Types.ObjectId
       }] 

});

employerSchema.plugin(passportLocalMongoose);
var Employer = mongoose.model('Employer',employerSchema);

module.exports = {
  Employer:Employer,
  Job:Job
}