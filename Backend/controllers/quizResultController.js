// controllers/quizResultController.js

const QuizResult = require('../models/QuizResult');

exports.submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        console.log('📥 Received quiz submission:', {
            quizId,
            studentId,
            teacherId,
            answersCount: answers.length
        });

        // Simple validation
        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            console.log('❌ Validation failed:', { quizId, studentId, teacherId, answersLength: answers?.length });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Clean and validate answers
        const cleanAnswers = answers.map(ans => {
            // Convert selectedOption to array for MSQ type
            let selectedOption = ans.selectedOption;
            if (ans.type === 'MSQ' && !Array.isArray(selectedOption)) {
                selectedOption = [selectedOption];
            }

            return {
                questionId: ans.questionId,
                questionText: ans.questionText,
                type: ans.type,
                selectedOption: selectedOption,
                correctOption: ans.correctOption,
                marksAwarded: ans.marksAwarded || 0
            };
        });

        console.log('✅ Cleaned answers:', cleanAnswers);

        const newResult = new QuizResult({
            quizId,
            studentId,
            teacherId,
            answers: cleanAnswers,
            totalMarks: totalMarks || 0,
            totalNegativeMarks: totalNegativeMarks || 0
        });

        console.log('📝 Saving quiz result...');
        await newResult.save();
        console.log('✅ Quiz result saved successfully');

        res.status(201).json({
            message: 'Quiz submitted successfully',
            resultId: newResult._id
        });

    } catch (error) {
        console.error('❌ Error submitting quiz result:', error);
        
        // More detailed error logging
        if (error.name === 'ValidationError') {
            console.error('Validation Error Details:', error.errors);
            return res.status(400).json({ 
                error: 'Validation Error', 
                details: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }

        res.status(500).json({ 
            error: 'Server error while submitting quiz result',
            details: error.message 
        });
    }
};
