const Sign = require("../../models/user/signOff")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const mongoose = require("mongoose")


/** SignOff Add */
exports.addsign = async function addsign(req, res) {
    const job_id = req.body.job_id
    if (req.file) {
        upload_document = req.file.path
    }
    try {
        const match = await Sign.findOne({ job_id })
        var msg = ''
        if (!match) {
            const add = new Sign({
                sign_off: req.body.sign_off,
                name: req.body.name,
                signature: "http://localhost:3000/" + req.file.path.replace(/\\/g, '/'),
                Date: req.body.Date,
                job_id: req.body.job_id,
                added_by: req.body.added_by
            })
            await add.save()
            msg = "Added Successfully"
        } else {
            const edit = await Sign.findOneAndUpdate({ job_id }, {
                sign_off: req.body.sign_off,
                name: req.body.name,
                signature: "http://localhost:3000/" + req.file.path.replace(/\\/g, '/'),
                Date: req.body.Date,
                job_id: req.body.job_id,
                edit_by: req.body.edit_by,
                updateAt:Date.now()
            })
            msg = "Update Successfully"
            const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(job_id) });
            const tabArr = jobdata.tabs;
             tabArr.filter(function (value, key) {
                if (value._id == 7) {
                    value.status = true;
                }
            })
            // tabArr.forEach(element => {
            //     if (element._id == 4) {
            //         element.status = true;
            //     }
            // });
            if(req.body.sign_off != '' && req.body.name != ''){
                const scopetab = await JobTabTask.findByIdAndUpdate({_id :jobdata._id} ,
                    { $set: { tabs: tabArr } },
                    function (er, re) {
                        console.log("error", er);
                    }
            ).exec();
            msg = 'Tab Update Successfull'
            }
            return res.status(200).json({success:true, message:msg})
    
        }
            return res.status(200).json({ success: true, message: msg })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** SignOff View */
exports.signView = async function signView(req, res) {
    const _id = req.params
    try {
        const view = await Sign.findById(_id)
        return res.status(200).json({ success: true, data: view })
    } catch (err) {
        return res.status({ success: false, message: err.message })
    }
}



/** SignOff Edit */
exports.editSign = async function editSign(req, res) {
    const _id = req.params
    try {
        const edit = await Sign.findByIdAndUpdate(_id, req.body)
        return res.status(200).json({ success: true, message: "Update Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** SignOff Delete */
exports.deleteSign = async function deleteSign(req, res) {
    const _id = req.params
    try {
        const sign = await Sign.findByIdAndDelete(_id)
        return res.status(200).json({ success: true, message: "Delete Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}