import { useState } from 'react';
import PropTypes from 'prop-types';

const BasicDetailsSection = ({ onNext }) => {
  const [logoOption, setLogoOption] = useState('app');
  const [testName, setTestName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [chapterInput, setChapterInput] = useState('');
  const [chapters, setChapters] = useState([]);

  const handleNext = () => {
    if (!testName.trim()) {
      alert('Please enter a test name');
      return;
    }
    if (!subjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }
    onNext({
      testName,
      subjectName,
      description,
      language,
      logoOption,
      chapters
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter test name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter subject name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter test description"
          />
        </div>

        {/* Chapters Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chapters</label>
          <div className="flex gap-2">
            <input
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const value = chapterInput.trim();
                  if (!value) return;
                  if (!chapters.includes(value)) setChapters([...chapters, value]);
                  setChapterInput('');
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Type a chapter and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                const value = chapterInput.trim();
                if (!value) return;
                if (!chapters.includes(value)) setChapters([...chapters, value]);
                setChapterInput('');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {chapters.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm">
                {c}
                <button type="button" onClick={() => setChapters(chapters.filter(x => x !== c))} className="hover:text-emerald-900">×</button>
              </span>
            ))}
            {chapters.length === 0 && (
              <span className="text-sm text-gray-500">No chapters added yet.</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Add chapters to tag each question in the next step.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Logo Options</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="logo"
                checked={logoOption === 'custom'}
                onChange={() => setLogoOption('custom')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span>Add My Logo</span>
              {logoOption === 'custom' && (
                <button className="px-4 py-1 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50">
                  Upload Logo
                </button>
              )}
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="logo"
                checked={logoOption === 'app'}
                onChange={() => setLogoOption('app')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span>Use Application Logo</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="logo"
                checked={logoOption === 'none'}
                onChange={() => setLogoOption('none')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span>Hide Logo</span>
            </label>
          </div>
        </div>
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

BasicDetailsSection.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default BasicDetailsSection;
