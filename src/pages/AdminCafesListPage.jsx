import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { PlusCircle, ShieldCheck, Sparkles, ArrowLeft, Clock, CreditCard } from 'lucide-react';

export default function AdminCafesListPage() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/admin/cafes')
      .then(setCafes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-8 text-center text-red-600">خطا: {error.message}</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10" dir="rtl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.65)]">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-300"><Sparkles size={16} /> مدیریت کافه‌ها</div>
          <h1 className="mt-2 text-2xl font-bold">نظارت روی همه کافه‌ها در یک صفحه</h1>
          <p className="mt-2 text-sm text-slate-300">وضعیت اشتراک، دسترسی رویدادها و اطلاعات کافه‌ها را مدیریت کنید.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/create-cafe"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            <PlusCircle size={16} /> ساخت کافه جدید
          </Link>
          <Link
            to="/admin/subscription"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            <CreditCard size={16} /> مدیریت اشتراک
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
            <ArrowLeft size={16} /> خروج
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-right">نام کافه</th>
              <th className="px-4 py-3 text-right">نام کاربری</th>
              <th className="px-4 py-3 text-right">تلفن</th>
              <th className="px-4 py-3 text-right">آدرس</th>
              <th className="px-4 py-3 text-right">دسترسی رویداد</th>
              <th className="px-4 py-3 text-right">وضعیت اشتراک</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cafes.map((cafe) => (
              <tr key={cafe.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-800">{cafe.name}</td>
                <td className="px-4 py-3 text-slate-600">{cafe.userName}</td>
                <td className="px-4 py-3 text-slate-600">{cafe.phone || '-'}</td>
                <td className="max-w-xs truncate px-4 py-3 text-slate-600">{cafe.address || '-'}</td>
                <td className="px-4 py-3">
                  {cafe.eventsEnabled ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> فعال</span> : <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><ShieldCheck size={14} /> غیرفعال</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    cafe.eventsEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <CreditCard size={14} /> فعال
                  </span>
                </td>
                <td className="px-4 py-3 text-left">
                  <button
                    onClick={() => navigate(`/admin/cafes/${cafe.id}/edit`)}
                    className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    ویرایش
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}