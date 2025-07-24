import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Search, Settings2, Edit2, Trash2 } from 'lucide-react';

const QuizList = ({ quizzes = [], onNewQuiz, onEditQuiz, onDeleteQuiz, onDefaultTests }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">My tests</h1>
          <span className="text-gray-500">({quizzes.length})</span>
        </div>
        <div className="flex gap-2">
          {/* Default Test Button */}
          <button
            onClick={onDefaultTests}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <span>Default test</span>
          </button>

          {/* New Test Button */}
          <button
            onClick={onNewQuiz}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus size={18} />
            <span>New test</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-gray-600 whitespace-nowrap">Category</span>
            <select className="flex-1 pl-4 pr-8 py-2 border rounded-lg bg-white">
              <option>All categories</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings2 size={18} />
            <span>Manage categories</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-gray-600 whitespace-nowrap">Status</span>
            <select className="flex-1 pl-4 pr-8 py-2 border rounded-lg bg-white">
              <option>All</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id || quiz.id} className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className={`px-3 py-1 text-sm rounded-full w-fit ${
                  quiz.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {quiz.status || 'DRAFT'}
                </span>
                <span className="text-sm text-gray-500">
                  CREATED: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditQuiz(quiz)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => onDeleteQuiz(quiz._id || quiz.id)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {quiz.basicDetails?.testName || quiz.title || quiz.basicDetails?.title || 'Untitled Quiz'}
            </h3>
            <p className="text-gray-600 mb-4">
              {quiz.basicDetails?.description || quiz.description || '(no description)'}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-sm text-gray-500 uppercase">
                {quiz.category || quiz.basicDetails?.category || 'UNCATEGORIZED'}
              </span>
              {quiz.status === 'ACTIVE' && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">50% avg. score</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Results (30)</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

QuizList.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    basicDetails: PropTypes.shape({
      testName: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string
    })
  })).isRequired,
  onNewQuiz: PropTypes.func.isRequired,
  onEditQuiz: PropTypes.func.isRequired,
  onDeleteQuiz: PropTypes.func.isRequired,
  onDefaultTests: PropTypes.func.isRequired, // ADD THIS LINE
};

export default QuizList;
