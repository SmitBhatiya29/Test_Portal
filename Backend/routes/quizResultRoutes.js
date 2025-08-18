    // routes/quizResultRoutes.js

    const express = require('express');
    const router = express.Router();

    const quizResultController = require('../controllers/quizResultController');

    // POST - submit quiz result
    router.post('/submit', quizResultController.submitQuizResult); 
    module.exports = router;
