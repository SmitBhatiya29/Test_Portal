import { FileText, HelpCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const ChapterList = ({ chapters, subjectName, onChapterSelect }) => {
  const getChapterColor = (index) => {
    const colors = [
      'bg-blue-50 border-blue-200 hover:bg-blue-100',
      'bg-green-50 border-green-200 hover:bg-green-100',
      'bg-purple-50 border-purple-200 hover:bg-purple-100',
      'bg-pink-50 border-pink-200 hover:bg-pink-100',
      'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      'bg-red-50 border-red-200 hover:bg-red-100',
      'bg-teal-50 border-teal-200 hover:bg-teal-100'
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
      'text-indigo-600',
      'text-red-600',
      'text-teal-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {subjectName} Chapters
        </h2>
        <p className="text-gray-600">
          Select a chapter to view and manage questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, index) => {
          const cardColor = getChapterColor(index);
          const iconColor = getIconColor(index);

          return (
            <div
              key={chapter.id}
              onClick={() => onChapterSelect(chapter)}
              className={`${cardColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <FileText className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-white bg-opacity-60 px-2 py-1 rounded-full">
                    {chapter.questions?.length || 0} Questions
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {chapter.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Ready to use questions
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-xs text-gray-600 text-center">
                      Click to view and select questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No chapters available for this subject.</p>
        </div>
      )}
    </div>
  );
};

ChapterList.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    questions: PropTypes.array
  })).isRequired,
  subjectName: PropTypes.string,
  onChapterSelect: PropTypes.func.isRequired,
};

export default ChapterList;