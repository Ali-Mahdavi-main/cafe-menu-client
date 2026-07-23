import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Save, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

export default function SettingsPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    cafeName: '',
    logoUrl: '',
    address: '',
    phone: '',
    instagram: '',
    workingHours: '',
  });

  const [publicAccessKey, setPublicAccessKey] = useState('');
  const publicMenuUrl =
    user && publicAccessKey
      ? `${window.location.origin}/menu/${user.cafeId}/${publicAccessKey}`
      : '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  // Confirmation dialog state
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ show: true, message: msg, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  // Load current settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiFetch('/settings');
        setForm({
          cafeName: data.cafeName || '',
          logoUrl: data.logoUrl || '',
          address: data.address || '',
          phone: data.phone || '',
          instagram: data.instagram || '',
          workingHours: data.workingHours || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Load public access key
  useEffect(() => {
    async function loadKey() {
      try {
        const data = await apiFetch('/settings/public-key');
        setPublicAccessKey(data.publicAccessKey);
      } catch {}
    }
    loadKey();
  }, []);

  // Trigger confirmation dialog
  const requestRegenerateKey = () => {
    setShowRegenConfirm(true);
  };

  // Actual regeneration
  const regenerateKey = async () => {
    try {
      const data = await apiFetch('/settings/regenerate-key', { method: 'POST' });
      setPublicAccessKey(data.publicAccessKey);
      showFeedback('لینک جدید ساخته شد. لینک قبلی دیگر کار نخواهد کرد.');
    } catch (err) {
      showFeedback(err.message, 'error');
    } finally {
      setShowRegenConfirm(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      showFeedback('تنظیمات با موفقیت ذخیره شد');
    } catch (err) {
      showFeedback(err.message || 'خطا در ذخیره تنظیمات', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error && !form.cafeName) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-600">
        خطا در دریافت تنظیمات: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Feedback */}
      {feedback.show && (
        <div
          className={`fixed bottom-6 left-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">تنظیمات کافه</h1>
        <p className="text-sm text-gray-500">اطلاعات کافه خود را مدیریت کنید</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
        {/* Logo */}
        <ImageUploader
          currentImage={form.logoUrl}
          onImageUploaded={(url) => setForm({ ...form, logoUrl: url })}
        />

        {/* Cafe Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام کافه</label>
          <Input
            value={form.cafeName}
            onChange={(e) => setForm({ ...form, cafeName: e.target.value })}
            placeholder="مثال: کافه باغ"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="تهران، خیابان ولیعصر..."
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="021-12345678"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
          <Input
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://instagram.com/cafe"
            dir="ltr"
          />
        </div>

        {/* Working Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ساعت کاری</label>
          <Input
            value={form.workingHours}
            onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
            placeholder="شنبه تا پنجشنبه ۸ صبح تا ۱۱ شب"
          />
        </div>

        {/* Public Access Key Section */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">دسترسی عمومی</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Input
              value={publicMenuUrl}
              readOnly
              dir="ltr"
              className="flex-1 text-left"
              placeholder="https://..."
            />
            <Button variant="outline" onClick={requestRegenerateKey} className="gap-2 whitespace-nowrap">
              <RefreshCcw size={16} />
              بازسازی لینک
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            این لینک را می‌توانید به مشتریان خود بدهید یا در QR Code استفاده کنید
          </p>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save size={16} />
                ذخیره تغییرات
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog for Regeneration */}
      <Dialog open={showRegenConfirm} onOpenChange={setShowRegenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={20} />
              هشدار مهم
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            با بازسازی لینک، لینک قبلی و تمامی QR Code‌های چاپ شده بر اساس آن 
            <strong className="text-red-600"> از کار خواهند افتاد</strong>.
            <br />
            مشتریان دیگر نمی‌توانند از لینک قدیمی به منوی شما دسترسی پیدا کنند.
          </p>
          <p className="text-sm text-gray-700 mt-1">
            آیا از انجام این کار اطمینان دارید؟
          </p>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setShowRegenConfirm(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={regenerateKey}>
              بله، لینک جدید بساز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}