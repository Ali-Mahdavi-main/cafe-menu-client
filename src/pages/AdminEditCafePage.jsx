import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import ThemeEditor from '../components/ThemeEditor';

export default function AdminEditCafePage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [theme, setTheme] = useState({});
  const [publicMenuUrl, setPublicMenuUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function fetchCafe() {
      try {
        const cafes = await apiFetch('/admin/cafes');
        const cafe = cafes.find(c => c.id == id);
        if (cafe) {
          setForm({
            cafeName: cafe.name || '',
            username: '',
            password: '',
            address: cafe.address || '',
            logoUrl: cafe.logoUrl || '',
            instagramUrl: cafe.instagramUrl || '',
            phone: cafe.phone || '',
            workingHours: cafe.workingHours || '',
          });

          // Parse existing theme JSON
          const themeObj = cafe.themeConfigJson ? JSON.parse(cafe.themeConfigJson) : {};
          setTheme(themeObj);

          if (cafe.publicAccessKey) {
            setPublicMenuUrl(`${window.location.origin}/menu/${cafe.id}/${cafe.publicAccessKey}`);
          }
        } else {
          setFeedback({ type: 'error', message: 'کافه پیدا نشد' });
        }
      } catch (err) {
        setFeedback({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    }
    fetchCafe();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        cafeName: form.cafeName,
        address: form.address,
        logoUrl: form.logoUrl,
        instagramUrl: form.instagramUrl,
        phone: form.phone,
        workingHours: form.workingHours,
        themeConfigJson: JSON.stringify(theme),
        // Only include username/password if they are provided
        ...(form.username && { username: form.username }),
        ...(form.password && { password: form.password }),
      };

      await apiFetch(`/admin/cafes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setFeedback({ type: 'success', message: 'تغییرات با موفقیت ذخیره شد' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ویرایش کافه</h1>
        <button onClick={() => navigate('/admin/cafes')} className="text-sm text-gray-600 hover:underline">
          بازگشت به لیست
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 mb-6 text-sm font-medium ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Public menu link */}
      {publicMenuUrl && (
        <div className="mb-6 bg-blue-50 rounded-lg p-3 text-sm">
          <span className="text-gray-600">لینک عمومی منو: </span>
          <a
            href={publicMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-mono ml-2 break-all"
          >
            {publicMenuUrl}
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کافه *</label>
            <input name="cafeName" value={form.cafeName} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری (در صورت تغییر وارد کنید)</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید (در صورت تغییر وارد کنید)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
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
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}