const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateTeacher } = require('../middleware/authMiddleware');
const { authenticateStudent } = require('../middleware/authMiddleware');
// Teacher creates quiz
router.post('/', authenticateTeacher, quizController.createQuiz);

// In routes/quizRoutes.js
router.get('/my-quizzes', authenticateTeacher, quizController.getTeacherQuizzes);

// Delete quiz by ID (only if created by that teacher)
router.delete('/:id', authenticateTeacher, quizController.deleteQuiz);

router.get('/student-quizzes', authenticateStudent, quizController.getStudentQuizzes);
module.exports = router;
