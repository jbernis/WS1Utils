
var express = require('express');
var router = express.Router();
var call = require('../../apiCallVmware.js');
const Google = require("../../models/google");
const cors = require("../settings/cors");
const Intelli = require("../../models/intelli");
const Datalakes = require("../../models/midatalakes");
const fs = require('fs');
const got = require('got');
const callMi = require('../../apiCallMicrosoft');
const rm = require('rimraf');
const mkdirp = require('mkdirp');
const axios = require('axios');
const checkJwt = require("../settings/auth0token")
const {Storage} = require('@google-cloud/storage');
const pathadd = require('path');



router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);

  console.log("may br ptrcheck");
  });

router.get('/',cors.cors, function(req, res, next) {
    res.send('API is working properly');
});

router.post('/job',cors.corsWithOptions, async (req, res, next) => {
 
    
  const name = req.body.data.name;
  const urlapi = req.body.data.urlapi;
  //console.log("body ",req.body);
  const url = 'http://127.0.0.1:4040/api/job';

  const data = {
      name,
      url:urlapi   
  }

  //console.log("data ",data);
  try {
  const job = await axios.post(url,data); 
  console.log("post job", job.status)
  res.json({"status":job.status})
  }catch(err){
    res.send(err)
      console.log("err from post ",err); 
      }
});

router.post('/job/run',cors.corsWithOptions,checkJwt, async (req, res, next) => {
 
    
  const name = req.body.data.name;
  const interval = req.body.data.interval;
  const email = req.body.data.email;
  const sub = req.body.data.sub;
  

  
  console.log("body start tintetval ",interval);
  const url = 'http://127.0.0.1:4040/api/job/every';



  const data = {
      name,
      interval,
      "data":{
        "body":{email,
             sub}
           ,
        "params" :
        {},

          "query" :
          {},
       }
       
        }
 
  //console.log("data ",data);
  try {
  const job = await axios.post(url,data); 
console.log("from run", job.status)
  res.json(job.status);

  }catch(err){
      console.log("erreur from start ", err.status); 
      res.json(err.status);
      }
});


router.post('/job/cancel',cors.corsWithOptions,checkJwt, async (req, res, next) => {
 
    
  const name = req.body.data.name;
  
  console.log("body  from cancel",req.body);
  const url = 'http://127.0.0.1:4040/api/job/cancel';

  const data = {
      name 
  }

  //console.log("data ",data);
  try {
  const job = await axios.post(url,data); 
  console.log("from cancel", job.status);
  res.json(job.status);
  }catch(err){
    console.log("erreru from cancel ", err.status); 
    res.json(err.status);
      
      }
});

router.post('/job/delete',cors.corsWithOptions, checkJwt, async (req, res, next) => {
 
    
  const name = req.body.data.name;
  
  console.log("body from delete ",req.body);
  const url = `http://127.0.0.1:4040/api/job/${name}`;

  try {
  const job = await axios.delete(url);
  console.log("delete job", job.status)
  res.json({"status":job.status})
  }catch(err){
    console.log("erreru from delete ", err.status); 
    res.json(err.status);
      }
});



router.post('/genv1',cors.corsWithOptions, async (req, res, next) => {
 
    
const email = req.body.email;
const sub = req.body.sub;
console.log("email1 ", req.body.email);


const path = "files/"+email.split('@')[0];
if (fs.existsSync(path)) rm.sync(path);
 mkdirp.sync(path); 


 const compare =  (arr1, arr2) => {
  const final = [];
  arr1.forEach((e1,i1)=>arr2.forEach((e2)=>
                            
                   {
      if(e1 === e2){
          final.push(i1)} 
      
      }
           ))
 return final; 
}

const filternew = (arr1, indexarr) => { return arr1.filter((item, i) =>  !indexarr.includes(i))}

 

var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
      
  const token = await call.getToken(data.region, data.encoded);
  const reportList = await call.searchReport( data.region, token.data.access_token);
  const allReports =  reportList.data.data.results.map( el => { return {name: el.name, id: el.id, scheduled: el.total_schedules}} );  
  const allReportsScheduled = allReports.filter(item => item.scheduled > 0);
  const detailsReports = await Promise.all(allReportsScheduled.map(async item => await call.reportDownload(data.region,token.data.access_token ,item.id)))
  const lastReports = detailsReports.map(item => item.filter(i => i.status === "COMPLETED").reduce(function (a, b) { return a.created_at > b.created_at  ? a : b; })) 

  const links = await Promise.all(lastReports.map(async item => await call.grepLinkReport2(data.region, token.data.access_token, item.id)));
  console.log("links from schedule api", links)


        
            
                  Datalakes.findOne( { email: email, sub: sub}, async (err, dataMi) =>{
                    
        const tokenMi = await callMi.getToken(dataMi.tenantid, dataMi.clientid, dataMi.secret);
        const mifiles = await callMi.testAccount(dataMi.repname, tokenMi.data.access_token);
      // console.log("mifiles ", mifiles.data.FileStatuses)
     //  console.log("mifiles2 ", mifiles.data.FileStatuses.FileStatus)
     const existingfiles =  mifiles.data.FileStatuses.FileStatus.filter(item => item.type === 'FILE').map( item => {
      const { pathSuffix } = item;
      return  pathSuffix
     }
    );

    const filesfromlinks = links.map(item => {
      var filename = item.split('/').pop().split('?')[0];
  console.log("filename ", filename)
      return filename;
})
    const finalindexlinks = compare(filesfromlinks, existingfiles); 

    const newlinks = filternew(links, finalindexlinks);
    console.log("newlinks ", newlinks);



        newlinks.map(item => {
          var filename = item.split('/').pop().split('?')[0];
          const pathfile = path+'/'+filename;
                console.log("api link has been called ", pathfile );
       
        const dl = got.stream(item).pipe(fs.createWriteStream(pathfile));
         
                dl.on('finish', () => {  
                     console.log('done');     
                     callMi.sendFiles(tokenMi.data.access_token, dataMi.repname, filename, pathfile)
                      .then( data => {
                          fs.unlink(pathfile, (err) => {
                                                         if (err) {
                                                                  console.error(" file deleted ", err)
                                                                }                                                  
                                                         })                   
                                 return data;
                         })    
                     
                   })
                  
                });  
              
        }
        )
   
       console.log("my reports from server: transfer OK" );
      res.json("transfer OK");

       
      }
        
        );

    });



    router.post('/genv2',cors.corsWithOptions, async (req, res, next) => {
 
    
        const email = req.body.email;
        const sub = req.body.sub;
        console.log("email ", req.body.email);
        const path = "files/"+email.split('@')[0];
         if (fs.existsSync(path)) rm.sync(path);
         mkdirp.sync(path); 
        
        var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
                
          const token = await call.getToken(data.region, data.encoded);
          const reportList = await call.searchReport( data.region, token.data.access_token);
          const allReports =  reportList.data.data.results.map( el => { return {name: el.name, id: el.id, scheduled: el.total_schedules}} );  
          const allReportsScheduled = allReports.filter(item => item.scheduled > 0);
          const detailsReports = await Promise.all(allReportsScheduled.map(async item => await call.reportDownload(data.region,token.data.access_token ,item.id)))
          const lastReports = detailsReports.map(item => item.filter(i => i.status === "COMPLETED").reduce(function (a, b) { return a.created_at > b.created_at  ? a : b; })) 
          const links = await Promise.all(lastReports.map(async item => await call.grepLinkReport2(data.region, token.data.access_token, item.id)));
          
                links.map(item => {
                    var filename = item.split('/').pop().split('?')[0];
                    const pathfile = path+'/'+filename;
                     
                          Datalakes.findOne( { email: email, sub: sub}, async (err, dataMi) =>{
                            
                
                const dl = got.stream(item).pipe(fs.createWriteStream(pathfile));
            
                        dl.on('finish', () => {
                         
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
                             
                           })
                          
                        });  
        
                })
           
               console.log("my reports from server: transfer OK" );
              res.json("transfer OK");
        
                });

            });



            router.post('/genv3',cors.corsWithOptions, async (req, res, next) => {
 
    
              const email = req.body.email;
              const sub = req.body.sub;
              console.log("email ", req.body.email);
              const path = "files/"+email.split('@')[0];
               if (fs.existsSync(path)) rm.sync(path);
                mkdirp.sync(path); 
              
              var auth = Intelli.findOne( { email: email, sub: sub}, async (err, data) =>{
                      
                const token = await call.getToken(data.region, data.encoded);
                const reportList = await call.searchReport( data.region, token.data.access_token);
                const allReports =  reportList.data.data.results.map( el => { return {name: el.name, id: el.id, scheduled: el.total_schedules}} );  
                const allReportsScheduled = allReports.filter(item => item.scheduled > 0);
                const detailsReports = await Promise.all(allReportsScheduled.map(async item => await call.reportDownload(data.region,token.data.access_token ,item.id)))
                const lastReports = detailsReports.map(item => item.filter(i => i.status === "COMPLETED").reduce(function (a, b) { return a.created_at > b.created_at  ? a : b; })) 
                const links = await Promise.all(lastReports.map(async item => await call.grepLinkReport2(data.region, token.data.access_token, item.id)));
                
                      links.map(item => {
                          var filename = item.split('/').pop().split('?')[0];
                          const pathfile = path+'/'+filename;
                           
                                Google.findOne( { email: email, sub: sub}, async (err, data) =>{
                                  
                      
                      const dl = got.stream(item).pipe(fs.createWriteStream(pathfile));
                  
                              dl.on('finish', () => {
                               
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

                          

                                
                                   
                                 })
                                
                              });  
              
                      })
                 
                     console.log("my reports from server: transfer OK" );
                    res.json("transfer OK");
              
                      });
      
                  });




        module.exports = router;