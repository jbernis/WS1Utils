const fs = require('fs');
const getStream = require('get-stream');

var url ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-17-08-00-UTC.csv?Expires=1574027722&Signature=qOgzD83aNElzal0ioeIM7AuNno0fVmoAG2mkSFRdd7fWxC5n4Oze6J7Wz~l6Ww9Pnoq4pmKUtRnFZ~GiQJvuvGDvkIGnLNFDQf~B9hRE7tO4voa~I9E8S7Y9duf-Dz-3d-0UarYOZ76fswzJQSO1Gwd0qXU1lWRFlBW-TWMIAZoHDlCFuB094Z-2zUYLo7JoJepH~-g06fNK35oTs1UTuCgqQnSAeBbTp3Elej0hHd9Z49eJ4CbaE~Nf4GzQVZbeXnFOkeNzV6-iyd8zjms9z3gDB-vfOnrXzR9RV6eDQ10szRunT~L4jg3~syV4AmDuGOksiOTjGuAMkaBkWxel~A__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

 
const test = async () => {
    const stream = fs.createReadStream('tmp/gotto.csv');
 
    console.log(await getStream(stream));
}

test();