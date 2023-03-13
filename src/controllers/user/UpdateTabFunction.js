const Job = require("../../models/admin/jobSchema")

exports.updateJobTabs = async function updateJoblabel(req,res){
   const job_id  = req.job_id; 
   const step    = req.step;
   const stepName= req.stepName;
   const jobTabs = req.jobTabs;
   jobTabs.filter(function (value, key) {
       // console.log(value.status); 
       if (key == step) {
           value.status = true;
       }
   })
   const updateTabsOfJob = await Job.findByIdAndUpdate({ _id: job_id },
       { $set: { tabs: jobTabs } },
       function (er, re) {
           console.log("error", er);
       }
   ).exec();

}