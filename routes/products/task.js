var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("../settings/cors");
const Tasks = require("../../models/tasks");

router.use(bodyParser.json());

/* GET users listing. */

router.options('/', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
//  console.log("may br ptrcheck");
})
.get('/',cors.cors, function(req, res, next) {

 // console.log("req ", req.query);
  Tasks.find(req.query)
  .then(
    task => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(task);
    },
    err => next(err)
  )
  .catch(err => next(err));
})

.post('/',cors.corsWithOptions,
  async ( req, res, next) => {
  //  console.log("statu4", mongoose.connection.readyState);

    
  //  console.log(req.body);
    const result = await Tasks.findOne({email: req.body.email, sub: req.body.sub}).lean();
   // console.log("result ", result)
    
    

if (result) {
    // update credentials...
   // console.log("id ",result._id);
    //Intelli.findOneAndUpdate({_id: result._id},{$set: req.body},{new:true})
    Tasks.updateOne(result, req.body)
    .then(
      task => {
       // console.log("creds Updated ", task);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(task);
      },
      err => next(err)
    )
    .catch(err => next(err));
}
  else {
  Tasks.create(req.body)
      .then(
        task => {
    //      console.log("taksk Created ", task);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(task);
        },
        err => next(err)
      )
      .catch(err => next(err));
       }
      }
    
  
)

module.exports = router;
