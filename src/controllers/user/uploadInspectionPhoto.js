const multer = require('multer')
const path = require('path');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/")
//     },
//     filename: function (req, file, cb) {
//         let ext = path.extname(file.originalname)
//         cb(null, Date.now() + ext)
//     }
// });

// const uploadMat = multer({ storage: storage });
// module.exports = uploadMat



//IMAGE STORAGE
const Storage = multer.diskStorage({
    destination : function(req, file, cb) {
        if(file.fieldname === 'inspect[photo1]'){
        cb(null, "./src/Images/uploadInspectionPhoto/")
    }else if(file.fieldname === 'inspect[photo2]'){
        cb(null, "./src/Images/uploadInspectionPhoto2/")
    }},
    filename : function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
    })

const upload = multer({
    storage : Storage,
    fileFilter : function(req, file, callback) {
        if(
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"
            
        ){
            callback(null, true)
        }else {
            console.log("only jpg, jpeg and png file supported!")
            callback (null, false)
        }
    },
    
}).array("inspect[photo1]")
// const multipleUpload = upload.fields([{name:'inspect[photo1]', maxCount:1},{name:'inspect[photo2]', maxCount:1}])

module.exports = upload


// const Storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, "./src/Images/uploadInspectionPhoto/")},
//     filename: (req, file, cb) => { cb(null, file.originalname) }, })

// const ImageFilter = (req, file, cb) => {
//         if ( file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
//         cb(null, true) } else { cb(null, false)}
//         }

// const uploadHandler = multer({ storage: Storage, fileFilter: ImageFilter })
// module.exports = uploadHandler