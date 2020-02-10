var express = require('express');
var router = express.Router();
var call = require('../../apiCallMicrosoft.js');
const cors = require("../settings/cors");
const Datalakes = require("../../models/midatalakes");



router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
    console.log("may br ptrcheck");
  });

router.get('/',cors.cors, function(req, res, next) {
    res.send('API is working properly from microsoft');
});


router.post('/getToken2',cors.corsWithOptions, async (req, res, next) => {
 //   const product = req.query.product;
 //   const email = req.query.email;
//    const sub = req.query.sub;

    //const product = req.body.product;
    const email = req.body.email;
    const sub = req.body.sub;
   
   //  console.log("db search ",Datalake1.findOne( { product: product} ));
    var auth = Datalakes.findOne( { email: email, sub: sub}, async (err, data) =>{
        
          console.log("data from database", data)
        
        //  console.log("my request",req);
           try {
           // res.json(data);
            const token = await call.getToken(data.tenantid, data.clientid, data.secret);
       // console.log("token : ", token);
         if(token.toString().startsWith('40')) {
              console.log("tken has been sent: ", token);
              res.json(`mafautestgrande${token}`)
          } else {
              //console.log("token ",token)
              res.json(token.data.access_token);
      
             } 
          }catch(err){
                 console.log("is ir iccoming ",err)
              }
            }
            
            )

           
        
    });


    router.post('/tesToken',cors.corsWithOptions, async (req, res, next) => {
        
       
           
           const tenantid = req.body.tenantid;
           const clientid = req.body.clientid;
           const secret = req.body.secret;
         console.log(req.body)
                  try {
                  
                   const token = await call.getToken(tenantid, clientid, secret);
            
                if(token.toString().startsWith('40')) {
                     console.log("tken has been sent: ", token);
                     res.json(`mafautestgrande${token}`)
                 } else {
                     console.log("testTken ", token.data.access_token)
                     res.json(token.data.access_token);
             
                    } 
                 }catch(err){
                        console.log("is ir iccoming ",err)
                     }
           
           });


           router.post('/testAccount',cors.corsWithOptions, async (req, res, next) => {
        
       
           
            const datalake = req.body.datalake;
            const jwt = req.body.jwt;
            
          console.log(req.body)
                   try {
                   
                    const account = await call.testAccount(datalake, jwt);
             
                 if(account.toString().startsWith('wrong')) {
                      console.log("tken has been sent: ");
                      res.send(`mafautestgrande`)
                  } else {
                      console.log("testTken ", account.data)
                      res.json(account.data);
              
                     } 
                  }catch(err){
                         console.log("is ir iccoming ",err)
                      }
            
            });


           router.post('/tesBlob',cors.corsWithOptions, async (req, res, next) => {
        
       
           
            const connectString = req.body.connectString;
           
          console.log(req.body)
                   try {
                   
                    const token = await call.testBlobService(connectString);
             
                 
                      console.log("testTken ", token)
                      res.json(token);
              
                      
                  }catch(err){
                         console.log("is ir iccoming ",err)
                         res.send(err);
                      }
            
            });
 


    

router.post('/test',cors.corsWithOptions, function(req, res) {
    var token = req.body.token;

 res.send(token);
});


module.exports = router;