const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    displayName: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', SubjectSchema);
