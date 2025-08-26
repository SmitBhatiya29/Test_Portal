import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

const ResultSection = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deterministic color choices for subjects
  const subjectColorFor = (name) => {
    const palette = [
      'bg-blue-50 text-blue-600',
      'bg-purple-50 text-purple-600',
      'bg-green-50 text-green-600',
      'bg-orange-50 text-orange-600',
      'bg-pink-50 text-pink-600',
      'bg-amber-50 text-amber-600',
      'bg-cyan-50 text-cyan-600',
    ];
    const idx = Math.abs((name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % palette.length;
    return palette[idx];
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          setError('Missing student session. Please login again.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/quiz-results/student/${studentId}`);
        const rows = res.data?.results || [];

        // Group by subject -> tests
        const bySubject = new Map();
        rows.forEach(r => {
          const key = r.subjectName || 'Unknown Subject';
          if (!bySubject.has(key)) {
            bySubject.set(key, {
              name: key,
              color: subjectColorFor(key),
              results: [],
            });
          }
          bySubject.get(key).results.push({
            testName: r.testName,
            marksObtained: r.obtainedMarks,
            totalMarks: r.totalPossibleMarks,
            date: r.createdAt,
          });
        });

        // Within each subject, latest first
        const subjectsArr = Array.from(bySubject.values()).map(s => ({
          ...s,
          results: s.results.sort((a, b) => new Date(b.date) - new Date(a.date))
        }));

        setSubjects(subjectsArr);
      } catch (e) {
        console.error('Failed to fetch student results', e);
        setError(e.response?.data?.error || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-gray-600">Loading results...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !selectedSubject ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {subjects.length === 0 && (
            <div className="col-span-1 sm:col-span-2 text-gray-600">No results yet.</div>
          )}
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
                    {subject.results?.length > 0 ? (
                      <>Latest score: {subject.results[0].marksObtained}/{subject.results[0].totalMarks}</>
                    ) : (
                      'No tests yet'
                    )}
                  </p>
                </div>
                {subject.results?.length > 0 && (
                  <span className={`rounded-full px-3 py-1 text-sm mt-2 sm:mt-0 ${subject.color}`}>
                    {((subject.results[0].marksObtained / subject.results[0].totalMarks) * 100).toFixed(0)}%
                  </span>
                )}
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