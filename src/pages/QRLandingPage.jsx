import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { MenuSquare, CalendarDays, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function QRLandingPage() {
  const { cafeId, accessKey } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventsEnabled } = useAuth();

  useEffect(() => {
    apiFetch(`/public/${cafeId}/${accessKey}`)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cafeId, accessKey]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <p>درخواست شما معتبر نیست.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_40%),linear-gradient(135deg,#0f172a,#111827)] px-4 py-8 text-white" dir="rtl">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-300">به {data.cafeName} خوش آمدید</p>
              <h1 className="mt-2 text-3xl font-bold">انتخاب کنید، چه بخواهید ببینید؟</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">از منوی ویژه یا رویدادهای جاری کافه لذت ببرید.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link to={`/menu/${cafeId}/${accessKey}`} className="group rounded-[28px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <MenuSquare size={24} className="text-emerald-400" />
              منوی کافه
            </div>
            <p className="mt-3 text-sm text-slate-300">مشاهده آیتم‌های منو، قیمت‌ها و دسته‌بندی‌های جذاب.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-2 text-sm text-emerald-300">باز کردن منو <ArrowLeft size={16} /></div>
          </Link>

          {eventsEnabled && data.eventsEnabled !== false && (
            <Link to={`/events/${cafeId}/${accessKey}`} className="group rounded-[28px] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 to-violet-400/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
              <div className="flex items-center gap-3 text-xl font-semibold">
                <CalendarDays size={24} className="text-fuchsia-400" />
                رویدادها
              </div>
              <p className="mt-3 text-sm text-slate-300">مشاهده پروموشن‌ها، رویدادهای ویژه و برنامه‌های کافه.</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/40 px-4 py-2 text-sm text-fuchsia-300">مشاهده رویدادها <ArrowLeft size={16} /></div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
