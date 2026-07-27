import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { Loader2, ArrowRight, CalendarDays } from 'lucide-react';

export default function PublicEventsPage() {
  const { cafeId, accessKey } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/public/events/${cafeId}/${accessKey}`)
      .then((res) => setEvents(Array.isArray(res) ? res : []))
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <p>رویدادی برای این کافه موجود نیست.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.22),_transparent_40%),linear-gradient(135deg,#020617,#111827)] px-4 py-8 text-white" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div>
            <p className="text-sm text-slate-400">رویدادهای ویژه</p>
            <h1 className="text-2xl font-bold">پروموشن و اتفاقات کافه</h1>
          </div>
          <Link to={`/qr/${cafeId}/${accessKey}`} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            بازگشت <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-slate-300 md:col-span-2">
              در حال حاضر رویدادی ثبت نشده است.
            </div>
          ) : events.map((event) => (
            <div key={event.id} className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{event.description}</p>
                </div>
                <div className="rounded-full bg-fuchsia-500/20 p-2 text-fuchsia-300">
                  <CalendarDays size={18} />
                </div>
              </div>
              {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="mt-4 h-44 w-full rounded-2xl object-cover" /> : null}
              <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                <span>{event.eventDateShamsi}</span>
                {event.fee ? <span>هزینه: {Number(event.fee).toLocaleString('fa-IR')} تومان</span> : <span>رایگان</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
