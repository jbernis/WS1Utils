const azure = require('azure-storage');


const config = require('./config');



const blobService = azure.createBlobService(config.AZURE_STORAGE_CONNECTION_STRING);



const container = 'mydata';
const task = 'data.csv';
const filename = './test/data.csv';

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