import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft } from 'lucide-react';
import BasicDetailsSection from './test-config/BasicDetailsSection';
import GuidelinesSection from './test-config/GuidelinesSection';
import TestAccessSection from './test-config/TestAccessSection';
import TimeSettingsSection from './test-config/TimeSettingsSection';
import QuizCreation from './QuizCreation';
import axios from 'axios';
import TeacherDashboard from './TeacherDashboard';

import { useNavigate } from 'react-router-dom';
const TestConfiguration = ({ onBack, onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicDetails: null,
    guidelines: null,
    access: null,
    timeSettings: null,
    questions: []
  });

  const handleStepComplete = (step, data) => {
    console.log("Step:", step);
    console.log("Data received:", data); // ✅ This will log the data from BasicDetailsSection
    setFormData(prev => ({ ...prev, [step]: data }));
    setCurrentStep(currentStep + 1);
  };
 

const teacherToken = localStorage.getItem('token'); // or whatever key you're using

const handleCreate = async (questions) => {
  const finalTestData = {
    basicDetails: formData.basicDetails,
    guidelines: { content: formData.guidelines },
    testAccess: formData.access,
    timeSettings: {
      startDate: formData.timeSettings.startDate,
      startTime: formData.timeSettings.startTime,
      durationMinutes: Number(formData.timeSettings.duration),
      enablePerQuestionTiming: formData.timeSettings.enablePerQuestionTiming,
      allowLateSubmission: formData.timeSettings.allowLateSubmission,
      gracePeriodMinutes: Number(formData.timeSettings.gracePeriod || 0)
    },
    questions
  };

  try {
    const response = await axios.post(
      'http://localhost:5000/api/quizzes',
      finalTestData,
      {
        headers: {
          Authorization: `Bearer ${teacherToken}`
        }
      }
    );
    console.log('✅ Quiz created:', response.data);
    
    // Call onComplete before navigation
    if (onComplete) {
      onComplete(finalTestData);
    }
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      navigate('/teacher');
    }, 100);

  } catch (error) {
    console.error('❌ Error creating quiz:', error.response?.data || error.message);
    // You might want to show an error message to the user here
  }
};

  

  const steps = [
    { number: 1, title: 'Basic Details' },
    { number: 2, title: 'Guidelines' },
    { number: 3, title: 'Test Access' },
    { number: 4, title: 'Time Settings' },
    { number: 5, title: 'Questions' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsSection onNext={(data) => handleStepComplete('basicDetails', data)} />;
      case 2:
        return <GuidelinesSection onNext={(data) => handleStepComplete('guidelines', data)} />;
      case 3:
        return <TestAccessSection onNext={(data) => handleStepComplete('access', data)} />;
      case 4:
        return <TimeSettingsSection onCreate={(data) => handleStepComplete('timeSettings', data)} />;
      case 5:
        return <QuizCreation chapters={formData.basicDetails?.chapters || []} onSave={handleCreate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Test</h1>
          </div>

          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= step.number
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-12 mx-4 ${
                        currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

TestConfiguration.propTypes = {
  onBack: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default TestConfiguration;