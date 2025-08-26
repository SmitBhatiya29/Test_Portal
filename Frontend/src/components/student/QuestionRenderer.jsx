import React from 'react';

const QuestionRenderer = ({ question, selectedAnswers, onAnswerChange }) => {
  const handleAnswerChange = (value, isChecked = null) => {
    if (question.type === 'MSQ') {
      const currentAnswers = selectedAnswers[question.id] || [];
      let newAnswers;
      if (isChecked) {
        newAnswers = [...currentAnswers, value];
      } else {
        newAnswers = currentAnswers.filter(answer => answer !== value);
      }
      onAnswerChange(question.id, newAnswers);
    } else {
      onAnswerChange(question.id, value);
    }
  };

  const renderOptions = () => {
    switch (question.type) {
      case 'MCQ':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={selectedAnswers[question.id] === index}
                  onChange={() => handleAnswerChange(index)}
                  className="mr-3 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'MSQ':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  value={index}
                  checked={(selectedAnswers[question.id] || []).includes(index)}
                  onChange={(e) => handleAnswerChange(index, e.target.checked)}
                  className="mr-3 w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'NAT':
        return (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Enter your numeric answer"
              value={selectedAnswers[question.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700"
            />
          </div>
        );

      case 'TrueFalse':
        return (
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="True"
                checked={selectedAnswers[question.id] === 'True'}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="mr-3 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">True</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="False"
                checked={selectedAnswers[question.id] === 'False'}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="mr-3 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">False</span>
            </label>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Question {question.questionNumber}
          </h3>
          <p className="text-gray-700 leading-relaxed">{question.questionText}</p>
        </div>

        {/* ✅ Difficulty Badge */}
        {question.difficulty && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.difficulty === 'Easy'
                ? 'bg-green-100 text-green-700'
                : question.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {question.difficulty}
          </span>
        )}
      </div>
      {renderOptions()}
    </div>
  );
};

export default QuestionRenderer;
