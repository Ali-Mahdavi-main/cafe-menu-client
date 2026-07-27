import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import Navbar from '../components/Navbar';

const pageTitles = {
  '/dashboard': { title: 'داشبورد', description: 'خلاصه وضعیت کافه' },
  '/categories': { title: 'دسته‌بندی‌ها', description: 'مدیریت دسته‌بندی منو' },
  '/menu-items': { title: 'آیتم‌های منو', description: 'مدیریت آیتم‌ها' },
  '/events': { title: 'رویدادها', description: 'مدیریت Promotion و رویدادها' },
  '/subscription': { title: 'اشتراک', description: 'پلن‌ها و پرداخت' },
  '/settings': { title: 'تنظیمات', description: 'اطلاعات کافه' },
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: '...', description: '' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          title={pageInfo.title}
          description={pageInfo.description}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}