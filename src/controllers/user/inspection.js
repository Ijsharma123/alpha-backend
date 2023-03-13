const Inspection = require("../../models/user/inspection")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const Job = require("../../models/admin/jobSchema")
const {updateJobTabs} = require('../../controllers/user/UpdateTabFunction')

const mongoose = require("mongoose")
const path = require('path');

/** Inspection add */
exports.addinspection = async function addinspection(req, res) {
    const job_id = req.params.job_id
    try {

        var inspectLI = '';
        var inspectSuspect = '';
        let inspectPriority = '';
        var inspectData = req.body;
        
        if (inspectData.inspectTo == 'location') {
            // let photo1=''
            // let photo2=''
            // const uploaded = req.files
            // photo1 = process.env.Domain + uploaded.photo1[0].path.replace(/\\/g, '/')
            // if(uploaded.photo2[0] != ''){
            //     photo2 = process.env.Domain + uploaded.photo2[0].path.replace(/\\/g, '/')
            // }
            inspectLI = {
                location_notes: inspectData.location_notes,
                photo1: inspectData.photo1,
                photo2: inspectData.photo2,
                
            }
        }
        
        if (inspectData.inspectTo == 'item') {
            // let photo1=''
            // let photo2=''
            // const uploaded = req.files
            // photo1 = process.env.Domain + uploaded.photo1[0].path.replace(/\\/g, '/')
            // if(uploaded.photo2[0] != ''){
            //  photo2 = process.env.Domain + uploaded.photo2[0].path.replace(/\\/g, '/')
            // }
            inspectLI = {
                Item: inspectData.Item,
                Material: inspectData.Material,
                photo1: inspectData.photo1,
                photo2: inspectData.photo2,
                Access: inspectData.Access,
            };
        }
        
        if (inspectData.is_suspect_asbestos == 'true') {
            inspectSuspect = {
                inspection_strategy: inspectData.inspection_strategy,
                sample_id: inspectData.sample_id,
                sample_type: inspectData.sample_type,
                Product_type: inspectData.Product_type,
                Extent_or_damage: inspectData.Extent_or_damage,
                Surface_type_treatment: inspectData.Surface_type_treatment,
                Extent: inspectData.Extent
            };
        }

        if (inspectData.is_priority_assessment == 'true') {
            inspectPriority = {
                Main_type_of_activity_in_area: inspectData.Main_type_of_activity_in_area,
                Location: inspectData.Location,
                Accessibility: inspectData.Accessibility,
                Extent_Amount: inspectData.Extent_Amount
            };
        }
        const saveinspectData = {
           job_id: inspectData.job_id,
            building: inspectData.building,
            level: inspectData.level,
            location: inspectData.location,
            inspectTo: inspectData.inspectTo,
            inspect: inspectLI,
            is_suspect_asbestos: inspectData.is_suspect_asbestos,
            suspect_asbestos: inspectSuspect,
            is_priority_assessment: inspectData.is_priority_assessment,
            priority_assessment: inspectPriority,
            added_by: inspectData.added_by,
            recomandation: inspectData.recomandation,
            additional_comments: inspectData.additional_comments,
            status: true
        }
        const match = await Inspection.findOne({ job_id })
        var msg = ''
        if(!match){
            const add = new Inspection(saveinspectData)
            add.save()
            msg = 'Added Succesfully'
        }else{
            const edit =await Inspection.findOneAndUpdate({job_id}, saveinspectData)
            msg = "Update Successfull"
            console.log(edit)
        }
        const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(req.body.job_id) });
        if (jobdata) {
            const tabArr = jobdata.tabs;
            //  tabArr.filter(function (value, key) {
            //     if (value._id == 1) {
            //         value.status = false;
            //         // userArr[key].payment_date =  Date.now();
            //     }
            // })
            tabArr.forEach(element => {
                if (element._id == 3) {
                    element.status = true;
                }
            });
            if (req.body.location != '' && req.body.recomandation != '' && req.body.additional_comments != '') {
                const scopetab = await JobTabTask.findByIdAndUpdate({ _id: jobdata._id },
                    { $set: { tabs: tabArr } },
                    function (er, re) {
                        console.log("error", er);
                    }
                ).exec();
                msg = 'Tab Update Successfull'
                const joblabelArr = jobdata.tabs;
                console.log(joblabelArr)
                if(joblabelArr[2].status == true){
                    const jobDetails = await Job.findById({ _id: mongoose.Types.ObjectId(job_id) });
                    console.log(jobDetails)
                    const jobTabs = jobDetails.tabs; 
                    console.log(jobTabs)
                    const sendBody= {
                        job_id  : job_id,
                        step    : 1,
                        stepName: "LabResult",
                        jobTabs : jobTabs
                    }
                    updateJobTabs(sendBody)
                }
            }
        }
        return res.status(200).json({ success: true, message: msg })
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
}



/** Inspection List */
exports.inspectionList = async function inspectionList(req, res) {
    const job_id = req.params
    try {
        const list = await Inspection.find({ job_id })
        return res.status(200).json({ success: true, data: list })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** View Inspection */
exports.Viewinspection = async function Viewinspection(req, res) {
    const _id = req.params
    try {
        const view = await Inspection.findById(_id)
        return res.status(200).json({ success: true, data: view })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Edit Inspection */
exports.InspectionEdit = async function InspectionEdit(req, res) {
    const _id = req.params
    try {
        const edit = await Inspection.findByIdAndUpdate(_id, req.body)
        return res.status(200).json({ success: true, message: "Update Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}


/** Inspection Delete */
exports.inspectionDelete = async function inspectionDelete(req, res) {
    const _id = req.params
    try {
        const inspect = await Inspection.findByIdAndDelete(_id)
        return res.status(200).json({ success: true, message: "Delete Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Inspection Copy Document */
exports.cloneInspection = async function cloneInspection(req, res) {
    const _id = req.params._id
    try {
        const doc = await Inspection.findById(_id);
        let obj = doc.toObject();
        delete obj._id;
        const docClone = new Inspection(obj);
        await docClone.save();
        if (!doc) {
            return res.status(401).json({ success: false, message: "ID not exist" })
        } else {
            const add = new Inspection(doc)
            const result = await add.save()
            return res.status(200).json({ success: true, message: "Added Successfully" })
        }
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}