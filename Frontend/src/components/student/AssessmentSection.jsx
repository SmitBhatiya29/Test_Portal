import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Play } from 'lucide-react';
import QuizTest from './QuizTest';

const AssessmentSection = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    const fetchStudentQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please login first.');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/quizzes/student-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformedData = res.data.map((quiz) => ({
          subject: quiz.basicDetails.subjectName,
          title: quiz.basicDetails.testName,
          date: quiz.timeSettings.startDate,
          time: quiz.timeSettings.startTime,
          duration: `${quiz.timeSettings.durationMinutes} minutes`,
          id: quiz._id,
          createdBy: quiz.createdBy,
          questions: quiz.questions.map((q) => ({
            _id: q._id,
            text: q.text,
            type: q.type,
            options: q.options,
            correctOption: q.correct,
            difficulty: q.difficulty
          })),
          guidelines: quiz.guidelines.content,
        }));

        setSubjects(transformedData);
      } catch (error) {
        console.error('❌ Error fetching quizzes:', error);
      }
    };

    fetchStudentQuizzes();
  }, []);

  const handleStartTest = (test) => {
    setSelectedTest(test);
  };

  const handleEndTest = () => {
    setSelectedTest(null);
  };

  if (selectedTest) {
    return <QuizTest testData={selectedTest} onEndTest={handleEndTest} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Center</h1>
          <p className="text-gray-600">Take your scheduled tests and track your progress</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((test, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{test.subject}</h3>
                    <p className="text-emerald-600 font-medium">{test.title}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                    {test.duration}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-emerald-500" />
                    <span className="text-sm">{new Date(test.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-emerald-500" />
                    <span className="text-sm">{test.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tests Available</h3>
            <p className="text-gray-500">Check back later for scheduled assessments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSection;
