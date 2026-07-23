import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, description, onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-gray-600 hover:text-gray-900"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {user?.userName}
        </span>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
          {user?.userName?.charAt(0) || 'ک'}
        </div>
      </div>
    </header>
  );
}