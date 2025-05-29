const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateTeacher } = require('../middleware/authMiddleware');

// Teacher creates quiz
router.post('/', authenticateTeacher, quizController.createQuiz);

// In routes/quizRoutes.js
router.get('/my-quizzes', authenticateTeacher, quizController.getTeacherQuizzes);

module.exports = router;
