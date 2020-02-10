const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lake1Schema = new Schema(
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

    repname: {
      type: String
     
    },

    tenantid: {
      type: String
     
    },
    clientid: {
      type: String
     
    },
   secret: {
      type: String,
     
    },

    serviceaccount: {
      type: String
    },
    container: { type: String
                        },

   azureconnectstring: {
                        type: String
     }

    
  },
  {
    timestamps: true
  }
);

var Lake1Settings = mongoose.model("Datalake", lake1Schema);

module.exports = Lake1Settings;