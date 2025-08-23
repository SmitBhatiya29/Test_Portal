
const QuizResult = require('../models/QuizResult');
const TeacherResponse = require('../models/TeacherResponse');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
exports.submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Normalize answers according to type
        const cleanAnswers = answers.map(ans => {
            let selectedOption = ans.selectedOption;

            if (ans.type === 'MCQ') {
                // always array with one index number
                if (!Array.isArray(selectedOption)) {
                    selectedOption = [Number(selectedOption)];
                } else {
                    selectedOption = [Number(selectedOption[0])];
                }
            }

            if (ans.type === 'MSQ') {
                // always array of indexes
                if (!Array.isArray(selectedOption)) {
                    selectedOption = [Number(selectedOption)];
                } else {
                    selectedOption = selectedOption.map(opt => Number(opt));
                }
            }

            if (ans.type === 'NAT') {
                selectedOption = Number(selectedOption);
            }

            if (ans.type === 'TrueFalse') {
                // store as array with one boolean
                if (!Array.isArray(selectedOption)) {
                    selectedOption = [selectedOption === true || selectedOption === "true"];
                } else {
                    selectedOption = [selectedOption[0] === true || selectedOption[0] === "true"];
                }
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

        // --- Save TeacherResponse ---
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
                score: 0 // abhi calculation baad me hoga
            });

            await teacherResponse.save();
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
