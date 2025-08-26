import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, Square } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';
import TestStartPopup from './TestStartPopup';
import axios from 'axios';

const QuizTest = ({ testData, onEndTest }) => {
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFullScreenWarning, setShowFullScreenWarning] = useState(false);

  // Prepare questions
  const sampleQuestions = testData.questions.map((q, index) => ({
    id: q._id,
    questionNumber: index + 1,
    type: q.type,
    questionText: q.text,
    options: q.options,
    correctOption: q.correctOption || '' ,// optional if available
    difficulty: q.difficulty || 'Easy'
  }));

  // Convert duration string to seconds
  const getDurationInSeconds = (duration) => {
    const minutes = parseInt(duration.replace(' minutes', ''));
    return minutes * 60;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle fullscreen events
  const handleFullScreenChange = useCallback(() => {
    if (testStarted && !document.fullscreenElement) {
      setShowFullScreenWarning(true);
    } else {
      setShowFullScreenWarning(false);
    }
  }, [testStarted]);

  // Handle tab visibility change
  const handleVisibilityChange = useCallback(() => {
    if (testStarted && document.hidden) {
      setShowFullScreenWarning(true);
    }
  }, [testStarted]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleFullScreenChange, handleVisibilityChange]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (testStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, timeRemaining]);

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowStartPopup(false);
      setTestStarted(true);
      setTimeRemaining(getDurationInSeconds(testData.duration));
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      // Start test anyway if fullscreen fails
      setShowStartPopup(false);
      setTestStarted(true);
      setTimeRemaining(getDurationInSeconds(testData.duration));
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleMarkForReview = () => {
    const questionId = sampleQuestions[currentQuestionIndex].id;
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleEndTest = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      const token = localStorage.getItem('token');

      const answers = sampleQuestions.map((q) => {
        const ans = {
          questionId: q.id,
          questionText: q.questionText,
          type: q.type,
          selectedOption: selectedAnswers[q.id] || '',
          correctOption: q.correctOption || '',
          marksAwarded: 0
        };

        // Log each answer object to debug
        console.log("Answer Debug:", ans);
        return ans;
      });

      const payload = {
        quizId: testData.id,
        studentId: localStorage.getItem('studentId'),
        teacherId: testData.createdBy || testData.teacherId, // Get teacherId from testData
        answers,
        totalMarks: 0,
        totalNegativeMarks: 0
      };

      // Deep debug
      console.log("🚀 Submitting Payload >>>", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        'http://localhost:5000/api/quiz-results/submit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Quiz result submitted successfully.', response.data);
      const summary = response?.data?.summary;
      if (summary) {
        // Persist last summary for result screen
        localStorage.setItem('lastResultSummary', JSON.stringify(summary));
        alert(`Quiz submitted! Your score: ${summary.obtainedMarks}/${summary.totalPossibleMarks}`);
      } else {
        alert('Quiz submitted successfully!');
      }
    } catch (error) {
      console.error('❌ Error submitting quiz result:', error);

      // Try to extract more info
      if (error.response) {
        console.error("❗ Backend response:", error.response.data);
      }

      alert('Failed to submit quiz. Please try again.');
    } finally {
      setTestStarted(false);
      // Pass summary up if parent wants to show a result page
      try {
        const stored = localStorage.getItem('lastResultSummary');
        const summary = stored ? JSON.parse(stored) : null;
        onEndTest && onEndTest(summary);
      } catch {
        onEndTest && onEndTest();
      }
    }
  };

  const returnToFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullScreenWarning(false);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{testData.subject}</h2>
            <p className="text-gray-600">{testData.title}</p>
          </div>
          <button
            onClick={() => setShowStartPopup(true)}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors w-full"
          >
            Start Test
          </button>
        </div>

        <TestStartPopup
          isOpen={showStartPopup}
          onClose={() => setShowStartPopup(false)}
          onStart={handleStartTest}
          testData={testData}
        />
      </div>
    );
  }

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const isCurrentMarked = markedForReview.has(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Screen Warning */}
      {showFullScreenWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Square size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Full Screen Required</h3>
            <p className="text-gray-600 mb-6">
              You must stay in full screen mode during the test. Please return to full screen to continue.
            </p>
            <button
              onClick={returnToFullScreen}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Return to Full Screen
            </button>
          </div>
        </div>
      )}

      {/* Header with Timer */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{testData.subject}</h1>
            <p className="text-gray-600">{testData.title}</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
            <Clock size={20} className="text-red-600" />
            <span className="font-mono text-lg font-semibold text-red-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Question */}
        <div className="flex-1 p-6">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerChange={handleAnswerChange}
          />
        </div>

        {/* Right Side - Question Navigation */}
        <div className="w-80 bg-white border-l p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {sampleQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-emerald-600 text-white'
                    : markedForReview.has(q.id)
                    ? 'bg-amber-100 text-amber-700'
                    : selectedAnswers[q.id]
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-600 rounded"></div>
              <span className="text-gray-600">Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 rounded"></div>
              <span className="text-gray-600">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 rounded"></div>
              <span className="text-gray-600">Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-gray-600">Not Answered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleMarkForReview}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isCurrentMarked
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Flag size={18} />
              {isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}
            </button>

            <button
              onClick={handleEndTest}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              End Test
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === sampleQuestions.length - 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTest;
