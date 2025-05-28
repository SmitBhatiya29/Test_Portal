import PropTypes from 'prop-types';
import { FileText, Upload } from 'lucide-react';

const NewQuizOptions = ({ onCreateFromScratch, onImportFromFile }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8">Create new test</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={onCreateFromScratch}
          className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
        >
          <FileText size={48} className="text-gray-400 group-hover:text-emerald-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Create from scratch</h3>
            <p className="text-gray-600">Start with a blank test and add your own questions</p>
          </div>
        </button>

        <button
          onClick={onImportFromFile}
          className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
        >
          <Upload size={48} className="text-gray-400 group-hover:text-emerald-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Import from file</h3>
            <p className="text-gray-600">Upload questions from Word, Excel or text file</p>
          </div>
        </button>
      </div>
    </div>
  );
};

NewQuizOptions.propTypes = {
  onCreateFromScratch: PropTypes.func.isRequired,
  onImportFromFile: PropTypes.func.isRequired,
};

export default NewQuizOptions;