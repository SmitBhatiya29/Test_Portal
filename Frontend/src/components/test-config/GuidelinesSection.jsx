import { useState } from 'react';
import PropTypes from 'prop-types';

const HIGHLIGHT_COLORS = [
  { name: 'Red', class: 'text-red-600' },
  { name: 'Yellow', class: 'text-yellow-600' },
  { name: 'Green', class: 'text-green-600' },
  { name: 'Blue', class: 'text-blue-600' },
  { name: 'Purple', class: 'text-purple-600' },
];

const GuidelinesSection = ({ onNext }) => {
  const [guidelines, setGuidelines] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0].class);

  const handleHighlight = () => {
    if (selectedText) {
      const newText = guidelines.replace(
        selectedText,
        `<span class="${selectedColor}">${selectedText}</span>`
      );
      setGuidelines(newText);
      setSelectedText('');
    }
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Guidelines
          </label>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.class)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color.class ? 'border-gray-900' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.name.toLowerCase() }}
                  title={color.name}
                />
              ))}
            </div>
            <button
              onClick={handleHighlight}
              disabled={!selectedText}
              className={`px-4 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 ${
                selectedColor.replace('text', 'border').replace('600', '500')
              } ${selectedColor}`}
            >
              Highlight Selected Text
            </button>
          </div>
          <div
            contentEditable
            onSelect={handleSelect}
            className="min-h-[300px] p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            dangerouslySetInnerHTML={{ __html: guidelines }}
            onBlur={(e) => setGuidelines(e.target.innerHTML)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onNext(guidelines)}

          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

GuidelinesSection.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default GuidelinesSection;