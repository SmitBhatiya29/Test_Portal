import { useState } from 'react';
import PropTypes from 'prop-types';

const TimeSettingsSection = ({ onCreate }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [enablePerQuestionTiming, setEnablePerQuestionTiming] = useState(false);
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [gracePeriod, setGracePeriod] = useState('5');

  const handleCreate = () => {
    if (!startDate || !startTime || !duration) {
      alert('Please fill in all required fields');
      return;
    }
    onCreate({
      startDate,
      startTime,
      duration,
      enablePerQuestionTiming,
      allowLateSubmission,
      gracePeriod: allowLateSubmission ? gracePeriod : null,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Test Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enablePerQuestionTiming}
              onChange={(e) => setEnablePerQuestionTiming(e.target.checked)}
              className="text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable per-question timing
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500 ml-6">
            Set individual time limits for each question
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowLateSubmission}
              onChange={(e) => setAllowLateSubmission(e.target.checked)}
              className="text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Allow late submission
            </span>
          </label>
          {allowLateSubmission && (
            <div className="mt-2 ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grace period (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Create Test
        </button>
      </div>
    </div>
  );
};

TimeSettingsSection.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default TimeSettingsSection;