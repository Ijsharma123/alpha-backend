require('dotenv').config()
const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
const { Validator } = require('node-input-validator')
const { nodemailer } = require("nodemailer")
const Admin = require("../../models/admin/adminSchema");



//For reset password send Email
async function sendResetPasswordMail(req, res, reqBody){
    try{
        const transporter = nodemailer.createTransport({
            host:'gmail',
            port:587,
            secure:false,
            auth:{
                user:process.env.Email,
                pass:process.env.Password
            }
        })
        console.log('created')
        const mailOptions = {
            from:process.env.Email,
            to:reqBody.email,
            subject:'Reset your Password',
            html:'Hii '+reqBody.name+', Your Verification Code Is '+ reqBody.otp
        }
        console.log('Done')
        await transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err)
            }else{
                console.log('Email has been sent:- '+ info.response)
            }
        })
    }catch(err){
        res.status(401).json({success:false, err:err.message})
    }
}



/** Add Admin */  
exports.addAdmin = async function addAdmin(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        const add = await Admin.find({ email })

        if (add.length >= 1) {
            return res.status(401).json({ success: false, message: "Admin already exists" })
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(401).json({ success: false, message: err.message })
                } else {
                    const Add = new Admin({
                        email: req.body.email,
                        name: req.body.name,
                        password: hash,
                        address: req.body.address,
                        add_logo: req.body.add_logo,
                        contact_number: req.body.contact_number
                    })
                    Add.save()
                    return res.status(200).json({ success: true, message:"Admin added Successfully" })
                }
            })
        }
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
}



/** Admin Login */
exports.login = async function adminlogin(req, res) {
    const { email, password } = req.body
    try {
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(501).json({ success: false, msg: "Invalid Email" })
        }
        const passwordMatch = await bcrypt.compare(password, admin.password)
        if (!passwordMatch) {
            return res.status(501).json({ success: false, msg: "Invalid Password" })
        }
        const payload = {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        }
        jwt.sign(payload, process.env.JWT_Key, { expiresIn: 86400000 }, (err, token) => {
            if (err) {
                res.send("Something wrong")
            } else {
                return res.status(200).json({ success: true, msg: "Verification Done", token: token })
            }
        })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
}



/** Admin Change Password */
exports.changePassword = async function changePassword(req, res) {
    try {
        const password = new Validator(req.body, {
            old_password: 'required',
            new_password: 'required',
            confirm_password: 'required|same:new_password'
        })
        const matched = await password.check()
        if (!matched) {
            return res.status(401).json(password.errors)
        }

        //const user =await Admin.findOne({email:req.body.email})    when you want to change password with email
        const admin = await Admin.findById(req.admin.id)
        if (bcrypt.compareSync(req.body.old_password, admin.password)) {

            const hashPassword = bcrypt.hashSync(req.body.new_password, 10)
            await Admin.updateOne({ _id: admin._id }, { password: hashPassword })

            return res.status(200).json({ success: true, mess: "Password successfully Updated" })
        } else {
            return res.status(400).json({ success: false, mess: "Password does not matched" })
        }
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}



/** Admin Generate Otp For Forget Password */
exports.sendOtp = async function sendOtp(req, res) {
    const email = req.body.email
    try{
        const data = await Admin.findOne({email})
        if(data){
            const otp = Math.floor((Math.random()*1000000)+1)
            const Otp = new OTP({
                name:req.admin.name,
                email:req.body.email,
                otp:otp,
            })
            Otp.save()
            const reqBody ={
                name : data.name, 
                email : data.email,
                otp :  otp
            }
            sendResetPasswordMail(req, res, reqBody)
            res.status(200).json({success:true, msg:"Please check your gmail " + otp})
        }else {
            return res.status(401).json({success:false, msg:"Email Id not exist"})
        }
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** Admin Verify Otp For Reset Password */
exports.verifyOtp = async function verifyOtp(req, res){
    var {email, otp} = req.body
    try{
        var data = await OTP.findOne({email, otp})
         if(!data){
            return res.status(401).json({success:false, msg:'Otp Is Wrong'})
        }else{
            return res.status(200).json({success:true, msg:'Otp Is Correct', data:data})
        }
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
}



/** Admin Reset Password */
exports.resetPassword = async function resetPassword(req, res) {
    const email = req.body.email
    try {
        const password = new Validator(req.body, {
            email: 'required',
            new_password: 'required',
            confirm_password: 'required|same:new_password'
        })
        const matched = await password.check()
        if (!matched) {
            return res.status(401).json(password.errors)
        }
        const admin = await Admin.findOne({ email })
        if(!admin){
            return res.status(401).json({success:false, msg:"Invalid Email"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = bcrypt.hashSync(req.body.new_password, salt) 
        await Admin.updateOne({ email }, { password: hashPassword })
             res.status(200).json({ success: true, data: admin })
    } catch (err) {
         res.status(400).json({ success: false, message: err.message })
    }
}



/** Admin profile Show using id*/
exports.showProfile = async function showProfile(req, res){
    const _id = req.params
    try{
        const admin = await Admin.findOne(_id).select("-password")
        return res.status(200).json({success:true, data:admin}) 
    }catch(err){
        return res.status(404).json({success:false, err:err.message})
    }
}



/** Admin Edit Profile */
exports.editProfile = async function editProfile(req, res){
    const _id = req.params._id
   try{
        const admin = await Admin.findByIdAndUpdate(_id,req.body)
        return res.status(200).json({success:true, data:admin})
    }catch(err){
        return res.status(404).json({success:false, err:err.message})
    }
}