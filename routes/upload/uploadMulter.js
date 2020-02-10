var express = require('express');
var router = express.Router();
const util = require("util");
const fs = require("fs");
const path = require("path");

//const uniqueString = require("unique-string");
const cors = require("../settings/cors");
//const readDir = util.promisify(fs.readdir);
var multer = require("multer");

/* GET users listing. */
router.get('/', cors.cors, function(req, res, next) {
  res.send('respond with a resource');
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    fs.mkdir('./uploads', function(err) {
        if(err) {
            console.log(err.stack)
        } else {
            callback(null, './uploads');
        }
    })
  },
  filename: function(req, file, cb) {
    // this overwrites the default multer renaming callback
    // and simply saves the file as it is
    cb(null, file.originalname + path.extname(file.originalname))
}
});

router.post('/', cors.corsWithOptions, function(req,res){
    var upload = multer({ storage : storage}).single('userFile');
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


module.exports = router;
