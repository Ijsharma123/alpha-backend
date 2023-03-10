const Image = require("../../models/user/imagetest")
var fs = require('fs');
var path = require('path');


exports.ImageTest = async function ImageTest(req, res){
        try{
            const Img = new Image({
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            })
            Img.save()
            return res.status(200).json({msg:Img})
        }catch(err){
            return res.status(401).json({msg:err.message})
        }
}


exports.Imageget = async function Imageget(req,res){
        try{
            const neImg = await Image.find()
            return res.status(200).json({neImg}) 
        }catch(err){
            return res.status(401).json({neImg})
        }
} 