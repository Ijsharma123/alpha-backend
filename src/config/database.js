require('dotenv').config();

const mongoose = require("mongoose")
const mongoconn = process.env.connection
mongoose.set('strictQuery', false);      //Use for Mongoose Deprecating Warning
const connection = async()=>{
    try{
         mongoose.connect(mongoconn)
        console.log("Mongodb Connection Successfully...")
    }catch(err){
        console.log("Mongodb Connection Refused")
    }
}
module.exports = connection