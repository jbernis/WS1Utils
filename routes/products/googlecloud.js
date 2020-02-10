var express = require('express');
var router = express.Router();
const cors = require("../settings/cors");
const Google = require("../../models/google");
var axios = require('axios');
const jsonfile = require('jsonfile');
const {Storage} = require('@google-cloud/storage');
const pathadd = require('path');


router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
    console.log("may br ptrcheck");
  })

 .get('/',cors.cors, function(req, res, next) {
    res.send('API is working properly');
})



.post('/testcreds', cors.corsWithOptions, async (req, res, next) => {
    console.log("test", req.body);
    const sub =req.body.sub;
    const bucket = req.body.bucket;
    const dirPath = pathadd.join(process.cwd(), '/certificates');
    

    const file = `${dirPath}/${sub}/googlecredentials.json`
    console.log("file ", file)
    let googleObject = jsonfile.readFileSync(file);
  
  
if (googleObject.project_id) {
console.log("projectId  from above", googleObject.project_id);
const gc = new Storage({
  projectId: googleObject.project_id,
  keyFilename: file
});

let allBuckets = []
gc.getBuckets()
  .then(results => {
    const buckets = results[0];
buckets.forEach(bucket => {
  allBuckets.push(bucket.name)
      
    }
    );
    console.log("allBuckets low", allBuckets)
    if(allBuckets.includes(bucket)) {console.log("tihs is a sucess") 
  res.send(googleObject.project_id)
  }else {console.log("tihs is not")
    res.send("false")}

  })
  .catch(err => {
    console.error('ERROR:', err);
    res.send("false")
  });
}

else res.send("false")
           
  })

  
  
  



module.exports = router;