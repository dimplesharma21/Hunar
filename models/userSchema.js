var mongoose = require('mongoose');
var models2 = require('./employerSchema');

var passportLocalMongoose = require("passport-local-mongoose");


var educationSchema = mongoose.Schema({   
    
       skills: String,
       tenthpass: Boolean,
       twelthpass: Boolean,
       ugpass: Boolean,
       pgpass: Boolean,
       tenthpassyear: Number,
       twelthpassyear: Number,
       ugpassyear: Number,
       pgpassyea: Number,
       ugcollege: String,
       pgcollege: String     

});
var Education = mongoose.model('Education',educationSchema);

var workSchema = mongoose.Schema({   
    
    company: String,
    job: String,
    joiningdate: Date,
    leavingdate: Date,
    description: String
});
var Work = mongoose.model('Work', workSchema);





var userSchema = mongoose.Schema({   
    //  email: {      
    //     type: String, required: true
    // },    
    // username:String,
    //  mobileNum : { type: Number, required: true},   
    //  password : { type: String, required: true}, 
    //  confpassword : { type: String, required: true}, 
    //  firstName: {type:String, required: true},
    //  middName:{type:String},
    //  lastname:{type:String, required: true},
    //    fathName:{type:String, required: true},
    //    curentLoc:{type:String, required: true},
    //    add1:{type:String, required: true},
    //    add2:{type:String},
    //    additional:{type:String},
    //    country:{type:String, required: true},
    //    state:{type:String, required: true},
    //    dist:{type:String, required: true},
    //    city:{type:String, required: true},
    //    postCode:{type:Number, required: true},
    //    landNumber:{type:Number},
    //    dob:{type:Date, required: true},
    //    gender:{type:String, required: true},
    //    adharNum:{type:Number},
    //    nationality:{type:String, required: true},
    //    marritalStatus:{type:Boolean},
    //    category:{type:String, required: true},
    //    community:{type:String, required: true},
    //    typeOfDisability:{type:String, required: true},
    //    disabilitySubtype:{type:String, required: true},
    //    disabilityPerc:{type:Number, required: true},
    //    disabilityCertNum:{type:Number, required: true},
    //    uploadedDisCerti:{type:String, },
    //    certiIssuedBy:{type:String, required: true},
    //    candiPhoto:{type:String, },
    //    nhfdcbenificiary:{type:Boolean},

    
    username:{type: String, unique: true},
     mobileNum : { type: Number},   
     password : { type: String}, 
     confpassword : { type: String}, 
     firstName: {type:String},
     middName:{type:String},
     lastname:{type:String},
       fathName:{type:String},
       curentLoc:{type:String},
       add1:{type:String},
       add2:{type:String},
       additional:{type:String},
       country:{type:String},
       state:{type:String},
       dist:{type:String},
       city:{type:String},
       postCode:{type:Number},
       landNumber:{type:Number},
       dob:{type:Date},
       gender:{type:String},
       adharNum:{type:Number},
       nationality:{type:String},
       marritalStatus:{type:Boolean},
       category:{type:String},
       community:{type:String},
       typeOfDisability:{type:String},
       disabilitySubtype:{type:String},
       disabilityPerc:{type:Number},
       disabilityCertNum:{type:Number},
       uploadedDisCerti:{type:String, },
       certiIssuedBy:{type:String},
       candiPhoto:{type:String },
       nhfdcbenificiary:{type:Boolean},

       education: {
        ref: "Education",
        type: mongoose.Schema.Types.ObjectId
        
       },
       works:[{
        ref: "Work",
        type: mongoose.Schema.Types.ObjectId
       }] ,
       // appliedjobs: [String]
       applied_jobs:[{
        ref:"models2.Job",
        type: mongoose.Schema.Types.ObjectId
       }]


       


     

});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User',userSchema);

module.exports = {
  User:User,
  Education:Education,
  Work:Work
}