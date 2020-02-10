
var axios = require('axios');



module.exports = {




    getToken: async (region, oauth) => {

     //   console.log("start getting token");
        const url = `https://auth.${region}.data.vmwservices.com/oauth/token?grant_type=client_credentials`;
       
      //    console.log("authorization: ",`Basic ${oauth}`)
          try {
          const jwt = await axios.post(url,null,
              {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${oauth}` }
              }); 
         // console.log("author: ",jwt)
              return jwt;
          }catch(err){
          //    console.log("error from catch454545 ", err )
              return(err.response.status);
           //  return(err);
          }
        },


    searchReport: async (region, jwt) => {

    
   const url = `https://api.${region}.data.vmwservices.com/v1/reports/search`;
console.log("intelligence url", url);
   const data =  {
     "page_size": 1000,
     "offset": 0
   }
   try {
   const reporting = await axios.post(url,data,
     {
       headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${jwt}` }
     }); 
  //  console.log(reporting.data.data.results);
     return reporting;
    } catch(err){
        console.log("error from catch od search reports", err )
        return err.response.statusText;
    }
 },

  

  reportDownload: async (region, jwt, reportId) => {

    
    const url = `https://api.${region}.data.vmwservices.com/v1/reports/${reportId}/downloads/search`;
  // console.log("seacgh download url ", url);
    const data =  {
      "page_size": 1000,
      "offset": 0
    }
    try {
    const linkAvail = await axios.post(url,data,
      {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` }
      }); 
     // console.log("link fro mserver ",linkAvail.data.data.results);
      return linkAvail.data.data.results;
    } catch(err){
        console.log("error from catch download", err )
    }
  },

 
  grepLinkReport: async (region, jwt, id) => {

    
    const url = `https://api.${region}.data.vmwservices.com/v1/reports/tracking/${id}/download`;
    
    try {
    const linkAvail = await axios.get(url,
      {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` },
            maxRedirects: 0,
            validateStatus: null

      }); 
      //console.log("link fro mserver ",linkAvail.headers.location);
      return linkAvail.headers.location;
    } catch(err){

       // console.log("error from catch download", err )
    }
  },

  grepLinkReport2: async (region, jwt, id) => {

    
    const url = `https://api.${region}.data.vmwservices.com/v1/reports/tracking/${id}/download`;
    
    try {
    const linkAvail = await axios.get(url,
      {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` },
            maxRedirects: 0,
            validateStatus: null

      })
      
      ; 
      //console.log("link fro mserver ",linkAvail.headers.location);
      
      return linkAvail.headers.location;
    } catch(err){
       // console.log("error from catch download", err )
    }
  }

  
  
}

