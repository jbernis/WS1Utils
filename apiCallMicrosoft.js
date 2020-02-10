
var axios = require('axios');
var qs = require('qs');
var fs = require('fs');
const FormData = require('form-data');
const azure = require('azure-storage');




module.exports = {

  testAccount: async (datalake, jwt) => {

    //    console.log("start getting token");
    //    console.log("datasend ",tenantid, client_id, client_secret)
        const url =  `https://${datalake}.azuredatalakestore.net/webhdfs/v1/?op=LISTSTATUS`
        
          //console.log("authorization: ",`Basictoto ${oauth}`)

       const headers= { 
          
            'Authorization': `Bearer ${jwt}`
            
          }
         
          try {
      
          const account = await axios.get(url,{headers}
       ); 
          console.log("response account", account)
              return account;
          }catch(err){
              console.log("error from catch454545 ", err.response )
              return("wrong"+err.response);
          }
        },



 



    getToken: async (tenantid, client_id, client_secret) => {

    //    console.log("start getting token");
    //    console.log("datasend ",tenantid, client_id, client_secret)
        const url =  `https://login.microsoftonline.com/${tenantid}/oauth2/token`
        
          //console.log("authorization: ",`Basictoto ${oauth}`)
          var data = {
            
            grant_type: 'client_credentials',
            resource: 'https://datalake.azure.net/',
            client_id: client_id,
            client_secret:client_secret
            
            };

            console.log("data: ", data)
          try {
      
          const jwt = await axios.post(url,qs.stringify(data),
       ); 
          
              return jwt;
          }catch(err){
            //  console.log("error from catch454545 ", err.response )
              return(err.response);
          }
        },


 

sendFiles: async (jwt, datalake, file, pathfile) => {

  
    
  const url = `https://${datalake}.azuredatalakestore.net/webhdfs/v1/${file}?op=CREATE`;
  
//console.log("Url from send ", url)
 // console.log("arguments: ", ...arguments);

 
 
/* const form = new FormData();
 form.maxDataSize = Infinity;
form.append(file, fs.createReadStream(pathfile) ); */

    let form = new FormData();
    let bufferedForm = fs.readFileSync(pathfile);
    form.append(file, bufferedForm);


/*await got.put(url,{ 
  method: "PUT",
  headers: { 
          
  'Authorization': `Bearer ${jwt}`
  
},
body: form

}); */

  try {

    axios.put(url, form,
      
    { headers: { 
          
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'multipart/form-data'
        
      },
      'maxRedirects': 1,
      'maxContentLength': Infinity, 
      'maxBodyLength': Infinity

      
        
        
  }
)
    .then(response => {console.log("from send ", response.status);
    return response.status
  })
    .catch(errors => {console.log("errors from send ",errors.status)
    return errors.status} );
  

  }
    
   catch(err){
    // console.log("error from catch download", err )
   //  return err
  } 

},

sendFilesv2: (azureconnectstring, container, task, filename) => {



  const blobService = azure.createBlobService(azureconnectstring);
  
  
  
  blobService.createContainerIfNotExists(container, error => {
    if (error) return console.log(error);
    blobService.createBlockBlobFromLocalFile(
      container,
      task,
      filename,
      (error, result) => {
        if (error) return console.log(error);
        console.dir(result, { depth: null, colors: true });
      }
    );
  });

  },

  sendFilesv3: (azureconnectstring, container, task, filename) => {



    const blobService = azure.createBlobService(azureconnectstring);
    

    return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(container, error => {
      if (error) return console.log(error);
      blobService.createBlockBlobFromLocalFile(
        container,
        task,
        filename,
        (error, result) => {
          if (error) {
          console.dir(result, { depth: null, colors: true });
          reject(error)
          } else {
            resolve({ filename});
          }
        }
      );
    });
  });
    },


    testBlobService : async (connectString) => {
      const blobService = azure.createBlobService(connectString);
    

    return new Promise((resolve, reject) => {
      blobService.getServiceProperties(function(error, result, response) {  
        if (error) {
          console.dir(result, { depth: null, colors: true });
          console.log("error ", error)
          reject(error)
          } else {
            console.log("resp ", response.isSuccessful)
            resolve({ response});
          }
        }
      );
    });
 
      
    }

  


   

}







