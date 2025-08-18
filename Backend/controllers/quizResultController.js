// controllers/quizResultController.js
const QuizResult = require('../models/QuizResult');
const TeacherResponse = require('../models/TeacherResponse');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');

exports.submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        console.log('📥 Received quiz submission:', {
            quizId,
            studentId,
            teacherId,
            answersCount: answers.length
        });

        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Clean answers
        const cleanAnswers = answers.map(ans => {
            let selectedOption = ans.selectedOption;
            if (ans.type === 'MSQ' && !Array.isArray(selectedOption)) {
                selectedOption = [selectedOption];
            }
            return {
                questionId: ans.questionId,
                questionText: ans.questionText,
                type: ans.type,
                selectedOption,
                correctOption: ans.correctOption,
                marksAwarded: ans.marksAwarded || 0
            };
        });

        // ✅ Save result
        const newResult = new QuizResult({
            quizId,
            studentId,
            teacherId,
            answers: cleanAnswers,
            totalMarks: totalMarks || 0,
            totalNegativeMarks: totalNegativeMarks || 0
        });

        await newResult.save();
        console.log('✅ Quiz result saved successfully');

        // --- Fetch extra data for teacher response ---
        const student = await Student.findById(studentId).select('name email');
        const quiz = await Quiz.findById(quizId).select('basicDetails');

        if (student && quiz) {
            const quizName = quiz?.basicDetails?.testName || 'Untitled Quiz';

            const teacherResponse = new TeacherResponse({
                teacherId,
                studentId,
                studentName: student.name,
                studentEmail: student.email,
                quizId,
                quizName,
                score: 0 // abhi default 0
            });

            await teacherResponse.save();
            console.log('📤 Teacher response saved');
        }

        res.status(201).json({
            message: 'Quiz submitted successfully',
            resultId: newResult._id
        });

    } catch (error) {
        console.error('❌ Error submitting quiz result:', error);
        res.status(500).json({
            error: 'Server error while submitting quiz result',
            details: error.message
        });
    }
};
