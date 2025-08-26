    // routes/quizResultRoutes.js

    const express = require('express');
    const router = express.Router();

    const quizResultController = require('../controllers/quizResultController');

    // POST - submit quiz result
    router.post('/submit', quizResultController.submitQuizResult);

    // GET - summary by quiz and student
    router.get('/summary/:quizId/:studentId', quizResultController.getResultSummary);

    module.exports = router;
