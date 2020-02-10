const wget = require('wget-improved');

var url ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-17-08-00-UTC.csv?Expires=1574018793&Signature=XPZmv6P~n9uuctv4VwEIXvlvOKMvT3uchATt5~Yho8md6~lRIf9y6tIofltF0lBPOOc1HQTf51fJdIb-6KrMRORsee4~Bt-UEra2jz5IJMxdrHQPm1AcyDSTTyrmY~5H3zfBdrpmF8HSr4Mo4NfsslkZj3dZjWFNI5ECtwpQazXugZK1yirL88oIlUVoHWWHn4THa2RABzF2WqxSzHzZpIzCRJT77e5n3spWegK4K35iiM6UetVLKFF2PiBqiUZ3G2YD1AoCFiXi10g5nT~gUn7HgjbSkp8pp9LlWbLrr2DN9CWJgw7fzdJBoP-PZrVaFhIScv84VVuqitDFjGBsrA__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'


const src = 'http://nodejs.org/images/logo.svg';
const output = 'tmp/logo3.csv';
const options = {
    // see options below
};
let download = wget.download(url, output, options);
download.on('error', function(err) {
    console.log(err);
});
download.on('start', function(fileSize) {
    console.log("start");
    console.log(fileSize);
});
download.on('end', function(output) {
    console.log(output);
    console.log("end");
});
download.on('progress', function(progress) {
    typeof progress === 'number'
    // code to show progress bar
});