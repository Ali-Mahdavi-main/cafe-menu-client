import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderTree,
  CupSoda,
  Settings,
  LogOut,
  X,
  CalendarDays,
  CreditCard,
} from 'lucide-react';

const allLinks = [
  { to: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { to: '/menu-items', label: 'آیتم‌های منو', icon: CupSoda },
  { to: '/events', label: 'رویدادها', icon: CalendarDays },
  { to: '/subscription', label: 'اشتراک', icon: CreditCard },
  { to: '/settings', label: 'تنظیمات', icon: Settings },
];

export default function AppSidebar({ open, onClose }) {
  const { user, logout, eventsEnabled } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = eventsEnabled ? allLinks : allLinks.filter((l) => l.to !== '/events');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        lg:static lg:translate-x-0 lg:shadow-none lg:border-l border-gray-200
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800">
            {user?.cafeName || 'کافه من'}
          </span>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}