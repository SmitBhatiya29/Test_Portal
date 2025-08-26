// MergedStudentDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LayoutDashboard, BookOpen, Award, Calendar, HelpCircle, LogOut, User, ChevronDown, Menu, Target, Clock } from 'lucide-react';

import StudentSidebar from './StudentSidebar';
import AssessmentSection from './student/AssessmentSection';
import ResultSection from './student/ResultSection';
import TestPlannerSection from './student/TestPlannerSection';
import ProfileDropdown from './student/ProfileDropdown';
import axios from 'axios';

import {
  processAccuracyBySubject,
  processAccuracyByDifficulty,
  processAccuracyByChapterAndDifficulty,
  processQuestionsByChapter,
} from './utils/dataProcessing.js';
import AccuracyBySubjectChart from './charts/AccuracyBySubjectChart.jsx';
import AccuracyByDifficultyChart from './charts/AccuracyByDifficultyChart.jsx';
import AccuracyByChapterDifficultyChart from './charts/AccuracyByChapterDifficultyChart.jsx';
import QuestionsByChapterChart from './charts/QuestionsByChapterChart.jsx';
import ParticleBackground from './ParticleBackground.jsx';

const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const StudentDashboard = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    name: '', batch: '', institute: '', rollNo: '', enrollmentNo: '', phone: '',
    email: '', course: '', semester: '', profileImage: DEFAULT_PROFILE_IMAGE,
  });
  const [studentId, setStudentId] = useState(null);
  const [resultsData, setResultsData] = useState([]); // raw results from backend
  const [chapterSummary, setChapterSummary] = useState(null); // from ChapterWiseResult endpoint

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout(); return;
    }
    axios.get('http://localhost:5000/api/students/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        const data = response.data.student;
        const profileImage = data.profileImage?.trim() !== '' ? data.profileImage : DEFAULT_PROFILE_IMAGE;
        setStudentInfo({
          name: data.name || '', batch: data.batchRollNo || '', institute: data.institute || '',
          rollNo: data.batchRollNo || '', enrollmentNo: data.enrollmentNo || '', phone: data.phoneNo || '',
          email: data.email || '', course: data.branch || '', semester: data.databaseName || '', profileImage
        });
        if (data._id) {
          setStudentId(data._id);
          localStorage.setItem('studentId', data._id);
        }
      })
      .catch(error => {
        console.error('Failed to fetch student profile:', error);
        if (error.response?.status === 401) onLogout();
      });
  }, [onLogout]);

  // Fetch quiz results for the student
  useEffect(() => {
    const token = localStorage.getItem('token');
    const sid = studentId || localStorage.getItem('studentId');
    if (!token || !sid) return;
    axios.get(`http://localhost:5000/api/quiz-results/student/${sid}`)
      .then(res => {
        const { results } = res.data || { results: [] };
        setResultsData(Array.isArray(results) ? results : []);
      })
      .catch(err => {
        console.error('Failed to fetch student results:', err);
      });
  }, [studentId]);

  // Fetch chapter-wise merged summary for the student (ChapterWiseResult)
  useEffect(() => {
    const sid = studentId || localStorage.getItem('studentId');
    if (!sid) return;
    axios.get(`http://localhost:5000/api/quiz-results/student/${sid}/chapter-summary`)
      .then(res => {
        setChapterSummary(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch chapter summary:', err);
      });
  }, [studentId]);

  // Transform backend results into records expected by processors
  const processedRecords = useMemo(() => {
    // Each backend result has: subjectName, testName, counts {easy,medium,hard}, correctCounts {...}, totalQuestions, totalCorrect
    // Mapping requested: subject = testName, chapter = subjectName
    const rows = [];
    resultsData.forEach(r => {
      const subject = r.testName || 'Unknown Test';
      const chapter = r.subjectName || 'Unknown Subject';
      const levels = [
        { key: 'Easy', count: r?.counts?.easy || 0, correct: r?.correctCounts?.easy || 0 },
        { key: 'Medium', count: r?.counts?.medium || 0, correct: r?.correctCounts?.medium || 0 },
        { key: 'Hard', count: r?.counts?.hard || 0, correct: r?.correctCounts?.hard || 0 },
      ];
      levels.forEach(l => {
        if (l.count > 0) {
          rows.push({
            studentName: studentInfo.name || 'Student',
            subject,
            chapter,
            difficultyLevel: l.key,
            accuracy: Math.round((l.correct / l.count) * 100),
            questionsAttempted: l.count,
            questionsCorrect: l.correct,
            averageTimePerQuestion: 0,
          });
        }
      });
    });
    return rows;
  }, [resultsData, studentInfo.name]);

  const chartData = useMemo(() => {
    const base = {
      accuracyBySubject: processAccuracyBySubject(processedRecords),
      accuracyByDifficulty: processAccuracyByDifficulty(processedRecords),
      accuracyByChapterDifficulty: processAccuracyByChapterAndDifficulty(processedRecords),
      questionsByChapter: processQuestionsByChapter(processedRecords),
    };

    // Override two charts using ChapterWiseResult if available
    if (chapterSummary && Array.isArray(chapterSummary.subjects)) {
      const byChapter = new Map();
      chapterSummary.subjects.forEach(s => {
        const chapters = s.chapters || {};
        Object.entries(chapters).forEach(([ch, v]) => {
          if (!byChapter.has(ch)) {
            byChapter.set(ch, {
              easy: { total: 0, correct: 0 },
              medium: { total: 0, correct: 0 },
              hard: { total: 0, correct: 0 },
            });
          }
          const agg = byChapter.get(ch);
          const add = (key) => {
            const t = (v?.[key]?.total) || 0;
            const c = (v?.[key]?.correct) || 0;
            agg[key].total += t;
            agg[key].correct += c;
          };
          add('easy'); add('medium'); add('hard');
        });
      });

      const accuracyByChapterDifficulty = Array.from(byChapter.entries()).map(([chapter, stats]) => ({
        chapter,
        Easy: stats.easy.total > 0 ? Math.round((stats.easy.correct / stats.easy.total) * 100) : 0,
        Medium: stats.medium.total > 0 ? Math.round((stats.medium.correct / stats.medium.total) * 100) : 0,
        Hard: stats.hard.total > 0 ? Math.round((stats.hard.correct / stats.hard.total) * 100) : 0,
      }));

      const questionsByChapter = Array.from(byChapter.entries()).map(([chapter, stats]) => ({
        chapter,
        attempted: (stats.easy.total + stats.medium.total + stats.hard.total),
        correct: (stats.easy.correct + stats.medium.correct + stats.hard.correct),
      }));

      base.accuracyByChapterDifficulty = accuracyByChapterDifficulty;
      base.questionsByChapter = questionsByChapter;

      // Average Accuracy by Subject from cumulative performance
      const accuracyBySubject = chapterSummary.subjects.map(s => {
        const perf = s.performance || {};
        const totalQ = perf.totalQuestions || 0;
        const totalC = perf.totalCorrect || 0;
        return {
          subject: s.subjectName || 'Unspecified',
          accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
        };
      });
      base.accuracyBySubject = accuracyBySubject;
    }

    return base;
  }, [processedRecords, chapterSummary]);

  // KPI metrics from backend-transformed records
  const kpis = useMemo(() => {
    const totalQuestions = processedRecords.reduce((sum, r) => sum + (r.questionsAttempted || 0), 0);
    const totalCorrect = processedRecords.reduce((sum, r) => sum + (r.questionsCorrect || 0), 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const avgTime = processedRecords.length > 0
      ? Math.round(processedRecords.reduce((sum, r) => sum + (r.averageTimePerQuestion || 0), 0) / processedRecords.length)
      : 0;
    const averageScore = processedRecords.length > 0
      ? Math.round(processedRecords.reduce((sum, r) => sum + (r.accuracy || 0), 0) / processedRecords.length)
      : 0;
    return { totalQuestions, overallAccuracy, avgTime, averageScore };
  }, [processedRecords]);

  const renderContent = () => {
    switch (currentSection) {
      case 'assessment': return <AssessmentSection />;
      case 'result': return <ResultSection />;
      case 'planner': return <TestPlannerSection />;
      case 'support':
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Support</h2>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <p className="text-gray-600">Contact support at support@example.com</p>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Top KPI Metrics */}
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Welcome, {studentInfo.name || 'Student'}!</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <DashboardCard title="Overall Accuracy" value={`${kpis.overallAccuracy}%`} icon={<Target className="text-amber-600" />} color="bg-amber-50" />
                <DashboardCard title="Avg Time per Question" value={`${kpis.avgTime}s`} icon={<Clock className="text-indigo-600" />} color="bg-indigo-50" />
                <DashboardCard title="Total Questions Attempted" value={`${kpis.totalQuestions}`} icon={<BookOpen className="text-blue-600" />} color="bg-blue-50" />
                <DashboardCard title="Average Score" value={`${kpis.averageScore}%`} icon={<Award className="text-purple-600" />} color="bg-purple-50" />
              </div>
            </div>

            {/* Detailed Analytics */}
            <ParticleBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <AccuracyBySubjectChart data={chartData.accuracyBySubject} />
                <AccuracyByDifficultyChart data={chartData.accuracyByDifficulty} />
                <div className="lg:col-span-2">
                  <AccuracyByChapterDifficultyChart data={chartData.accuracyByChapterDifficulty} />
                </div>
                <QuestionsByChapterChart data={chartData.questionsByChapter} />
              </div>
            </div>
          </>
        );
    }
  };

  const DashboardCard = ({ title, value, icon, color, subtext }) => (
    <div className={`${color} rounded-lg p-4 md:p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium text-sm md:text-base">{title}</h3>
        {icon}
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      {subtext && <p className="text-xs md:text-sm text-gray-600 mt-1">{subtext}</p>}
    </div>
  );

  DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    subtext: PropTypes.string,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${showMobileSidebar ? 'block' : 'hidden'}`} onClick={() => setShowMobileSidebar(false)}>
        <div className="absolute inset-y-0 left-0 w-64" onClick={e => e.stopPropagation()}>
          <StudentSidebar currentSection={currentSection} onSectionChange={(section) => { setCurrentSection(section); setShowMobileSidebar(false); }} onLogout={onLogout} />
        </div>
      </div>
      <div className="hidden lg:block">
        <StudentSidebar currentSection={currentSection} onSectionChange={setCurrentSection} onLogout={onLogout} />
      </div>

      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileSidebar(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
              </h1>
            </div>
            <div className="relative">
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <img src={studentInfo.profileImage || DEFAULT_PROFILE_IMAGE} alt={studentInfo.name || 'Student'} className="w-8 h-8 rounded-full object-cover" />
                <span className="hidden md:inline">{studentInfo.name || 'Student'}</span>
                <ChevronDown size={16} />
              </button>
              {showProfileDropdown && (
                <ProfileDropdown studentInfo={studentInfo} onClose={() => setShowProfileDropdown(false)} />
              )}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

StudentDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default StudentDashboard;