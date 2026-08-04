import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { MenuSquare, CalendarDays, Sparkles, Loader2, ArrowLeft, AlertTriangle, RefreshCcw } from 'lucide-react';
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
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin opacity-80" />
        <p className="text-sm text-slate-400">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-slate-900 px-6 text-white" dir="rtl">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-[28px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
            <AlertTriangle size={22} />
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            این لینک معتبر نیست یا دیگر در دسترس نمی‌باشد.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
          >
            <RefreshCcw size={14} />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // No event feature for this cafe (globally off, or disabled per-cafe) → skip the choice screen entirely
  const showEvents = eventsEnabled && data.eventsEnabled !== false;
  if (!showEvents) {
    return <Navigate to={`/menu/${cafeId}/${accessKey}`} replace />;
  }

  const theme = data.theme || {};

  const bgStyle = {
    backgroundColor: theme.backgroundColor || '#0f172a',
    color: theme.textColor || '#ffffff',
    fontFamily: theme.fontFamily || 'sans-serif',
  };

  const cardStyle = {
    backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.1)',
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.2)',
    borderRadius: `${theme.borderRadius || 28}px`,
    boxShadow: theme.shadow !== 'none' ? theme.shadow : '0 20px 60px -20px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(16px)',
  };

  return (
    <div
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 py-8"
      dir="rtl"
      style={bgStyle}
    >
      {theme.backgroundLightEnabled && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transform-gpu translate-z-0">
          <div
            className="absolute -top-10 -right-10 h-80 w-80 rounded-full opacity-50 blur-3xl transform-gpu"
            style={{ background: `radial-gradient(circle, ${theme.primaryColor || '#8b5cf6'}80, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-16 -left-10 h-80 w-80 rounded-full opacity-40 blur-3xl transform-gpu"
            style={{ background: `radial-gradient(circle, ${theme.secondaryColor || theme.primaryColor || '#6366f1'}70, transparent 70%)` }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="animate-fade-in-up border p-8 text-center sm:p-10" style={cardStyle}>
          {data.logoUrl ? (
            <img
              src={data.logoUrl}
              alt={data.cafeName}
              className="mx-auto mb-6 h-24 w-24 rounded-full border-4 object-cover shadow-xl"
              style={{ borderColor: theme.primaryColor || 'rgba(255,255,255,0.35)' }}
            />
          ) : (
            <div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black text-white shadow-xl"
              style={{ backgroundColor: theme.primaryColor || 'rgba(255,255,255,0.15)' }}
            >
              {data.cafeName?.[0] || '☕'}
            </div>
          )}

          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs uppercase tracking-widest opacity-70"
            style={{ borderColor: 'currentColor' }}
          >
            <Sparkles size={12} />
            به {data.cafeName} خوش آمدید
          </span>

        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to={`/menu/${cafeId}/${accessKey}`}
            className="group animate-fade-in-up flex flex-col justify-between border p-8 transition-all hover:-translate-y-2 hover:shadow-2xl"
            style={{ ...cardStyle, borderTop: `4px solid ${theme.primaryColor}`, animationDelay: '80ms' }}
          >
            <div>
              <div className="mb-4 flex items-center gap-3 text-2xl font-bold" style={{ color: theme.primaryColor }}>
                <MenuSquare size={28} /> منوی دیجیتال
              </div>
              <p className="text-base leading-relaxed opacity-80">
                مشاهده تمامی آیتم‌ها، دسته‌بندی‌ها و قیمت‌های به‌روز کافه.
              </p>
            </div>
            <div
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
            >
              مشاهده منو
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </Link>

          <Link
            to={`/events/${cafeId}/${accessKey}`}
            className="group animate-fade-in-up flex flex-col justify-between border p-8 transition-all hover:-translate-y-2 hover:shadow-2xl"
            style={{ ...cardStyle, borderTop: `4px solid ${theme.secondaryColor}`, animationDelay: '160ms' }}
          >
            <div>
              <div className="mb-4 flex items-center gap-3 text-2xl font-bold" style={{ color: theme.secondaryColor }}>
                <CalendarDays size={28} /> رویدادها
              </div>
              <p className="text-base leading-relaxed opacity-80">
                باخبر شدن از پروموشن‌ها، موسیقی زنده و برنامه‌های ویژه.
              </p>
            </div>
            <div
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: theme.secondaryColor, color: '#fff' }}
            >
              مشاهده رویدادها
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}