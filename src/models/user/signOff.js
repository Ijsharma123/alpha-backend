const mongoose = require("mongoose")
const signSchema = mongoose.Schema({
    sign_off:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    signature:{
        type:String,
        required:false
    },
    Date:{
        type:Date,
        default:Date.now()
    },
    job_id:{
        type:String,
        required:true
    },
    added_by:{
        type:String,
        required:true
    },
    edit_by:{
        type:String,
        required:false
    },
    addedAt:{
        type:Date,
        default:Date.now()
    },
    updateAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model("SignOff", signSchema)