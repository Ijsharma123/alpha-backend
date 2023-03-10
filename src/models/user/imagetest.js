const { contentType } = require("mime-types")
const mongoose = require("mongoose")
const imagetest = mongoose.Schema({
    image:{
        type:Buffer,
        contentType:String
    }
})

module.exports = mongoose.model("Images", imagetest)