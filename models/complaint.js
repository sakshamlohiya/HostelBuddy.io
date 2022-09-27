const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Subject:{
        type:String,
        required:true
    },
    Authorities:{
        type:String,
    },
    Des:{
        type:String,
        required:true
    }
})

const Cinfo = mongoose.model('Cinfo',complaintSchema)
module.exports = Cinfo