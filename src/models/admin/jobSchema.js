const mongoose = require("mongoose")

/** Schema */
const jobSchema = mongoose.Schema({
    client_name: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    site_work: {
        type: String,
        required: true
    },
    assign_to: {
        type: Array,
        required: true
    },
    due_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tabs:{
        type:Array,
        required:true
    },
    progress:{
        type:Number,
        required:false
    },
    addedAt: {
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model("Jobs", jobSchema)

