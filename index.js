require('dotenv').config();

const express = require("express")
const cors = require("cors")
const DBconnect = require("./src/config/database")
const bodyParser = require("body-parser")


DBconnect()

const app = express()
app.use(express.json());
app.use(cors())

 // create application/json parser
 app.use(bodyParser.json());
//  parse various different custom JSON types as JSON
 app.use(bodyParser.json({ type: 'application/*+json' }));
 // parse some custom thing into a Buffer
 app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
 // parse an HTML body into a string
 app.use(bodyParser.text({ type: 'text/html' }));
 // parse an text body into a string
 app.use(bodyParser.text({ type: 'text/plain' }));
 // create application/x-www-form-urlencoded parser
 app.use(bodyParser.urlencoded({ extended: false }));


/** Images path for CoverPage Api  */
app.use("/src/Images/uploadCoverPhoto",express.static('src/Images/uploadCoverPhoto'))  

/** Images path for Attachment Api  */
app.use("/src/Images/uploadAttachmentPhoto",express.static('src/Images/uploadAttachmentPhoto'))  



//Admin Path
const AdminRouter = require("./src/routes/admin")
//User Path
const UserRouter = require("./src/routes/user")

app.listen(process.env.PORT,()=>{
    console.log(`Server Started Successfully ${process.env.PORT}`)
})

const responseHandler = require("./src/Middlewares/responseHandler");
app.use("/", responseHandler);


//Admin
app.use("/admin",AdminRouter)
//User
app.use("/user",UserRouter)
