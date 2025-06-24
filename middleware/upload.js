const path = require('path');
const multer = require('multer');

// configure stotage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});


// File type filter (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|pdf|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if(extname && mimetype){
        cb(null, true);
    }
    else{
        cb(new Error('Only png, jpeg, jpg, pdf files are allowed'))
    }
}

const upload = multer({
    storage,
    limits:{
        fileSize: 1 * 1024 * 1024, // Limit 30 MB
        files: 1
    },
    fileFilter
});


module.exports = upload;