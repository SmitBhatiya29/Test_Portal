const express = require('express');
    const router = express.Router();

    const studentController = require('../controllers/studentController');
    const quizController = require('../controllers/quizController');
    const { authenticateStudent } = require('../middleware/authMiddleware');

    // Student Signup
    router.post('/signup', studentController.signup);

    // Student Login
    router.post('/login', studentController.login);


    router.delete('/delete-by-database-teacher', studentController.deleteStudentsByDatabaseAndTeacher);

    // routes/studentRoutes.js
    router.get('/profile', authenticateStudent, studentController.getStudentProfile);

    // Protected route: Get quizzes assigned to student
    router.get('/quizzes', authenticateStudent, quizController.getAssignedQuizzes);

    // Delete students by databaseName and teacherId



    module.exports = router;
