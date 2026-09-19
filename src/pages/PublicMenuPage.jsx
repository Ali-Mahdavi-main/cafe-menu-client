import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { Phone, MapPin, ExternalLink, Clock, Star, Sparkles, ChevronUp, ChevronRight, X } from 'lucide-react';

/* ---------- Helpers ---------- */
const aspectToPadding = (ratio) => {
  if (!ratio || ratio === 'auto') return undefined;
  const [w, h] = ratio.split('/').map(Number);
  return h && w ? `${(h / w) * 100}%` : undefined;
};

/* ---------- Background Lights ---------- */
function BackgroundLights({ theme }) {
  if (!theme.backgroundLightEnabled) return null;

  const leftColor = theme.backgroundLightLeftColor || '#a78bfa';
  const rightColor = theme.backgroundLightRightColor || '#60a5fa';
  const opacity = (theme.backgroundLightIntensity || 50) / 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full w-1/2 opacity-70"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${leftColor}${Math.round(opacity * 0.6).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-1/2 opacity-70"
        style={{
          background: `radial-gradient(circle at 80% 50%, ${rightColor}${Math.round(opacity * 0.6).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ---------- Header ---------- */
function CafeHeader({ logoUrl, cafeName, workingHours, theme }) {
  const primary = theme.primaryColor;
  const style = theme.headerStyle || 1;

  const headerClass = "relative z-10";

  if (style === 1)
    return (
      <header className={`mb-10 text-center ${headerClass}`}>
        {logoUrl && (
          <img src={logoUrl} alt={cafeName} className="mx-auto mb-5 h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white/80" />
        )}
        <h1 className="font-bold tracking-tight" style={{ fontSize: theme.headingFontSize, color: primary }}>
          {cafeName}
        </h1>
        {workingHours && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm" style={{ backgroundColor: `${primary}10`, color: primary }}>
            <Clock size={14} />
            {workingHours}
          </div>
        )}
      </header>
    );

  if (style === 2)
    return (
      <header className={`mb-10 ${headerClass}`}>
        {logoUrl && (
          <div className="relative h-36 w-full overflow-hidden rounded-2xl mb-5">
            <img src={logoUrl} alt={cafeName} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="font-bold text-white" style={{ fontSize: theme.headingFontSize }}>
                {cafeName}
              </h1>
            </div>
          </div>
        )}
        {workingHours && (
          <div className="flex items-center justify-center gap-2 text-sm opacity-70">
            <Clock size={14} /> {workingHours}
          </div>
        )}
      </header>
    );

  if (style === 3)
    return (
      <header className={`mb-10 flex items-center gap-4 ${headerClass}`}>
        {logoUrl && (
          <img src={logoUrl} alt={cafeName} className="h-20 w-20 rounded-2xl object-cover shadow-lg flex-shrink-0" />
        )}
        <div>
          <h1 className="font-bold" style={{ fontSize: theme.headingFontSize, color: primary }}>
            {cafeName}
          </h1>
          {workingHours && (
            <div className="mt-1 flex items-center gap-2 text-sm opacity-70">
              <Clock size={14} /> {workingHours}
            </div>
          )}
        </div>
      </header>
    );

  if (style === 4)
    return (
      <header className={`mb-10 text-center ${headerClass}`}>
        {logoUrl && (
          <img src={logoUrl} alt={cafeName} className="mx-auto mb-4 h-16 w-16 rounded-xl object-cover" />
        )}
        <h1
          className="inline-block font-bold px-8 py-3 rounded-full border-2"
          style={{ fontSize: theme.headingFontSize, color: primary, borderColor: primary }}
        >
          {cafeName}
        </h1>
        {workingHours && (
          <p className="mt-4 text-sm opacity-60">{workingHours}</p>
        )}
      </header>
    );

  return null;
}

/* ---------- Generic image-based nav bar (used for sub-category selection inside a category) ---------- */
function ImageNavBar({ items, selected, onSelect, theme, allLabel = 'همه' }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const isTextOnly = theme.categoryNavBarStyle === 'text';

  const mosaicImages = useMemo(() => items.filter((it) => it.imageUrl).slice(0, 4), [items]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 5);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [checkScroll, items]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 130, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  if (isTextOnly) {
    return (
      <div className="relative mb-10">
        <div className="flex gap-2 overflow-x-auto py-2 px-2 scrollbar-hide">
          <button
            onClick={() => onSelect('all')}
            className="flex-shrink-0 whitespace-nowrap font-medium transition-colors duration-200 px-4 py-2 text-sm"
            style={{
              backgroundColor: selected === 'all' ? theme.primaryColor : `${theme.primaryColor}14`,
              color: selected === 'all' ? '#fff' : theme.primaryColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            {allLabel}
          </button>
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              className="flex-shrink-0 whitespace-nowrap font-medium transition-colors duration-200 px-4 py-2 text-sm"
              style={{
                backgroundColor: selected === it.key ? theme.primaryColor : `${theme.primaryColor}14`,
                color: selected === it.key ? '#fff' : theme.primaryColor,
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-10" ref={scrollRef}>
      {showLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors">
          <ChevronUp size={18} className="-rotate-90 text-gray-600" />
        </button>
      )}
      <div className="flex gap-3 overflow-x-auto py-2 px-2 scrollbar-hide scroll-sm-auto">
        <button
          onClick={() => onSelect('all')}
          className="relative flex-shrink-0 w-20 h-20 overflow-hidden transition-transform duration-200 hover:scale-105"
          style={{
            borderRadius: `${theme.borderRadius}px`,
            opacity: selected === 'all' ? 1 : 0.8,
            transform: selected === 'all' ? 'scale(1.05)' : undefined,
            boxShadow: selected === 'all'
              ? `0 0 0 2px ${theme.backgroundColor || '#fff'}, 0 0 0 4px ${theme.primaryColor}`
              : undefined,
          }}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-white/20">
            {mosaicImages.map((it, idx) => (
              <div key={idx} className="relative overflow-hidden">
                {it.imageUrl ? (
                  <img src={it.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-500" />
                )}
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-1">
            <span className="text-[10px] font-medium text-white text-center block">{allLabel}</span>
          </div>
        </button>

        {items.map((it) => {
          const isSelected = selected === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              className="relative flex-shrink-0 w-20 h-20 overflow-hidden transition-transform duration-200 hover:scale-105"
              style={{
                borderRadius: `${theme.borderRadius}px`,
                opacity: isSelected ? 1 : 0.8,
                transform: isSelected ? 'scale(1.05)' : undefined,
                boxShadow: isSelected
                  ? `0 0 0 2px ${theme.backgroundColor || '#fff'}, 0 0 0 4px ${theme.primaryColor}`
                  : undefined,
              }}
            >
              {it.imageUrl ? (
                <img src={it.imageUrl} alt={it.label} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{it.label.charAt(0)}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-1">
                <span className="text-[10px] font-medium text-white text-center block truncate">{it.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      {showRight && (
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors">
          <ChevronUp size={18} className="rotate-90 text-gray-600" />
        </button>
      )}
    </div>
  );
}

/* ---------- Parent Category Card (first screen, 16:9, blurred image background) ---------- */
function ParentCategoryCard({ category, theme, onClick }) {
  const firstImage = useMemo(() => {
    for (const sc of category.subCategories) {
      const found = sc.items.find((i) => i.imageUrl);
      if (found) return found.imageUrl;
    }
    return null;
  }, [category]);

  const itemCount = useMemo(
    () => category.subCategories.reduce((sum, sc) => sum + sc.items.length, 0),
    [category]
  );

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden text-center transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: theme.shadow !== 'none' ? theme.shadow : undefined,
        border: `1px solid ${theme.borderColor || '#e2e8f0'}`,
      }}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {firstImage ? (
          <>
            <img
              src={firstImage}
              alt={category.parentCategoryName}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor}55, ${theme.primaryColor}20)` }}
          />
        )}

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-white">
          <h1 className="font-bold drop-shadow-md" style={{ fontSize: theme.headingFontSize }}>
            {category.parentCategoryName}
          </h1>
        </div>
      </div>
    </button>
  );
}

function ParentCategoryGrid({ categories, theme, onSelect }) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {categories.map((cat, idx) => (
        <div
          key={cat.parentCategoryId ?? cat.parentCategoryName}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(idx, 10) * 60}ms` }}
        >
          <ParentCategoryCard
            category={cat}
            theme={theme}
            onClick={() => onSelect(cat.parentCategoryName)}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- Loading Skeleton ---------- */
function MenuSkeleton({ theme }) {
  const radius = theme?.borderRadius ?? 16;
  return (
    <>
      <div className="mb-6 flex justify-center">
        <div className="h-4 w-40 rounded-full bg-slate-200/70 animate-pulse" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden animate-pulse bg-slate-200/70"
            style={{ paddingBottom: '56.25%', borderRadius: `${radius}px`, border: '1px solid rgba(148,163,184,0.2)' }}
          />
        ))}
      </div>
    </>
  );
}

/* ---------- Back Button ---------- */
function BackButton({ onClick, theme }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
      style={{ backgroundColor: `${theme.primaryColor}12`, color: theme.primaryColor }}
    >
      <ChevronRight size={16} />
      بازگشت به دسته‌بندی‌ها
    </button>
  );
}

/* ---------- Menu Item Card ---------- */
function MenuItemCard({ item, theme, isSpecial, onClick }) {
  const style = theme.cardStyle || 1;
  const imagePad = aspectToPadding(theme.imageAspectRatio);
  const isGlass = style === 5;
  const isOverlay = style === 4;

  const handleClick = () => {
    if (onClick) onClick(item);
  };

  const baseClass = `relative overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1 cursor-pointer active:scale-[0.98] ${
    isSpecial ? 'ring-2 ring-amber-400/60 animate-pulse-glow' : ''
  }`;

  const cardStyle = {
    backgroundColor: isOverlay ? 'transparent' : (theme.cardBackground || '#ffffff'),
    borderColor: isSpecial ? theme.secondaryColor : (theme.borderColor || '#e2e8f0'),
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: isSpecial
      ? '0 0 30px rgba(250,204,21,0.5)'
      : theme.shadow !== 'none'
      ? theme.shadow
      : undefined,
  };

  if (isGlass) {
    cardStyle.background = 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)';
    cardStyle.backdropFilter = 'blur(20px)';
    cardStyle.border = '1px solid rgba(255,255,255,0.3)';
  }

  const specialBadge = isSpecial ? (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
      <Star size={10} /> ویژه
    </div>
  ) : null;

  if (style === 1) {
    return (
      <div className={`${baseClass} flex h-full`} style={cardStyle} onClick={handleClick}>
        {specialBadge}
        {item.imageUrl && (
          <div className="w-24 sm:w-28 flex-shrink-0 relative" style={imagePad ? { paddingBottom: imagePad } : {}}>
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            <h3 className="font-semibold" style={{ fontSize: theme.bodyFontSize }}>{item.title}</h3>
            {item.description && (
              <p className="mt-1 truncate text-xs opacity-60" style={{ fontSize: theme.bodyFontSize * 0.8 }}>{item.description}</p>
            )}
          </div>
          <div className="mt-2">
            <span className="font-bold" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
              {item.price?.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (style === 2) {
    return (
      <div className={`${baseClass} flex flex-col h-full`} style={cardStyle} onClick={handleClick}>
        {specialBadge}
        {item.imageUrl && (
          <div className="w-full relative" style={imagePad ? { paddingBottom: imagePad } : { height: '45%' }}>
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex flex-col justify-between p-3 flex-1">
          <div>
            <h3 className="font-semibold" style={{ fontSize: theme.bodyFontSize }}>{item.title}</h3>
            {item.description && (
              <p className="mt-1 truncate text-xs opacity-60" style={{ fontSize: theme.bodyFontSize * 0.8 }}>{item.description}</p>
            )}
          </div>
          <div className="mt-2">
            <span className="font-bold" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
              {item.price?.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (style === 3) {
    return (
      <div
        className={`relative flex items-center gap-3 py-3 px-2 transition-colors rounded-xl cursor-pointer active:scale-[0.98] ${
          isSpecial ? 'bg-amber-50/60 ring-1 ring-amber-200' : ''
        }`}
        style={{ borderBottom: isSpecial ? 'none' : `1px solid ${theme.borderColor}50` }}
        onClick={handleClick}
      >
        {specialBadge}
        {item.imageUrl && (
          <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate" style={{ fontSize: theme.bodyFontSize }}>{item.title}</h3>
          {item.description && (
            <p className="truncate text-xs opacity-50" style={{ fontSize: theme.bodyFontSize * 0.8 }}>{item.description}</p>
          )}
        </div>
        <span className="font-bold whitespace-nowrap" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
          {item.price?.toLocaleString()} تومان
        </span>
      </div>
    );
  }

  if (style === 4) {
    return (
      <div className={`${baseClass} h-full min-h-[180px]`} style={cardStyle} onClick={handleClick}>
        {specialBadge}
        {item.imageUrl && (
          <>
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <div className="relative z-10 flex flex-col justify-end p-4 text-white h-full">
          <h3 className="font-semibold" style={{ fontSize: theme.bodyFontSize }}>{item.title}</h3>
          {item.description && (
            <p className="mt-1 text-xs opacity-90 line-clamp-2" style={{ fontSize: theme.bodyFontSize * 0.8 }}>{item.description}</p>
          )}
          <div className="mt-3">
            <span className="font-bold" style={{ fontSize: theme.bodyFontSize }}>
              {item.price?.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (style === 5) {
    return (
      <div className={`${baseClass} flex flex-col h-full`} style={cardStyle} onClick={handleClick}>
        {specialBadge}
        {item.imageUrl && (
          <div className="w-full relative" style={imagePad ? { paddingBottom: imagePad } : { height: '45%' }}>
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>
        )}
        <div className="flex flex-col justify-between p-3 flex-1">
          <div>
            <h3 className="font-semibold text-white drop-shadow-md" style={{ fontSize: theme.bodyFontSize }}>{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-xs text-white/80 line-clamp-2 drop-shadow-sm" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                {item.description}
              </p>
            )}
          </div>
          <div className="mt-2">
            <span className="font-bold text-white drop-shadow-md" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
              {item.price?.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ---------- Menu Item Modal (popup) ---------- */
function MenuItemModal({ item, categoryName, theme, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!item) return null;

  const style = theme.cardStyle || 1;
  const isGlass = style === 5;
  const isOverlay = style === 4;
  const primary = theme.primaryColor;

  const cardStyle = {
    backgroundColor: isOverlay ? '#111' : (theme.cardBackground || '#ffffff'),
    borderColor: theme.borderColor || '#e2e8f0',
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
  };

  if (isGlass) {
    cardStyle.background = 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 100%)';
    cardStyle.backdropFilter = 'blur(24px)';
    cardStyle.border = '1px solid rgba(255,255,255,0.35)';
  }

  const lightText = isOverlay || isGlass;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: 'fadeInUp 0.2s ease-out' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto border scrollbar-hide"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-3 left-3 z-20 rounded-full bg-black/45 backdrop-blur-sm p-2 text-white hover:bg-black/65 transition-colors"
        >
          <X size={18} />
        </button>

        {item.isSpecial && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
            <Star size={10} /> ویژه
          </div>
        )}

        {item.imageUrl && (
          <div className="relative w-full" style={{ paddingBottom: '62%' }}>
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
            {isOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            )}
            {isGlass && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
          </div>
        )}

        <div className={`p-5 ${isOverlay ? 'relative -mt-14 z-10' : ''}`}>
          {categoryName && (
            <span
              className="inline-block mb-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: lightText ? 'rgba(255,255,255,0.15)' : `${primary}12`,
                color: lightText ? '#fff' : primary,
              }}
            >
              {categoryName}
            </span>
          )}

          <h2
            className={`font-bold ${lightText ? 'text-white drop-shadow-md' : ''}`}
            style={{ fontSize: theme.headingFontSize * 0.55, color: lightText ? undefined : theme.textColor }}
          >
            {item.title}
          </h2>

          {item.description && (
            <p
              className={`mt-2 leading-relaxed ${lightText ? 'text-white/85' : 'opacity-70'}`}
              style={{ fontSize: theme.bodyFontSize }}
            >
              {item.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span
              className={`font-bold ${lightText ? 'text-white drop-shadow-md' : ''}`}
              style={{ color: lightText ? undefined : theme.priceColor, fontSize: theme.bodyFontSize * 1.35 }}
            >
              {item.price?.toLocaleString()} تومان
            </span>
            {item.isAvailable === false && (
              <span className="text-xs font-medium text-red-400">ناموجود</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Category Heading ---------- */
function pickStableImage(items, seed) {
  const withImages = (items || []).filter((i) => i.imageUrl);
  if (withImages.length === 0) return null;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return withImages[hash % withImages.length].imageUrl;
}

function CategoryHeading({ name, items, theme }) {
  const style = theme.categoryStyle || 1;
  const primary = theme.primaryColor;
  const fs = theme.headingFontSize * 0.7;

  if (style === 1)
    return (
      <h2 className="mb-6 text-center font-semibold" style={{ color: primary, fontSize: fs, borderBottom: `2px solid ${theme.borderColor}`, paddingBottom: '0.5rem' }}>
        {name}
      </h2>
    );
  if (style === 2)
    return (
      <div className="mb-6 flex justify-center">
        <span className="inline-block rounded-full px-5 py-2 text-center font-semibold text-white shadow-md" style={{ backgroundColor: primary, fontSize: fs }}>
          {name}
        </span>
      </div>
    );
  if (style === 3)
    return (
      <div className="mb-6 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: primary }} />
        <h2 className="font-semibold" style={{ color: primary, fontSize: fs }}>{name}</h2>
      </div>
    );
  if (style === 4)
    return (
      <div className="mb-6 flex justify-center">
        <h2 className="inline-block rounded-xl border-2 px-6 py-2 text-center font-semibold" style={{ color: primary, borderColor: primary, fontSize: fs }}>
          {name}
        </h2>
      </div>
    );
  if (style === 5) {
    const bgImage = pickStableImage(items, name);
    return (
      <div className="relative mb-6 h-20 w-full rounded-2xl overflow-hidden flex items-center justify-center" style={{ borderRadius: `${theme.borderRadius}px` }}>
        {bgImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(10px)' }}
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-500" />
        )}
        <h2 className="relative z-10 font-bold text-white drop-shadow-lg" style={{ fontSize: fs * 1.1 }}>
          {name}
        </h2>
      </div>
    );
  }
  return null;
}

/* ---------- Footer ---------- */
function CafeFooter({ address, phone, instagram, workingHours, cafeName, theme }) {
  const style = theme.footerStyle || 1;
  const primary = theme.primaryColor;
  const secondary = theme.secondaryColor;
  const year = new Date().getFullYear();
  const copyright = `© ${year} ${cafeName}`;

  const content = (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
      {address && (
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} style={{ color: primary }} />
          <span>{address}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-2 text-sm">
          <Phone size={14} style={{ color: primary }} />
          <span dir="ltr">{phone}</span>
        </div>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-80" style={{ color: secondary }}>
          <ExternalLink size={14} /> اینستاگرام
        </a>
      )}
      {workingHours && (
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} style={{ color: primary }} />
          <span>{workingHours}</span>
        </div>
      )}
    </div>
  );

  const footerStyle = {
    backgroundColor: theme.cardBackground,
    borderColor: theme.borderColor,
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: theme.shadow,
  };

  if (style === 1)
    return (
      <footer className="mt-16 p-5 text-center text-sm" style={footerStyle}>
        {content}
        <p className="mt-4 opacity-40 text-xs">{copyright}</p>
      </footer>
    );

  if (style === 2)
    return (
      <footer className="mt-16 p-6 text-center text-sm" style={{ ...footerStyle, borderRadius: `${theme.borderRadius}px`, border: 'none' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {address && <div className="flex flex-col items-center gap-1"><MapPin size={16} style={{ color: primary }} /><span className="text-xs">{address}</span></div>}
          {phone && <div className="flex flex-col items-center gap-1"><Phone size={16} style={{ color: primary }} /><span dir="ltr" className="text-xs">{phone}</span></div>}
          {instagram && <a href={instagram} className="flex flex-col items-center gap-1"><ExternalLink size={16} style={{ color: secondary }} /><span className="text-xs">اینستاگرام</span></a>}
          {workingHours && <div className="flex flex-col items-center gap-1"><Clock size={16} style={{ color: primary }} /><span className="text-xs">{workingHours}</span></div>}
        </div>
        <p className="opacity-40 text-xs">{copyright}</p>
      </footer>
    );

  if (style === 3)
    return (
      <footer className="mt-16 p-5 text-center text-sm" style={{ ...footerStyle, borderRadius: `${theme.borderRadius}px`, border: 'none' }}>
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-lg font-bold" style={{ color: primary }}>
            <Sparkles size={18} /> {cafeName}
          </div>
          {address && <p className="text-xs">{address}</p>}
        </div>
        {content}
        <p className="mt-4 opacity-40 text-xs">{copyright}</p>
      </footer>
    );

  if (style === 4)
    return (
      <footer className="mt-16 p-5 text-center text-sm" style={{ ...footerStyle, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', borderRadius: '999px', border: 'none' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-bold" style={{ color: primary }}>{cafeName}</div>
          {content}
        </div>
        <p className="mt-4 opacity-40 text-xs">{copyright}</p>
      </footer>
    );

  return null;
}

/* ---------- Main Page ---------- */
export default function PublicMenuPage() {
  const { cafeId, accessKey } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation: 'categories' shows the parent-category cards, 'detail' shows one category's full menu
  const [view, setView] = useState('categories');
  const [activeParent, setActiveParent] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState('all');

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemCategory, setActiveItemCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setView('categories');
    setActiveParent(null);
    setActiveSubCategory('all');
    apiFetch(`/public/${cafeId}/${accessKey}`)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [cafeId, accessKey]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 16px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        will-change: transform, opacity;
      }
      @keyframes glowPulse {
        0% { box-shadow: 0 0 8px rgba(250,204,21,0.4); }
        50% { box-shadow: 0 0 28px rgba(250,204,21,0.8); }
        100% { box-shadow: 0 0 8px rgba(250,204,21,0.4); }
      }
      .animate-glow-pulse { animation: glowPulse 2.5s infinite; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const openItem = useCallback((item, categoryName) => {
    setActiveItem(item);
    setActiveItemCategory(categoryName);
  }, []);

  const closeItem = useCallback(() => {
    setActiveItem(null);
    setActiveItemCategory(null);
  }, []);

  const categories = useMemo(() => (Array.isArray(data?.menu) ? data.menu : []), [data]);
  const theme = data?.theme || {};
  const useTwoColumns = theme.cardWidth <= 200;
  const gridClass = useTwoColumns ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2';

  const activeParentCategory = useMemo(
    () => categories.find((c) => c.parentCategoryName === activeParent) || null,
    [categories, activeParent]
  );

  const activeParentItems = useMemo(
    () => (activeParentCategory ? activeParentCategory.subCategories.flatMap((sc) => sc.items) : []),
    [activeParentCategory]
  );

  const subNavItems = useMemo(() => {
    if (!activeParentCategory) return [];
    return activeParentCategory.subCategories.map((sc) => ({
      key: sc.categoryId,
      label: sc.categoryName,
      imageUrl: sc.items.find((i) => i.imageUrl)?.imageUrl || null,
    }));
  }, [activeParentCategory]);

  const visibleSubCategories = useMemo(() => {
    if (!activeParentCategory) return [];
    if (activeSubCategory === 'all') return activeParentCategory.subCategories;
    return activeParentCategory.subCategories.filter((sc) => sc.categoryId === activeSubCategory);
  }, [activeParentCategory, activeSubCategory]);

  const handleSelectParent = useCallback((name) => {
    setActiveParent(name);
    setActiveSubCategory('all');
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleBack = useCallback(() => {
    setView('categories');
    setActiveParent(null);
    setActiveSubCategory('all');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const showEmptyState = !loading && !error && categories.length === 0;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {theme.backgroundLightEnabled && <BackgroundLights theme={theme} />}

      {theme.overlayOpacity > 0 && (
        <div className="fixed inset-0 z-10 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${theme.overlayOpacity / 100})` }} />
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <CafeHeader
          logoUrl={data?.logoUrl}
          cafeName={data?.cafeName}
          workingHours={data?.workingHours}
          theme={theme}
        />

        {error && (
          <div className="text-center py-16 text-red-400">
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {!error && loading && <MenuSkeleton theme={theme} />}

        {!error && !loading && view === 'categories' && (
          <>
            {categories.length > 0 && (
              <ParentCategoryGrid categories={categories} theme={theme} onSelect={handleSelectParent} />
            )}
            {showEmptyState && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-lg font-medium">منویی موجود نیست</p>
                <p className="text-sm mt-2">لطفاً از مدیریت منو آیتم‌های منو را اضافه کنید</p>
              </div>
            )}
          </>
        )}

        {!error && !loading && view === 'detail' && activeParentCategory && (
          <>
            <BackButton onClick={handleBack} theme={theme} />

            <CategoryHeading name={activeParentCategory.parentCategoryName} items={activeParentItems} theme={theme} />

            {subNavItems.length > 1 && (
              <ImageNavBar items={subNavItems} selected={activeSubCategory} onSelect={setActiveSubCategory} theme={theme} />
            )}

            {visibleSubCategories.map((sc) => (
              <div key={sc.categoryId} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-700" style={{ fontSize: theme.bodyFontSize }}>
                  {sc.categoryName}
                </h3>
                <div className={`grid ${gridClass} gap-4`}>
                  {sc.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      theme={theme}
                      isSpecial={item.isSpecial}
                      onClick={(clickedItem) => openItem(clickedItem, sc.categoryName)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <CafeFooter
          address={data?.address}
          phone={data?.phone}
          instagram={data?.instagram}
          workingHours={data?.workingHours}
          cafeName={data?.cafeName}
          theme={theme}
        />
        <div className="mt-6 flex justify-center">
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=7409176&Code=IzQz3pFc84IStgN0GEPkppcNx8RhZYEb"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=7409176&Code=IzQz3pFc84IStgN0GEPkppcNx8RhZYEb"
              alt="نماد اعتماد الکترونیکی"
              style={{ cursor: 'pointer' }}
            />
          </a>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 rounded-full bg-white/80 backdrop-blur-sm p-2.5 shadow-lg hover:bg-white transition-all"
        >
          <ChevronUp size={20} className="text-gray-700" />
        </button>
      )}

      {activeItem && (
        <MenuItemModal
          item={activeItem}
          categoryName={activeItemCategory}
          theme={theme}
          onClose={closeItem}
        />
      )}
    </div>
  );
}