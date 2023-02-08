const mongoose = require("mongoose")

/** Schema */
const jobTabTaskSchema = mongoose.Schema({
    job_id: {
        type: Object,
        required: true
    },
    tabs:{
        type:Array,
        required:true
    },
    added_by:{
        type:Object,
        required:true
    },
    addedAt: {
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model("JobTabTask", jobTabTaskSchema)

