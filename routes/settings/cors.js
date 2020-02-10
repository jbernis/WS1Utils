const express = require("express");
const cors = require("cors");
//const app = express();

const whitelist = [
  "http://localhost:3000/settings",
  "http://localhost:3000/reports",
  "http://localhost:3000/gcp",
  "http://localhost:3000",
  "https://localhost:3443",
  "https://localhost:4040"
];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log("origin2: ", req.header("Origin"));
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
