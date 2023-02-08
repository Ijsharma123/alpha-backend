const mongoose = require("mongoose")
const groupSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("User-Group", groupSchema)