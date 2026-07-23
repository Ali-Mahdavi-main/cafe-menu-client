import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

const defaultTheme = {
  primaryColor: '#1e293b',
  secondaryColor: '#64748b',
  backgroundColor: '#f8fafc',
  textColor: '#0f172a',
  cardBackground: '#ffffff',
  borderColor: '#e2e8f0',
  borderRadius: 16,
  shadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  margin: 16,
  cardWidth: 300,
  cardHeight: 300,
  imageAspectRatio: '1/1',
  textAspectRatio: 'auto',
  headerStyle: 1,
  footerStyle: 1,
  categoryNavStyle: 'image',
  fontFamily: 'Vazirmatn',
  headingFontSize: 28,
  bodyFontSize: 16,
  priceColor: '#0d9488',
  cardStyle: 1,
  categoryStyle: 1,
  specialCardEnabled: false,
  specialCardItemId: null,
  // ----- Background Lights -----
  backgroundLightEnabled: false,
  backgroundLightLeftColor: '#a78bfa',
  backgroundLightRightColor: '#60a5fa',
  backgroundLightIntensity: 40,
};

/* ---------- Collapsible Section ---------- */
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
}

/* ---------- Live Preview Mini Card ---------- */
function MiniPreview({ theme }) {
  const previewStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadow !== 'none' ? theme.shadow : 'none',
    padding: theme.margin,
    fontFamily: theme.fontFamily,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-500">
        <Eye size={16} /> پیش‌نمایش زنده
      </div>
      <div style={previewStyle} className="transition-all duration-300 relative overflow-hidden">
        {/* Simulate background light if enabled */}
        {theme.backgroundLightEnabled && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-0 h-full w-1/2"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${theme.backgroundLightLeftColor}${Math.round((theme.backgroundLightIntensity || 40) * 2.55).toString(16).padStart(2, '0')}, transparent 70%)`,
              }}
            />
            <div
              className="absolute right-0 h-full w-1/2"
              style={{
                background: `radial-gradient(circle at 80% 50%, ${theme.backgroundLightRightColor}${Math.round((theme.backgroundLightIntensity || 40) * 2.55).toString(16).padStart(2, '0')}, transparent 70%)`,
              }}
            />
          </div>
        )}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23'%3E%3Crect width='24' height='24' rx='4' fill='%23CBD5E1'/%3E%3C/svg%3E" alt="" />
          </div>
          <div>
            <h4 style={{ fontSize: theme.bodyFontSize * 0.9, fontWeight: 600 }}>آیتم نمونه</h4>
            <p style={{ fontSize: theme.bodyFontSize * 0.7, opacity: 0.7 }}>توضیح کوتاه</p>
          </div>
          <span className="mr-auto font-bold" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize * 0.8 }}>
            ۴۵,۰۰۰ تومان
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ThemeEditor({ value, onChange }) {
  const theme = { ...defaultTheme, ...value };

  const update = (key, val) => onChange({ ...theme, [key]: val });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">🎨 شخصی‌سازی ظاهر</h3>
        <button
          onClick={() => onChange(defaultTheme)}
          className="text-xs text-blue-600 hover:underline"
        >
          بازنشانی به پیش‌فرض
        </button>
      </div>

      <MiniPreview theme={theme} />

      {/* Colors */}
      <Section title="رنگ‌ها">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['primaryColor', 'رنگ اصلی'],
            ['secondaryColor', 'رنگ دوم'],
            ['backgroundColor', 'پس‌زمینه صفحه'],
            ['textColor', 'رنگ متن'],
            ['cardBackground', 'پس‌زمینه کارت'],
            ['borderColor', 'رنگ حاشیه'],
            ['priceColor', 'رنگ قیمت'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={theme[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="flex-1 font-mono text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Background Lights */}
      <Section title="نور پس‌زمینه" defaultOpen={false}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">فعال‌سازی نور</label>
            <input
              type="checkbox"
              checked={theme.backgroundLightEnabled}
              onChange={(e) => update('backgroundLightEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          {theme.backgroundLightEnabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">رنگ نور چپ</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={theme.backgroundLightLeftColor}
                      onChange={(e) => update('backgroundLightLeftColor', e.target.value)}
                      className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={theme.backgroundLightLeftColor}
                      onChange={(e) => update('backgroundLightLeftColor', e.target.value)}
                      className="flex-1 font-mono text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">رنگ نور راست</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={theme.backgroundLightRightColor}
                      onChange={(e) => update('backgroundLightRightColor', e.target.value)}
                      className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={theme.backgroundLightRightColor}
                      onChange={(e) => update('backgroundLightRightColor', e.target.value)}
                      className="flex-1 font-mono text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">شدت نور (درصد)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={theme.backgroundLightIntensity}
                    onChange={(e) => update('backgroundLightIntensity', Number(e.target.value))}
                    className="w-full h-2 accent-blue-500 rounded-lg"
                  />
                  <span className="w-10 text-xs text-gray-500">{theme.backgroundLightIntensity}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Card sizing */}
      <Section title="اندازه کارت">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">عرض کارت (px)</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range" min="50" max="360" step="5"
                value={theme.cardWidth}
                onChange={(e) => update('cardWidth', Number(e.target.value))}
                className="w-full h-2 accent-blue-500 rounded-lg"
              />
              <span className="w-10 text-xs text-gray-500">{theme.cardWidth}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">ارتفاع کارت (px)</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range" min="150" max="400" step="10"
                value={theme.cardHeight}
                onChange={(e) => update('cardHeight', Number(e.target.value))}
                className="w-full h-2 accent-blue-500 rounded-lg"
              />
              <span className="w-10 text-xs text-gray-500">{theme.cardHeight}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Aspect ratios */}
      <Section title="نسبت تصویر و فضا">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">نسبت تصویر</label>
            <select value={theme.imageAspectRatio} onChange={(e) => update('imageAspectRatio', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="1/1">مربع (1:1)</option>
              <option value="4/3">مستطیل (4:3)</option>
              <option value="16/9">عریض (16:9)</option>
              <option value="3/4">عمودی (3:4)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">نسبت فضای متن</label>
            <select value={theme.textAspectRatio} onChange={(e) => update('textAspectRatio', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="auto">خودکار</option>
              <option value="1/1">مربع</option>
              <option value="1/2">باریک</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Header / Footer styles */}
      <Section title="هدر و فوتر">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">مدل هدر</label>
            <select value={theme.headerStyle} onChange={(e) => update('headerStyle', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value={1}>۱ - لوگو گرد وسط</option>
              <option value={2}>۲ - لوگو مستطیل بالا</option>
              <option value={3}>۳ - لوگو چپ و نام راست</option>
              <option value={4}>۴ - نام با حاشیه</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">مدل فوتر</label>
            <select value={theme.footerStyle} onChange={(e) => update('footerStyle', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value={1}>۱ - ساده</option>
              <option value={2}>۲ - ستونی</option>
              <option value={3}>۳ - با آیکون بزرگ</option>
              <option value={4}>۴ - دایره‌ای</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Card & Category styles */}
      <Section title="استایل آیتم‌ها و دسته‌بندی">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">مدل کارت آیتم‌ها</label>
            <select value={theme.cardStyle} onChange={(e) => update('cardStyle', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value={1}>۱ - افقی</option>
              <option value={2}>۲ - شناور (تصویر بالا)</option>
              <option value={3}>۳ - ساده (لیستی)</option>
              <option value={4}>۴ - تصویر پس‌زمینه</option>
              <option value={5}>۵ - شیشه‌ای</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">استایل عنوان دسته</label>
            <select value={theme.categoryStyle} onChange={(e) => update('categoryStyle', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value={1}>۱ - خط زیرین</option>
              <option value={2}>۲ - دکمه رنگی</option>
              <option value={3}>۳ - خط عمودی</option>
              <option value={4}>۴ - کادر</option>
              <option value={5}>۵ - تصویر تار</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-600">نوار دسته‌بندی</label>
          <select value={theme.categoryNavStyle} onChange={(e) => update('categoryNavStyle', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="image">تصویری</option>
            <option value="text">فقط متن</option>
          </select>
        </div>
      </Section>

      {/* Special Card */}
      <Section title="کارت ویژه">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">فعال‌سازی کارت ویژه</label>
          <input
            type="checkbox"
            checked={theme.specialCardEnabled}
            onChange={(e) => update('specialCardEnabled', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        {theme.specialCardEnabled && (
          <div className="mt-3">
            <label className="text-xs font-medium text-gray-600">شناسه آیتم ویژه</label>
            <Input
              type="number"
              value={theme.specialCardItemId ?? ''}
              onChange={(e) => update('specialCardItemId', e.target.value ? Number(e.target.value) : null)}
              placeholder="مثلاً 5"
              className="mt-1"
            />
          </div>
        )}
      </Section>

      {/* Effects & spacing */}
      <Section title="افکت‌ها و فواصل">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">گردی گوشه‌ها</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="range" min="0" max="50" value={theme.borderRadius} onChange={(e) => update('borderRadius', Number(e.target.value))} className="w-full h-2 accent-blue-500" />
              <span className="w-10 text-xs text-gray-500">{theme.borderRadius}px</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">سایه</label>
            <select value={theme.shadow} onChange={(e) => update('shadow', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs">
              <option value="none">بدون سایه</option>
              <option value="0 1px 3px rgba(0,0,0,0.1)">کوچک</option>
              <option value="0 4px 6px -1px rgba(0,0,0,0.1)">متوسط</option>
              <option value="0 10px 15px -3px rgba(0,0,0,0.2)">بزرگ</option>
              <option value="0 20px 25px -5px rgba(0,0,0,0.3)">خیلی بزرگ</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">فاصله کارت‌ها</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="range" min="0" max="40" value={theme.margin} onChange={(e) => update('margin', Number(e.target.value))} className="w-full h-2 accent-blue-500" />
              <span className="w-10 text-xs text-gray-500">{theme.margin}px</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title="تایپوگرافی">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">سایز عنوان (px)</label>
            <Input
              type="number"
              value={theme.headingFontSize}
              onChange={(e) => update('headingFontSize', Number(e.target.value) || 28)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">سایز متن (px)</label>
            <Input
              type="number"
              value={theme.bodyFontSize}
              onChange={(e) => update('bodyFontSize', Number(e.target.value) || 16)}
              className="mt-1"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}