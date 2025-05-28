import { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import QuizList from './QuizList';
import TestConfiguration from './TestConfiguration';
import ResultDatabase from './ResultDatabase';
import AccountSettings from './AccountSettings';
import HelpSupport from './HelpSupport';

const TeacherDashboard = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('tests');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [quizzes, setQuizzes] = useState([
    {
      id: '1',
      title: 'Maths Test',
      description: '',
      category: 'UNCATEGORIZED',
      language: 'en',
      status: 'SETUP',
      createdAt: '2025-01-02',
      questions: [],
      settings: {
        shuffleQuestions: true,
        showResults: true,
        certificateEnabled: false,
      },
    },
    {
      id: '2',
      title: 'C Programming Test',
      description: '',
      category: 'UNCATEGORIZED',
      language: 'en',
      status: 'SETUP',
      createdAt: '2025-01-02',
      questions: [],
      settings: {
        shuffleQuestions: true,
        showResults: true,
        certificateEnabled: true,
      },
    },
  ]);

  const handleEditQuiz = (quiz) => {
    console.log('Edit quiz:', quiz);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
  };

  const handleCreateQuiz = (formData) => {
    const finalTestData = {
      ...formData,
    };

    console.log("Final test data ready to send:", finalTestData);

    const newQuiz = {
      id: String(quizzes.length + 1),
      ...finalTestData.basicDetails,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      questions: finalTestData.questions,
      settings: {
        ...finalTestData.timeSettings,
        guidelines: finalTestData.guidelines,
        access: finalTestData.access
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
      case 'tests':
        return (
          <QuizList
            quizzes={quizzes}
            onNewQuiz={() => setCurrentView('new-test')}
            onEditQuiz={handleEditQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        );
      case 'respondents':
        return <div className="p-6">Respondents section coming soon</div>;
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
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
            <div className="w-6" /> {/* Spacer for alignment */}
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
