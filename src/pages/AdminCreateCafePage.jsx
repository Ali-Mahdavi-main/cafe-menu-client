import { useState } from 'react';
import { apiFetch } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import ThemeEditor from '../components/ThemeEditor';
import { Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminCreateCafePage() {
  const [form, setForm] = useState({
    cafeName: '',
    username: '',
    password: '',
    address: '',
    logoUrl: '',
    instagramUrl: '',
    phone: '',
    workingHours: '',
    eventsEnabled: true,
  });

  // Theme state – merged with defaults inside ThemeEditor
  const [theme, setTheme] = useState({});

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const payload = {
        ...form,
        eventsEnabled: form.eventsEnabled,
        themeConfigJson: JSON.stringify(theme),
      };

      const data = await apiFetch('/admin/cafes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setFeedback({
        type: 'success',
        message: `کافه با موفقیت ساخته شد. لینک منو: ${data.publicMenuUrl}`,
      });

      // Reset form
      setForm({
        cafeName: '',
        username: '',
        password: '',
        address: '',
        logoUrl: '',
        instagramUrl: '',
        phone: '',
        workingHours: '',
        eventsEnabled: true,
      });
      setTheme({});
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'خطا در ساخت کافه' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10" dir="rtl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.65)]">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-300"><Sparkles size={16} /> ساخت کافه جدید</div>
          <h1 className="mt-2 text-2xl font-bold">راه‌اندازی سریع و حرفه‌ای برای کافه</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">در این بخش می‌توانید کافه را با منوی عمومی، تنظیمات ظاهر و دسترسی رویدادها ایجاد کنید.</p>
        </div>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
          <ArrowLeft size={16} /> خروج
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 mb-6 text-sm font-medium ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {feedback.type === 'success' && <div className="mb-1">✅ {feedback.message}</div>}
          {feedback.type === 'error' && <div>{feedback.message}</div>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
        {/* Basic fields same as before */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کافه *</label>
            <input name="cafeName" value={form.cafeName} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری *</label>
            <input name="username" value={form.username} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.eventsEnabled} onChange={(e) => setForm({ ...form, eventsEnabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
            <ShieldCheck size={16} className="text-emerald-600" />
            فعال‌سازی بخش رویدادها برای این کافه
          </label>
          <p className="mt-2 text-xs text-slate-500">این گزینه فقط برای کافه‌های دارای اشتراک فعال و با مجوز ادمین قابل استفاده است.</p>
        </div>

        <ImageUploader currentImage={form.logoUrl} onImageUploaded={(url) => setForm({ ...form, logoUrl: url })} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">لینک اینستاگرام</label>
            <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ساعت کاری</label>
            <input name="workingHours" value={form.workingHours} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Theme Editor */}
        <ThemeEditor value={theme} onChange={setTheme} />

        <div className="border-t border-slate-200 pt-4">
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'در حال ساخت...' : 'ساخت کافه'}
          </button>
        </div>
      </form>
    </div>
  );
}