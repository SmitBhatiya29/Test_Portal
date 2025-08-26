const Quiz = require('../models/Quiz');
const Student = require('../models/Student');
// Teacher creates a quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const teacherId = req.teacher._id;

    const quizData = req.body;
    quizData.createdBy = teacherId;

    // Normalize correct answers based on question type (avoid breaking True/False)
    if (quizData.questions && Array.isArray(quizData.questions)) {
      const toBoolean = (val) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
          const v = val.trim().toLowerCase();
          if (v === 'true') return true;
          if (v === 'false') return false;
        }
        return Boolean(val);
      };

      quizData.questions = quizData.questions.map((q) => {
        const type = q?.type;
        const raw = Array.isArray(q?.correct) ? q.correct : [q?.correct];

        let correct;
        if (type === 'MCQ') {
          // single index inside array
          const n = Number(Array.isArray(raw) ? raw[0] : raw);
          correct = [Number.isNaN(n) ? 0 : n];
        } else if (type === 'MSQ') {
          // array of indices
          correct = raw.map((v) => Number(v)).filter((n) => Number.isInteger(n));
        } else if (type === 'NAT') {
          // store single numeric value
          const n = Number(Array.isArray(raw) ? raw[0] : raw);
          correct = [Number.isNaN(n) ? 0 : n];
        } else if (type === 'TrueFalse') {
          // store single boolean inside array
          const v = Array.isArray(raw) ? raw[0] : raw;
          correct = [toBoolean(v)];
        } else {
          correct = raw; // fallback
        }

        return { ...q, correct };
      });
    }

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
// Delete a quiz by ID (only if created by the logged-in teacher)
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const teacherId = req.teacher._id;

    const deletedQuiz = await Quiz.findOneAndDelete({ _id: quizId, createdBy: teacherId });

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized to delete' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getStudentQuizzes = async (req, res) => {
  try {
    const studentId = req.student.id; // ✅ From auth middleware
    console.log("📥 Requested by Student ID:", studentId);

    // ✅ Step 1: Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      console.log("❌ Student not found for ID:", studentId);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log("✅ Found student:", {
      id: student._id,
      name: student.name,
      createdBy: student.createdBy,
    });

    // ✅ Step 2: Find quizzes created by student's teacher
    const quizzes = await Quiz.find({ createdBy: student.createdBy });

    console.log(`📊 Quizzes found for teacher ID ${student.createdBy}:`, quizzes.length);

    // ✅ Step 3: Send response
    res.status(200).json(quizzes);

  } catch (error) {
    console.error('💥 Error fetching student quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
