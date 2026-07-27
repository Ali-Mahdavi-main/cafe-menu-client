import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Palette, Layout, Type, Sparkles, ImageIcon, Layers, Sliders, Eye, Undo2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
  backgroundLightEnabled: false,
  backgroundLightLeftColor: '#a78bfa',
  backgroundLightRightColor: '#60a5fa',
  backgroundLightIntensity: 40,
  animationEnabled: true,
  borderType: 'solid',
  overlayOpacity: 0,
  glassIntensity: 0,
  accentGradient: false,
  accentStart: '#6366f1',
  accentEnd: '#8b5cf6',
  textAlign: 'center',
  itemSpacing: 16,
  sectionGap: 32,
};

function Section({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)] transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-blue-500" />
          <span>{title}</span>
          {badge && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-11 rounded-lg border border-gray-300 cursor-pointer p-0.5"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 font-mono text-xs"
        dir="ltr"
      />
      <span className="w-16 truncate text-xs text-gray-400">{value}</span>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-gray-500">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 accent-blue-500 rounded-lg"
      />
      <span className="w-10 text-xs font-mono text-gray-600 text-left">{value}</span>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function MiniPreview({ theme }) {
  const previewStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: theme.shadow !== 'none' ? theme.shadow : 'none',
    padding: `${theme.margin}px`,
    fontFamily: theme.fontFamily,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
        <Eye size={16} /> پیش‌نمایش زنده
      </div>
      <div style={previewStyle} className="transition-all duration-300 relative overflow-hidden">
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
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <h4 style={{ fontSize: theme.bodyFontSize * 0.9, fontWeight: 700 }}>کافه نمونه</h4>
              <p style={{ fontSize: theme.bodyFontSize * 0.7, opacity: 0.6 }}>آدرس نمونه کافه</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.cardBackground,
                  borderRadius: `${theme.borderRadius}px`,
                  boxShadow: theme.shadow,
                }}
              >
                <div className="h-16 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-xs text-slate-400">تصویر</span>
                </div>
                <div className="p-2">
                  <p className="font-semibold truncate" style={{ fontSize: theme.bodyFontSize * 0.75 }}>آیتم {i}</p>
                  <p style={{ color: theme.priceColor, fontSize: theme.bodyFontSize * 0.7 }}>۴۵,۰۰۰ تومان</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeEditor({ value, onChange }) {
  const theme = { ...defaultTheme, ...value };

  const update = (key, val) => onChange({ ...theme, [key]: val });

  const handleReset = () => onChange(defaultTheme);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
  };

  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 p-5 text-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.65)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">ثبت‌کننده تم</h3>
              <p className="mt-0.5 text-sm text-slate-300">طراحی ظاهر منوی عمومی با بازبینی زنده</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'کپی شد' : 'JSON'}
            </button>
            <button
              onClick={handleExport}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 flex items-center gap-1"
            >
              <ImageIcon size={12} />
              خروجی
            </button>
            <button
              onClick={handleReset}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 flex items-center gap-1"
            >
              <Undo2 size={12} />
              بازنشانی
            </button>
          </div>
        </div>
      </div>

      <MiniPreview theme={theme} />

      <Section title="رنگ‌ها" icon={Palette}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            ['primaryColor', 'رنگ اصلی'],
            ['secondaryColor', 'رنگ دوم'],
            ['backgroundColor', 'پس‌زمینه صفحه'],
            ['textColor', 'رنگ متن'],
            ['cardBackground', 'پس‌زمینه کارت'],
            ['borderColor', 'رنگ حاشیه'],
            ['priceColor', 'رنگ قیمت'],
          ]).map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
              <ColorRow value={theme[key]} onChange={(val) => update(key, val)} />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="block text-[11px] font-semibold text-gray-500 mb-3 uppercase tracking-wider">گرادیانت اکسنت</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={theme.accentGradient}
                onChange={(e) => update('accentGradient', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              فعال‌سازی
            </label>
          </div>
          {theme.accentGradient && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">رنگ شروع</label>
                <ColorRow value={theme.accentStart} onChange={(val) => update('accentStart', val)} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">رنگ پایان</label>
                <ColorRow value={theme.accentEnd} onChange={(val) => update('accentEnd', val)} />
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="نور پس‌زمینه" icon={Sparkles} badge="افکت">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">فعال‌سازی نور</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={theme.backgroundLightEnabled}
              onChange={(e) => update('backgroundLightEnabled', e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full" />
          </label>
        </div>
        {theme.backgroundLightEnabled && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">رنگ نور چپ</label>
                <ColorRow value={theme.backgroundLightLeftColor} onChange={(val) => update('backgroundLightLeftColor', val)} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">رنگ نور راست</label>
                <ColorRow value={theme.backgroundLightRightColor} onChange={(val) => update('backgroundLightRightColor', val)} />
              </div>
            </div>
            <SliderRow label="شدت" value={theme.backgroundLightIntensity} onChange={(val) => update('backgroundLightIntensity', val)} min={10} max={100} />
          </div>
        )}
      </Section>

      <Section title="اندازه و چیدمان" icon={Layout}>
        <div className="space-y-4">
          <SliderRow label="عرض کارت" value={theme.cardWidth} onChange={(val) => update('cardWidth', val)} min={100} max={400} />
          <SliderRow label="ارتفاع کارت" value={theme.cardHeight} onChange={(val) => update('cardHeight', val)} min={150} max={450} />
          <SliderRow label="گردی گوشه‌ها" value={theme.borderRadius} onChange={(val) => update('borderRadius', val)} min={0} max={50} />
          <SliderRow label="فاصله کارت‌ها" value={theme.itemSpacing} onChange={(val) => update('itemSpacing', val)} min={4} max={40} />
          <SliderRow label="فاصله بخش‌ها" value={theme.sectionGap} onChange={(val) => update('sectionGap', val)} min={8} max={64} />
          <SelectRow label="نسبت تصویر" value={theme.imageAspectRatio} onChange={(val) => update('imageAspectRatio', val)} options={[
            { value: '1/1', label: 'مربع (1:1)' },
            { value: '4/3', label: 'مستطیل (4:3)' },
            { value: '16/9', label: 'عریض (16:9)' },
            { value: '3/4', label: 'عمودی (3:4)' },
            { value: 'auto', label: 'خودکار' },
          ]} />
          <SelectRow label="نوع حاشیه" value={theme.borderType} onChange={(val) => update('borderType', val)} options={[
            { value: 'solid', label: 'ساده' },
            { value: 'dashed', label: 'نقطه‌چین' },
            { value: 'dotted', label: 'نقطه‌ای' },
            { value: 'double', label: 'دوگانه' },
          ]} />
        </div>
      </Section>

      <Section title="استایل کارت" icon={Layers}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] text-gray-500 mb-2 block">مدل کارت آیتم‌ها</label>
            <select value={theme.cardStyle} onChange={(e) => update('cardStyle', Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>مدل {v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-2 block">استایل عنوان دسته</label>
            <select value={theme.categoryStyle} onChange={(e) => update('categoryStyle', Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>مدل {v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SelectRow label="نوار دسته‌بندی" value={theme.categoryNavStyle} onChange={(val) => update('categoryNavStyle', val)} options={[
            { value: 'image', label: 'تصویری' },
            { value: 'text', label: 'فقط متن' },
          ]} />
          <SelectRow label="محور متن" value={theme.textAlign} onChange={(val) => update('textAlign', val)} options={[
            { value: 'center', label: 'وسط' },
            { value: 'right', label: 'راست' },
            { value: 'left', label: 'چپ' },
          ]} />
        </div>
      </Section>

      <Section title="هدر و فوتر" icon={Sparkles}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-500 mb-2 block">مدل هدر</label>
            <select value={theme.headerStyle} onChange={(e) => update('headerStyle', Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {[1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>مدل {v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-2 block">مدل فوتر</label>
            <select value={theme.footerStyle} onChange={(e) => update('footerStyle', Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {[1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>مدل {v}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="تایپوگرافی" icon={Type}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">سایز عنوان (px)</label>
            <Input type="number" value={theme.headingFontSize} onChange={(e) => update('headingFontSize', Number(e.target.value) || 28)} className="font-mono" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">سایز متن (px)</label>
            <Input type="number" value={theme.bodyFontSize} onChange={(e) => update('bodyFontSize', Number(e.target.value) || 16)} className="font-mono" />
          </div>
        </div>
        <SelectRow label="فونت" value={theme.fontFamily} onChange={(val) => update('fontFamily', val)} options={[
          { value: 'Vazirmatn', label: 'Vazirmatn' },
          { value: 'Vazirmatn-Bold', label: 'Vazirmatn Bold' },
          { value: 'Vazirmatn-SemiBold', label: 'Vazirmatn SemiBold' },
          { value: 'Vazirmatn-Medium', label: 'Vazirmatn Medium' },
          { value: 'Vazirmatn-Light', label: 'Vazirmatn Light' },
        ]} />
      </Section>

      <Section title="سایه و افکت" icon={Sliders}>
        <div className="space-y-4">
          <SelectRow label="سایه" value={theme.shadow} onChange={(val) => update('shadow', val)} options={[
            { value: 'none', label: 'بدون سایه' },
            { value: '0 1px 3px rgba(0,0,0,0.1)', label: 'کوچک' },
            { value: '0 4px 6px -1px rgba(0,0,0,0.1)', label: 'متوسط' },
            { value: '0 10px 15px -3px rgba(0,0,0,0.2)', label: 'بزرگ' },
            { value: '0 20px 25px -5px rgba(0,0,0,0.3)', label: 'خیلی بزرگ' },
          ]} />
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">انیمیشن</label>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={theme.animationEnabled}
                onChange={(e) => update('animationEnabled', e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full" />
            </label>
          </div>
          <SliderRow label="شیشه‌ای" value={theme.glassIntensity} onChange={(val) => update('glassIntensity', val)} min={0} max={50} />
          <SliderRow label="لایه روی" value={theme.overlayOpacity} onChange={(val) => update('overlayOpacity', val)} min={0} max={80} />
        </div>
      </Section>

      <Section title="کارت ویژه" icon={Sparkles}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">فعال‌سازی کارت ویژه</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={theme.specialCardEnabled}
              onChange={(e) => update('specialCardEnabled', e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full" />
          </label>
        </div>
        {theme.specialCardEnabled && (
          <div className="mt-3">
            <label className="text-[11px] text-gray-500 mb-1 block">شناسه آیتم ویژه (ID)</label>
            <Input
              type="number"
              value={theme.specialCardItemId ?? ''}
              onChange={(e) => update('specialCardItemId', e.target.value ? Number(e.target.value) : null)}
              placeholder="مثلاً 5"
            />
          </div>
        )}
      </Section>
    </div>
  );
}