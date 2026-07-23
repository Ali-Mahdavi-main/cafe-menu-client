import { useState } from 'react';
import { apiFetch } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import ThemeEditor from '../components/ThemeEditor';

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
        themeConfigJson: JSON.stringify(theme),  // theme is already the full object
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
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ساخت کافه جدید</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
          خروج
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
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

        <div className="pt-4 border-t">
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'در حال ساخت...' : 'ساخت کافه'}
          </button>
        </div>
      </form>
    </div>
  );
}