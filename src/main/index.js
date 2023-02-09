require('dotenv').config();

const express = require("express")
const cors = require("cors")
const DBconnect = require("../config/database")

DBconnect()

const app = express()
app.use(express.json());
app.use(cors())

/** Images path for CoverPage Api  */
app.use("/src/Images/uploadCoverPhoto",express.static('src/Images/uploadCoverPhoto'))  

/** Images path for Attachment Api  */
app.use("/src/Images/uploadAttachmentPhoto",express.static('src/Images/uploadAttachmentPhoto'))  



//Admin Path
const AdminRouter = require("../routes/admin")
//User Path
const UserRouter = require("../routes/user")

app.listen(process.env.PORT,()=>{
    console.log(`Server Started Successfully ${process.env.PORT}`)
})

const responseHandler = require("../Middlewares/responseHandler");
app.use("/", responseHandler);


//Admin
app.use("/admin",AdminRouter)
//User
app.use("/user",UserRouter)
