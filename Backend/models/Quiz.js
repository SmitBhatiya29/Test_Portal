const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },

  basicDetails: {
    testName: { type: String, required: true },
    subjectName: { type: String, required: true }, // ✅ New field added here
    description: { type: String },
    language: { type: String, default: 'en' },
    logoOption: { type: String, enum: ['custom', 'app', 'none'], default: 'app' },
    logoUrl: { type: String },
    chapters: [{ type: String }]
  },

  guidelines: {
    content: { type: String, default: '' }
  },

  testAccess: {
    databaseName: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    accessCode: { type: String }
  },

  timeSettings: {
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    enablePerQuestionTiming: { type: Boolean, default: false },
    allowLateSubmission: { type: Boolean, default: false },
    gracePeriodMinutes: { type: Number, default: 5 }
  },

  questions: [
  {
    text: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['MCQ', 'MSQ', 'NAT', 'TrueFalse'],
      required: true 
    },
    options: [{ type: String }],
    correct: [{ type: mongoose.Schema.Types.Mixed }],
    marks: { type: Number, default: 1 },
    negativeMarks: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    chapter: { type: String, default: '' },
    tags: [{ type: String }]
  }
],

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],

}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', QuizSchema);
