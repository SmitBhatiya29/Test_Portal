const Quiz = require('../models/Quiz');

// Teacher creates a quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const teacherId = req.teacher._id;

    const quizData = req.body;
    quizData.createdBy = teacherId;

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    next(error);
  }
};

// Get quizzes assigned to logged in student
exports.getAssignedQuizzes = async (req, res, next) => {
  try {
    const studentId = req.student._id;
    const quizzes = await Quiz.find({ assignedTo: studentId });

    res.json({ quizzes });
  } catch (error) {
    next(error);
  }
};

// Get quizzes created by teacher
exports.getTeacherQuizzes = async (req, res, next) => {
  try {
    const teacherId = req.teacher._id;
    const quizzes = await Quiz.find({ createdBy: teacherId });
    
    // Log the data being sent
    console.log('Sending quizzes:', quizzes);
    
    res.json({ quizzes });
  } catch (error) {
    next(error);
  }
};
