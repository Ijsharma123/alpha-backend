const Inspection = require("../../models/user/inspection")


/** Inspection Edit */
exports.InspectionEdit = async function InspectionEdit(req, res) {
    const job_id = req.params.job_id
    console.log(job_id)
    // if (req.file == '' || req.file == undefined) {
    //     photo1 = req.body.photo1
    // } else {
    //     photo1 = process.env.Domain + req.file.path.replace(/\\/g, '/')
    // }
    // if (req.file == '' || req.file == undefined) {
    //     photo2 = req.body.photo2
    // } else {
    //     photo2 = process.env.Domain + req.file.path.replace(/\\/g, '/')
    // }
    try {
        var inspectLI = '';
        var inspectSuspect = '';
        let inspectPriority = '';
        var inspectData = req.body;

        // let photo1=''
        // let photo2=''
        
        // const uploaded = req.files
        // console.log(req.files)
        // // if (!req.files   ) {
        // if (!uploaded.length ) {
        //     photo1 = inspectData.photo1
        //     console.log('data not available')
        // } else {
        //     photo1 = process.env.Domain + uploaded.photo1[0].path.replace(/\\/g, '/')
        //     console.log('data available')
        // }
        // // if (!req.files || req.files == '') {
        // //     photo2 = inspectData.photo2
        // // } else {
        // //     photo2 = process.env.Domain + uploaded.photo2[0].path.replace(/\\/g, '/')
        // // }
        
        if (inspectData.inspectTo == 'location') {
            
            inspectLI = {
                location_notes: inspectData.location_notes,
                photo1: inspectData.photo1,
                photo2: inspectData.photo2,
                
            }
        }

        if (inspectData.inspectTo == 'item') {
           
            
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
            // job_id: inspectData.job_id,
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
        const edit = await Inspection.findOneAndUpdate(job_id, saveinspectData)
        return res.status(200).json({ success: true, message: "Update Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}