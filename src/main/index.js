require('dotenv').config();

const express = require("express")
const cors = require("cors")
const DBconnect = require("../config/database")

const User = require("./../models/admin/userSchema")


DBconnect()

const app = express()
app.use(express.json());
app.use(cors())

// app.get('/', (req, res) => res.send('Home Page Route'));

/** Images path for CoverPage Api  */
app.use("/src/Images/uploadCoverPhoto",express.static('src/Images/uploadCoverPhoto'))  

/** Images path for Attachment Api  */
app.use("/src/Images/uploadAttachmentPhoto",express.static('src/Images/uploadAttachmentPhoto'))  



//Admin Path
// const AdminRouter = require("../routes/admin")
//User Path
// const UserRouter = require("../routes/user")

app.listen(process.env.PORT,()=>{
    console.log(`Server Started Successfully ${process.env.PORT}`)
})

app.get("/user/list", async (req,res)=>{
    try{
        const user12 =await User.find()
        return res.status(200).json({success:true, msg:user12})
    }catch(err){
        return res.status(400).json({success:false, msg:err.message})
    }
})



const responseHandler = require("../Middlewares/responseHandler");
app.use("/", responseHandler);


//Admin
// app.use("/admin",AdminRouter)
//User
// app.use("/user",UserRouter)
