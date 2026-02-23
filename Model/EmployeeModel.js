const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
    },
  mobile: {
    type: String,
    required: true
  },
  role_id:{
    type : String,
    required:true
  },
  shift : {
    type : String,
    required:true
  },
  city : {
    type : String,
    required:true
  }

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
