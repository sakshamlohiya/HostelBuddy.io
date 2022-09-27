const mongoose = require('mongoose');

const Aschema = new mongoose.Schema({
    Subject:{
        type:String,
        required:true
    },
    Participants:{
        type:String,
        required:true
    },
    Des:{
        type:String,
        required:true
    },
    Aimg:{
        data:Buffer,
        contentType:String
    }
})

const achievement = mongoose.model('achievement',Aschema);
module.exports = achievement