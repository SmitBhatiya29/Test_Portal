const mongoose = require('mongoose');

const DifficultyStatsSchema = new mongoose.Schema(
  {
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
  },
  { _id: false }
);

const ChapterStatsSchema = new mongoose.Schema(
  {
    easy: { type: DifficultyStatsSchema, default: () => ({}) },
    medium: { type: DifficultyStatsSchema, default: () => ({}) },
    hard: { type: DifficultyStatsSchema, default: () => ({}) },
  },
  { _id: false }
);

const OverallPerformanceSchema = new mongoose.Schema(
  {
    totalQuestions: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalWrong: { type: Number, default: 0 },
    easy: { type: DifficultyStatsSchema, default: () => ({}) },
    medium: { type: DifficultyStatsSchema, default: () => ({}) },
    hard: { type: DifficultyStatsSchema, default: () => ({}) },
  },
  { _id: false }
);

const ChapterWiseResultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },

    // Map<chapterName, ChapterStats>
    chapters: {
      type: Map,
      of: ChapterStatsSchema,
      default: () => new Map(),
    },

    performance: { type: OverallPerformanceSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Ensure unique document per (studentId, subjectId)
ChapterWiseResultSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('ChapterWiseResult', ChapterWiseResultSchema);
