const QuizResult = require('../models/QuizResult');
const TeacherResponse = require('../models/TeacherResponse');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const ResultSummary = require('../models/ResultSummary');
const Subject = require('../models/Subject');
const ChapterWiseResult = require('../models/ChapterWiseResult');

const submitQuizResult = async (req, res) => {
    try {
        const { quizId, studentId, teacherId, answers, totalMarks, totalNegativeMarks } = req.body;

        if (!quizId || !studentId || !teacherId || !answers || answers.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Load quiz
        const quizDoc = await Quiz.findById(quizId);
        if (!quizDoc) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const questionMap = new Map();
        for (const q of quizDoc.questions) {
            questionMap.set(String(q._id), q);
        }

        const toIndex = (val, options = []) => {
            if (typeof val === 'number' && Number.isInteger(val)) return val;
            const asNum = Number(val);
            if (!Number.isNaN(asNum) && Number.isInteger(asNum)) return asNum;
            if (typeof val === 'string' && options && options.length) {
                const idx = options.findIndex(o => String(o) === val || String(o) === String(val));
                return idx >= 0 ? idx : -1;
            }
            return -1;
        };

        const toBoolean = (val) => {
            if (typeof val === 'boolean') return val;
            if (typeof val === 'string') {
                const v = val.trim().toLowerCase();
                if (v === 'true') return true;
                if (v === 'false') return false;
            }
            return Boolean(val);
        };

        const cleanAnswers = answers.map(ans => {
            const q = questionMap.get(String(ans.questionId));
            const qType = q?.type || ans.type;
            const options = q?.options || [];

            let selectedOption = ans.selectedOption;

            const normalizeCorrect = () => {
                const raw = Array.isArray(q?.correct)
                    ? q.correct
                    : Array.isArray(ans.correctOption)
                        ? ans.correctOption
                        : [ans.correctOption];

                if (qType === 'MCQ') {
                    const idxVals = raw.map(v => toIndex(v, options)).filter(i => i >= 0);
                    return idxVals.length ? [idxVals[0]] : [];
                }
                if (qType === 'MSQ') {
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
                let idx;
                if (Array.isArray(selectedOption)) {
                    idx = toIndex(selectedOption[0], options);
                } else {
                    idx = toIndex(selectedOption, options);
                }
                selectedOption = [idx >= 0 ? idx : 0];
            } else if (qType === 'MSQ') {
                const vals = Array.isArray(selectedOption) ? selectedOption : [selectedOption];
                const indices = vals.map(v => toIndex(v, options)).filter(i => i >= 0);
                selectedOption = indices;
            } else if (qType === 'NAT') {
                const num = Number(selectedOption);
                selectedOption = Number.isNaN(num) ? 0 : num;
            } else if (qType === 'TrueFalse') {
                const v = Array.isArray(selectedOption) ? selectedOption[0] : selectedOption;
                selectedOption = [toBoolean(v)];
            }

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
                chapter: q?.chapter || '',
                selectedOption,
                correctOption: correct,
                marksAwarded: awarded
            };
        });

        const easyQuestions = cleanAnswers.filter(a => a.difficulty === 'Easy');
        const mediumQuestions = cleanAnswers.filter(a => a.difficulty === 'Medium');
        const hardQuestions = cleanAnswers.filter(a => a.difficulty === 'Hard');

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

        // Resolve subject doc
        const rawSubjectName = quizDoc?.basicDetails?.subjectName || 'unspecified';
        const keyName = String(rawSubjectName || 'unspecified').trim().toLowerCase();
        const subjectDoc = await Subject.findOneAndUpdate(
          { name: keyName },
          { $setOnInsert: { name: keyName, displayName: rawSubjectName } },
          { upsert: true, new: true }
        );

        // Chapter aggregation
        const chapterAgg = new Map();
        for (const a of cleanAnswers) {
            const chapter = (a.chapter || '').trim() || 'Unspecified';
            const diff = (a.difficulty || 'Easy').toLowerCase();
            const isCorrect = (a.marksAwarded || 0) > 0;
            if (!chapterAgg.has(chapter)) {
                chapterAgg.set(chapter, {
                    easy: { total: 0, correct: 0, wrong: 0 },
                    medium: { total: 0, correct: 0, wrong: 0 },
                    hard: { total: 0, correct: 0, wrong: 0 },
                });
            }
            const bucket = chapterAgg.get(chapter)[diff] || chapterAgg.get(chapter).easy;
            bucket.total += 1;
            if (isCorrect) bucket.correct += 1; else bucket.wrong += 1;
        }

        const overallInc = {
            totalQuestions: totalQuestions,
            totalCorrect: cleanAnswers.filter(a => (a.marksAwarded || 0) > 0).length,
            totalWrong: cleanAnswers.filter(a => (a.marksAwarded || 0) <= 0).length,
            easy: { total: counts.easy, correct: correctCounts.easy, wrong: counts.easy - correctCounts.easy },
            medium: { total: counts.medium, correct: correctCounts.medium, wrong: counts.medium - correctCounts.medium },
            hard: { total: counts.hard, correct: correctCounts.hard, wrong: counts.hard - correctCounts.hard },
        };

        const incDoc = {};
        incDoc['performance.totalQuestions'] = overallInc.totalQuestions;
        incDoc['performance.totalCorrect'] = overallInc.totalCorrect;
        incDoc['performance.totalWrong'] = overallInc.totalWrong;
        for (const d of ['easy','medium','hard']) {
            incDoc[`performance.${d}.total`] = overallInc[d].total;
            incDoc[`performance.${d}.correct`] = overallInc[d].correct;
            incDoc[`performance.${d}.wrong`] = overallInc[d].wrong;
        }
        for (const [ch, stats] of chapterAgg.entries()) {
            for (const d of ['easy','medium','hard']) {
                incDoc[`chapters.${ch}.${d}.total`] = (incDoc[`chapters.${ch}.${d}.total`] || 0) + stats[d].total;
                incDoc[`chapters.${ch}.${d}.correct`] = (incDoc[`chapters.${ch}.${d}.correct`] || 0) + stats[d].correct;
                incDoc[`chapters.${ch}.${d}.wrong`] = (incDoc[`chapters.${ch}.${d}.wrong`] || 0) + stats[d].wrong;
            }
        }

        await ChapterWiseResult.updateOne(
          { studentId, subjectId: subjectDoc._id },
          {
            $setOnInsert: { studentId, subjectId: subjectDoc._id },
            $inc: incDoc,
          },
          { upsert: true }
        );

        // Save quiz result
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

        // TeacherResponse
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

        // ResultSummary
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

// GET: chapter-wise summary merged across all quizzes per subject for a student
async function getChapterSummaryForStudent(req, res) {
    try {
        const { studentId } = req.params;
        if (!studentId) {
            return res.status(400).json({ error: 'studentId is required' });
        }

        const docs = await ChapterWiseResult.find({ studentId })
            .populate({ path: 'subjectId', select: 'name displayName' })
            .lean();

        const subjects = docs.map(d => {
            const subjectName = d.subjectId?.displayName || d.subjectId?.name || 'unspecified';
            const chapters = {};
            if (d.chapters && typeof d.chapters === 'object') {
                const asObj = typeof d.chapters.entries === 'function' ? Object.fromEntries(d.chapters) : d.chapters;
                for (const [chName, v] of Object.entries(asObj)) {
                    chapters[chName] = {
                        easy: v?.easy || { total: 0, correct: 0, wrong: 0 },
                        medium: v?.medium || { total: 0, correct: 0, wrong: 0 },
                        hard: v?.hard || { total: 0, correct: 0, wrong: 0 },
                    };
                }
            }

            return {
                subjectId: d.subjectId?._id,
                subjectName,
                performance: d.performance || {
                    totalQuestions: 0,
                    totalCorrect: 0,
                    totalWrong: 0,
                    easy: { total: 0, correct: 0, wrong: 0 },
                    medium: { total: 0, correct: 0, wrong: 0 },
                    hard: { total: 0, correct: 0, wrong: 0 },
                },
                chapters,
            };
        });

        return res.json({ subjects });
    } catch (error) {
        console.error('❌ Error fetching chapter summary:', error);
        return res.status(500).json({ error: 'Server error fetching chapter summary' });
    }
}

// Export handlers for router
module.exports = {
  submitQuizResult,
  getResultSummary,
  // Fetch all results for a student, enriched with quiz details
  getStudentResults,
  getChapterSummaryForStudent,
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

            const totalQuestions = Array.isArray(r.answers) ? r.answers.length : 0;
            const totalCorrect = Array.isArray(r.answers)
                ? r.answers.filter(a => (a?.marksAwarded || 0) > 0).length
                : 0;

            const counts = {
                easy: Array.isArray(r.easyQuestions) ? r.easyQuestions.length : 0,
                medium: Array.isArray(r.mediumQuestions) ? r.mediumQuestions.length : 0,
                hard: Array.isArray(r.hardQuestions) ? r.hardQuestions.length : 0,
            };
            const correctCounts = {
                easy: Array.isArray(r.easyQuestions) ? r.easyQuestions.filter(a => (a?.marksAwarded || 0) > 0).length : 0,
                medium: Array.isArray(r.mediumQuestions) ? r.mediumQuestions.filter(a => (a?.marksAwarded || 0) > 0).length : 0,
                hard: Array.isArray(r.hardQuestions) ? r.hardQuestions.filter(a => (a?.marksAwarded || 0) > 0).length : 0,
            };

            return {
                id: r._id,
                quizId: quiz?._id,
                teacherId: r.teacherId,
                subjectName,
                testName,
                obtainedMarks: r.totalMarks || 0,
                totalPossibleMarks,
                totalQuestions,
                totalCorrect,
                counts,
                correctCounts,
                createdAt: r.createdAt,
            };
        });

        return res.json({ results: payload });
    } catch (error) {
        console.error('❌ Error fetching student results:', error);
        return res.status(500).json({ error: 'Server error fetching student results' });
    }
}
