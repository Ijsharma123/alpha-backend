const mongoose = require("mongoose")
const sampleSchema = mongoose.Schema({
    sample_id:{
        type:String,
        required:true
    },
    fibre_type:{
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
module.exports = mongoose.model("Sample_Result", sampleSchema)