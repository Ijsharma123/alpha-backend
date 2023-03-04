const Job = require('../../models/admin/jobSchema');
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const mongoose = require("mongoose")

/** Job Add */
exports.jobAdd = async function jobAdd(req, res) {
    try {
        const add = new Job({
            client_name: req.body.client_name,
            project_name: req.body.project_name,
            address: req.body.address,
            notes: req.body.notes,
            site_work: req.body.site_work,
            assign_to: req.body.assign_to,
            due_date: req.body.due_date,
            tabs: req.body.tabs,
            progress: req.body.progress,
            status: req.body.status,
        })
        add.save();

        if (add._id) {
            const addjob = new JobTabTask({
                job_id: add._id,
                tabs: [
                    { "_id": 1, "tab_id":1, "tab_name": "SiteWork", "name": "Scope of Work & Genral Info", "status": false },
                    { "_id": 2, "tab_id":1, "tab_name": "SiteWork", "name": "Cover Page Photo", "status": false },
                    { "_id": 3, "tab_id":2, "tab_name": "LabResult", "name": "Inspections", "status": false },
                    { "_id": 4, "tab_id":3, "tab_name": "FloorPlan", "name": "Attachments", "status": false },
                    { "_id": 5, "tab_id":4, "tab_name": "QualityControl", "name": "Quality Control", "status": false },
                    { "_id": 6, "tab_id":5, "tab_name": "Issued", "name": "Sample Result", "status": false },
                    { "_id": 7, "tab_id":5, "tab_name": "Issued", "name": "Sign Off", "status": false }
                ],
                added_by: req.admin.id
            })
            addjob.save()
        }
        return res.status(200).globalResponse({ success: true, message: "Job added" })

    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}



/** Job List */
exports.jobList = async function jobList(req,res){
    try{
        const jobList = await Job.find()
        return res.status(200).globalResponse({success:true, count:jobList.length, data:jobList})
    }catch(err){
        return res.status(401).globalResponse({success:false, msg:err.message})
    }
}


/** Job Update */
exports.jobEdit = async function jobEdit(req, res) {
    const _id = req.params
    try {
        const job = await Job.findByIdAndUpdate(_id, req.body)
        return res.status(200).globalResponse({ success: true, message: 'Update Successfully' })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}



/** Job Delete */
exports.jobDelete = async function jobDelete(req, res) {
    const _id = req.params
    try {
        const job = await Job.findByIdAndDelete(_id)
        return res.status(200).globalResponse({ success: true, message: 'Delete Successfully' })
    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}