import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import axios from 'axios';

const TestPlannerSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  // Helpers
  const formatDuration = (mins) => {
    if (!mins && mins !== 0) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  };

  // Parse date string that may be ISO or 'dd-mm-yyyy'. Optionally combine time HH:mm.
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    let dt;
    // Try native parse first (handles ISO and Date objects)
    dt = new Date(dateStr);
    if (isNaN(dt.getTime())) {
      // Try dd-mm-yyyy
      const m = String(dateStr).match(/^(\d{1,2})[-\/](\d{1,2})[-\/]?(\d{2,4})$/);
      if (m) {
        const d = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10) - 1;
        const y = parseInt(m[3].length === 2 ? `20${m[3]}` : m[3], 10);
        dt = new Date(y, mo, d);
      }
    }
    if (isNaN(dt.getTime())) return null;
    if (timeStr) {
      const t = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)?\s*$/i.exec(timeStr);
      if (t) {
        let hours = parseInt(t[1], 10);
        const minutes = parseInt(t[2], 10);
        const ampm = t[3]?.toUpperCase();
        if (ampm) {
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
        }
        dt.setHours(hours, minutes, 0, 0);
      }
    }
    return dt;
  };

  const toLocalDate = (d, t) => {
    const dt = d instanceof Date ? d : parseDateTime(d, t);
    try { return dt ? dt.toLocaleDateString() : ''; } catch { return ''; }
  };

  const daysUntil = (dateStr) => {
    if (!dateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return '';
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'in 1 day';
    if (diffDays > 1) return `in ${diffDays} days`;
    return '';
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Missing session. Please login again.');
          setLoading(false);
          return;
        }
        // Primary: assigned quizzes
        const res = await axios.get('http://localhost:5000/api/students/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        let arr = res.data?.quizzes || res.data || [];
        if (!Array.isArray(arr)) arr = [];

        // Fallback: quizzes created by student's teacher (if assigned list empty)
        if (arr.length === 0) {
          const res2 = await axios.get('http://localhost:5000/api/students/quizzes/by-teacher', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const arr2 = res2.data?.quizzes || res2.data || [];
          setQuizzes(Array.isArray(arr2) ? arr2 : []);
        } else {
          setQuizzes(arr);
        }
      } catch (e) {
        console.error('Failed to load assigned quizzes', e);
        setError(e.response?.data?.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Map quizzes to schedule items and sort by start date/time
  const upcomingTests = useMemo(() => {
    const items = (quizzes || []).map((q) => {
      const subject = q?.basicDetails?.subjectName || 'Subject';
      const title = q?.basicDetails?.testName || 'Test';
      const dateStr = q?.timeSettings?.startDate;
      const time = q?.timeSettings?.startTime;
      const duration = formatDuration(q?.timeSettings?.durationMinutes);
      const instructor = ''; // not available in model
      const venue = ''; // not available in model
      const topics = undefined; // not available in model
      const when = parseDateTime(dateStr, time);
      return {
        subject,
        title,
        date: when ? when.toISOString() : dateStr,
        time,
        duration,
        instructor,
        venue,
        topics,
      };
    });
    // Keep only tests that are today or in the future (exclude missing/invalid dates)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const upcoming = items.filter((it) => {
      if (!it.date) return false;
      const dt = parseDateTime(it.date, it.time) || new Date(it.date);
      return !isNaN(dt.getTime()) && dt >= startOfToday;
    });
    upcoming.sort((a, b) => {
      const ad = parseDateTime(a.date, a.time) || new Date(a.date);
      const bd = parseDateTime(b.date, b.time) || new Date(b.date);
      return ad - bd;
    });
    return upcoming;
  }, [quizzes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Upcoming Tests</h2>
        {upcomingTests.length > 0 && (
          <span className="text-sm px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            {upcomingTests.length}
          </span>
        )}
      </div>
      {loading ? (
        <div className="text-gray-600">Loading schedule...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : upcomingTests.length === 0 ? (
        <div className="text-gray-600">No upcoming tests.</div>
      ) : (
        <div className="space-y-6">
          {upcomingTests.map((test, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.subject}</h3>
                  <p className="text-emerald-600 font-medium">{test.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {test.date && daysUntil(test.date) && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm">
                      {daysUntil(test.date)}
                    </span>
                  )}
                  {test.duration && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                      {test.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {test.date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>{toLocalDate(test.date, test.time)}</span>
                  </div>
                )}
                {test.time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>{test.time}</span>
                  </div>
                )}
                {test.instructor && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={18} />
                    <span>{test.instructor}</span>
                  </div>
                )}
                {test.venue && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{test.venue}</span>
                  </div>
                )}
              </div>

              {Array.isArray(test.topics) && test.topics.length > 0 && (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestPlannerSection;