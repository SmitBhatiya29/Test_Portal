import { BookOpen, Calculator, Atom, Globe, FlaskConical, Cpu } from 'lucide-react';
import PropTypes from 'prop-types';

const SubjectList = ({ subjects, examName, onSubjectSelect }) => {
  const getSubjectIcon = (subjectName) => {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return Calculator;
    if (name.includes('physic')) return Atom;
    if (name.includes('chemistry') || name.includes('science')) return FlaskConical;
    if (name.includes('computer') || name.includes('cs')) return Cpu;
    if (name.includes('biology')) return Globe;
    return BookOpen;
  };

  const getSubjectColor = (index) => {
    const colors = [
      'bg-blue-50 border-blue-200 hover:bg-blue-100',
      'bg-green-50 border-green-200 hover:bg-green-100',
      'bg-purple-50 border-purple-200 hover:bg-purple-100',
      'bg-pink-50 border-pink-200 hover:bg-pink-100',
      'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    ];
    return colors[index % colors.length];
  };

  const getIconColor = (index) => {
    const colors = [
      'text-blue-600',
      'text-green-600',
      'text-purple-600',
      'text-pink-600',
      'text-yellow-600',
      'text-indigo-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {examName} Subjects
        </h2>
        <p className="text-gray-600">
          Select a subject to view available chapters and questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const IconComponent = getSubjectIcon(subject.name);
          const cardColor = getSubjectColor(index);
          const iconColor = getIconColor(index);

          return (
            <div
              key={subject.id}
              onClick={() => onSubjectSelect(subject)}
              className={`${cardColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <IconComponent className={`w-8 h-8 ${iconColor}`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subject.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {subject.chapters?.length || 0} Chapters
                    </span>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-xs text-gray-600 text-center">
                      Click to explore chapters and questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No subjects available for this exam.</p>
        </div>
      )}
    </div>
  );
};

SubjectList.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    chapters: PropTypes.array
  })).isRequired,
  examName: PropTypes.string,
  onSubjectSelect: PropTypes.func.isRequired,
};

export default SubjectList;