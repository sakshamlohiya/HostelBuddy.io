 const mongoose = require('mongoose');
 var bcrypt = require('bcrypt-nodejs')

const UserSchema1 = new mongoose.Schema({
    CollegeEmail:{
        type: String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    ContactNumber:{
        type:Number,
        required:true
    },
    RollNo:{
        type:String,
        required:true
    },
    Degree:{
        type:String,
        required:true
    },
    Year:{
        type:String,
        required:true
    },
    ResidenceFloor:{
        type:String,
        required:true
    },
    Description:{
        type:String
    }
})

UserSchema1.methods.encryptPassowrd = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}

UserSchema1.methods.validPassword = function(password) {
    if(this.Password != null) {
        return bcrypt.compareSync(password, this.Password);
    } else {
        return false;
    }
};

const Userinfo = mongoose.model('Userinfo',UserSchema1)
module.exports = Userinfo