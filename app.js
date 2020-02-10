var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var googlecredentialsRouter = require('./routes/settings/googleCreds');
var intellicredentialsRouter = require('./routes/settings/intelliCreds');
var micredentialsRouter = require('./routes/settings/datalakesCreds');
var awcredentialsRouter = require('./routes/settings/awCreds');
var vmwareRouter = require('./routes/products/intelligence');
var microsoftRouter = require('./routes/products/microsoft');
var airwatchRouter = require('./routes/products/airwatch');
var googleRouter = require('./routes/products/googlecloud');
var uploadRouter = require('./routes/upload/upload');
var scheduleRouter = require('./routes/products/schedule');
var taskRouter = require('./routes/products/task');
var emailRouter = require('./routes/products/sendemail');
const mongoose = require('mongoose');
var app = express();
const config = require('./config/DB');
mongoose.set('useCreateIndex', true);



mongoose.connect(config.DB, {useUnifiedTopology: true,useNewUrlParser: true} ).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' +err)
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/googlecloud', googleRouter);
app.use('/api/google', googlecredentialsRouter);
app.use('/api/credentials', intellicredentialsRouter);
app.use('/api/micredentials', micredentialsRouter);
app.use('/api/airwatch', awcredentialsRouter);
app.use('/api/vmware', vmwareRouter);
app.use('/api/microsoft', microsoftRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/agenda', scheduleRouter);
app.use('/api/task', taskRouter);
app.use('/api/uem', airwatchRouter);
app.use('/api/contact', emailRouter);

console.log("statu3", mongoose.connection.readyState);
module.exports = app;
