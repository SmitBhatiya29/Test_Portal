import React from 'react';
import { Calendar, Clock, BookOpen, MapPin, User } from 'lucide-react';

const TestPlannerSection = () => {
  const upcomingTests = [
    {
      subject: 'Physics',
      title: 'Quantum Mechanics',
      date: '2025-01-15',
      time: '10:00 AM',
      duration: '2 hours',
      topics: ['Wave Functions', 'Schrödinger Equation', 'Quantum States'],
      instructor: 'Dr. Smith',
      venue: 'Room 101',
    },
    {
      subject: 'Mathematics',
      title: 'Linear Algebra',
      date: '2025-01-18',
      time: '2:00 PM',
      duration: '3 hours',
      topics: ['Matrices', 'Vector Spaces', 'Linear Transformations'],
      instructor: 'Prof. Johnson',
      venue: 'Main Hall',
    },
    {
      subject: 'Computer Science',
      title: 'Data Structures',
      date: '2025-01-20',
      time: '11:30 AM',
      duration: '1 hour',
      topics: ['Arrays', 'Linked Lists', 'Trees'],
      instructor: 'Dr. Brown',
      venue: 'Lab 3',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Test Schedule</h2>
      <div className="space-y-6">
        {upcomingTests.map((test, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.subject}</h3>
                <p className="text-emerald-600 font-medium">{test.title}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                {test.duration}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>{new Date(test.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>{test.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span>{test.instructor}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{test.venue}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</h4>
              <div className="flex flex-wrap gap-2">
                {test.topics.map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPlannerSection;