const wget = require('node-wget-promise');
var mkdirp = require('mkdirp');
const output = 'tmp/titi3.csv';

var url ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-17-08-00-UTC.csv?Expires=1574018793&Signature=XPZmv6P~n9uuctv4VwEIXvlvOKMvT3uchATt5~Yho8md6~lRIf9y6tIofltF0lBPOOc1HQTf51fJdIb-6KrMRORsee4~Bt-UEra2jz5IJMxdrHQPm1AcyDSTTyrmY~5H3zfBdrpmF8HSr4Mo4NfsslkZj3dZjWFNI5ECtwpQazXugZK1yirL88oIlUVoHWWHn4THa2RABzF2WqxSzHzZpIzCRJT77e5n3spWegK4K35iiM6UetVLKFF2PiBqiUZ3G2YD1AoCFiXi10g5nT~gUn7HgjbSkp8pp9LlWbLrr2DN9CWJgw7fzdJBoP-PZrVaFhIScv84VVuqitDFjGBsrA__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'



/*wget(url,  {
    onStart: function(fileSize) {
        console.log(fileSize);
    },
    onProgress: function(data) {
        console.log(data);
    },
    output: function(output) {
        console.log(output);
    }
  })
  .then(metadata => console.log(metadata))
  .catch(err => console.log(err));
*/

wget(url)

/*(async () => {
    await wget(url);
    console.log('Done');
  })(); */