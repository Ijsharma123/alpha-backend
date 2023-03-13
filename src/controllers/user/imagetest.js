const Image = require("../../models/user/imagetest")
var fs = require('fs');
var path = require('path');


exports.ImageTest = async function ImageTest(req, res){
        try{
            const Img = new Image({
                // Image:req.file.path
                image :  loadImage(fs.readFileSync(__dirname 
                    + '/uploads'))
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