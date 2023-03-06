const Inspectionon = require("../../models/user/inspection")


/** Inspection Edit */
exports.Inspection = async function Inspection(req, res) {
    const job_id = req.params.job_id
    // console.log(job_id)
    
    try {
        var inspectLI = '';
        var inspectSuspect = '';
        let inspectPriority = '';
        // var inspectData = req.body;

      
        
        if (req.body.inspectTo == 'location') {
            
            inspectLI = {
                location_notes: req.body.location_notes,
                photo1: req.body.photo1,
                photo2: req.body.photo2,
                
            }
        }

        if (req.body.inspectTo == 'item') {
           
            
            inspectLI = {
                Item: req.body.Item,
                Material: req.body.Material,
                photo1: req.body.photo1,
                photo2: req.body.photo2,
                Access: req.body.Access,
            };
        }
        
        if (req.body.is_suspect_asbestos == 'true') {
            inspectSuspect = {
                inspection_strategy: req.body.inspection_strategy,
                sample_id: req.body.sample_id,
                sample_type: req.body.sample_type,
                Product_type: req.body.Product_type,
                Extent_or_damage: req.body.Extent_or_damage,
                Surface_type_treatment: req.body.Surface_type_treatment,
                Extent: req.body.Extent
            };
        }

        if (req.body.is_priority_assessment == 'true') {
            inspectPriority = {
                Main_type_of_activity_in_area: req.body.Main_type_of_activity_in_area,
                Location: req.body.Location,
                Accessibility: req.body.Accessibility,
                Extent_Amount: req.body.Extent_Amount
            };
        }
        const saveinspectData = {
            building: req.body.building,
            level: req.body.level,
            location: req.body.location,
            inspectTo: req.body.inspectTo,
            inspect: inspectLI,
            is_suspect_asbestos: req.body.is_suspect_asbestos,
            suspect_asbestos: inspectSuspect,
            is_priority_assessment: req.body.is_priority_assessment,
            priority_assessment: inspectPriority,
            added_by: req.body.added_by,
            recomandation: req.body.recomandation,
            additional_comments: req.body.additional_comments,
            status: true
        }
        // console.log(inspectData)
        const edit = await Inspectionon.findOneAndUpdate({job_id}, saveinspectData)
        // console.log(edit)
        return res.status(200).json({ success: true, message: "Update Successfully" })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
}