const mongoose = require("mongoose")
const attachSchema = mongoose.Schema({
    attachment:{
        type:String,
        required:true
    },
    page_number:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    page_size:{
        type:String,
        required:true
    },
    paper_orientation:{
        type:String,
        required:true
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
module.exports = mongoose.model("Attachment", attachSchema)