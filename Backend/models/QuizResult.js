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
    selectedOption: { 
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function(v) {
                // For MSQ, ensure it's an array
                if (this.type === 'MSQ') {
                    return Array.isArray(v);
                }
                // For MCQ and TrueFalse, ensure it's a string
                if (this.type === 'MCQ' || this.type === 'TrueFalse') {
                    return typeof v === 'string';
                }
                // For NAT, ensure it's a number
                if (this.type === 'NAT') {
                    return typeof v === 'number' || !isNaN(Number(v));
                }
                return true;
            },
            message: 'Invalid answer format for question type'
        }
    },
    correctOption: { 
        type: mongoose.Schema.Types.Mixed,
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