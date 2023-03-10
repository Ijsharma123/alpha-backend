const Attachment = require("../../models/user/attachment")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const {updateJobTabs} = require('../../controllers/user/UpdateTabFunction')

const Job = require('../../models/admin/jobSchema');
const mongoose = require("mongoose")


/** Attachment Add */
exports.addAttachment = async function addAttachment(req, res) {
    const job_id = req.body.job_id
   
    try {
        const match = await Attachment.findOne({ job_id })
        var msg = ''
        if (!match) {
            const attach = new Attachment({
                attachment: req.body.attachment,
                page_number: req.body.page_number,
                title: req.body.title,
                image: process.env.Domain + req.file.path.replace(/\\/g, '/'),
                page_size: req.body.page_size,
                paper_orientation: req.body.paper_orientation,
                job_id: req.body.job_id,
                added_by: req.body.added_by,
            })
            await attach.save()
            msg = 'Attachment Added Successfully'
        } else {
            const edit = await Attachment.findOneAndUpdate({ job_id }, {
                attachment: req.body.attachment,
                page_number: req.body.page_number,
                title: req.body.title,
                image: process.env.Domain + req.file.path.replace(/\\/g, '/'),
                page_size: req.body.page_size,
                paper_orientation: req.body.paper_orientation,
                job_id: req.body.job_id,
                edit_by: req.body.edit_by,
                updateAt: Date.now()
            })
            msg = 'Update Successfully'
         } const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(job_id) });
            if (jobdata) {
                const tabArr = jobdata.tabs;
                // tabArr.filter(function (value, key) {
                //     if (value._id == 4) {
                //         value.status = true;
                //     }
                // })
                tabArr.forEach(element => {
                    if (element._id == 4) {
                        element.status = true;
                    }
                });
                if (req.body.attachment != '' && req.body.page_number != '' && req.body.title != '' && req.body.page_size != '' && req.body.paper_orientation != '') {
                    const scopetab = await JobTabTask.findByIdAndUpdate({ _id: jobdata._id },
                        { $set: { tabs: tabArr } },
                        function (er, re) {
                            console.log("error", er);
                        }
                    ).exec();
                    msg = 'Tab Update Successfull';
                    
                    const joblabelArr = jobdata.tabs;
                    
                    if(joblabelArr[3].status == true){
                        const jobDetails = await Job.findById({ _id: mongoose.Types.ObjectId(job_id) });
                        const jobTabs = jobDetails.tabs; 
                        const sendBody= {
                            job_id  : job_id,
                            step    : 2,
                            stepName: "FloorPlan",
                            jobTabs : jobTabs
                        }
                        updateJobTabs(sendBody)
                    }
                    
                }
            }
        return res.status(200).json({ success: true, message: msg })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Attachment View */
exports.attachmentView = async function attachmentView(req, res) {
    const job_id = req.params.job_id
    try {
        const view = await Attachment.find({job_id})
        return res.status(200).json({ success: true, data: view })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Attachment Edit */
exports.attachmentEdit = async function attachmentEdit(req, res) {
    const job_id = req.params.job_id
    if (req.file == '' || req.file == undefined) {
        image = req.body.image
    } else {
        image = process.env.Domain + req.file.path.replace(/\\/g, '/')
    }
    console.log(req.file)
    try {
        const edit = await Attachment.findOneAndUpdate(job_id, {
            attachment: req.body.attachment,
            page_number: req.body.page_number,
            title: req.body.title,
            image: image,
            page_size: req.body.page_size,
            paper_orientation: req.body.paper_orientation,
            job_id: req.body.job_id,
            edit_by: req.body.edit_by
        })
        return res.status(200).json({ success: true, message: "Update Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Attachment Delete */
exports.deleteAttachment = async function deleteAttachment(req, res) {
    const _id = req.params
    try {
        const attach = await Attachment.findByIdAndDelete(_id)
        return res.status(200).json({ success: true, message: "Delete Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}