const mongoose = require("mongoose")
const CoverPhoto = require("../../models/user/coverPhoto")
const JobTabTask = require('../../models/admin/jobTabTaskSchema')


/** Cover Photo Add */
exports.addCoverPhoto = async function addCoverPhoto(req, res) {
    const job_id = req.body.job_id
    if (req.file) {
        upload_document = req.file.path
    }
    try {
        const match = await CoverPhoto.findOne({job_id})
        let msg = ''
        if(!match){
        const cover = new CoverPhoto({
            photo:"http://localhost:3000/" + req.file.path.replace(/\\/g, '/'),
            caption: req.body.caption,
            job_id:req.body.job_id,
            added_by:req.body.added_by,
        })
        cover.save()
        msg = "Your Cover Page Photo is Successfully Stored"
    }else {
        const edit = await CoverPhoto.findOneAndUpdate({job_id}, {
            photo:"http://localhost:3000/" + req.file.path.replace(/\\/g, '/'),
            caption: req.body.caption,
            job_id:req.body.job_id,
            edit_by:req.body.edit_by,
            updateAt: Date.now()
        })
        msg = "Update Successfull"
    }
        const jobdata = await JobTabTask.findOne({ job_id: mongoose.Types.ObjectId(job_id) });
     if(jobdata){
    const tabArr = jobdata.tabs;
     tabArr.filter(function (value, key) {
        if (value._id == 2) {
            value.status = true;
        }
        })
    
    // tabArr.forEach(element => {
    //     if (element._id == 2) {
    //         element.status = true;
    //     }
    // });
    if(req.body.caption != '' && req.body.added_by != '' ){
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
        return res.status(401).json({ success: false, message: err.message })
    }
}



/** Cover Photo View */
exports.CoverPhotoview = async function CoverPhotoview(req,res){
    const job_id = req.params.job_id
    try{
        const list = await CoverPhoto.find({job_id})
        return res.status(200).json({success:true, data:list})
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}



/** Cover Photo Edit */
exports.editCoverPhoto = async function editCoverPhoto(req, res){
    const _id = req.params
    if (req.file) {
        upload_document = req.file.path
    }
    try{
        const edit = await CoverPhoto.findByIdAndUpdate(_id, {
            photo:"http://localhost:3000/" + req.file.path.replace(/\\/g, '/'),
            caption: req.body.caption,
            job_id:req.body.job_id,
            added_by:req.body.added_by,
            edit_by:req.body.edit_by
        })
        return res.status(200).json({success:true, message:"Update Successfull"})
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}



/** Cover Photo Delete */
exports.coverPhotoDelete = async function coverPhotoDelete(req, res){
    const _id = req.params
    try{
        const cover = await CoverPhoto.findByIdAndDelete(_id)
        return res.status(200).json({success:true, message:"Delete Successfully"})
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}