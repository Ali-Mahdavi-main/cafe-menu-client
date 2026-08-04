import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock,
  Tag,
  Gift,
  Server,
  ShieldCheck,
  RefreshCcw,
  Wrench,
  Headphones,
  QrCode,
  Receipt,
  ArrowLeft,
} from 'lucide-react';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('fa-IR');
}

// What the subscription fee actually covers — this is the whole point of the page.
const INCLUSIONS = [
  {
    icon: Server,
    label: 'میزبانی و سرور با آپتایم بالا',
    desc: 'منوی دیجیتال شما ۲۴ ساعته و بدون قطعی در دسترس مشتریان است.',
  },
  {
    icon: ShieldCheck,
    label: 'امنیت و گواهی SSL',
    desc: 'اتصال رمزنگاری‌شده برای حفظ امنیت اطلاعات کافه و مشتریان شما.',
  },
  {
    icon: RefreshCcw,
    label: 'پشتیبان‌گیری روزانه',
    desc: 'دسته‌بندی‌ها، آیتم‌ها و تنظیمات هر روز به‌صورت خودکار ذخیره می‌شود.',
  },
  {
    icon: Wrench,
    label: 'به‌روزرسانی و رفع اشکال',
    desc: 'امکانات جدید و اصلاحات به‌طور مداوم روی سیستم شما اعمال می‌شود.',
  },
  {
    icon: Headphones,
    label: 'پشتیبانی مستقیم',
    desc: 'در صورت هر سوال یا مشکل، مستقیماً با تیم پشتیبانی در ارتباط هستید.',
  },
  {
    icon: QrCode,
    label: 'لینک و QR همیشه فعال',
    desc: 'کد QR چاپ‌شده‌ی شما همیشه معتبر می‌ماند، بدون نیاز به چاپ مجدد.',
  },
];

const BARCODE_BARS = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3];

function PlanCard({ plan, isCurrent, onChoose, isSubmitting }) {
  const priceAfterDiscount = plan.price - (plan.price * plan.discount) / 100;
  const isFree = priceAfterDiscount === 0;

  return (
    <div
      className={`relative flex flex-col rounded-[28px] border p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 ${
        isCurrent
          ? 'border-violet-400 bg-violet-50/60'
          : plan.isFeatured
          ? 'border-violet-300 bg-gradient-to-b from-violet-50/50 to-white shadow-[0_16px_45px_-24px_rgba(139,92,246,0.3)]'
          : 'border-stone-200 bg-white'
      }`}
    >
      {plan.isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-bold text-white">
          پیشنهاد ویژه
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-800">{plan.name}</h2>
          {plan.description && <p className="mt-0.5 text-xs text-stone-500">{plan.description}</p>}
        </div>
        {isCurrent && (
          <span className="flex-shrink-0 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white">
            فعلی
          </span>
        )}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Clock size={14} className="text-stone-400" />
        <span className="text-xs text-stone-500">{plan.durationDays} روز دسترسی کامل</span>
      </div>

      <div className="mb-2">
        {isFree ? (
          <span className="text-3xl font-bold text-stone-900">رایگان</span>
        ) : (
          <>
            {plan.discount > 0 && (
              <div className="mb-1">
                <span className="font-mono text-sm text-stone-400 line-through">{formatPrice(plan.price)}</span>
                <span className="mr-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                  -{plan.discount}%
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold text-stone-900">
                {formatPrice(priceAfterDiscount)}
              </span>
              <span className="mb-1 text-sm text-stone-500">تومان / ماه</span>
            </div>
          </>
        )}
      </div>

      <p className="mb-5 text-xs text-stone-400">شامل هاست، پشتیبان‌گیری، امنیت و پشتیبانی</p>

      <button
        onClick={() => onChoose(plan.id)}
        disabled={isSubmitting}
        className={`mt-auto w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
          isCurrent
            ? 'cursor-default bg-violet-100 text-violet-700'
            : isFree
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700'
        }`}
      >
        {isSubmitting ? (
          <Loader2 size={16} className="mx-auto animate-spin" />
        ) : isCurrent ? (
          'پلن فعلی'
        ) : isFree ? (
          'دریافت رایگان'
        ) : (
          'پرداخت و فعال‌سازی'
        )}
      </button>
    </div>
  );
}

export default function SubscriptionPage() {
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingPlanId, setSubmittingPlanId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setFeedback({ type: 'success', message: 'پرداخت با موفقیت انجام شد. اشتراک شما فعال شد.' });
    } else if (payment === 'failed') {
      setFeedback({ type: 'error', message: 'پرداخت با خطا مواجه شد. لطفاً دوباره تلاش کنید.' });
    } else if (payment === 'cancelled') {
      setFeedback({ type: 'error', message: 'پرداخت لغو شد.' });
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, meData] = await Promise.all([
          apiFetch('/payment/plans').catch(() => []),
          apiFetch('/auth/me').catch(() => null),
        ]);
        setPlans(Array.isArray(plansData) ? plansData : []);
        setSubscriptionInfo(meData?.subscription || null);
      } catch (err) {
        setFeedback({ type: 'error', message: err.message || 'خطا در بارگذاری اطلاعات اشتراک' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedPlan = useMemo(() => {
    const planId = subscriptionInfo?.planId;
    if (planId == null) return null;
    return plans.find((plan) => plan.id === planId) || null;
  }, [plans, subscriptionInfo]);

  const handleChoosePlan = async (planId) => {
    try {
      setSubmittingPlanId(planId);
      setFeedback(null);
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

      setFeedback({ type: 'success', message: 'درخواست پرداخت ثبت شد، منتظر تأیید باشید.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'درخواست پرداخت انجام نشد.' });
    } finally {
      setSubmittingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const remainingDays = subscriptionInfo?.remainingDays ?? 0;
  const subscriptionStatus = subscriptionInfo?.status ?? 'نامشخص';
  const planName = subscriptionInfo?.planName ?? 'انتخاب نشده';
  const isFree = subscriptionInfo?.isFree || false;
  const gracePeriodEnd = subscriptionInfo?.gracePeriodEnd;
  const warningCount = subscriptionInfo?.warningCount || 0;

  const totalDays = selectedPlan?.durationDays ?? null;
  const runwayPct =
    totalDays && totalDays > 0 ? Math.min(100, Math.round((remainingDays / totalDays) * 100)) : null;

  let dotColor = 'bg-rose-500';
  let statusHeadline = 'منوی شما غیرفعال است';
  let statusSub = 'برای فعال‌سازی، یکی از پلن‌های زیر را انتخاب کنید.';
  let ctaUrgent = true;

  if (subscriptionStatus === 'فعال') {
    dotColor = 'bg-emerald-500';
    statusHeadline = 'منوی دیجیتال شما هم‌اکنون فعال است';
    statusSub = 'مشتریان شما در همین لحظه به منو دسترسی دارند.';
    ctaUrgent = remainingDays <= 5;
  } else if (subscriptionStatus === 'در دوره تمدید') {
    dotColor = 'bg-amber-500';
    statusHeadline = 'اشتراک شما در دوره تمدید است';
    statusSub = 'منو همچنان فعال است؛ لطفاً هرچه زودتر تمدید کنید.';
  }

  return (
    <div className="space-y-6" dir="rtl">
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
            feedback.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {feedback.message}
        </div>
      )}

      {/* Live status strip — replaces a decorative hero with the one thing this page needs to say first */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.25)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dotColor}`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${dotColor}`} />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-800">{statusHeadline}</p>
            <p className="text-xs text-stone-500">{statusSub}</p>
          </div>
        </div>

        {runwayPct !== null && (
          <div className="flex items-center gap-3 sm:w-56">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${runwayPct}%` }}
              />
            </div>
            <span className="whitespace-nowrap font-mono text-xs text-stone-500">
              {remainingDays}/{totalDays} روز
            </span>
          </div>
        )}

          <a
          href="#plans"
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-semibold transition sm:self-auto ${
            ctaUrgent
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          {ctaUrgent ? 'تمدید اشتراک' : 'مشاهده پلن‌ها'}
          <ArrowLeft size={13} />
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* The receipt — the signature element that answers "what am I paying for" */}

        {/* Compact current-status card */}
        <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.25)] lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <CreditCard size={16} className="text-violet-600" />
            وضعیت اشتراک شما
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-3">
              <dt className="text-stone-500">پلن فعلی</dt>
              <dd className="font-medium text-stone-800">{planName}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-3">
              <dt className="text-stone-500">وضعیت</dt>
              <dd
                className={`font-medium ${
                  subscriptionStatus === 'فعال'
                    ? 'text-emerald-600'
                    : subscriptionStatus === 'در دوره تمدید'
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {subscriptionStatus}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">روز باقی‌مانده</dt>
              <dd className="font-mono text-base font-semibold text-stone-800">{remainingDays}</dd>
            </div>
          </dl>

          <div className="mt-4 space-y-2">
            {gracePeriodEnd && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <AlertTriangle size={13} className="ml-1 inline" />
                دوره تمدید تا {new Date(gracePeriodEnd).toLocaleDateString('fa-IR')}
              </div>
            )}
            {warningCount > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <AlertTriangle size={13} className="ml-1 inline" />
                {warningCount} هشدار برای این اشتراک ارسال شده
              </div>
            )}
            {isFree && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                <Tag size={13} className="ml-1 inline" />
                اشتراک رایگان — هر زمان می‌توانید ارتقا دهید
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div id="plans">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">پلن‌ها</h2>
          <p className="text-xs text-stone-400">برای تمدید یا ارتقا یک پلن انتخاب کنید</p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">
            <Gift size={28} className="mx-auto mb-2 text-stone-300" />
            در حال حاضر پلنی موجود نیست. با ادمین تماس بگیرید.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={selectedPlan?.id === plan.id}
                onChoose={handleChoosePlan}
                isSubmitting={submittingPlanId === plan.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}