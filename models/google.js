const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const googleSchema = new Schema(
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
      

    bucket: { type: String
       },
 
    fileName: { type: String
   },
    
    projectId: { type: String
     },
},
  {
    timestamps: true
  }
);

var Google = mongoose.model("Google", googleSchema);

module.exports = Google;