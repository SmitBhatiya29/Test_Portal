import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const ResultSection = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      name: 'Mathematics',
      color: 'bg-blue-50 text-blue-600',
      results: [
        { testName: 'Calculus Mid-Term', marksObtained: 85, totalMarks: 100, date: '2024-12-15' },
        { testName: 'Linear Algebra Quiz', marksObtained: 45, totalMarks: 50, date: '2024-12-10' },
      ],
    },
    {
      name: 'Physics',
      color: 'bg-purple-50 text-purple-600',
      results: [
        { testName: 'Mechanics Final', marksObtained: 75, totalMarks: 100, date: '2024-12-18' },
        { testName: 'Quantum Physics Quiz', marksObtained: 38, totalMarks: 50, date: '2024-12-05' },
      ],
    },
    {
      name: 'Chemistry',
      color: 'bg-green-50 text-green-600',
      results: [
        { testName: 'Organic Chemistry', marksObtained: 88, totalMarks: 100, date: '2024-12-20' },
        { testName: 'Inorganic Quiz', marksObtained: 42, totalMarks: 50, date: '2024-12-12' },
      ],
    },
    {
      name: 'English',
      color: 'bg-orange-50 text-orange-600',
      results: [
        { testName: 'Grammar Test', marksObtained: 92, totalMarks: 100, date: '2024-12-14' },
        { testName: 'Literature Quiz', marksObtained: 47, totalMarks: 50, date: '2024-12-08' },
      ],
    },
  ];

  return (
    <div>
      {!selectedSubject ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-lg shadow p-4 md:p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{subject.name}</h3>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Latest score: {subject.results[0].marksObtained}/{subject.results[0].totalMarks}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm mt-2 sm:mt-0 ${subject.color}`}>
                  {((subject.results[0].marksObtained / subject.results[0].totalMarks) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 mt-4 text-sm">
                View details
                <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-emerald-600 mb-4 md:mb-6 flex items-center gap-2"
          >
            ← Back to subjects
          </button>
          
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{selectedSubject.name} Results</h2>
          
          <div className="space-y-4">
            {selectedSubject.results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold">{result.testName}</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      Date: {new Date(result.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <div className="text-xl md:text-2xl font-bold">
                      {result.marksObtained}/{result.totalMarks}
                    </div>
                    <div className={`mt-1 rounded-full px-3 py-1 text-sm ${selectedSubject.color}`}>
                      {((result.marksObtained / result.totalMarks) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultSection;