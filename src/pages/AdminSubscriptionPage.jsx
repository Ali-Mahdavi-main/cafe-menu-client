import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/api';
import {
  PlusCircle,
  Trash2,
  Save,
  ShieldCheck,
  TrendingUp,
  Activity,
  Clock,
  Package,
  Tag,
  Gift,
  AlertTriangle,
  Loader2,
  Search,
  Star,
  Check,
} from 'lucide-react';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('fa-IR');
}

export default function AdminSubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [cafeSearch, setCafeSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    durationDays: 30,
    price: 0,
    discount: 0,
    isFeatured: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, statsData, cafesData] = await Promise.all([
          apiFetch('/admin/plans').catch(() => []),
          apiFetch('/admin/cafes/stats').catch(() => null),
          apiFetch('/admin/cafes').catch(() => []),
        ]);
        setPlans(Array.isArray(plansData) ? plansData : []);
        setStats(statsData);
        setCafes(Array.isArray(cafesData) ? cafesData : []);
      } catch (err) {
        setFeedback({ type: 'error', message: err.message || 'خطا در بارگذاری اطلاعات' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCafes = useMemo(() => {
    const term = cafeSearch.trim().toLowerCase();
    if (!term) return cafes;
    return cafes.filter(
      (c) => c.name?.toLowerCase().includes(term) || c.userName?.toLowerCase().includes(term)
    );
  }, [cafes, cafeSearch]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setFeedback(null);
      await apiFetch('/admin/plans', {
        method: 'POST',
        body: JSON.stringify(newPlan),
      });
      setNewPlan({ name: '', description: '', durationDays: 30, price: 0, discount: 0, isFeatured: false });
      setShowCreatePlan(false);
      const data = await apiFetch('/admin/plans').catch(() => []);
      setPlans(Array.isArray(data) ? data : []);
      setFeedback({ type: 'success', message: 'پلن جدید ساخته شد.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'خطا در ساخت پلن' });
    }
  };

  const handleUpdatePlan = async (id, field, value) => {
    try {
      await apiFetch(`/admin/plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ [field]: value }),
      });
      const data = await apiFetch('/admin/plans').catch(() => []);
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await apiFetch(`/admin/plans/${id}`, { method: 'DELETE' });
      const data = await apiFetch('/admin/plans').catch(() => []);
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleConfirmDelete = (id) => {
    if (confirmDeleteId === id) {
      handleDeletePlan(id);
      setConfirmDeleteId(null);
      return;
    }
    setConfirmDeleteId(id);
    setTimeout(() => {
      setConfirmDeleteId((current) => (current === id ? null : current));
    }, 3000);
  };

  const handleFreeSubscription = async (cafeId, planId) => {
    try {
      setFeedback(null);
      const result = await apiFetch(`/admin/cafes/${cafeId}/free-subscription`, {
        method: 'POST',
        body: JSON.stringify({ planId, durationDays: planId > 0 ? undefined : 30 }),
      });
      setFeedback({ type: 'success', message: `اشتراک برای کافه اعمال شد. معتبر تا ${result.endDateShamsi}` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'خطا در اعطای اشتراک' });
    }
  };

  const handleToggleCafeStatus = async (cafeId, currentlyDisabled) => {
    try {
      setFeedback(null);
      const endpoint = currentlyDisabled ? `/admin/cafes/${cafeId}/enable` : `/admin/cafes/${cafeId}/disable`;
      await apiFetch(endpoint, { method: 'POST' });
      const updated = await apiFetch('/admin/cafes');
      setCafes(Array.isArray(updated) ? updated : []);
      setFeedback({ type: 'success', message: currentlyDisabled ? 'کافه فعال شد' : 'کافه غیرفعال شد' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'کل کافه‌ها', value: stats.totalCafes, icon: Package, color: 'text-stone-700' },
        { label: 'اشتراک فعال', value: stats.activeSubscriptions, icon: ShieldCheck, color: 'text-emerald-600' },
        { label: 'منقضی‌شده', value: stats.expiredSubscriptions, icon: Clock, color: 'text-rose-600' },
        { label: 'رایگان', value: stats.freeSubscriptions, icon: Gift, color: 'text-amber-700' },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8" dir="rtl">
      {/* Console header */}
      <div className="mb-6 overflow-hidden rounded-[28px] border border-stone-800 bg-stone-900 p-6 text-stone-50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-stone-400 ring-1 ring-white/10">
              <Activity size={12} /> کنسول مدیریت
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">اشتراک‌ها، پلن‌ها و کافه‌ها</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
              وضعیت مالی و اشتراک تمام کافه‌های پلتفرم را از اینجا مدیریت کنید.
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-full border border-stone-700 bg-stone-800/60 p-1">
            <button
              onClick={() => setShowStats(true)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                showStats ? 'bg-white text-violet-700' : 'text-stone-300 hover:text-white'
              }`}
            >
              <TrendingUp size={13} className="ml-1 inline" /> آمار
            </button>
            <button
              onClick={() => setShowStats(false)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                !showStats ? 'bg-white text-violet-700' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Package size={13} className="ml-1 inline" /> پلن‌ها
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
            feedback.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />}
          {feedback.message}
        </div>
      )}

      {/* Stats Tab */}
      {showStats && stats && (
        <div className="space-y-6">
          {/* Ledger stat strip */}
          <div className="grid grid-cols-2 divide-x divide-dashed divide-stone-200 overflow-hidden rounded-[28px] border border-stone-200 bg-[#FBF7F0] sm:grid-cols-4">
            {statCards.map((card) => (
              <div key={card.label} className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <card.icon size={13} className={card.color} />
                  {card.label}
                </div>
                <p className={`mt-2 font-mono text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Expiring Soon */}
          {stats.cafesExpiringSoon?.length > 0 && (
            <div className="rounded-[28px] border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <AlertTriangle size={16} /> کافه‌های نزدیک به انقضا (کمتر از ۵ روز)
              </h3>
              <div className="mt-4">
                {stats.cafesExpiringSoon.map((c, i) => (
                  <div
                    key={c.cafeId}
                    className={`flex flex-wrap items-center justify-between gap-2 py-3 ${
                      i !== 0 ? 'border-t border-dashed border-amber-200' : ''
                    }`}
                  >
                    <div>
                      <span className="font-medium text-stone-800">{c.cafeName}</span>
                      <span className="mr-3 text-xs text-stone-500">پلن: {c.planName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-stone-500">{c.endDateShamsi}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          c.daysRemaining <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {c.daysRemaining} روز
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Subscriptions */}
          {stats.recentSubscriptions?.length > 0 && (
            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.2)] sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-stone-800">آخرین فعالیت‌های اشتراک</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-right text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                      <th className="px-3 py-2">کافه</th>
                      <th className="px-3 py-2">پلن</th>
                      <th className="px-3 py-2">وضعیت</th>
                      <th className="px-3 py-2 font-mono normal-case tracking-normal">شروع</th>
                      <th className="px-3 py-2 font-mono normal-case tracking-normal">پایان</th>
                      <th className="px-3 py-2">رایگان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {stats.recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="transition hover:bg-stone-50">
                        <td className="px-3 py-2.5 font-medium text-stone-800">{sub.cafeName}</td>
                        <td className="px-3 py-2.5 text-stone-600">{sub.planName}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              sub.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {sub.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-stone-500">{sub.startDateShamsi}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-stone-500">{sub.endDateShamsi}</td>
                        <td className="px-3 py-2.5">
                          {sub.isFree ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Free Subscription + Enable/Disable */}
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.2)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                <Gift size={16} className="text-emerald-600" /> اعطای اشتراک و مدیریت وضعیت کافه‌ها
              </h3>
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={cafeSearch}
                  onChange={(e) => setCafeSearch(e.target.value)}
                  placeholder="جستجوی کافه..."
                  className="h-9 rounded-full border border-stone-200 bg-stone-50 pr-9 pl-4 text-xs outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filteredCafes.map((cafe) => (
                <div
                  key={cafe.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/60 p-4"
                >
                  <div>
                    <span className="font-semibold text-stone-800">{cafe.name}</span>
                    <span className="mr-2 text-xs text-stone-500">@{cafe.userName}</span>
                    {cafe.isDisabled && (
                      <span className="mr-2 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        غیرفعال
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleFreeSubscription(cafe.id, 0)}
                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-emerald-700"
                    >
                      پلن رایگان ۳۰ روزه
                    </button>
                    {plans.length > 0 && (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val) handleFreeSubscription(cafe.id, val);
                          e.target.value = '';
                        }}
                        className="rounded-full border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] outline-none focus:border-violet-400"
                      >
                        <option value="" disabled>
                          پلن پولی...
                        </option>
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatPrice(p.priceAfterDiscount || p.price)} ت
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => handleToggleCafeStatus(cafe.id, cafe.isDisabled)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                        cafe.isDisabled
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {cafe.isDisabled ? 'فعال‌سازی' : 'غیرفعال‌سازی'}
                    </button>
                  </div>
                </div>
              ))}
              {filteredCafes.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-stone-400">
                  کافه‌ای با این مشخصات پیدا نشد.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {!showStats && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800">پلن‌های اشتراک</h2>
            <button
              onClick={() => setShowCreatePlan(!showCreatePlan)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              <PlusCircle size={16} />
              {showCreatePlan ? 'انصراف' : 'پلن جدید'}
            </button>
          </div>

          {showCreatePlan && (
            <form
              onSubmit={handleCreatePlan}
              className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.2)]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">نام پلن *</label>
                  <input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">توضیحات</label>
                  <input
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">مدت (روز) *</label>
                  <input
                    type="number"
                    value={newPlan.durationDays}
                    onChange={(e) => setNewPlan({ ...newPlan, durationDays: Number(e.target.value) })}
                    required
                    min={1}
                    dir="ltr"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">قیمت (تومان) *</label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    required
                    min={0}
                    dir="ltr"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">تخفیف (درصد)</label>
                  <input
                    type="number"
                    value={newPlan.discount}
                    onChange={(e) => setNewPlan({ ...newPlan, discount: Number(e.target.value) })}
                    min={0}
                    max={100}
                    dir="ltr"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={newPlan.isFeatured}
                      onChange={(e) => setNewPlan({ ...newPlan, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
                    />
                    پیشنهاد ویژه
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700"
                >
                  <Save size={16} /> ذخیره پلن
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-[24px] border p-5 shadow-sm transition ${
                  plan.isFeatured ? 'border-violet-300 bg-violet-50/40' : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-800">{plan.name}</h3>
                    {plan.description && <p className="mt-1 text-xs text-stone-500">{plan.description}</p>}
                  </div>
                  <button
                    onClick={() => handleUpdatePlan(plan.id, 'isFeatured', !plan.isFeatured)}
                    title={plan.isFeatured ? 'حذف از ویژه' : 'علامت‌گذاری به‌عنوان ویژه'}
                    className={`shrink-0 rounded-full p-1.5 transition ${
                      plan.isFeatured
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    <Star size={13} className={plan.isFeatured ? 'fill-violet-500' : ''} />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {plan.durationDays} روز
                  </span>
                  {plan.discount > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {plan.discount}% تخفیف
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    {plan.discount > 0 ? (
                      <>
                        <span className="font-mono text-lg font-bold text-stone-900">
                          {formatPrice(plan.priceAfterDiscount)}
                        </span>
                        <span className="mr-1.5 font-mono text-xs text-stone-400 line-through">
                          {formatPrice(plan.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-lg font-bold text-stone-900">{formatPrice(plan.price)}</span>
                    )}
                    <span className="mr-1 text-xs text-stone-400"> تومان</span>
                  </div>
                  <button
                    onClick={() => handleConfirmDelete(plan.id)}
                    className={`rounded-full px-2.5 py-1.5 text-[11px] font-medium transition ${
                      confirmDeleteId === plan.id
                        ? 'bg-rose-600 text-white'
                        : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    {confirmDeleteId === plan.id ? 'مطمئنید؟' : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}