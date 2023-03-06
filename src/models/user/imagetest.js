const mongoose = require("mongoose")
const imagetest = mongoose.Schema({
    image:{
        type:String
    }
})

module.exports = mongoose.model("Images", imagetest)