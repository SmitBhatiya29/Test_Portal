import React from 'react';
import PropTypes from 'prop-types';
import { LayoutDashboard, BookOpen, Award, Calendar, HelpCircle, LogOut } from 'lucide-react';

const StudentSidebar = ({ currentSection, onSectionChange, onLogout }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <BookOpen size={20} />, label: 'Assessment', id: 'assessment' },
    { icon: <Award size={20} />, label: 'Result', id: 'result' },
    { icon: <Calendar size={20} />, label: 'Test Planner', id: 'planner' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'Support', id: 'support' },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r sticky top-0">
      <div className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-md bg-emerald-100 text-emerald-600">
          <BookOpen size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">Quizemaster</span>
          <span className="text-xs text-gray-500">Assessment Suite</span>
        </div>
      </div>
      
      <nav className="flex-1 px-2 md:px-4 py-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 text-sm md:text-base ${
              currentSection === item.id ? 'bg-emerald-50 text-emerald-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 md:px-4 py-2 border-t">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 text-sm md:text-base ${
              currentSection === item.id ? 'bg-emerald-50 text-emerald-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 text-sm md:text-base"
        >
          <LogOut size={20} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

StudentSidebar.propTypes = {
  currentSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default StudentSidebar;