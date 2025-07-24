import { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const QuestionEditor = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer ?? 0,
    difficulty: question?.difficulty || 'Medium',
    explanation: question?.explanation || ''
  });

  const [errors, setErrors] = useState({});

  const handleQuestionChange = (value) => {
    setFormData(prev => ({ ...prev, question: value }));
    if (errors.question) {
      setErrors(prev => ({ ...prev, question: null }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
    
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: null }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer >= index && prev.correctAnswer > 0 
          ? prev.correctAnswer - 1 
          : prev.correctAnswer >= newOptions.length 
          ? 0 
          : prev.correctAnswer
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    if (formData.correctAnswer >= formData.options.length || !formData.options[formData.correctAnswer]?.trim()) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const updatedQuestion = {
        ...question,
        ...formData,
        options: formData.options.filter(opt => opt.trim()) // Remove empty options
      };
      onSave(updatedQuestion);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {question ? 'Edit Question' : 'Add New Question'}
              </h1>
              <p className="text-gray-600 mt-1">
                Create or modify question details and options
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Question Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.question ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={addOption}
                  disabled={formData.options.length >= 6}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex-1 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 w-6">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {formData.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.options && (
                <p className="mt-2 text-sm text-red-600">{errors.options}</p>
              )}
              {errors.correctAnswer && (
                <p className="mt-2 text-sm text-red-600">{errors.correctAnswer}</p>
              )}
              
              <p className="mt-2 text-xs text-gray-500">
                Select the radio button to mark the correct answer
              </p>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Provide an explanation for the correct answer..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                This explanation will be shown to students after they complete the quiz
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Preview</h3>
          </div>
          <div className="p-6">
            {formData.question ? (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">
                  {formData.question}
                </h4>
                
                <div className="space-y-2">
                  {formData.options.filter(opt => opt.trim()).map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        formData.correctAnswer === index
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-600 w-6">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm text-gray-900">{option}</span>
                      {formData.correctAnswer === index && (
                        <span className="text-xs text-green-600 ml-auto font-medium">Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {formData.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">Explanation: </span>
                      {formData.explanation}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-4">
                  <span className={`px-2 py-1 rounded border ${
                    formData.difficulty === 'Easy' ? 'bg-green-100 text-green-800 border-green-200' :
                    formData.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {formData.difficulty}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Start typing your question to see the preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

QuestionEditor.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string,
    question: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.number,
    difficulty: PropTypes.string,
    explanation: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default QuestionEditor;