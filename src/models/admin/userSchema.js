const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    group_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    access:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:false
    }
})
module.exports = mongoose.model("User", userSchema)