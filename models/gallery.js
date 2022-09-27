const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    Imagename:{
        type:String,
        required:true
    },
    ImageDes:{
        type:String,
        required:true
    },
    Img:{
        data:Buffer,
        contentType:String
    }

})

const Image = mongoose.model('Image',gallerySchema)
module.exports = Image
