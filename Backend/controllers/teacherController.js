const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const Student = require("../models/Student");
// Teacher Signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password ,institute} = req.body;

    let existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({ name, email, password: hashedPassword,institute });
    await teacher.save();

    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    next(error);
  }
};

// Teacher Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // JWT Token create करना
    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, JWT_SECRET, { expiresIn: '1d' });

    // Cookie में token set करें
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Logged in successfully',
        token,
       teacher: { id: teacher._id, name: teacher.name, email: teacher.email } });
  } catch (error) {
    next(error);
  }
};


// ✅ Get all students registered by this teacher
exports.getMyStudents = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const students = await Student.find({ createdBy: teacherId });

    // Return 200 with empty array if no students found
    res.status(200).json(students || []);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Controller to get all students created by a specific teacher
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.teacher?.id || req.teacher?._id;
    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized: No teacher ID found' });
    }

    const teacher = await Teacher.findById(teacherId).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Server error fetching teacher profile' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Update Teacher Profile
exports.updateProfile = async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    const { name, email, institute, currentPassword, newPassword } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // If user wants to update password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, teacher.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

      teacher.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.institute = institute || teacher.institute;

    await teacher.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
