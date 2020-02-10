const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const awsettingSchema = new Schema(
  {

   
    email: {
      type: String,
      required: true
    },
    sub: {
        type: String,
        required: true,
        unique: true
      },

    awurl: {
      type: String
     
    },
    apikey: {
      type: String
     
    },
   awadmin: {
      type: String,
     
    },

    awpassword: {
      type: String
    },

    awencoded: {
      type: String
    },
    lgid: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

var awSettings = mongoose.model("awsetting", awsettingSchema);

module.exports = awSettings;