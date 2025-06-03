import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock } from 'lucide-react';

const AssessmentSection = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchStudentQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');  // get token from localStorage
        if (!token) {
          console.error('No token found. Please login first.');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/quizzes/student-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,  // send token explicitly in header
          },
          // no need for withCredentials unless using cookies
        });

        const transformedData = res.data.map((quiz) => ({
          subject: quiz.basicDetails.subjectName,
          title: quiz.basicDetails.testName,
          date: quiz.timeSettings.startDate,
          time: quiz.timeSettings.startTime,
          duration: `${quiz.timeSettings.durationMinutes} minutes`,
        }));

        setSubjects(transformedData);
      } catch (error) {
        console.error('❌ Error fetching quizzes:', error);
      }
    };

    fetchStudentQuizzes();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Upcoming Assessments</h2>
      <div className="grid gap-6">
        {subjects.map((test, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.subject}</h3>
                <p className="text-emerald-600 font-medium mt-1">{test.title}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                {test.duration}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>{new Date(test.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>{test.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentSection;
