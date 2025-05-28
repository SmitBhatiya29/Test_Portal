const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateTeacher } = require('../middleware/authMiddleware');

// Teacher creates quiz
router.post('/', authenticateTeacher, quizController.createQuiz);

// You can add more quiz-related routes here

module.exports = router;
