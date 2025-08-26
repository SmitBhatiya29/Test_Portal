const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    questionId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    questionText: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['MCQ', 'MSQ', 'NAT', 'TrueFalse'], 
        required: true 
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    chapter: {
        type: String,
        default: ''
    },
    selectedOption: { 
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function(v) {
                if (this.type === 'MCQ') {
                    return Array.isArray(v) && v.length === 1 && typeof v[0] === 'number';
                }
                if (this.type === 'MSQ') {
                    return Array.isArray(v) && v.every(opt => typeof opt === 'number');
                }
                if (this.type === 'NAT') {
                    return typeof v === 'number' || !isNaN(Number(v));
                }
                if (this.type === 'TrueFalse') {
                    return Array.isArray(v) && v.length === 1 && 
                        (v[0] === true || v[0] === false || v[0] === "true" || v[0] === "false");
                }
                return true;
            },
            message: 'Invalid selectedOption format for question type'
        }
    },
    correctOption: { 
        type: [mongoose.Schema.Types.Mixed], // always array
        required: true
    },
    marksAwarded: { 
        type: Number, 
        required: true,
        default: 0
    }
});

const QuizResultSchema = new mongoose.Schema({
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher', 
        required: true 
    },
    answers: [AnswerSchema],
    // Grouped by difficulty for convenient querying/reporting
    easyQuestions: [AnswerSchema],
    mediumQuestions: [AnswerSchema],
    hardQuestions: [AnswerSchema],
    totalMarks: { 
        type: Number, 
        required: true,
        default: 0
    },
    totalNegativeMarks: { 
        type: Number, 
        required: true,
        default: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
