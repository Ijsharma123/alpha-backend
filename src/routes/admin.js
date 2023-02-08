const express = require("express")
const router = express.Router()

/** Files Path */
    const Admin = require("../controllers/admin/admin_auth")
    const User = require("../controllers/admin/user")
    const UserGroup = require("../controllers/admin/user")
    const Job = require("../controllers/admin/job")
    const Token = require("../Middlewares/admin-token")


/** Admin_auth File Routes */
    router.route("/add").post(Admin.addAdmin)
    router.route("/login").post(Admin.login)
    router.route("/changepassword").post(Token, Admin.changePassword)
    router.route("/sendotp").post(Token, Admin.sendOtp)
    router.route("/verifyotp").post(Admin.verifyOtp)
    router.route("/resetpassword").post(Admin.resetPassword)
    router.route("/editprofile/:_id").post(Token, Admin.editProfile)
    router.route("/showprofile/:_id").get(Token, Admin.showProfile)

/** User File Routes */
    router.route("/add/user").post(Token, User.addUser)
    router.route("/user/edit/:_id").post(Token, User.editUser)
    router.route("/user/list").get(Token, User.userList)
    router.route("/user/delete/:_id").get(Token, User.userDelete)
    router.route("/user/group").get(Token, UserGroup.userGroup)
    router.route("/user/activeuser").get(Token, User.activeUser)
 
/** Job File Routes */
    router.route("/job/add").post(Token, Job.jobAdd)
    router.route("/job/list").get(Token, Job.jobList)
    router.route("/job/edit/:_id").post(Token, Job.jobEdit)
    router.route("/job/delete/:_id").get(Token, Job.jobDelete)


module.exports = router