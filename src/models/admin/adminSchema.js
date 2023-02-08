const mongoose = require("mongoose")
const adminSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    add_logo:{
        type:String,
        required:true
    },
    contact_number:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model('admin', adminSchema)