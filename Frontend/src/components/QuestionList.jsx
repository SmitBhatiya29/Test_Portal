import { useState } from 'react';
import { Edit3, Replace, Trash2, CheckCircle, Circle, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import QuestionEditor from './QuestionEditor';

const QuestionList = ({ 
  questions, 
  chapterName, 
  selectedQuestions, 
  onQuestionsChange, 
  onCreateTest 
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);

  const toggleQuestionSelection = (question) => {
    const isSelected = selectedQuestions.some(q => q.id === question.id);
    if (isSelected) {
      onQuestionsChange(selectedQuestions.filter(q => q.id !== question.id));
    } else {
      onQuestionsChange([...selectedQuestions, question]);
    }
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.length === questions.length) {
      onQuestionsChange([]);
    } else {
      onQuestionsChange([...questions]);
    }
  };

  const handleQuestionUpdate = (updatedQuestion) => {
    // For now, we'll just close the editor
    // In a real app, you'd update the question in your data source
    setEditingQuestion(null);
    console.log('Question updated:', updatedQuestion);
  };

  const handleQuestionDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      // In a real app, you'd delete from your data source
      console.log('Delete question:', questionId);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (editingQuestion) {
    return (
      <QuestionEditor
        question={editingQuestion}
        onSave={handleQuestionUpdate}
        onCancel={() => setEditingQuestion(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {chapterName} Questions
            </h2>
            <p className="text-gray-600 mt-1">
              Select questions to create your test
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {selectedQuestions.length} of {questions.length} selected
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={selectAllQuestions}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedQuestions.length === questions.length ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {selectedQuestions.length === questions.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>

          <button
            onClick={onCreateTest}
            disabled={selectedQuestions.length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Create Test ({selectedQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const isSelected = selectedQuestions.some(q => q.id === question.id);
          
          return (
            <div
              key={question.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => toggleQuestionSelection(question)}
                      className="mt-1"
                    >
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Question {index + 1}
                        </span>
                        {question.difficulty && (
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        {question.question}
                      </h3>
                      
                      {/* Options */}
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center space-x-2 p-2 rounded ${
                              question.correctAnswer === optionIndex
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50'
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-600 w-6">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="text-sm text-gray-900">{option}</span>
                            {question.correctAnswer === optionIndex && (
                              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-900">
                            <span className="font-medium">Explanation: </span>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => console.log('Replace question:', question.id)}
                      className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                      title="Replace Question"
                    >
                      <Replace className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleQuestionDelete(question.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
            <Circle className="w-full h-full" />
          </div>
          <p className="text-gray-600">No questions available for this chapter.</p>
        </div>
      )}
    </div>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.array,
    correctAnswer: PropTypes.number,
    difficulty: PropTypes.string,
    explanation: PropTypes.string
  })).isRequired,
  chapterName: PropTypes.string,
  selectedQuestions: PropTypes.array.isRequired,
  onQuestionsChange: PropTypes.func.isRequired,
  onCreateTest: PropTypes.func.isRequired,
};

export default QuestionList;