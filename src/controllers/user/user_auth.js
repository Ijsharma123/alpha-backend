const User = require('../../models/admin/userSchema');
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Validator } = require('node-input-validator');
const Job = require('../../models/admin/jobSchema');
const JobTabTask = require('../../models/admin/jobTabTaskSchema');
const mongoose = require('mongoose');

/** For reset password send Email */
async function sendResetPasswordMail(req, res, reqBody) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.Email,
                pass: process.env.Password
            }
        })
        console.log('created')
        const mailOptions = {
            from: process.env.Email,
            to: reqBody.email,
            subject: 'Reset your Password',
            html: '<p>Hii ' + reqBody.name + ', Please open the link <a href = "http://localhost:3000/user/resetpassword" > reset your password </a> and your Verification Code Is '+ reqBody.otp
        }
        console.log('Done')
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log('Email has been sent:- ' + info.response)
            }
        })
    } catch (err) {
        res.status(401).json({ success: false, err: err.message })
    }
}



/** User Login */
exports.userLogin = async function userLogin(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, msg: "Invalid Email" })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ success: false, msg: "Invalid Password" })
        }
        const payload = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
        jwt.sign(payload, process.env.JWT_Key, { expiresIn: 30000 }, (err, token) => {
            if (err) {
                res.send("Something wrong")
            } else {
                return res.status(200).json({ success: true, msg: "Verification Done", token: token })
            }
        })
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
}



/** Sent Email To User */
exports.sendEmail = async function sendEmail(req, res) {
    const email = req.body.email
    try {
        const data = await User.findOne({ email })
        if (data) {
            // const otp = Math.floor((Math.random()*1000000)+1)
            const AutoOTP = otpGenerator.generate(6, {
                digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
            })
            const mail = await User.findOneAndUpdate({email}, {otp: AutoOTP})
            const reqBody = {
                name: data.name,
                email: data.email,
                otp :  AutoOTP
            }
            sendResetPasswordMail(req, res, reqBody)
            res.status(200).json({ success: true, msg: "Please check your gmail "+ AutoOTP })
        } else {
            return res.status(401).json({ success: false, msg: "Email Id not exist" })
        }
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
}



/** User Verify Otp */
exports.verifyOtp = async function verifyOtp(req, res){
    const { email, OTP } = req.body
    try{
        const mail = await User.findOne({email})
        if(mail.otp !== OTP){
            return res.status(401).json({success:false, message:"Your Otp Is Wrong"})
        }else{
            return res.status(200).json({success:true, message:"Your Otp Is Correct"})
        }
    }catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}



/** User reset password */
exports.resetpassword = async function resetpassword(req, res){
    const email = req.body.email
    try{
        const password = new Validator(req.body, {
                email: 'required',
                new_password: 'required',
                confirm_password: 'required|same:new_password'
            })
        const Matched  = await password.check()
        if(!Matched){
            return res.status(401).json(password.errors)
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({success:false, msg:"Invalid Email"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = bcrypt.hashSync(req.body.new_password, salt) 
        await User.findOneAndUpdate({email}, {password:hashPassword})
            return res.status(200).json({success:true, data:user})
        }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** User Change Password */
exports.changePassword = async function changePassword(req, res){
    try{
        const password = new Validator(req.body, {
            old_password: 'required',
            new_password: 'required',
            confirm_password: 'required|same:new_password'
        })
        const matched = await password.check()
        if(!matched){
            return res.status(401).json(password.errors)
        }
        const user = await User.findById(req.user.id)
        if (bcrypt.compareSync(req.body.old_password, user.password)) {

            const hashPassword = bcrypt.hashSync(req.body.new_password, 10)
            await User.updateOne({ _id: user._id }, { password: hashPassword })

            return res.status(200).json({ success: true, mess: "Password successfully Updated" })
        } else {
            return res.status(400).json({ success: false, mess: "Password does not matched" })
        }
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** User Show Profile */
exports.showProfile = async function showProfile(req, res){
    const _id = req.params
    try{
        const user = await User.find({_id}).select('-password')
        return res.status(200).json({success:true, data:user})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** Edit User Profile */
exports.editProfile = async function editProfile(req, res){
    const _id = req.params
    try{
        const user = await User.findByIdAndUpdate(_id, req.body)
        return res.status(200).json({success:true, data:user})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}


/** job list by assign to */
exports.jobAssignTo = async function jobList(req, res) {
    const user_id = req.user.id;
    try {
        var jobList = await Job.aggregate([
            {
                $match: { assign_to:{$elemMatch:{_id : user_id, }}}
            },
            { 
                $sort : { addedAt : -1 } 
            }
        ]);
        
        return res.status(200).globalResponse({ success: true, message:'count ' + jobList.length, data: jobList })

    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}

/** job list by assign to */
exports.viewjobAssignTo = async function viewjobAssignTo(req, res) {
    const user_id = req.user.id;
    const jod_id = req.body.jod_id;
    try {
        var jobData = await Job.findOne({ assign_to:{$elemMatch:{_id : user_id, }}, jod_id });
        return res.status(200).globalResponse({ success: true, message:'Your job is here!', data: jobData })

    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}


/** job tabs task */
exports.jobTabsTask = async function jobTabTask(req, res) {
    const user_id = req.user.id;
    try {
        var jobTaskData = await JobTabTask.findOne({ job_id: req.body.job_id });
        
        if(jobTaskData){
            const jobtabupdate = await JobTabTask.findOneAndUpdate({job_id:req.body.job_id}, {tabs: req.body.tabs})
            return res.status(200).globalResponse({ success: true, message:"Job Task Updated!" })
        }else{
            const addjobtab = new JobTabTask({
                job_id: req.body.job_id,
                tabs: req.body.tabs,
                added_by: user_id
            })
            addjobtab.save()
            return res.status(200).globalResponse({ success: true, message:"Job Task added!" })
        }

    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}

/** get job tabs task */
exports.getJobTabsTask = async function getJobTabsTask(req, res) {
    job_id = mongoose.Types.ObjectId(req.params.job_id);
    try {
        const jobtabupdate =  await JobTabTask.findOne({ job_id });
        return res.status(200).globalResponse({ success: true, message:"Job Tab Task!", data:jobtabupdate })
       
    } catch (err) {
        return res.status(401).globalResponse({ success: false, message: err.message })
    }
}
