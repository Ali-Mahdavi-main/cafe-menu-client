import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Loader2, PlusCircle, Trash2, Save, Sparkles, ImagePlus } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  fee: 0,
  eventDate: '',
  isActive: true,
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  async function fetchEvents() {
    try {
      const data = await apiFetch('/events');
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'خطا در بارگذاری رویدادها' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploaded = await apiFetch('/upload', {
          method: 'POST',
          body: uploadData,
          headers: {},
        });
        imageUrl = uploaded.imageUrl;
      }

      const payload = {
        ...form,
        imageUrl,
        cafeId: Number(form.cafeId || 0),
        fee: Number(form.fee || 0),
        eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : new Date().toISOString(),
      };
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setForm(emptyForm);
      setImageFile(null);
      await fetchEvents();
      setFeedback({ type: 'success', message: 'رویداد با موفقیت ثبت شد.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'ثبت رویداد انجام نشد.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/events/${id}`, { method: 'DELETE' });
      await fetchEvents();
      setFeedback({ type: 'success', message: 'رویداد حذف شد.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'حذف رویداد انجام نشد.' });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {feedback && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {feedback.message}
        </div>
      )}

      <div className="rounded-[32px] bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-violet-100">بخش رویدادها</p>
            <h1 className="mt-2 text-2xl font-bold">رویدادها و Promotion</h1>
            <p className="mt-2 max-w-2xl text-sm text-violet-100">
              رویدادهای ویژه کافه خود را ثبت کنید تا مشتریان در مسیر QR، گزینه مشاهده رویدادها را ببینند.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-violet-100">
              <Sparkles size={16} />
              <span>پیشنهاد ویژه</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSave} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)] space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <PlusCircle size={18} className="text-violet-600" />
            افزودن رویداد جدید
          </div>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان رویداد" />
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="توضیح رویداد" />
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
              <ImagePlus size={16} className="text-violet-600" />
              <span>{imageFile ? imageFile.name : 'انتخاب تصویر از دستگاه'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="یا لینک تصویر را وارد کنید" />
          <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="هزینه" />
          <Input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            فعال باشد
          </label>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            ذخیره رویداد
          </Button>
        </form>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <CalendarDays size={18} className="text-blue-600" />
            رویدادهای ثبت‌شده
          </div>
          <div className="mt-4 space-y-3">
            {events.length === 0 ? (
              <p className="text-sm text-slate-500">هنوز رویدادی ثبت نشده است.</p>
            ) : events.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{event.description}</p>
                  <p className="mt-2 text-xs text-slate-400">{event.eventDateShamsi || event.eventDate}</p>
                </div>
                <button onClick={() => handleDelete(event.id)} className="text-sm text-red-600 hover:underline">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
