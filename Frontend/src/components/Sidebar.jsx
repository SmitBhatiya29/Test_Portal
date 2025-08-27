import PropTypes from 'prop-types';
import { LayoutGrid, Users, Database, Settings, HelpCircle, LogOut, BarChart3, BookOpen } from 'lucide-react';

const Sidebar = ({ onLogout, onNavigate, currentView }) => {
  const menuItems = [
    { icon: <LayoutGrid size={20} />, label: 'My Tests', id: 'tests' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', id: 'analytics' },
    { icon: <Users size={20} />, label: 'Respondents', id: 'respondents' },
    { icon: <Database size={20} />, label: 'Results database', id: 'results' },
    { icon: <Settings size={20} />, label: 'My account', id: 'account' },
    
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'Help', id: 'help' },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r fixed">
      <div className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-md bg-emerald-100 text-emerald-600">
          <BookOpen size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">Quizemaster</span>
          <span className="text-xs text-gray-500">Assessment Suite</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 transition-colors ${
              currentView === item.id ? 'bg-emerald-50 text-emerald-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-2 border-t">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 transition-colors ${
              currentView === item.id ? 'bg-emerald-50 text-emerald-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
};

export default Sidebar;