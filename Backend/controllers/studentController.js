const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ Bulk or Single Student Signup
const signup = async (req, res, next) => {
  try {
    const students = req.body.students;

    if (Array.isArray(students) && students.length > 0) {
      const newStudents = [];

      for (const student of students) {
        const {
          email,
          password,
          name,
          branch,
          institute,
          batchRollNo,
          enrollmentNo,
          phoneNo,
          createdBy,
          databaseName
        } = student;

        // ✅ Basic validation for required fields
        if (!email || !password || !name) {
          console.log(`Skipping student due to missing fields: ${JSON.stringify(student)}`);
          continue;
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
          console.log(`Student already exists with email: ${email}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        newStudents.push({
          email,
          password: hashedPassword,
          name,
          branch,
          institute,
          batchRollNo,
          enrollmentNo,
          phoneNo,
          createdBy,
          databaseName
        });
      }

      if (newStudents.length === 0) {
        return res.status(400).json({ message: 'No new students to register (may already exist or missing required fields)' });
      }

      const result = await Student.insertMany(newStudents);
      return res.status(201).json({
        message: `${result.length} students registered successfully.`,
        students: result
      });

    } else {
      // ✅ Handle single student registration
      const {
        email,
        password,
        name,
        branch,
        institute,
        batchRollNo,
        enrollmentNo,
        phoneNo,
        createdBy,
        databaseName
      } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }

      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already registered with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new Student({
        email,
        password: hashedPassword,
        name,
        branch,
        institute,
        batchRollNo,
        enrollmentNo,
        phoneNo,
        createdBy,
        databaseName
      });

      await newStudent.save();

      res.status(201).json({ message: 'Student registered successfully', student: newStudent });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    next(error);
  }
};

// ✅ Student Login
// ✅ Student Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie for additional security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Include token in response body for frontend storage
    res.json({
      message: 'Logged in successfully',
      token, // Add this line to include token in response
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
};
// ✅ Bulk Delete Students by databaseName and teacherId
const deleteStudentsByDatabaseAndTeacher = async (req, res, next) => {
  try {
    const { databaseName, createdBy } = req.body;

    if (!databaseName || !createdBy) {
      return res.status(400).json({ message: 'databaseName and createdBy (teacher ID) are required' });
    }

    const result = await Student.deleteMany({ databaseName, createdBy });

    res.status(200).json({
      message: `${result.deletedCount} student(s) deleted successfully.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete Error:', error);
    next(error);
  }
};

// controllers/studentController.js
const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.student?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized: No student ID found' });
    }

    const student = await Student.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    next(error);
  }
};

// Add this with your other controller functions
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the function
module.exports = {
    signup,
    login,
    deleteStudentsByDatabaseAndTeacher,
    getStudentProfile  // Add this line
};

