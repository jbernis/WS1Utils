var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("./cors");
const Intelli = require("../../models/intelli");

router.use(bodyParser.json());

/* GET users listing. */

router.options('/', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
  console.log("may br ptrcheck");
})
.get('/',cors.cors, function(req, res, next) {

  console.log("req ", req.query);
  Intelli.find(req.query)
  .then(
    intellis => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(intellis);
    },
    err => next(err)
  )
  .catch(err => next(err));
})

.post('/',cors.corsWithOptions,
  async ( req, res, next) => {
    console.log("statu4", mongoose.connection.readyState);

    
    console.log(req.body);
    const result = await Intelli.findOne({email: req.body.email, sub: req.body.sub}).lean();
    console.log("result ", result)
    
    

if (result) {
    // update credentials...
    console.log("id ",result._id);
    //Intelli.findOneAndUpdate({_id: result._id},{$set: req.body},{new:true})
    Intelli.updateOne(result, req.body)
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
  Intelli.create(req.body)
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
