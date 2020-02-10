var express = require('express');
var router = express.Router();
var call = require('../../apiCallVmware.js');

const cors = require("../settings/cors");
const Intelli = require("../../models/intelli");
const Datalakes = require("../../models/midatalakes");
const Google = require("../../models/google");
const fs = require('fs');
const got = require('got');
const callMi = require('../../apiCallMicrosoft');
const rm = require('rimraf');
const mkdirp = require('mkdirp');
const {Storage} = require('@google-cloud/storage');
const pathadd = require('path');



router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
    console.log("may br ptrcheck");
  });

router.get('/',cors.cors, function(req, res, next) {

    console.log('API is working properly');
    res.send('API is working properly');
});

router.post('/testcreds',cors.corsWithOptions, async (req, res, next) => {
    const region = req.body.region;
    const encoded = req.body.encoded;

    console.log("req ", req.body );
    
     
        
           try {
              const token = await call.getToken(region, encoded);
          //   console.log("my token", token.data.access_token);
       console.log("this is reuls ", token);
          if(token.toString().startsWith('40')) {
           //   console.log("tken has been sent: ", token);
              res.json(`mafautestgrande${token}`)
          } else {
              res.json(token.data.access_token);
      
             } 
          }catch(err){
                 console.log("is ir iccoming ",err)
                 res.send(err);
              }
           
        
    });


router.post('/getToken',cors.corsWithOptions, async (req, res, next) => {
    const email = req.body.email;
    const sub = req.body.sub;

    console.log("req ", req.body );
    
     
    var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
        
        if (data) {
        console.log("myauth ",data);
        //  console.log("my request",req);
           try {
              const token = await call.getToken(data.region, data.encoded);
          //   console.log("my token", token.data.access_token);
       //   console.log("this is reuls ", token);
          if(token.toString().startsWith('40')) {
              console.log("tken has been sent: ", token);
              res.json(`mafautestgrande${token}`)
          } else {
              res.json(token.data.access_token);
      
             } 
          }catch(err){
                 console.log("is ir iccoming ",err)
                 
              }

            }
            else res.send("Please56785678");
            })
    
    });

router.post('/searchReports',cors.corsWithOptions, async (req, res, next) => {
    var token = req.body.token;

   // const product = req.body.product;
    const email = req.body.email;
    const sub = req.body.sub;
    
    

     
    var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
        
        
    
 //  console.log("token from serrver ",token);
    try {
    const reportList = await call.searchReport( data.region, token);
//console.log("my reports from server: ",reportList.data.data.results);
 if(reportList.data){
    res.json(reportList.data.data.results);}
    else{console.log("from reportts send", reportList)
        res.json(reportList)}
    } catch(err){
        console.log("from reportts ", err)
        
    }
 })
});

  
    router.post('/reportDownload',cors.corsWithOptions, async (req, res, next) => {
        
        var token = req.body.token;
        var id = req.body.reportId;
        //const product = req.body.product;
        const email = req.body.email;
        const sub = req.body.sub;
      //  console.log("jwt from serrver ",req.body.token);
       // console.log("id from serrver ",req.body.reportId);
       var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
        
      

        try {
        const reportId = await call.reportDownload(data.region, token, id);
      //  console.log(" report id: ",reportId);
        res.json(reportId);
        } catch(err){
            //console.log(err)
           }

        })
        });


        router.post('/getLink',cors.corsWithOptions, async (req, res, next) => {
            var token = req.body.token;
            var id = req.body.id;
        const email = req.body.email;
        const sub = req.body.sub;
        var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
        
            try {
                console.log("api link has been called");
            const link= await call.grepLinkReport(data.region, token, id);
           // console.log(" link id111: ", link);
            res.json(link);
            } catch(err){
                console.log(err);
               }
            })
            });


            router.post('/getLink2',cors.corsWithOptions, async (req, res, next) => {
                var tokenMi = req.body.tokenMi;
                var token = req.body.token;
                var id = req.body.id;
            //    const product = req.body.product;
            const email = req.body.email;
            const sub = req.body.sub;


            const path = "files/"+email.split('@')[0];
             // if (fs.existsSync(path)) rm.sync(path);  //bad as looping
             if (!fs.existsSync(path)) mkdirp.sync(path);   


            
            var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
            
                try {
                    
                       
                    const link= await call.grepLinkReport2(data.region, token, id);
                    var filename = link.split('/').pop().split('?')[0];
                    
                    const pathfile = "files/"+path+'/'+filename;
                    console.log("api link has been called ", pathfile );
                    const dl = got.stream(link).pipe(fs.createWriteStream(pathfile))

                    Datalakes.findOne( { email: email, sub: sub}, async (err, dataMi) =>{

                    
                    dl.on('finish', response => {console.log(response)
                        console.log('done');
                        
                         callMi.sendFiles(tokenMi, dataMi.repname, filename, pathfile)
                        .then( data => {

                             fs.unlink(pathfile, (err) => {
                                                         if (err) {
                                                                  console.error(" file deleted ", err)
                                                                }                                                  
                                                         })                  
                                 return data;
                         }) 


                        res.json("from greplink2 "+link);
                    });
                });
                } catch(err){
                    console.log(err);
                   }
                })
                });

          
                router.post('/getLink3',cors.corsWithOptions, async (req, res, next) => {
                    var token = req.body.token;
                    var id = req.body.id;
                  //  const product = req.body.product;
                const email = req.body.email;
                const sub = req.body.sub;
                const path = "files/"+email.split('@')[0];
                if (!fs.existsSync(path)) mkdirp.sync(path);   
                 // if (fs.existsSync(path)) rm.sync(path);  //bad as looping
                var auth = Intelli.findOne( {  email: email, sub: sub}, async (err, data) =>{
                
                    try {
                        
                        
                        const link= await call.grepLinkReport2(data.region, token, id);
                        var filename = link.split('/').pop().split('?')[0];
                        
                        const pathfile = path+'/'+filename;
                        console.log("api link has been called ", pathfile );
                        const dl = got.stream(link).pipe(fs.createWriteStream(pathfile))
    
                        Datalakes.findOne( { email: email, sub: sub}, async (err, dataMi) =>{
    
                        console.log("file ", dl.path);
                        dl.on('finish', response => {console.log(response)
                            console.log('done');
                        
                             callMi.sendFilesv3(dataMi.azureconnectstring, dataMi.container, filename, pathfile).then((data)=>{
                                console.log(data);
                                fs.unlink(data.filename, (err) => {
                                                                    if (err) {
                                                                             console.error(" file deleted ", err)
                                                                           }                                                  
                                                                    })                   
                                            return data;
                            
                            }
                                )
                            res.json("from greplink2 "+link);
                        });
                    });
                    } catch(err){
                        console.log(err);
                       }
                    })
                    });



                    router.post('/getLink4',cors.corsWithOptions, async (req, res, next) => {
                        var token = req.body.token;
                        var id = req.body.id;
                      //  const product = req.body.product;
                    const email = req.body.email;
                    const sub = req.body.sub;
        
                    const path = "files/"+email.split('@')[0];
                   // if (fs.existsSync(path)) rm.sync(path);  //bad as looping
                   if (!fs.existsSync(path)) mkdirp.sync(path);  
                    var auth = Intelli.findOne( {  email: email, sub: sub}, async (err, data) =>{
                    
                        try {
                            
                               
                            const link= await call.grepLinkReport2(data.region, token, id);
                            var filename = link.split('/').pop().split('?')[0];
                            
                            const pathfile = path+'/'+filename;
                            console.log("api link has been called ", pathfile );
                            const dl = got.stream(link).pipe(fs.createWriteStream(pathfile))
        
                            Google.findOne( { email: email, sub: sub}, async (err, data) =>{
                            console.log(data);
                            console.log("file ", dl.path);
                            dl.on('finish', response => {
                              //  console.log(response);
                                console.log('done');
                            
                                const dirPath = pathadd.join(process.cwd(), '/certificates');
                                console.log("sub ", data.sub)
                               
                                const file = `${dirPath}/${data.sub}/googlecredentials.json`
                                console.log("file ", file)
                                const gc = new Storage({
                                    projectId: data.projectId,
                                    keyFilename: file
                                  });

                                  const bucket = gc.bucket(data.bucket);
                              
                                  const filegoogle = bucket.file(filename);
                                 const options =  {};
                                   bucket.upload(pathfile, options).then(() =>{

                                    fs.unlink(pathfile, (err) => {
                                                                        if (err) {
                                                                                 console.error(" file deleted ", err)
                                                                               }                                                  
                                                                        })  

                                   })

                          

                                res.json("from greplink2 "+link);
                            });
                        });
                        } catch(err){
                            console.log(err);
                           }
                        })
                        });
    
            
              
              
    

router.post('/test',cors.corsWithOptions, function(req, res) {
    var token = req.body.token;

 res.send(token);
});


module.exports = router;