const axios = require('axios');


const getlicence =async (awurl, awencoded, apikey, lgid) => {

const url = `${awurl}/api/system/users/enrolleddevices/search`;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${awencoded}`,
 'aw-tenant-code': `${apikey}`
 
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
  console.log("admins all",devices);
  console.log("devices ", devices.data.EnrolledDeviceInfoList);
  console.log("devices length", devices.data.EnrolledDeviceInfoList.length);
  
  
  
  
}
catch(err){
  console.log("deer ",err)
  if(err.toString().includes("ENOTFOUND") || err.response.status >= 404 ){
    console.log("Server not responding, check in seetings if it is not mispelled")
    
  }

}

}

getlicence("https://as137.awmdm.com","aW50ZWxsaWFtOmRhbm9uZTEy","zMj+ul/8tDRG7HVdnOPP2M5Q8HGxuhdB8J3Sy5/pgjM=",'5215')