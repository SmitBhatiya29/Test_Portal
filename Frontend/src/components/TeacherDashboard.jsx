import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import QuizList from './QuizList';
import TestConfiguration from './TestConfiguration';
import ResultDatabase from './ResultDatabase';
import AccountSettings from './AccountSettings';
import HelpSupport from './HelpSupport';
import Respondent from './Respondents';
import DefaultTests from './DefaultTests'; // ✅ Make sure this file exists
import axios from 'axios';
import TeacherAnalytics from './TeacherAnalytics';

const TeacherDashboard = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('tests');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes/my-quizzes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Fetched quizzes:', response.data.quizzes);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEditQuiz = (quiz) => {
    console.log('Edit quiz:', quiz);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 200) {
        setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      } else {
        alert(res.data.message || 'Failed to delete quiz');
      }
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleCreateQuiz = (formData) => {
    const finalTestData = {
      ...formData,
    };

    console.log("Final test data ready to send:", finalTestData);

    const { basicDetails = {}, timeSettings = {}, guidelines = '', access = {}, questions = [] } = formData;

    const newQuiz = {
      id: String(quizzes.length + 1),
      title: basicDetails.title || 'Untitled Quiz',
      description: basicDetails.description || '',
      category: basicDetails.category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      questions: questions,
      settings: {
        ...timeSettings,
        guidelines,
        access
      }
    };

    setQuizzes([...quizzes, newQuiz]);
    setCurrentView('tests');
  };

  const handleSidebarNavigation = (path) => {
    setCurrentView(path);
    setShowMobileSidebar(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'new-test':
        return (
          <TestConfiguration
            onBack={() => setCurrentView('tests')}
            onComplete={handleCreateQuiz}
          />
        );
      case 'default-tests':
        return (
          <DefaultTests
            onBack={() => setCurrentView('tests')}
            onCreateQuiz={handleCreateQuiz}
          />
        );
      case 'analytics':
        return <TeacherAnalytics />;
      case 'tests':
        return (
          <QuizList
            quizzes={quizzes}
            onNewQuiz={() => setCurrentView('new-test')}
            onEditQuiz={handleEditQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onDefaultTests={() => setCurrentView('default-tests')} // ✅ Added
          />
        );
      case 'respondents':
        return <Respondent />;
      case 'results':
        return <ResultDatabase />;
      case 'account':
        return <AccountSettings />;
      case 'help':
        return <HelpSupport />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${showMobileSidebar ? 'block' : 'hidden'}`}
        onClick={() => setShowMobileSidebar(false)}
      >
        <div className="absolute inset-y-0 left-0 w-64" onClick={e => e.stopPropagation()}>
          <Sidebar onLogout={onLogout} onNavigate={handleSidebarNavigation} currentView={currentView} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onLogout={onLogout} onNavigate={handleSidebarNavigation} currentView={currentView} />
      </div>

      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}
            </h1>
            <div className="w-6" />
          </div>
        </header>

        {/* Main Content */}
        <div className="min-h-screen">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

TeacherDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default TeacherDashboard;
