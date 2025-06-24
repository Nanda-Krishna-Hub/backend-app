const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();
const auth = require('../middleware/auth');
const path = require('path')
const app = express();

// Call to upload the file.
router.post('/upload', auth, upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).json('No file uploaded');
    }
    return res.status(200).json({
        message: 'File uploaded successfully',
        filepath: req.file.path,
        originalname: req.file.originalname,
        type: req.file.mimetype
    })
})

//Call to download the file
router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, "..",'uploads', req.params.filename);
    console.log(filePath)
    res.download(filePath, (err) => {
        if(err)
            return res.status(404).json({message: 'File not found'});
    })
})

// Error handling middleware. (will be called automatically without passing any where. called after all the upload routes.)
router.use((err, req, res, next) => {
    if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(400).json({message: 'File exceeds size limit of 2MB.'});
    }
    if(err.code === 'LIMIT_FILE_COUNT'){
        return res.status(400).json({message: 'File upload limit exceeds i.e: 1'});
    }
    return res.status(500).json({message: 'Upload error', error: err.message})
});


module.exports = router;