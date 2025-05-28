import PropTypes from 'prop-types';
import { FileText, Lock, Clock, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: <FileText size={20} />, label: 'Basic Details', id: 'basic' },
  { icon: <Lock size={20} />, label: 'Test Access', id: 'access' },
  { icon: <FileText size={20} />, label: 'Guidelines & Summary', id: 'guidelines' },
  { icon: <Clock size={20} />, label: 'Time Settings', id: 'time' },
];

const TestConfigSidebar = ({ currentSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-white h-screen border-r flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Test Configuration</h2>
      </div>

      <nav className="flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 ${
              currentSection === item.id
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight size={16} className={currentSection === item.id ? 'text-emerald-600' : 'text-gray-400'} />
          </button>
        ))}
      </nav>
    </div>
  );
};

TestConfigSidebar.propTypes = {
  currentSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default TestConfigSidebar;