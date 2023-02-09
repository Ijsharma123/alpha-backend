require('dotenv').config();
const DBconnect = require("./src/config/database")
DBconnect()

const express = require("express")
const router = require('./api/product')
const app = express()
const PORT = process.env.PORT || 3000
app.use("/api", router)
app.listen(PORT, ()=> console.log(`server is running in port ${PORT}`))


//{
  
// "version": 2,
// "builds": [
//     { 
//         "src": "package.js",
//         "use": "@vercel/node"
//     }
// ],
// "routes":[
//     {
//         "src": "/(.*)",
//         "dest": "/"
//     }
// ]
// }



