const express = require("express")
const router = express.Router()


/** Files Path */
     const User = require("../controllers/user/user_auth")
     const Scope = require("../controllers/user/scope")
     const Token = require("../Middlewares/user-token")
     const CoverPhoto = require("../controllers/user/coverPhoto")
     const coverUpload = require("../controllers/user/uploadCoverPhoto")
     const Attachment = require("../controllers/user/attachment")
     const attachUpload = require("../controllers/user/uploadAttachmentPhoto")
     const SampleResult = require("../controllers/user/sampleResult")
     const SignOff = require("../controllers/user/signOff")
     const signUpload = require("../controllers/user/uploadSignoffPhoto")
     const Inspection = require("../controllers/user/inspection")
     const upload = require("../controllers/user/uploadInspectionPhoto")
     const Preview = require("../controllers/user/preview")
     const Inspect = require("../controllers/user/inspectEdit")
     const ImageIm = require("../controllers/user/imagetest")

/** User_auth File Route */
     router.route("/login").post(User.userLogin)
     router.route("/sendemail").post(Token, User.sendEmail)
     router.route("/verifyotp").post(User.verifyOtp)
     router.route("/resetpassword").post(User.resetpassword)
     router.route("/changepassword").post(Token, User.changePassword)
     router.route("/showprofile/:_id").get(Token, User.showProfile)
     router.route("/editprofile/:_id").post(Token, User.editProfile)
     
/** Job list assignto */
     router.route("/jobassignto").get(Token, User.jobAssignTo)
     router.route("/viewjobassignto").post(Token, User.viewjobAssignTo)
     // router.route("/jobtabstask").post(Token, User.jobTabsTask)
     router.route("/getJobTabsTask/:job_id").get(Token, User.getJobTabsTask)

/** Scope File Route */
     router.route("/scope/add/edit").post(Token, Scope.addScope)
     router.route("/singlescope/view/:_id").get(Token, Scope.scopeView)

/** Cover Photo File Path */
     router.route("/coverphoto/add").post(Token, coverUpload, CoverPhoto.addCoverPhoto)
     router.route("/coverphoto/view/:job_id").get(Token, CoverPhoto.CoverPhotoview)       
     router.route("/coverphoto/edit/:_id").post(Token, coverUpload, CoverPhoto.editCoverPhoto)
     router.route("/coverphoto/delete/:_id").get(Token, CoverPhoto.coverPhotoDelete)

/** Attachment File Path */
     router.route("/attachment/add").post(Token, attachUpload, Attachment.addAttachment)
     router.route("/attachment/view/:job_id").get(Token, Attachment.attachmentView)
     router.route("/attachment/edit/:job_id").post(Token, attachUpload, Attachment.attachmentEdit)
     router.route("/attachment/delete/:_id").get(Token, Attachment.deleteAttachment)
     router.route("/test").get( Attachment.test)
     
     /** Sample Result File Path */
     router.route("/sampleresult/add").post(Token, SampleResult.addSampleResult)
     router.route("/sampleresult/view/:_id").get(Token, SampleResult.sampleResultView)
     router.route("/sampleresult/list/:job_id").get(Token, SampleResult.sampleResultList)
     router.route("/sampleresult/edit/:_id").post(Token, SampleResult.sampleResultEdit)
     router.route("/sampleresult/delete/:_id").get(Token, SampleResult.sampleResultDelete)
     
     /** SignOff Result File Path */
     router.route("/signoff/add").post(Token, signUpload, SignOff.addsign)
     router.route("/signoff/view/:job_id").get(Token, SignOff.signView)
     router.route("/signoff/edit/:job_id").post(Token, signUpload, SignOff.editSign)
     router.route("/signoff/delete/:job_id").get(Token, SignOff.deleteSign)
     
     /** Inspection File Path */
     router.route("/inspection/add").post(Token, upload, Inspection.addinspection)
     router.route("/inspection/list/:_id").get(Token, Inspection.inspectionList)
     router.route("/inspection/view/:_id").get(Token, Inspection.Viewinspection)
     router.route("/inspection/edit/:_id").post(Token, Inspection.InspectionEdit)
     // router.route("/testinsc/edit/:job_id").post(Token, Inspect.InspectionEdit)
     router.route("/inspection/delete/:_id").get(Token, Inspection.inspectionDelete)
     router.route("/inspection/clone/:_id").post(Token, Inspection.cloneInspection)

/** Preview File Path */
     router.route("/preview/view/:job_id").get(Token, Preview.Viewpreview)



   router.route("/test/Image").post(attachUpload, ImageIm.ImageTest)
   router.route("/test/Image/get").get(ImageIm.Imageget)

     


module.exports = router