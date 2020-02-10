var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
const util = require("util");
const fs = require("fs");
const pathadd = require("path");
const rm = require('rimraf');
const mkdirp = require('mkdirp');
const checkJwt = require("../settings/auth0token")


const cors = require("../settings/cors");
// default options
router.use(fileUpload());

router.options('/google', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
  console.log("may br ptrcheck");
})



router.post('/google', cors.corsWithOptions,checkJwt, (req, res) => {

    console.log("req ", req.params);
    console.log("req ", req.query);
    console.log("req ", req.body);
    const sub = req.body.sub;
    const dirPath = pathadd.join(process.cwd(), '/certificates');
    const path = `${dirPath}/${sub}`;
     console.log("path ", path)
    if (fs.existsSync(path)) rm.sync(path);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    console.log("sample ",sampleFile);
    if (!fs.existsSync(path)) mkdirp(path, function (err) {
      if (err) throw err;
      else {
        console.log('done');
         // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`${path}/googlecredentials.json`, function(err) {
      if (err)
      console.log("err", err);
       // return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
  
  }
    
    })
    
       
    
  });


module.exports = router;
