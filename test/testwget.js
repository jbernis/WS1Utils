var wget = require('node-wget');
var mkdirp = require('mkdirp');
 

var url ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/48766029-a630-43e2-8550-17eb40494d73/All-Apps-2019-11-17-08-00-UTC.csv?Expires=1574018793&Signature=XPZmv6P~n9uuctv4VwEIXvlvOKMvT3uchATt5~Yho8md6~lRIf9y6tIofltF0lBPOOc1HQTf51fJdIb-6KrMRORsee4~Bt-UEra2jz5IJMxdrHQPm1AcyDSTTyrmY~5H3zfBdrpmF8HSr4Mo4NfsslkZj3dZjWFNI5ECtwpQazXugZK1yirL88oIlUVoHWWHn4THa2RABzF2WqxSzHzZpIzCRJT77e5n3spWegK4K35iiM6UetVLKFF2PiBqiUZ3G2YD1AoCFiXi10g5nT~gUn7HgjbSkp8pp9LlWbLrr2DN9CWJgw7fzdJBoP-PZrVaFhIScv84VVuqitDFjGBsrA__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

var url2 = 'https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/94eea3ec-7cc9-47f0-ac1c-168741c44605/ACME-iOS-Android-Apps-60-Days-2019-11-01-00-00-UTC.csv?Expires=1574017887&Signature=c7Yug~-rKqIeiZrRp3XxS9J1a9r6eKAI2WY0FW8bwd3Fi4p8uPdkGhJEyhKqodT1thJF8BZmJyGaWq1U5vNXALTd9Bu6OQRJhCrYoP4VuHM0LgipPRBe9Hs5NqKhwrWDhAdrmbOCgDc7EioxoKDo240lEsPPzhltJ8Xs-uH6anhFsc2pH6OZ0FAevD~IwSNanqdoJjolaxQe80tncEfMMuCC-afA9mNvysKNLptFeF01VHoHVkQpdzv3YwHsD5~MzXC51NECqJw2zgrCFVL7LEhKwcqGpZYtlt45Wp~5Gy~tzBTC-h7Q5QCc4ExJz6sg25Xm2PYzSXVRSuSHANhKvA__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

var url3 ='https://storage.sandbox.data.vmwservices.com/reports/3b94b766-af3f-4ead-adf2-1ca1d919f3bf/baab1074-bdcd-415a-9421-86ce600aa448/Workspace-ONE-UEM-iOS-and-Android-Agents-2019-05-20-13-57-UTC.csv?Expires=1574018093&Signature=mwDkpuupWADupJ4EIBcS3jMgRwSIE0uYXHgRNyNh4wNPRYPluOIY7lyagpHmrGpUv74s7Oeeq8ZcI40WSj1-VsP2az7AzscJO8QPBo4A1fPdzYOTda0LUbavcu5psqcEc6IPYuwaJFGkSZUqf~242F17GuJflGn5417xEFI8NY4tMkxp4sCgE1qz5pHWfnoMrkUZZbT~qam30etO6d8jsCRiXyE4xJ3Q4oURkW-BX388iqDcPzP5wDWDls0NHCo6nUhk-H91hHW1UgYYEH4kWpwMERsRRZIilGk5Len4GTE~~wp6yW7Qh0HVMOAtW5ecdJI5qKWYV7y-5Xy-85gUdw__&Key-Pair-Id=APKAJA7Y7GCNUHTD4IIQ'

/*mkdirp('tmp', (function (err) {
    if (err) console.error(err)
    else {console.error('done')
    ; }
})) */

wget({url:url, dest: 'tmp/toto2.csv'})