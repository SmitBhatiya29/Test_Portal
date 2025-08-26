const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');
const ResultSummary = require('../models/ResultSummary');
const Quiz = require('../models/Quiz');
const Student = require('../models/Student');

// GET /api/teacher/analytics/overview
// Auth: authenticateTeacher (uses req.teacher)
exports.getTeacherAnalyticsOverview = async (req, res) => {
  try {
    const teacherId = req.teacher?._id || req.teacher?.id;
    if (!teacherId) return res.status(401).json({ message: 'Unauthorized' });

    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

    // 1) High-level metrics from ResultSummary (efficient totals)
    const overallAgg = await ResultSummary.aggregate([
      { $match: { teacherId: teacherObjectId } },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: '$totalQuestions' },
          totalObtained: { $sum: '$obtainedMarks' },
          totalPossible: { $sum: '$totalPossibleMarks' },
          // correctness approximation from easy/medium/hard counts
          correctEasy: { $sum: '$correctCounts.easy' },
          correctMedium: { $sum: '$correctCounts.medium' },
          correctHard: { $sum: '$correctCounts.hard' },
        }
      }
    ]);

    const overall = overallAgg[0] || {
      totalQuestions: 0,
      totalObtained: 0,
      totalPossible: 0,
      correctEasy: 0,
      correctMedium: 0,
      correctHard: 0,
    };

    const totalCorrect = (overall.correctEasy || 0) + (overall.correctMedium || 0) + (overall.correctHard || 0);
    const overallAvgAccuracy = overall.totalQuestions > 0 ? (totalCorrect / overall.totalQuestions) * 100 : 0;
    const overallAvgScore = overall.totalPossible > 0 ? (overall.totalObtained / overall.totalPossible) * 100 : 0;

    // 2) Subject-wise accuracy using QuizResult + Quiz lookup
    const subjectAccuracy = await QuizResult.aggregate([
      { $match: { teacherId: teacherObjectId } },
      { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' },
      {
        $project: {
          subject: '$quiz.basicDetails.subjectName',
          answers: 1
        }
      },
      { $unwind: '$answers' },
      {
        $group: {
          _id: '$subject',
          total: { $sum: 1 },
          correct: { $sum: { $cond: [{ $gt: ['$answers.marksAwarded', 0] }, 1, 0] } }
        }
      },
      { $project: { subject: '$_id', _id: 0, accuracy: { $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$correct', '$total'] }, 100] }, 0] }, total: 1, correct: 1 } },
      { $sort: { subject: 1 } }
    ]);

    // 3) Subject x Difficulty grouped accuracy (heatmap-style data)
    const subjectDifficulty = await QuizResult.aggregate([
      { $match: { teacherId: teacherObjectId } },
      { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' },
      { $unwind: '$answers' },
      {
        $group: {
          _id: { subject: '$quiz.basicDetails.subjectName', difficulty: '$answers.difficulty' },
          total: { $sum: 1 },
          correct: { $sum: { $cond: [{ $gt: ['$answers.marksAwarded', 0] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id.subject',
          difficulty: '$_id.difficulty',
          accuracy: { $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$correct', '$total'] }, 100] }, 0] },
          total: 1,
          correct: 1
        }
      },
      { $sort: { subject: 1 } }
    ]);

    // 4) Student-wise comparison (avg accuracy, avg score)
    const studentComparison = await ResultSummary.aggregate([
      { $match: { teacherId: teacherObjectId } },
      {
        $group: {
          _id: '$studentId',
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: { $add: ['$correctCounts.easy', '$correctCounts.medium', '$correctCounts.hard'] } },
          obtained: { $sum: '$obtainedMarks' },
          possible: { $sum: '$totalPossibleMarks' },
          attempts: { $sum: 1 }
        }
      },
      {
        $project: {
          studentId: '$_id',
          _id: 0,
          avgAccuracy: { $cond: [{ $gt: ['$totalQuestions', 0] }, { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] }, 0] },
          avgScore: { $cond: [{ $gt: ['$possible', 0] }, { $multiply: [{ $divide: ['$obtained', '$possible'] }, 100] }, 0] },
          attempts: 1
        }
      },
      {
        $lookup: { from: 'students', localField: 'studentId', foreignField: '_id', as: 'student' }
      },
      { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          studentId: 1,
          name: { $ifNull: ['$student.name', 'Unknown'] },
          email: { $ifNull: ['$student.email', ''] },
          avgAccuracy: 1,
          avgScore: 1,
          attempts: 1
        }
      },
      { $sort: { avgAccuracy: -1 } }
    ]);

    // 5) Trend analysis over time (by attempt createdAt)
    const trend = await ResultSummary.aggregate([
      { $match: { teacherId: teacherObjectId } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' }
          },
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: { $add: ['$correctCounts.easy', '$correctCounts.medium', '$correctCounts.hard'] } },
          obtained: { $sum: '$obtainedMarks' },
          possible: { $sum: '$totalPossibleMarks' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.y',
              month: '$_id.m',
              day: '$_id.d'
            }
          },
          accuracy: { $cond: [{ $gt: ['$totalQuestions', 0] }, { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] }, 0] },
          score: { $cond: [{ $gt: ['$possible', 0] }, { $multiply: [{ $divide: ['$obtained', '$possible'] }, 100] }, 0] }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 6) Weak areas: lowest accuracy subjects and difficulties
    const weakSubjects = [...subjectAccuracy]
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    const byDifficulty = subjectDifficulty.reduce((acc, row) => {
      const key = row.difficulty || 'Unknown';
      if (!acc[key]) acc[key] = { total: 0, correct: 0 };
      acc[key].total += row.total || 0;
      acc[key].correct += row.correct || 0;
      return acc;
    }, {});
    const weakDifficulty = Object.entries(byDifficulty).map(([k, v]) => ({
      difficulty: k,
      accuracy: v.total > 0 ? (v.correct / v.total) * 100 : 0
    })).sort((a, b) => a.accuracy - b.accuracy);

    res.json({
      overview: {
        overallAvgAccuracy: Number(overallAvgAccuracy.toFixed(2)),
        overallAvgScore: Number(overallAvgScore.toFixed(2)),
        totalQuestionsAttempted: overall.totalQuestions || 0,
      },
      subjectAccuracy,
      subjectDifficulty, // for heatmap/grouped bars
      studentComparison,
      trend,
      weakAreas: {
        subjects: weakSubjects,
        difficulty: weakDifficulty
      },
      notes: [
        'Chapter-level analytics are not available because questions/answers do not store a chapter field.',
        'Average time per question is not available because timing data is not stored.'
      ]
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error computing analytics' });
  }
};
