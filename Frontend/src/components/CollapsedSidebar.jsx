import { mainNavIcons } from './icons';

const CollapsedSidebar = () => {
  const menuItems = [
    { icon: 'dashboard', path: '/' },
    { icon: 'users', path: '/respondents' },
    { icon: 'database', path: '/results' },
    { icon: 'settings', path: '/account' },
  ];

  const bottomItems = [
    { icon: 'help', path: '/help' },
    { icon: 'logout', path: '/logout' },
  ];

  return (
    <div className="w-16 bg-white h-screen flex flex-col border-r">
      <div className="p-4 flex justify-center">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">T</div>
      </div>
      
      <nav className="flex-1 px-2 py-2">
        {menuItems.map((item) => {
          const Icon = mainNavIcons[item.icon];
          return (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center justify-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
            >
              <Icon size={20} />
            </a>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t">
        {bottomItems.map((item) => {
          const Icon = mainNavIcons[item.icon];
          return (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center justify-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsedSidebar;