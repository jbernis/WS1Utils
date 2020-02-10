
const axios = require('axios');


 const getTokenMi =async (product, email, sub) => {

    // if(this.props.creds.url && this.props.creds.clientid && this.props.creds.secret){

     console.log(' i am in getoken from mi')
     const url = 'http://127.0.0.1:8000/microsoft/getToken2';

     const data =  {
      product,
      email,
      sub
    }
     
   try { const jwt = await axios.post(url,data)   //.then(data => console.log("my ", data)); 

    console.log("mi test ", jwt);
   
    console.log("mi ", jwt.data);
    return jwt
   
   
   } catch(err){
   //  console.log(err); 
     }
    }


    const tokenMi =  getTokenMi('midatalakegen1','tsecure@tezousecure.net','facebook|990293514641258');
