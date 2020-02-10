const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const intellisettingSchema = new Schema(
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

    url: {
      type: String
     
    },
    clientid: {
      type: String
     
    },
   secret: {
      type: String,
     
    },

    encoded: {
      type: String
    },

    region: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

var intelliSettings = mongoose.model("Setting", intellisettingSchema);

module.exports = intelliSettings;