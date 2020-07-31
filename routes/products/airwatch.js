var express = require('express');
var router = express.Router();
const cors = require("../settings/cors");
const Airwatch = require("../../models/airwatch");
var axios = require('axios');


router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
    console.log("may br ptrcheck");
  });

router.get('/',cors.cors,  function(req, res, next) {
    res.send('API is working properly from microsoft');
});



router.post('/testcreds',cors.corsWithOptions, async (req, res, next) => {
  const awurl = req.body.awurl;
  const apikey = req.body.apikey;
  const awencoded = req.body.awencoded;
  const username = req.body.username;

  
  console.log("test", req.body);
   
    
    const url = `${awurl}/api/system/admins/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${awencoded}`,
     'aw-tenant-code': `${apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
sortorder: "ASC",
pagesize: '10000',
username

};

    try {
   const admins = await axios.get(url, 
     
      {  params,
        headers
      })

      if(admins.data){
      console.log("admins all", admins.data);
      console.log("admins ", admins.data.Admins.length)
      // console.log("admins ", admins.data.Admins.filter(admin => !admin.IsActiveDirectoryUser))
       
        res.json(admins.data.Admins);
      }
      
      else res.send("Server error, check your credentials")
    }
    catch(err){
      console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }      
})




router.post('/searchusers',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid
  
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    if (data) {
    const url = `${data.awurl}/api/system/users/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
pagesize: '1000000',
orderby: 'username',
LocationGroupId: lgid
};

    try {
   const users = await axios.get(url, 
     
      {  params,
        headers
      })
       console.log("is zpps ", users.data.Users);
        res.json(users.data.Users);
      
      
    }
    catch(err){
      console.log("is ir iccoming ",err)
   }
  } else res.send("Please56785678"); 
      
  })
})


router.post('/searchdeviceperuser',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const username = req.body.username;
  const lgid = req.body.lgid;

  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/mdm/devices/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=2'
}

const params =  {
user: username,
lgid
};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
       console.log("is zpps ", devices);
       if(devices.data)
        res.json(devices.data);
      else res.send("No device found for this User");
      
    }
    catch(err){
      console.log("is ir iccoming ",err.response.data.message)
     res.json(err.response.data.message);
   }
      
  })
})






router.post('/searchdevice',cors.corsWithOptions,  (req, res, next) => {
    const email = req.body.email;
    const sub = req.body.sub;
    const search = req.body.search;
    const id = req.body.id;
    Airwatch.findOne( { email: email, sub: sub}, async (err, data) =>{
        if(data){
        const url = ` ${data.awurl}/api/mdm/devices`;
        const url1 = ` ${data.awurl}/api/mdm/devices/network`;
        const url2 = `${data.awurl}/api/mdm/devices/apps`;
        const url3 = `${data.awurl}/api/mdm/devices/security`;
        const url4 = `${data.awurl}/api/mdm/devices/profiles`;
        const url5 = `${data.awurl}/api/mdm/devices/certificates`;
        const params =  {
          searchby: search,
          id
        };
      
        const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${data.awencoded}` ,
               'aw-tenant-code': `${data.apikey}`,
               'Accept':'application/json;version=1'
        }

        const promises = [
            await axios.get(url, 
         
                {  params,
                  headers
                }).catch(err => {

                //  console.log("deer ",err)
                  if(err.toString().includes("ENOTFOUND") ){
                    console.log("Error: Server not responding, check in settings if it is not mispelled")
                    res.send("Error: Server not responding or mispelled")
                  }
                  else if(err.response.statusText){
                    console.log('Error dev info: ', JSON.stringify(err.response.statusText));                    
                    res.send("Error: "+err.response.statusText)}

                  else{console.log("Server not responding or mispelled")
                    res.send("Error: Server not responding or mispelled")}

                  }   
                ),

             await axios.get(url1, 
         
                    {  params,
                      headers
                    }).catch(e => console.log('Error network: ', e.message)),
         
              await axios.get(url2, 
         
                      {  params,
                        headers
                      }).catch(e => console.log('Error app: ', e.message)),

                      await axios.get(url3, 
         
                        {  params,
                          headers
                        }).catch(e => console.log('Error security: ', e.message)),

                        await axios.get(url4, 
         
                          {  params,
                            headers
                          }).catch(e => console.log('Error profile: ', e.message)),
                          
                          await axios.get(url5, 
         
                            {  params,
                              headers
                            }).catch(e => console.log('Error profile: ', e.message)) 

        ];

        
        const awdevice = Promise.all(promises).then(data => {
            console.log("device", data.length);
            console.log("apps", data[2].data);
            console.log("security", data[3].data);
            console.log("profile", data[4].data);
            console.log("certificate", data[5].data);


          if (data[0])
            res.json([data[0].data,data[1].data,data[2].data,data[3].data, data[4].data]); 
        })
  
          .catch(err=>{
          console.log("is ir iccoming ",err.response.data)
          res.send("Error: "+err.response.data.message)
          }
          )
       } else res.send("Please56785678");
      } 
       )
  
    });


    router.post('/searchprofiles',cors.corsWithOptions,  (req, res, next) => {
      const email = req.body.email;
      const sub = req.body.sub;
      const platform = req.body.platform;
     // const apptype = req.body.type;
      const lgid = req.body.lgid;
      console.log(req.body);
      Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
        
        const url = `${data.awurl}/api/mdm/profiles/search`;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${data.awencoded}`,
         'aw-tenant-code': `${data.apikey}`
        
  }

  const params =  {
  //  applicationtype: apptype,
  //  type: "app",
    platform,
    locationgroupid: lgid,
    status: 'Active',
    includeandroidforwork: true
  };

        try {
       const profiles = await axios.get(url, 
         
          {  params,
            headers
          })
           console.log("is zpps ", profiles.data.Profiles);
            res.json(profiles.data.Profiles);
          
          
        }
        catch(err){
          console.log("is ir iccoming ",err)
       }
          
      })
    })


    router.post('/actionprofile',cors.corsWithOptions,  (req, res, next) => {
      const email = req.body.email;
      const sub = req.body.sub;
      const profileid = req.body.profileid;
      const action = req.body.action;
      const DeviceId = req.body.DeviceId;

      console.log(req.body);
      Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
        
        const url = `${data.awurl}/api/mdm/profiles/${profileid}/${action}`;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${data.awencoded}`,
         'aw-tenant-code': `${data.apikey}`,
         'Accept':'application/json;version=1'
  }

  const params =  {
    DeviceId
  };

        try {
       const act = await axios.post(url,params, 
         
          {  
            headers
          })
            console.log("is zpps ", act.status +' '+ act.statusText);
            res.send(act.status);
          
          
        }
        catch(err){
          console.log("is ir iccoming ",err.response.data)
          res.send(err.response.data.message)
       }
          
      })
    })



    router.post('/searchapps',cors.corsWithOptions,  (req, res, next) => {
      const email = req.body.email;
      const sub = req.body.sub;
      const platform = req.body.platform;
      const apptype = req.body.type;
      const lgid = req.body.lgid;
      console.log(req.body);
      Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
        
        const url = `${data.awurl}/api/mam/apps/search`;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${data.awencoded}`,
         'aw-tenant-code': `${data.apikey}`
  }

  const params =  {
    applicationtype: apptype,
    type: "app",
    platform,
    locationgroupid: lgid,
    status: 'Active'
  };

        try {
       const apps = await axios.get(url, 
         
          {  params,
            headers
          })
           console.log("is zpps ", apps);
            res.json(apps.data.Application);
          
          
        }
        catch(err){
          console.log("is ir iccoming ",err)
       }
          
      })
    })

    router.post('/actionapp',cors.corsWithOptions,  (req, res, next) => {
      const email = req.body.email;
      const sub = req.body.sub;
      const appid = req.body.appid;
      const apptype = req.body.type;
      const action = req.body.action;
      const DeviceId = req.body.DeviceId;

      console.log(req.body);
      Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
        
        const url = `${data.awurl}/api/mam/apps/${apptype}/${appid}/${action}`;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${data.awencoded}`,
         'aw-tenant-code': `${data.apikey}`
  }

  const params =  {
    DeviceId
  };

        try {
       const act = await axios.post(url,params, 
         
          {  
            headers
          })
            console.log("is zpps ", act.status +' '+ act.statusText);
            res.send(act.status);
          
          
        }
        catch(err){
          console.log("is ir iccoming ",err.response.data)
          res.send(err.response.data.message)
       }
          
      })
    })


    

    router.post('/assignsmapp', cors.corsWithOptions,  (req, res, next) => {

      const email = req.body.email;
      const sub = req.body.sub;
      const gid = req.body.gid;
      const appid = req.body.appid;
      const DeviceId = req.body.DeviceId;
      const type = req.body.type;
      console.log(req.body);
      
     
      Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{

        const url0 = `${data.awurl}/api//mdm/smartgroups/search`;
        const url1 = `${data.awurl}/api//mdm/smartgroups`;
      
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${data.awencoded}`,
         'aw-tenant-code': `${data.apikey}`
  }

  const params =  {
    "name" : "dummy-sm-"+DeviceId
  };

  

  try {
    console.log("sm when sm created ");
  const sm = await axios.get(url0, 
         
    {  params,
      headers
    }
    
    ).then(async sm =>{
      if (sm.data && sm.data.SmartGroups[0].Name===`dummy-sm-${DeviceId}`) {

        
        console.log("sm when sm created ", sm.data.SmartGroups[0].SmartGroupID);
        const url2 = `${data.awurl}/api/mam/apps/${type}/${appid}/smartgroups/${sm.data.SmartGroups[0].SmartGroupID}`;
        console.log("urlwhen sm created ", url2);
      let sm1 =  await axios.post(url2, null,
          {  
            headers
          })
         console.log("sm1 ", sm1.status)
         res.send(sm1.status);
     
     
      }
      else {
        const params =  {
          "Name" : "dummy-sm-"+DeviceId, 
          "ManagedByOrganizationGroupId": gid,
          "DeviceAdditions":[{
                               "Id":DeviceId }]
      
           };
         
           try {
             console.log("sm not created");
            await axios.post(url1, params,
            
             {  
               headers
             }).then(async sm => {console.log("sm when sm not created", sm.data.Value)
             const url2 = `${data.awurl}/api/mam/apps/${type}/${appid}/smartgroups/${sm.data.Value}`;
           let sm1 =  await axios.post(url2, null,
               {  
                 headers
               })
              console.log("sm1 not created ", sm1.status)
              res.send(sm1.status);
           })
              
           }
           catch(err){
             console.log("is ir iccoming ",err)
          }

      }
    })
   
    }

  catch(err){
    console.log("is ir iccoming ",err)
 }

     })
  })


  router.post('/searchadmins',cors.corsWithOptions,  (req, res, next) => {
    const email = req.body.email;
    const sub = req.body.sub;
    
    console.log(req.body);
    Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
      if(data){
      const url = `${data.awurl}/api/system/admins/search`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${data.awencoded}`,
       'aw-tenant-code': `${data.apikey}`,
       'Accept':'application/json;version=1'
}

const params =  {
 sortorder: "ASC",
 pagesize: '10000'
 
};

      try {
     const admins = await axios.get(url, 
       
        {  params,
          headers
        })
       // console.log("admins all", admins.data);
        console.log("admins ", admins.data.Admins.length)
        // console.log("admins ", admins.data.Admins.filter(admin => !admin.IsActiveDirectoryUser))
         console.log("admins okta", admins.data.Admins.filter(admin => admin.UserName==='oktapi'))
          res.json(admins.data.Admins.filter(admin => !admin.IsActiveDirectoryUser));
        
        
      }
      catch(err){
        console.log("deer ",err)
        if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
          console.log("Server not responding, check in seetings if it is not mispelled")
          res.send("Server not responding or mispelled")
        }
        else if(err.response.data){
        console.log("is ir iccoming ",err.response.data.message)
        res.send(err.response.data.message)}
        else{console.log("Server not responding or mispelled")
          res.send("Server not responding or mispelled")}
     }
    }
     else res.send("Please56785678"); 
    })
  })


router.post('/changepass',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const adminid = req.body.adminid;
  const pass = req.body.pass;
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/system/admins/${adminid}/changepassword`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
  Password: pass,
  "RequiresPasswordChange":false }

    try {
   const change = await axios.post(url, params,
     
      {  
        headers
      })
        console.log("is zpps ", change.statusText);
        res.json(change.statusText);
      
      
    }
    catch(err){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message);
   }
      
  })
})


router.post('/test',cors.corsWithOptions, function(req, res) {
  var token = req.body.token;

res.send(token);
});


router.post('/searchog',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    console.log("data", data)
    if(data){
    const url = `${data.awurl}/api/system/groups/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
sortorder: "ASC",
pagesize: '10000'
};

    try {
   const og = await axios.get(url, 
     
      {  params,
        headers
      })
      //console.log("og all", og.data);
     
      // console.log("admins ", admins.data.Admins.filter(admin => !admin.IsActiveDirectoryUser))
       
        res.json(og.data.LocationGroups);
      //res.json(og.data.OrganizationGroups); with 'Accept':'application/json;version=2'
      
    }
    catch(err){
      //console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }
  }
  else res.send("Please56785678"); 
  })
})


router.post('/searchlgid',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    if(data){
    const url = `${data.awurl}/api/system/groups/${lgid}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
sortorder: "ASC",
pagesize: '10000'
};

    try {
   const lg = await axios.get(url, 
     
      {  params,
        headers
      })
      console.log("lg all", lg.data);
     
       
        res.json(lg.data);
      
      
    }
    catch(err){
      //console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }
  }else res.send("Please56785678");
      
  })
})


//licenses workflow

router.post('/searchdeviceperog',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;

  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/system/users/enrolleddevices/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
  organizationgroupid: lgid
};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
       console.log("is zpps ", devices);
        res.json(devices.data);
      
      
    }
    catch(err){
      console.log("is ir iccoming ",err)
   }
      
  })
})


router.post('/getappid',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;
  const bundleid = req.body.bundleid
  
  console.log("this is input ",req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/mam/apps/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

const params =  {
  locationgroupid: lgid,
  bundleid,
  status: "Active",
  applicationtype: "Public"
  
};

    try {
   const appid = await axios.get(url, 
     
      {  params,
        headers
      })
       console.log("is zpps ", appid.data);
        res.json(appid.data);
      
      
    }
    catch(err){
      console.log("is ir iccoming ",err)
   }
      
  })
})


router.post('/searchdeviceperapp',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;
  const applicationid = req.body.appid
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/mam/apps/public/${applicationid}/devices`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}

console.log("URL BOXER ", url)

const params =  {
  organizationgroupid: lgid,
  status: "installed",
  pagesize: "100000"
  
};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
     //  console.log("devices error ", devices.Application);
        res.json(devices.data);
      
      
    }
    catch(err){
      console.log("is ir iccoming ",err)
     // console.log("is ir iccoming ",err.response.data.errorCode)
    //res.json([])
   }
      
  })
})


router.post('/searchtelecomdev',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;
 
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    
    const url = `${data.awurl}/api/mdm/telecom/devices/bulkusagehistory`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=1'
}



const params =  {
  organizationgroupid: lgid,
  pagesize:"100000"
};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
       console.log("telecom ", devices);
        res.json(devices.data);
      
      
    }
    catch(err){
      console.log("is ir telecom ",err.response.data)
     if(err.response.data.errorCode == "5030") res.send({data: [3000, 4000, 10389]});
   }
      
  })
})


router.post('/searchdevperog',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;
  
  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    if(data){
    const url = `${data.awurl}/api/system/users/enrolleddevices/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`
     
}

const params =  {
organizationgroupid: lgid,
pagesize: '50000'

};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
     // console.log("admins all", admins.data);
     if(devices.data){
      console.log("devices ", devices.data.EnrolledDeviceInfoList);
      console.log("devices length", devices.data.EnrolledDeviceInfoList.length);
      res.json(devices.data.EnrolledDeviceInfoList);
     }
     else res.json([]);
      /* console.log("admins okta", admins.data.Admins.filter(admin => admin.UserName==='oktapi'))
        res.json(admins.data.Admins.filter(admin => !admin.IsActiveDirectoryUser));
      */
      
    }
    catch(err){
      console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }
  }
   else res.send("Please56785678"); 
  })
})


router.post('/searchalldevicesperog',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;

  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    if(data){
    const url = `${data.awurl}/api/mdm/devices/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=2'
}

const params =  {
  sortorder: "ASC",
  pagesize: '10000000',
lgid

};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
      console.log("devices all", devices.data);
    //  console.log("devices ", devices.data.Devices.length)   
    if(devices.data)  res.json(devices.data.Devices)
    
      else res.json([])
    }

    catch(err){
      console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }
  }
   else res.send("Please56785678"); 
  })
})


router.post('/searchallipperog',cors.corsWithOptions,  (req, res, next) => {
  const email = req.body.email;
  const sub = req.body.sub;
  const lgid = req.body.lgid;

  console.log(req.body);
  Airwatch.findOne({ email: email, sub: sub}, async (err, data) =>{
    if(data){
    const url = `${data.awurl}/api/mdm/devices/litesearch`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${data.awencoded}`,
     'aw-tenant-code': `${data.apikey}`,
     'Accept':'application/json;version=2'
}

const params =  {
  sortorder: "ASC",
  pagesize: '10000000',
lgid

};

    try {
   const devices = await axios.get(url, 
     
      {  params,
        headers
      })
      console.log("devices all", devices.data);
    //  console.log("devices ", devices.data.Devices.length)   
    if(devices.data)  res.json(devices.data.Devices)
    
      else res.json([])
    }

    catch(err){
      console.log("deer ",err)
      if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
        console.log("Server not responding, check in seetings if it is not mispelled")
        res.send("Server not responding or mispelled")
      }
      else if(err.response.data){
      console.log("is ir iccoming ",err.response.data.message)
      res.send(err.response.data.message)}
      else{console.log("Server not responding or mispelled")
        res.send("Server not responding or mispelled")}
   }
  }
   else res.send("Please56785678"); 
  })
})



module.exports = router;