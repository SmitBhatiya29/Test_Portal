import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import ExamList from './ExamList';
import SubjectList from './SubjectList';
import ChapterList from './ChapterList';
import QuestionList from './QuestionList';
import { defaultTestsData } from './data/defaultTestsData';

const DefaultTests = ({ onBack, onCreateQuiz }) => {
  const [currentStep, setCurrentStep] = useState('exams');
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setCurrentStep('subjects');
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentStep('chapters');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentStep('questions');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'subjects':
        setCurrentStep('exams');
        setSelectedExam(null);
        break;
      case 'chapters':
        setCurrentStep('subjects');
        setSelectedSubject(null);
        break;
      case 'questions':
        setCurrentStep('chapters');
        setSelectedChapter(null);
        break;
      default:
        onBack();
    }
  };

  const handleCreateTest = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question to create a test.');
      return;
    }

    const testData = {
      basicDetails: {
        title: `${selectedExam?.name} - ${selectedSubject?.name} - ${selectedChapter?.name}`,
        description: `Auto-generated test from default questions`,
        category: selectedExam?.name || 'General'
      },
      timeSettings: {
        duration: Math.max(selectedQuestions.length * 2, 10), // 2 minutes per question, minimum 10 minutes
        showTimer: true
      },
      guidelines: 'This is an auto-generated test from default questions. Read each question carefully before answering.',
      access: {
        isPublic: true,
        password: ''
      },
      questions: selectedQuestions.map((question, index) => ({
        id: question.id,
        question: question.question,
        type: 'multiple-choice',
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: 1,
        explanation: question.explanation,
        difficulty: question.difficulty
      }))
    };

    onCreateQuiz(testData);
  };

  const renderBreadcrumb = () => {
    const breadcrumbItems = ['Default Tests'];
    
    if (selectedExam) breadcrumbItems.push(selectedExam.name);
    if (selectedSubject) breadcrumbItems.push(selectedSubject.name);
    if (selectedChapter) breadcrumbItems.push(selectedChapter.name);

    return (
      <nav className="text-sm text-gray-600 mb-4">
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">›</span>}
            <span className={index === breadcrumbItems.length - 1 ? 'text-blue-600 font-medium' : ''}>
              {item}
            </span>
          </span>
        ))}
      </nav>
    );
  };

  const renderCurrentView = () => {
    switch (currentStep) {
      case 'exams':
        return (
          <ExamList 
            exams={defaultTestsData.exams} 
            onExamSelect={handleExamSelect} 
          />
        );
      case 'subjects':
        return (
          <SubjectList 
            subjects={selectedExam?.subjects || []} 
            examName={selectedExam?.name}
            onSubjectSelect={handleSubjectSelect} 
          />
        );
      case 'chapters':
        return (
          <ChapterList 
            chapters={selectedSubject?.chapters || []} 
            subjectName={selectedSubject?.name}
            onChapterSelect={handleChapterSelect} 
          />
        );
      case 'questions':
        return (
          <QuestionList 
            questions={selectedChapter?.questions || []}
            chapterName={selectedChapter?.name}
            selectedQuestions={selectedQuestions}
            onQuestionsChange={setSelectedQuestions}
            onCreateTest={handleCreateTest}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Default Tests</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderBreadcrumb()}
        {renderCurrentView()}
      </div>
    </div>
  );
};

DefaultTests.propTypes = {
  onBack: PropTypes.func.isRequired,
  onCreateQuiz: PropTypes.func.isRequired,
};

export default DefaultTests;