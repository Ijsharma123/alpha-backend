const Image = require("../../models/user/imagetest")
const express = require("express")
const app = express()
const Multer = require("multer")
var fs = require('fs');
const { Storage } = require("@google-cloud/storage");
var path = require('path');
const src = path.join(__dirname, "views");
app.use(express.static(src));


// exports.ImageTest = async function ImageTest(req, res){
//         try{
//             const Img = new Image({
//                 Image:req.file.path
//           })
//             Img.save()
//             return res.status(200).json({msg:Img})
//         }catch(err){
//             return res.status(401).json({msg:err.message})
//         }
// }


// exports.Imageget = async function Imageget(req,res){
//         try{
//             const neImg = await Image.find()
//             return res.status(200).json({neImg}) 
//         }catch(err){
//             return res.status(401).json({neImg})
//         }
// } 


const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});


let projectId = "trusty-fuze-369409"; // Get this from Google Cloud
let keyFilename = "mykey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("alpha-bucket-2247"); // Get this from Google Cloud -> Storage

// Gets all files in the defined bucket
app.get("/upload", async (req, res) => {
// exports.ImageGet = async function ImageGet(req,res){
  try {
    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});
// Streams file upload to Google Storage
app.post("/", multer.single("imgfile"), (req, res) => {
// exports.uploadImage = async function uploadImage(req,res){
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");
        console.log("Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get the main index html file
app.get("/", (req, res) => {
// exports.image = async function Image(req,res){
  res.sendFile(__dirname + "/src/controllers/user/index.html");
});