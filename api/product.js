const express = require("express")
const router = express.Router()
const User = require("./../src/models/admin/userSchema")

router.get("/user/list", async (req,res)=>{
    try{
        const user12 =await User.find()
        return res.status(200).json({success:true, msg:user12})
    }catch(err){
        return res.status(400).json({success:false, msg:err.message})
    }
})
module.exports = router