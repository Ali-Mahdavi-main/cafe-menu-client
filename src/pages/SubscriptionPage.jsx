import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/api';
import { Button } from '@/components/ui/button';
import { CreditCard, Sparkles, CheckCircle2, AlertTriangle, Loader2, CircleDollarSign, CalendarClock } from 'lucide-react';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('fa-IR');
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingPlanId, setSubmittingPlanId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, meData] = await Promise.all([
          apiFetch('/payment/plans').catch(() => []),
          apiFetch('/auth/me').catch(() => null),
        ]);

        setPlans(Array.isArray(plansData) ? plansData : []);
        setSubscriptionInfo(meData?.subscription || meData || null);
      } catch (err) {
        setFeedback({ type: 'error', message: err.message || 'خطا در بارگذاری اطلاعات اشتراک' });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedPlan = useMemo(() => {
    const planName = subscriptionInfo?.planName || subscriptionInfo?.plan?.name || subscriptionInfo?.name;
    if (!planName) return null;
    return plans.find((plan) => plan.name === planName) || null;
  }, [plans, subscriptionInfo]);

  const handleChoosePlan = async (planId) => {
    try {
      setSubmittingPlanId(planId);
      const data = await apiFetch('/payment/request', {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (data?.authority) {
        window.location.href = `https://sandbox.zarinpal.com/pg/StartPay/${data.authority}`;
        return;
      }

      setFeedback({ type: 'success', message: 'درخواست پرداخت با موفقیت ثبت شد. در حالت تست، اشتراک فعال می‌شود.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'درخواست پرداخت انجام نشد.' });
    } finally {
      setSubmittingPlanId(null);
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

      <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">وضعیت اشتراک فعلی</p>
            <h1 className="mt-2 text-2xl font-bold">اشتراک و پرداخت</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              با خرید پلن مناسب، کافه شما در دسترس مشتریان باقی می‌ماند و در صورت نیاز، هشدارهای مالی به شما نمایش داده می‌شود.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Sparkles size={16} />
              <span>پلن‌های مدرن و سریع</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <CreditCard size={18} className="text-blue-600" />
            وضعیت کنونی
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">وضعیت</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {subscriptionInfo?.status || (subscriptionInfo?.isActive ? 'فعال' : 'در حال بررسی')}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">پلن فعلی</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {subscriptionInfo?.planName || subscriptionInfo?.plan?.name || 'هنوز انتخاب نشده'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">روز باقیمانده</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {subscriptionInfo?.remainingDays ?? subscriptionInfo?.daysRemaining ?? subscriptionInfo?.daysLeft ?? '—'}
              </p>
            </div>
            {subscriptionInfo?.warningCount ? (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-700">
                <AlertTriangle size={16} />
                <span>هشدار: {subscriptionInfo.warningCount} بار</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <CheckCircle2 size={18} className="text-emerald-600" />
            مزایا
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> دسترسی بدون وقفه به منوی آنلاین</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> نمایش رویدادها و پرومیشن‌ها</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> مدیریت حرفه‌ای QR و لینک عمومی</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isSubmitting = submittingPlanId === plan.id;
          const isCurrent = selectedPlan?.id === plan.id;
          return (
            <div key={plan.id} className={`rounded-[28px] border p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.3)] transition-all ${isCurrent ? 'border-blue-500 bg-blue-50/70' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-800">{plan.name}</h2>
                {isCurrent ? <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">فعلی</span> : null}
              </div>
              <p className="mt-3 text-sm text-slate-500">{plan.durationDays} روز دسترسی</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">{formatPrice(plan.price)}</span>
                <span className="mb-1 text-sm text-slate-500">تومان</span>
              </div>
              <Button className="mt-6 w-full" onClick={() => handleChoosePlan(plan.id)} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'پرداخت و فعال‌سازی'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
