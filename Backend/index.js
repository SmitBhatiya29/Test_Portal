require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const quizResultRoutes = require('./routes/quizResultRoutes');
const teacherResponseRoutes = require('./routes/teacherResponseRoutes');

const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const cors = require('cors');
// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB URI fallback (IPv4 enforced)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz-app';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err)); 
  
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend origin
  credentials: true               // allow cookies if needed
}));
// Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);
app.use('/api/teacher-responses', teacherResponseRoutes);
// Error handling middleware (last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));