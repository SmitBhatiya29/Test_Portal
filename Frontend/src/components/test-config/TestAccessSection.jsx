import { useState } from 'react';
import PropTypes from 'prop-types';

const TestAccessSection = ({ onNext }) => {
  const [databaseName, setDatabaseName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const handleNext = () => {
    // Validation agar chahiye to yahan kare
    if (!databaseName.trim()) {
      alert("Database Name is required!");
      return;
    }
    // Data ko onNext ko bhejna
    onNext({
      databaseName,
      accessCode,
      isPublic,
    });
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Database Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter database name for student access"
          />
          <p className="mt-1 text-sm text-gray-500">
            Only students in this database will be able to access the test
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Make test public (anyone with the link can access)
            </span>
          </label>
        </div>

        {!isPublic && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Code (Optional)
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter access code"
            />
            <p className="mt-1 text-sm text-gray-500">
              If set, students will need to enter this code to access the test
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

TestAccessSection.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default TestAccessSection;