const fs = require('fs');
const got = require('got');

const getStream = require('get-stream');
querystring = require("querystring");




 
var url ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-17-08-00-UTC.csv?Expires=1574027722&Signature=qOgzD83aNElzal0ioeIM7AuNno0fVmoAG2mkSFRdd7fWxC5n4Oze6J7Wz~l6Ww9Pnoq4pmKUtRnFZ~GiQJvuvGDvkIGnLNFDQf~B9hRE7tO4voa~I9E8S7Y9duf-Dz-3d-0UarYOZ76fswzJQSO1Gwd0qXU1lWRFlBW-TWMIAZoHDlCFuB094Z-2zUYLo7JoJepH~-g06fNK35oTs1UTuCgqQnSAeBbTp3Elej0hHd9Z49eJ4CbaE~Nf4GzQVZbeXnFOkeNzV6-iyd8zjms9z3gDB-vfOnrXzR9RV6eDQ10szRunT~L4jg3~syV4AmDuGOksiOTjGuAMkaBkWxel~A__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

var url0 ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-18-08-00-UTC.csv?Expires=1574069801&Signature=AIDOFoMQw8pYNnH79EAY2F0SeAGEgJNZX-MWmh~IzFe1X0mJdmjf5nkcVXCXR6i~IoX4X8xf5lrLD~qlEnlY~zUnYIfnbZJH~Q0Dwfdakp9voTrO7CpyhSG41If3p-8jIb6Bf0MHH5YlIQA-i2cKRBBSNhOrLB2W68vdGMriNhjAj5yR14kkybxXHHk2XkIev2sJ3JBazqhspWX5nRBgHncvIr-pwWH~DowuOsflKvx0Q1-5IklARTd1tThOsxClTnw-LHyitcfNdOfWEaNUNeWKqLo-wzlEtpKQHCKLGft--R0EsS9A6cR7yL8E1r9BiisuN3tNbkggz7zYfS6JxQ__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

var url1 ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/6ebfc586-1b87-46c9-bc8d-acbdfccba02b/Devices-Vulnerable-to-High-CVE-CVSS-%3E%3D-7--2019-11-11-13-30-UTC.csv?Expires=1574086671&Signature=lD318vxfybdIsQgikLRRrZHRj7F4cW9MGevcL50dvcNH8Vql2gB-1ysZ3A54HI08LySp4HK7H6hu2GKGIEP9~eiM1LVlqqoijxdNiYwxovhj7NWiusK87NJZzkMD-5I1qZj2~Llm2mEbypzTJZlnsD2TTOyck97CEcjtwUvnhSmoOfmLpk9DDHjK1IuvUdG1v0dh0O~Fsf3wpyadpJU5ze0loNXG95rJ6rfoqHRx4-j56fitTao4OR5kZFn9wZOvBwkWdZy~9baRXyZnUS2XZzfuVSBGBKEq8r6x~pb6YVIDByISUsrFQon6T3St97TMLtC8qyDf0A2IVHsirbejBw__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

var filename = querystring.unescape(url1).split('/').pop().split('?')[0];
//const entities = new Entities();
//const filename = entities.decode(filename0);
const path = "tmp/";

const toto = got.stream(url1).pipe(fs.createWriteStream(path+filename))
 
// For POST, PUT, and PATCH methods `got.stream` returns a `stream.Writable`
//fs.createReadStream('index.html').pipe(got.stream.post('sindresorhus.com'));

toto.on('finish', response => {console.log(response)
    test();
});
console.log(toto.path);


const test = async () => {
   const stream = fs.createReadStream(toto.path);
   console.log("inside stream");
   // console.log(await getStream(stream));
}

//test();

/*
const testgot = async () => {
    try {
        const response = await got(url).then(data=> fs.createWriteStream('tmp/gotto.csv');
        
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error.response.body);
        //=> 'Internal server error ...'
    }
}

//testgot();

*/

