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
import { Save, Loader2, RefreshCcw, AlertTriangle, Check, X, Link2 } from 'lucide-react';
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
      ? `${window.location.origin}/qr/${user.cafeId}/${publicAccessKey}`
      : '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ show: true, message: msg, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

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

  useEffect(() => {
    async function loadKey() {
      try {
        const data = await apiFetch('/settings/public-key');
        setPublicAccessKey(data.publicAccessKey);
      } catch {}
    }
    loadKey();
  }, []);

  const requestRegenerateKey = () => {
    setShowRegenConfirm(true);
  };

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
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error && !form.cafeName) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-600">
        خطا در دریافت تنظیمات: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6" dir="rtl">
      {/* Feedback */}
      {feedback.show && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] animate-slide-up ${
            feedback.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {feedback.type === 'error' ? <X size={17} /> : <Check size={17} />}
          {feedback.message}
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)] sm:p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100 ring-1 ring-white/15">
            بخش تنظیمات
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">تنظیمات کافه</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)] sm:p-8">
        <ImageUploader
          currentImage={form.logoUrl}
          onImageUploaded={(url) => setForm({ ...form, logoUrl: url })}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">نام کافه</label>
          <Input
            value={form.cafeName}
            onChange={(e) => setForm({ ...form, cafeName: e.target.value })}
            placeholder="مثال: کافه باغ"
            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">آدرس</label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="تهران، خیابان ولیعصر..."
            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">تلفن</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="021-12345678"
              dir="ltr"
              className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-left transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">اینستاگرام</label>
            <Input
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/cafe"
              dir="ltr"
              className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-left transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">ساعت کاری</label>
          <Input
            value={form.workingHours}
            onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
            placeholder="شنبه تا پنجشنبه ۸ صبح تا ۱۱ شب"
            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
          />
        </div>

        {/* Public Access Key */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Link2 size={15} />
            </div>
            <h2 className="text-sm font-semibold text-slate-800">دسترسی عمومی</h2>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              value={publicMenuUrl}
              readOnly
              dir="ltr"
              placeholder="https://..."
              className="h-11 flex-1 rounded-xl border-slate-200 bg-white text-left text-slate-500"
            />
            <Button
              variant="outline"
              onClick={requestRegenerateKey}
              className="h-11 gap-2 whitespace-nowrap rounded-xl border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900"
            >
              <RefreshCcw size={15} />
              بازسازی لینک
            </Button>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
           لینک دسترسی به منو
          </p>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-green-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
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

      {/* Regenerate Key Warning */}
      <Dialog open={showRegenConfirm} onOpenChange={setShowRegenConfirm}>
        <DialogContent className="rounded-2xl border-0 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] sm:max-w-md">
          <DialogHeader className="items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-slate-900">
              هشدار مهم
            </DialogTitle>
          </DialogHeader>

          <div className="mt-1 space-y-2 text-center text-sm leading-relaxed text-slate-500">
            <p>
              با بازسازی لینک، لینک قبلی و تمامی QR Code‌های چاپ شده بر اساس آن{' '}
              <span className="font-medium text-rose-600">از کار خواهند افتاد</span>.
            </p>
            <p>مشتریان دیگر نمی‌توانند از لینک قدیمی به منوی شما دسترسی پیدا کنند.</p>
          </div>

          <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={regenerateKey}
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md"
            >
              بله، لینک جدید بساز
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRegenConfirm(false)}
              className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}