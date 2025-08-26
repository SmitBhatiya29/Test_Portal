
const QuizResult = require('../models/QuizResult');
const TeacherResponse = require('../models/TeacherResponse');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const ResultSummary = require('../models/ResultSummary');
const submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Load quiz to get authoritative question definitions
        const quizDoc = await Quiz.findById(quizId);
        if (!quizDoc) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const questionMap = new Map();
        for (const q of quizDoc.questions) {
            questionMap.set(String(q._id), q);
        }

        // Helpers to coerce inputs safely
        const toIndex = (val, options = []) => {
            // If already number-like
            if (typeof val === 'number' && Number.isInteger(val)) return val;
            const asNum = Number(val);
            if (!Number.isNaN(asNum) && Number.isInteger(asNum)) return asNum;
            // Try to match option text
            if (typeof val === 'string' && options && options.length) {
                const idx = options.findIndex(o => String(o) === val || String(o) === String(val));
                return idx >= 0 ? idx : -1;
            }
            return -1;
        };

// (exports moved to end of file)

        const toBoolean = (val) => {
            if (typeof val === 'boolean') return val;
            if (typeof val === 'string') {
                const v = val.trim().toLowerCase();
                if (v === 'true') return true;
                if (v === 'false') return false;
            }
            return Boolean(val);
        };

        // ✅ Normalize answers according to actual question type/options
        const cleanAnswers = answers.map(ans => {
            const q = questionMap.get(String(ans.questionId));
            const qType = q?.type || ans.type; // fallback to client-provided type
            const options = q?.options || [];

            let selectedOption = ans.selectedOption;

            // Helper to normalize correct answers based on question type
            const normalizeCorrect = () => {
                const raw = Array.isArray(q?.correct)
                    ? q.correct
                    : Array.isArray(ans.correctOption)
                        ? ans.correctOption
                        : [ans.correctOption];

                if (qType === 'MCQ') {
                    // Expect single index in array
                    const idxVals = raw.map(v => toIndex(v, options)).filter(i => i >= 0);
                    return idxVals.length ? [idxVals[0]] : [];
                }
                if (qType === 'MSQ') {
                    // Expect array of indices
                    const idxVals = raw.map(v => toIndex(v, options)).filter(i => i >= 0);
                    return idxVals;
                }
                if (qType === 'NAT') {
                    const num = Number(Array.isArray(raw) ? raw[0] : raw);
                    return [Number.isNaN(num) ? 0 : num];
                }
                if (qType === 'TrueFalse') {
                    const v = Array.isArray(raw) ? raw[0] : raw;
                    return [toBoolean(v)];
                }
                return raw;
            };

            if (qType === 'MCQ') {
                // Expect single index inside array
                let idx;
                if (Array.isArray(selectedOption)) {
                    idx = toIndex(selectedOption[0], options);
                } else {
                    idx = toIndex(selectedOption, options);
                }
                selectedOption = [idx >= 0 ? idx : 0];
            } else if (qType === 'MSQ') {
                // Expect array of indexes
                const vals = Array.isArray(selectedOption) ? selectedOption : [selectedOption];
                const indices = vals.map(v => toIndex(v, options)).filter(i => i >= 0);
                selectedOption = indices;
            } else if (qType === 'NAT') {
                const num = Number(selectedOption);
                selectedOption = Number.isNaN(num) ? 0 : num;
            } else if (qType === 'TrueFalse') {
                // Store as array with one boolean
                const v = Array.isArray(selectedOption) ? selectedOption[0] : selectedOption;
                selectedOption = [toBoolean(v)];
            }

            // Compare selected vs correct to compute marks
            const isEqualArray = (a, b) => {
                if (!Array.isArray(a) || !Array.isArray(b)) return false;
                if (a.length !== b.length) return false;
                const sa = [...a].sort();
                const sb = [...b].sort();
                return sa.every((v, i) => v === sb[i]);
            };

            const correct = normalizeCorrect();

            let isCorrect = false;
            if (qType === 'MCQ' || qType === 'TrueFalse') {
                isCorrect = Array.isArray(selectedOption) && Array.isArray(correct) && selectedOption[0] === correct[0];
            } else if (qType === 'MSQ') {
                isCorrect = isEqualArray(selectedOption, correct);
            } else if (qType === 'NAT') {
                isCorrect = Number(selectedOption) === Number(Array.isArray(correct) ? correct[0] : correct);
            }

            const awarded = isCorrect ? (q?.marks ?? 0) : (q?.negativeMarks ?? 0) > 0 ? -(q?.negativeMarks ?? 0) : 0;

            return {
                questionId: ans.questionId,
                questionText: ans.questionText,
                type: qType,
                difficulty: q?.difficulty || 'Easy',
                selectedOption,
                // Use authoritative correct answers from quiz, normalized to consistent types
                correctOption: correct,
                marksAwarded: awarded
            };
        });

        // Group answers by difficulty for convenience
        const easyQuestions = cleanAnswers.filter(a => a.difficulty === 'Easy');
        const mediumQuestions = cleanAnswers.filter(a => a.difficulty === 'Medium');
        const hardQuestions = cleanAnswers.filter(a => a.difficulty === 'Hard');

        // Totals and difficulty metrics
        const totalQuestions = cleanAnswers.length;
        const totalPossibleMarks = quizDoc.questions.reduce((s, q) => s + (q.marks || 0), 0);
        const totalNegativePossible = quizDoc.questions.reduce((s, q) => s + (q.negativeMarks || 0), 0);
        const obtainedMarks = cleanAnswers.reduce((s, a) => s + (a.marksAwarded || 0), 0);
        const obtainedNegative = cleanAnswers.filter(a => (a.marksAwarded || 0) < 0).reduce((s, a) => s + Math.abs(a.marksAwarded || 0), 0);

        const counts = {
            easy: easyQuestions.length,
            medium: mediumQuestions.length,
            hard: hardQuestions.length,
        };
        const correctCounts = {
            easy: easyQuestions.filter(a => a.marksAwarded > 0).length,
            medium: mediumQuestions.filter(a => a.marksAwarded > 0).length,
            hard: hardQuestions.filter(a => a.marksAwarded > 0).length,
        };
        const marksByDifficulty = {
            easy: easyQuestions.reduce((s, a) => s + (a.marksAwarded || 0), 0),
            medium: mediumQuestions.reduce((s, a) => s + (a.marksAwarded || 0), 0),
            hard: hardQuestions.reduce((s, a) => s + (a.marksAwarded || 0), 0),
        };

        // ✅ Save result
        const newResult = new QuizResult({
            quizId,
            studentId,
            teacherId,
            answers: cleanAnswers,
            easyQuestions,
            mediumQuestions,
            hardQuestions,
            totalMarks: totalMarks || obtainedMarks,
            totalNegativeMarks: totalNegativeMarks || obtainedNegative
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
                score: obtainedMarks
            });

            await teacherResponse.save();
        }

        // --- Save ResultSummary ---
        const summary = new ResultSummary({
            quizId,
            studentId,
            teacherId,
            totalQuestions,
            totalPossibleMarks,
            totalNegativePossible,
            obtainedMarks,
            obtainedNegative,
            counts,
            correctCounts,
            marksByDifficulty,
        });
        await summary.save();

        res.status(201).json({
            message: 'Quiz submitted successfully',
            resultId: newResult._id,
            summary: {
                id: summary._id,
                obtainedMarks,
                obtainedNegative,
                totalQuestions,
                totalPossibleMarks,
                totalNegativePossible,
                counts,
                correctCounts,
                marksByDifficulty,
            }
        });

    } catch (error) {
        console.error('❌ Error submitting quiz result:', error);
        res.status(500).json({
            error: 'Server error while submitting quiz result',
            details: error.message
        });
    }
};

// GET summary by quiz and student (module scope)
const getResultSummary = async (req, res) => {
    try {
        const { quizId, studentId } = req.params;
        if (!quizId || !studentId) {
            return res.status(400).json({ error: 'quizId and studentId are required' });
        }

        const summary = await ResultSummary.findOne({ quizId, studentId });
        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        return res.json({
            summary: {
                id: summary._id,
                obtainedMarks: summary.obtainedMarks,
                obtainedNegative: summary.obtainedNegative,
                totalQuestions: summary.totalQuestions,
                totalPossibleMarks: summary.totalPossibleMarks,
                totalNegativePossible: summary.totalNegativePossible,
                counts: summary.counts,
                correctCounts: summary.correctCounts,
                marksByDifficulty: summary.marksByDifficulty,
                createdAt: summary.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Error fetching result summary:', error);
        res.status(500).json({ error: 'Server error fetching result summary' });
    }
};

// Export handlers for router
module.exports = {
  submitQuizResult,
  getResultSummary,
  // Fetch all results for a student, enriched with quiz details
  getStudentResults,
};

// GET: all results for a student (with subject & test names)
async function getStudentResults(req, res) {
    try {
        const { studentId } = req.params;
        if (!studentId) {
            return res.status(400).json({ error: 'studentId is required' });
        }

        // Populate quiz to access subject/test names and questions (to compute total possible marks)
        const results = await QuizResult.find({ studentId })
            .populate({ path: 'quizId', select: 'basicDetails questions' })
            .sort({ createdAt: -1 });

        const payload = results.map((r) => {
            const quiz = r.quizId;
            const subjectName = quiz?.basicDetails?.subjectName || 'Unknown Subject';
            const testName = quiz?.basicDetails?.testName || 'Untitled Test';
            const totalPossibleMarks = Array.isArray(quiz?.questions)
                ? quiz.questions.reduce((s, q) => s + (q.marks || 0), 0)
                : 0;
            return {
                id: r._id,
                quizId: quiz?._id,
                teacherId: r.teacherId,
                subjectName,
                testName,
                obtainedMarks: r.totalMarks || 0,
                totalPossibleMarks,
                createdAt: r.createdAt,
            };
        });

        return res.json({ results: payload });
    } catch (error) {
        console.error('❌ Error fetching student results:', error);
        return res.status(500).json({ error: 'Server error fetching student results' });
    }
}
