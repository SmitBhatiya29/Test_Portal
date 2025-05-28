import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const AssessmentSection = () => {
  const subjects = [
    {
      subject: 'Physics',
      title: 'Quantum Mechanics Mid-Term',
      date: '2025-01-15',
      time: '10:00 AM',
      duration: '2 hours',
    },
    {
      subject: 'Mathematics',
      title: 'Linear Algebra Final',
      date: '2025-01-18',
      time: '2:00 PM',
      duration: '3 hours',
    },
    {
      subject: 'Computer Science',
      title: 'Data Structures Quiz',
      date: '2025-01-20',
      time: '11:30 AM',
      duration: '1 hour',
    },
  ];

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