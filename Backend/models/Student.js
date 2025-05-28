const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  institute: {
    type: String,
    required: true
  },
  batchRollNo: {
    type: String,
    required: true
  },
  enrollmentNo: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  databaseName: {
    type: String,
    required: true // or false if optional
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
