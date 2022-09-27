const { time } = require('console');
const mongoose = require('mongoose');

const UserSchema1 = new mongoose.Schema({
    Eventname:{
        type: String,
        required:true
    },
    Eventdate:{
        type:Date,
        required:true
    },
    Eventtime:{
        type:String,
        required:true
    },
    Eventdes:{
        type:String,
    }
})

const Eventsinfo = mongoose.model('Eventsinfo',UserSchema1)
module.exports = Eventsinfo