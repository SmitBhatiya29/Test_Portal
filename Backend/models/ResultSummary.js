const mongoose = require('mongoose');

const ResultSummarySchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },

  // Totals
  totalQuestions: { type: Number, required: true, default: 0 },
  totalPossibleMarks: { type: Number, required: true, default: 0 },
  totalNegativePossible: { type: Number, required: true, default: 0 },
  obtainedMarks: { type: Number, required: true, default: 0 },
  obtainedNegative: { type: Number, required: true, default: 0 },

  // Per difficulty counts and marks
  counts: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  correctCounts: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  marksByDifficulty: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResultSummary', ResultSummarySchema);
