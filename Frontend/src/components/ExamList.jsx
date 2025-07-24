import { BookOpen, Users, Award, Brain, Zap, Building, MapPin, MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';

const ExamList = ({ exams, onExamSelect }) => {
  const getExamIcon = (examId) => {
    const iconMap = {
      '10th-standard': BookOpen,
      '12th-standard': BookOpen,
      'jee': Brain,
      'neet': Award,
      'gate': Zap,
      'upsc': Building,
      'gpsc': MapPin,
      'other-exams': MoreHorizontal
    };
    return iconMap[examId] || BookOpen;
  };

  const getExamColor = (examId) => {
    const colorMap = {
      '10th-standard': 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      '12th-standard': 'bg-green-50 border-green-200 hover:bg-green-100',
      'jee': 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      'neet': 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      'gate': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      'upsc': 'bg-red-50 border-red-200 hover:bg-red-100',
      'gpsc': 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      'other-exams': 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    };
    return colorMap[examId] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  const getIconColor = (examId) => {
    const colorMap = {
      '10th-standard': 'text-blue-600',
      '12th-standard': 'text-green-600',
      'jee': 'text-purple-600',
      'neet': 'text-pink-600',
      'gate': 'text-yellow-600',
      'upsc': 'text-red-600',
      'gpsc': 'text-indigo-600',
      'other-exams': 'text-gray-600'
    };
    return colorMap[examId] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Exam Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select from our comprehensive collection of exam categories to access pre-built questions 
          and create tests instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exams.map((exam) => {
          const IconComponent = getExamIcon(exam.id);
          const cardColor = getExamColor(exam.id);
          const iconColor = getIconColor(exam.id);

          return (
            <div
              key={exam.id}
              onClick={() => onExamSelect(exam)}
              className={`${cardColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <IconComponent className={`w-8 h-8 ${iconColor}`} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exam.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="flex items-center justify-center w-full mt-4">
                  <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white bg-opacity-60 rounded-full">
                    {exam.subjects?.length || 0} Subjects
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ExamList.propTypes = {
  exams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    subjects: PropTypes.array
  })).isRequired,
  onExamSelect: PropTypes.func.isRequired,
};

export default ExamList;