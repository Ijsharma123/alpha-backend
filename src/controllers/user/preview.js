const ScopeOfWork = require("../../models/user/scope")
const CoverPhoto = require("../../models/user/coverPhoto")
const Inspection = require("../../models/user/inspection")
const Attachment = require("../../models/user/attachment")
const SampleResult = require("../../models/user/sampleResult")
const SignOff = require("../../models/user/signOff")



/** Functions For Preview View Api */
async function getScopeByJobId(data){
    const scope = await ScopeOfWork.findOne({job_id:data.job_id}).select(['-status','-added_at','-update_at'])
    if(!scope){
        return {msg:"Job_Id not exist"}
    }else {
        return scope
    }
}


async function getCoverPhoto(data){
    const cover = await CoverPhoto.findOne({job_id:data.job_id}).select(['-status','-addedAt','-updateAt'])
    if(!cover){
        return {msg:"Job_Id not exist"}
    }else {
        return cover
    }
}


async function getInspection(data){
    const inspect = await Inspection.find({job_id:data.job_id}).select(['-status','-addedAt','-updateAt'])
    // console.log(inspect.length)
    if(inspect.length==0){
        return {msg:"Job_Id not exist"}
    }else {
        return inspect
    }   
 }


async function getAttachment(data){
    const attach = await Attachment.findOne({job_id:data.job_id}).select(['-status','-addedAt','-updateAt'])
    if(!attach){
        return {msg:"Job_Id not exist"}
    }else {
        return attach
    }    
}


async function getSampleResult(data){
    const sample = await SampleResult.find({job_id:data.job_id}).select(['-status','-addedAt','-updateAt'])
    if(!sample){
        return {msg:"Job_Id not exist"}
    }else {
        return sample
    }    
}


async function getSignOff(data){
    const sign = await SignOff.findOne({job_id:data.job_id}).select(['-status','-addedAt','-updateAt'])
    if(!sign){
        return {msg:"Job_Id not exist"}
    }else {
        return sign
    }    
}



/** Preview View */
exports.Viewpreview = async function Viewpreview(req, res){
    const job_id = req.params.job_id
    try{
         const scope = await getScopeByJobId({job_id});
        const cover = await getCoverPhoto({ job_id });
        const inspect = await getInspection({ job_id })
        const attach = await getAttachment({ job_id })
        const sample = await getSampleResult({ job_id })
        const signOff = await getSignOff({ job_id })

        
        const finalePrev ={
            scope:scope,
            cover:cover,
            inspect:inspect,
            attach:attach,
            sample:sample,
            signOff:signOff
        }
        return res.status(200).json({success:true, data:finalePrev})

    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}

