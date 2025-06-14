// controllers/quizResultController.js

const QuizResult = require('../models/QuizResult');

exports.submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        // Simple validation
        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Clean answers to avoid ObjectId errors
        const cleanAnswers = answers.map(ans => ({
            questionId: ans.questionId && ans.questionId !== "" ? ans.questionId : undefined,
            questionText: ans.questionText,
            type: ans.type,
            selectedOption: ans.selectedOption,
            correctOption: ans.correctOption,
            marksAwarded: ans.marksAwarded
        }));

        const newResult = new QuizResult({
            quizId,
            studentId,
            teacherId,
            answers: cleanAnswers,
            totalMarks,
            totalNegativeMarks
        });

        await newResult.save();

        res.status(201).json({
            message: 'Quiz submitted successfully',
            resultId: newResult._id
        });

    } catch (error) {
        console.error('Error submitting quiz result:', error);
        res.status(500).json({ error: 'Server error while submitting quiz result' });
    }
};
