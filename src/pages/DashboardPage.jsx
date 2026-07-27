import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { FolderTree, CupSoda, Settings, ChevronLeft, CalendarDays, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function StatCard({ title, value, icon: Icon, to, color }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={`absolute -left-4 -top-4 h-20 w-20 rounded-full opacity-10 ${color}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${color} bg-opacity-10`}>
          <Icon size={22} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
        مشاهده
        <ChevronLeft size={14} />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0, recentItems: [] });
  const [cafeName, setCafeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventsEnabled } = useAuth();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const me = await apiFetch('/auth/me');
        const cafeId = me.cafeId;
        setCafeName(me.cafeName);

        const [categoriesRes, menuRes] = await Promise.all([
          apiFetch('/category'),
          apiFetch('/menu')
        ]);

        const categories = Array.isArray(categoriesRes) ? categoriesRes : [];
        const items = Array.isArray(menuRes) ? menuRes : [];

        const sortedItems = [...items].sort((a, b) => b.id - a.id);

        setStats({
          categories: categories.length,
          items: items.length,
          recentItems: sortedItems.slice(0, 5)
        });
      } catch (err) {
        setError(err.message || 'خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  const statCards = [
    { title: 'دسته‌بندی‌ها', value: stats.categories, icon: FolderTree, to: '/categories', color: 'bg-blue-500' },
    { title: 'آیتم‌های منو', value: stats.items, icon: CupSoda, to: '/menu-items', color: 'bg-emerald-500' },
    { title: 'تنظیمات کافه', value: ' ', icon: Settings, to: '/settings', color: 'bg-purple-500' },
    { title: 'اشتراک', value: 'پرداخت', icon: CreditCard, to: '/subscription', color: 'bg-amber-500' },
  ];

  if (eventsEnabled) {
    statCards.splice(3, 0, { title: 'رویدادها', value: 'مدیریت', icon: CalendarDays, to: '/events', color: 'bg-fuchsia-500' });
  }

  const quickNavLinks = [
    { to: '/categories', icon: FolderTree, color: 'text-blue-500', label: 'مدیریت دسته‌بندی‌ها' },
    { to: '/menu-items', icon: CupSoda, color: 'text-emerald-500', label: 'مدیریت آیتم‌ها' },
    { to: '/settings', icon: Settings, color: 'text-purple-500', label: 'تنظیمات کافه' },
  ];

  if (eventsEnabled) {
    quickNavLinks.push({ to: '/events', icon: CalendarDays, color: 'text-fuchsia-500', label: 'مدیریت رویدادها' });
  }

  quickNavLinks.push({ to: '/subscription', icon: CreditCard, color: 'text-amber-500', label: 'اشتراک و پرداخت' });

  return (
    <div className="space-y-6">
      {cafeName && (
        <h1 className="text-2xl font-bold text-gray-800">
          {cafeName} 👋
        </h1>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.to} {...card} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">دسترسی سریع</h2>
          <div className="space-y-2">
            {quickNavLinks.map(({ to, icon: Icon, color, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} className={color} />
                  {label}
                </span>
                <ChevronLeft size={16} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">آیتم‌های اخیر</h2>
          {stats.recentItems.length === 0 ? (
            <p className="text-sm text-gray-500">هیچ آیتمی ثبت نشده است.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recentItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <CupSoda size={16} />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-700">{item.title}</span>
                      <span className="text-xs text-gray-400 mr-2">{item.categoryName}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {item.price?.toLocaleString('fa-IR') || 0} تومان
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}