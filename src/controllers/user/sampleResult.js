const SampleResult = require("../../models/user/sampleResult")
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const mongoose = require("mongoose")


/** Sample Result Add */
exports.addSampleResult = async function addSampleResult(req, res){
    const job_id = req.body.job_id
    try{
        const match = await SampleResult.findOne({job_id})
        let msg = ''
        // if(!match){
        const add = new SampleResult({
            sample_id:req.body.sample_id,
            fibre_type:req.body.fibre_type,
            job_id:req.body.job_id,
            added_by:req.body.added_by
        })
        add.save()
        msg = "Added Successfully"
        // }
            const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(job_id) });
            if(jobdata){
            const tabArr = jobdata.tabs;
             tabArr.filter(function (value, key) {
                if (value._id == 6) {
                    value.status = true;
                }
            })
            // tabArr.forEach(element => {
            //     if (element._id == 4) {
            //         element.status = true;
            //     }
            // });
            if(req.body.sample_id != '' && req.body.fibre_type != ''){
                const scopetab = await JobTabTask.findByIdAndUpdate({_id :jobdata._id} ,
                    { $set: { tabs: tabArr } },
                    function (er, re) {
                        console.log("error", er);
                    }
            ).exec();
            msg = 'Tab Update Successfull'
            }
            }
            return res.status(200).json({success:true, message:msg})
        
    
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}


/** Sample Result List */
exports.sampleResultList = async function sampleResultList(req, res){
    const job_id = req.params.job_id
    try{
        const view = await SampleResult.find({job_id})
        return res.status(200).json({success:true, data:view})
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}


/** Sample Result View */
exports.sampleResultView = async function sampleResultView(req, res){
    const _id = req.params
    try{
        const view = await SampleResult.findById(_id)
        return res.status(200).json({success:true, data:view})
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}



/** Sample Result Edit */
exports.sampleResultEdit = async function sampleResultEdit(req, res){
    const _id = req.params._id
    try{
        const user = await SampleResult.findOneAndUpdate({_id},{
            sample_id:req.body.sample_id,
            fibre_type:req.body.fibre_type,
            job_id:req.body.job_id,
            edit_by:req.body.edit_by,
            updateAt:Date.now()
        })
        return res.status(200).json({success:true, message:"Update Successfully"})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** Sample Result Delete */
exports.sampleResultDelete = async function sampleResultDelete(req, res){
    const _id = req.params
    try{
        const user = await SampleResult.findOneAndDelete({_id})
        return res.status(200).json({success:true, message:"Delete Successfully"})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}