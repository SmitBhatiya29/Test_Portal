    // routes/quizResultRoutes.js

const express = require('express');
const router = express.Router();

const quizResultController = require('../controllers/quizResultController');

// POST - submit quiz result
router.post('/submit', quizResultController.submitQuizResult);

// GET - summary by quiz and student
router.get('/summary/:quizId/:studentId', quizResultController.getResultSummary);

// GET - all results for a student
router.get('/student/:studentId', quizResultController.getStudentResults);

// GET - chapter-wise merged performance per subject for a student
router.get('/student/:studentId/chapter-summary', quizResultController.getChapterSummaryForStudent);


module.exports = router;
