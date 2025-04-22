import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu , LayoutDashboard ,ClipboardList,MessageCircleMore ,CircleUserRound } from 'lucide-react';


const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { name: 'home', icon: <LayoutDashboard />, path: '/' },
    { name: 'tasks', icon: <ClipboardList  />, path: '/TasksBoard' },
    { name: 'chat', icon: <MessageCircleMore   />, path: '/ChatPage' },

  ];

  return (
    <>
      <div className="md:hidden p-6">
        <Menu
          onClick={() => setOpen(!open)}
          className="w-6 h-6 cursor-pointer text-gray-800"
        />
      </div>

      <div
        className={`
          fixed top-0 left-0 h-full w-20 bg-white shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block
        `}
      >
        <nav className="h-full flex flex-col justify-between items-center p-4">
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="md:hidden p-3 self-start">
              <Menu
                onClick={() => setOpen(false)}
                className="w-6 h-6 cursor-pointer text-gray-800"
              />
            </div>

            <div className="flex flex-col gap-4 w-full">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    p-3 rounded-lg text-center 
                    ${pathname === item.path ? 'bg-gray-300' : 'hover:bg-gray-200'} 
                    transition-colors w-full
                  `}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-center w-full">
            <Link
              to="/profile"
              className={`
                p-3 rounded-lg text-center 
                ${pathname === '/profile' ? 'bg-gray-300' : 'hover:bg-gray-200'} 
                transition-colors
              `}
              onClick={() => setOpen(false)}
            >
              <CircleUserRound />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
