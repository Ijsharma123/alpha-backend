const Inspection = require("../../models/user/inspection")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const mongoose = require("mongoose")
const path = require("path")


/** Inspection add */
exports.addinspection = async function addinspection(req, res) {
    try {

        var inspectLI = '';
        var inspectSuspect = '';
        var inspectPriority = '';
        var inspectData = req.body;

        if (inspectData.inspectTo == 'location') {
            inspectLI = {
                location_notes: inspectData.inspect.location_notes,
                photo1: inspectData.inspect.photo1,
                photo2: inspectData.inspect.photo2,
            }
            // console.log(req.file.path);
        }

        if (inspectData.inspectTo == 'item') {
            inspectLI = {
                Item: inspectData.inspect.Item,
                Material: inspectData.inspect.Material,
                photo1: inspectData.inspect.photo1,
                photo2: inspectData.inspect.photo2,
                Access: inspectData.inspect.Access,
            };
        }

        if (inspectData.is_suspect_asbestos == true) {
            inspectSuspect = {
                inspection_strategy: inspectData.suspect_asbestos.inspection_strategy,
                sample_id: inspectData.suspect_asbestos.sample_id,
                sample_type: inspectData.suspect_asbestos.sample_type,
                Product_type: inspectData.suspect_asbestos.Product_type,
                Extent_or_damage: inspectData.suspect_asbestos.Extent_or_damage,
                Surface_type_treatment: inspectData.suspect_asbestos.Surface_type_treatment,
                Extent: inspectData.suspect_asbestos.Extent
            };
        }

        if (inspectData.is_priority_assessment == true) {
            inspectPriority = {
                Main_type_of_activity_in_area: inspectData.priority_assessment.Main_type_of_activity_in_area,
                Location: inspectData.priority_assessment.Location,
                Accessibility: inspectData.priority_assessment.Accessibility,
                Extent_Amount: inspectData.priority_assessment.Extent_Amount
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
        // const job_id = req.body.job_id
        const add = new Inspection(saveinspectData)
        var msg = ''
        add.save()
        msg = 'Added Succesfully'
        const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(req.body.job_id) });
        if(jobdata){
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
        if(req.body.location != '' && req.body.recomandation != '' && req.body.additional_comments != '' ){
            const scopetab = await JobTabTask.findByIdAndUpdate({_id :jobdata._id} ,
                { $set: { tabs: tabArr } },
                function (er, re) {
                    console.log("error", er);
                }
        ).exec();
        msg = 'Tab Update Successfull'
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
exports.Editinspection = async function Editinspection(req, res) {
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