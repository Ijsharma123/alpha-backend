const Scope = require("../../models/user/scope")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const Job = require("../../models/admin/jobSchema")
const mongoose = require("mongoose")


/** Scope Add */
exports.addScope = async function addScope(req, res) {
    const job_id = req.body.job_id;
    const data = req.body;
    try {
        const scope = await Scope.findOne({ job_id });
        var msg = '';
        if (!scope) {
            const add = new Scope({
                job_id: data.job_id,
                site_description: data.site_description,
                scope_of_work: data.scope_of_work,
                purpose_of_serve: data.purpose_of_serve,
                introduction: data.introduction,
                executive_summary: data.executive_summary,
                added_by: data.added_by,
                edit_by: data.edit_by,
                status: data.status,
            })
            add.save();
            msg = 'Scope Added Successfully';
        } else {
            const edit = await Scope.findOneAndUpdate({ job_id }, data)
            msg = 'Scope Update Successfully';
        }
        const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(job_id) });
        const tabArr = jobdata.tabs;
        //  tabArr.filter(function (value, key) {
        //     if (value._id == 1) {
        //         value.status = false;
        //         // userArr[key].payment_date =  Date.now();
        //     }
        // })
        tabArr.forEach(element => {
            if (element._id == 1) {
                element.status = true;
            }
        });
        if(data.site_description != '' && data.scope_of_work != '' && data.purpose_of_serve != '' && data.introduction != '' && data.executive_summary != ''){
            const scopetab = await JobTabTask.findByIdAndUpdate({_id :jobdata._id} ,
                { $set: { tabs: tabArr } },
                function (er, re) {
                    console.log("error", er);
                }
        ).exec();
        msg = 'Tab Update Successfull'
        }
        return res.status(200).json({ success: true, message: msg })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Single Scope View */
exports.scopeView = async function scopeView(req, res) {
    const _id = req.params._id
    try {
        const scope = await Scope.findOne({ job_id:_id })
        if(!scope){
            return res.status(200).json({success:true, message:"No Data Found"})
        }else {
        var scopeDetails = {
            job_id: scope.job_id,
            site_description: scope.site_description,
            scope_of_work: scope.scope_of_work,
            purpose_of_serve: scope.purpose_of_serve,
            introduction: scope.introduction,
            executive_summary: scope.executive_summary,
            added_by: scope.added_by,
            edit_by: scope.edit_by,
            status: scope.status,
            added_at: scope.added_at,
            update_at: scope.update_at
        }
    }
        return res.status(200).json({ success: true, data: scopeDetails })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}
