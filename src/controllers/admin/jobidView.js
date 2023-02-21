const  Attachment  = require( "../../models/user/attachment");
const  CoverPhoto  = require( "../../models/user/coverPhoto");
const  Inspection  = require( "../../models/user/inspection");
const  SampleResult  = require( "../../models/user/sampleResult");
const  Scope  = require( "../../models/user/scope");
const  SignOff  = require( "../../models/user/signOff");


async function newAttachment(data){
    const attach = await Attachment.findOne({job_id:data.job_id})
    if(!attach){
        return {msg:'Job_id does Not Exist'}
    }else{
        return attach
    }
}

async function newCoverPhoto(data){
    const cover = await CoverPhoto.findOne({job_id:data.job_id})
    if(!cover){
        return {msg:'Job_id does Not Exist'}
    }else{
        return cover
    }
}

async function newInspection(data){
    const inspect = await Inspection.findOne({job_id:data.job_id})
    if(!inspect){
        return {msg:'Job_id does Not Exist'}
    }else{
        return inspect
    }
}

async function newSampleResult(data){
    const sample = await SampleResult.findOne({job_id:data.job_id})
    if(!sample){
        return {msg:'Job_id does Not Exist'}
    }else {
        return sample
    }
}

async function newScope(data){
    const scope = await Scope.findOne({job_id:data.job_id})
    if(!scope){
        return {msg:'Job_id does Not Exist'}
    }else{
        return scope
    }
}

async function newSignOff(data){
    const sign = await SignOff.findOne({job_id:data.job_id})
    if(!sign){
        return {msg:'Job_id does Not Exist'}
    }else{
        return sign
    }
}


exports.jobidView = async function jobidView(req, res){
    const job_id = req.params.job_id
    try{
        const Attachment1 = await newAttachment({job_id})
        const Cover = await newCoverPhoto({job_id})
        const Inspect = await newInspection({job_id})
        const Sample = await newSampleResult({job_id})
        const Scope = await newScope({job_id})
        const Sign = await newSignOff({job_id})

        const finalResult = {
            Attachment1:Attachment1,
            Cover:Cover,
            Inspect:Inspect,
            Sample:Sample,
            Scope:Scope,
            Sign:Sign
        }

        return res.status(200).json({success:true, data:finalResult})
    }catch(err){
        return res.status(401).json({success:false, msg:err.message})
    }
}


