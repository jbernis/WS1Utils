const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
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
      

    items: {
      type: Array
     
    }
  },
  {
    timestamps: true
  }
);

var Tasks = mongoose.model("Task", taskSchema);

module.exports = Tasks;