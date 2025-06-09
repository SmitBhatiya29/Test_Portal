import React from 'react';
import { X, AlertTriangle, Clock, FileText, Target } from 'lucide-react';

const TestStartPopup = ({ isOpen, onClose, onStart, testData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Start Test</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 font-medium">
                You cannot leave full screen during the test. The test will be monitored for tab switching and full-screen exits.
              </p>
            </div>
          </div>

          {/* Test Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Test Name</p>
                <p className="font-semibold text-gray-800">{testData.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText size={20} className="text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Test Title</p>
                <p className="font-semibold text-gray-800">{testData.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={20} className="text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-800">{testData.duration}</p>
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={18} />
                Test Guidelines
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    Read each question carefully before selecting your answer
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    You can navigate between questions using Previous/Next buttons
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    Mark questions for review if you want to revisit them later
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    Do not close the browser or switch tabs during the test
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    Submit your test before the time runs out
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onStart}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestStartPopup;