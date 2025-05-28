const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticateTeacher } = require('../middleware/authMiddleware');


router.post('/signup', teacherController.signup);

router.post('/login', teacherController.login);

router.post('/logout', authenticateTeacher, teacherController.logout);

router.get('/students/:teacherId', authenticateTeacher, teacherController.getMyStudents);

router.get('/profile', authenticateTeacher, teacherController.getTeacherProfile);
// Example protected route
router.get('/quizzes', authenticateTeacher, require('../controllers/quizController').getTeacherQuizzes);

module.exports = router;
