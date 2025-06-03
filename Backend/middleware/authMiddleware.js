const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ Token extractor with detailed logging
const getTokenFromRequest = (req) => {
  let token = null;

  // Check for cookie token
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token from cookies:', token);
  }

  // Fallback to Bearer token from headers
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token from Authorization header:', token);
  }

  return token;
};

// ✅ Teacher Authentication Middleware
const authenticateTeacher = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: 'Authentication required (teacher)' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) return res.status(401).json({ message: 'Invalid token (teacher not found)' });

    req.teacher = teacher;
    next();
  } catch (error) {
    console.error('❌ Teacher Auth Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token (teacher)' });
  }
};

// ✅ Student Authentication Middleware
const authenticateStudent = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'Authentication required (student)' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student) {
      console.log('Student not found with token ID');
      return res.status(401).json({ message: 'Invalid token (student not found)' });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('❌ Student Auth Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token (student)' });
  }
};

module.exports = { authenticateTeacher, authenticateStudent };
