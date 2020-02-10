var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("./cors");
const Datalakes = require("../../models/midatalakes");

router.use(bodyParser.json());

/* GET users listing. */

router.options('/', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
  console.log("may br ptrcheck");
})
.get('/',cors.cors, function(req, res, next) {

  console.log("req ", req.query);
  Datalakes.find(req.query)
  .then(
    datalakes => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(datalakes);
    },
    err => next(err)
  )
  .catch(err => next(err));
})

.post('/',cors.corsWithOptions,
  async ( req, res, next) => {
    console.log("statu4", mongoose.connection.readyState);

    
    console.log(req.body);
    const result = await Datalakes.findOne({email: req.body.email, sub: req.body.sub}).lean();
    console.log("result ", result)
    
    

if (result) {
    // update credentials...
    console.log("id ",result._id);
    //Intelli.findOneAndUpdate({_id: result._id},{$set: req.body},{new:true})
    Datalakes.updateOne(result, req.body)
    .then(
      credentials => {
        console.log("creds Updated ", credentials);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(credentials);
      },
      err => next(err)
    )
    .catch(err => next(err));
}
  else {
    Datalakes.create(req.body)
      .then(
        credentials => {
          console.log("creds Created ", credentials);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(credentials);
        },
        err => next(err)
      )
      .catch(err => next(err));
       }
      }
    
  
)

module.exports = router;
