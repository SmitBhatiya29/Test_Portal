import PropTypes from 'prop-types';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const NewQuizForm = ({ onBack }) => {
  const [logoOption, setLogoOption] = useState('app');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        <span>New test</span>
      </button>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-6">Initial Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter test name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-3">
              <select className="flex-1 px-4 py-2 border rounded-lg">
                <option value="">Select category</option>
              </select>
              <button className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50">
                Create category
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional notes visible only to you)
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg h-32 resize-none"
              placeholder="Add test description for identification purposes"
            />
            <p className="text-sm text-gray-500 mt-1">It will be visible to you only.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test language
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Select test language.</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">LOGO</h3>
            <p className="text-sm text-gray-700 mb-4">Logo is visible in online and printable version of the test.</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="logo"
                  checked={logoOption === 'custom'}
                  onChange={() => setLogoOption('custom')}
                  className="text-emerald-500"
                />
                <span>Add my logo</span>
                {logoOption === 'custom' && (
                  <button className="px-4 py-1 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50">
                    Select
                  </button>
                )}
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="logo"
                  checked={logoOption === 'app'}
                  onChange={() => setLogoOption('app')}
                  className="text-emerald-500"
                />
                <span>Use application logo</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="logo"
                  checked={logoOption === 'none'}
                  onChange={() => setLogoOption('none')}
                  className="text-emerald-500"
                />
                <span>Hide logo</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
          Create
        </button>
      </div>
    </div>
  );
};

NewQuizForm.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default NewQuizForm;