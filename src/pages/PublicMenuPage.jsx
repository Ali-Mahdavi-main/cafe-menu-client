import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { Phone, MapPin, ExternalLink, Clock, Star, Sparkles, ChevronUp } from 'lucide-react';

/* ---------- Helpers ---------- */
const aspectToPadding = (ratio) => {
  if (!ratio || ratio === 'auto') return undefined;
  const [w, h] = ratio.split('/').map(Number);
  return h && w ? `${(h / w) * 100}%` : undefined;
};

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

/* ---------- Fade In Up Animation Component ---------- */
function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <div className={`animate-fade-in-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- MenuItemCard ---------- */
function MenuItemCard({ item, theme, isSpecial = false, index = 0 }) {
  const style = theme.cardStyle || 1;
  const imagePad = aspectToPadding(theme.imageAspectRatio);

  const baseCardClass = `relative overflow-hidden rounded-2xl border transition-all duration-300 ${
    isSpecial ? 'animate-glow-pulse ring-2 ring-amber-400/60' : ''
  } hover:shadow-xl hover:-translate-y-1`;

  const specialBadge = isSpecial ? (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg">
      <Star size={12} /> ویژه
    </div>
  ) : null;

  const cardStyleProps = {
    backgroundColor: theme.cardBackground,
    borderColor: isSpecial ? theme.secondaryColor : theme.borderColor,
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: isSpecial
      ? '0 0 25px rgba(250,204,21,0.4)'
      : theme.shadow !== 'none'
      ? theme.shadow
      : undefined,
  };

  // Style 1 – Horizontal (image left)
  if (style === 1) {
    return (
      <FadeIn delay={index * 80} className="h-full">
        <div className={`${baseCardClass} flex h-full`} style={cardStyleProps}>
          {specialBadge}
          {item.imageUrl && (
            <div className="w-28 sm:w-32 flex-shrink-0 relative" style={imagePad ? { paddingBottom: imagePad } : {}}>
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <h3 className="font-semibold" style={{ fontSize: theme.bodyFontSize }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs opacity-70 line-clamp-2" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                  {item.description}
                </p>
              )}
            </div>
            <div className="mt-2">
              <span className="text-sm font-bold" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
                {item.price?.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  // Style 2 – Image top
  if (style === 2) {
    return (
      <FadeIn delay={index * 80} className="h-full">
        <div className={`${baseCardClass} flex flex-col h-full`} style={cardStyleProps}>
          {specialBadge}
          {item.imageUrl && (
            <div className="w-full relative" style={imagePad ? { paddingBottom: imagePad } : { height: '50%' }}>
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-between p-4 flex-1">
            <div>
              <h3 className="font-semibold text-sm" style={{ fontSize: theme.bodyFontSize }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs opacity-70 line-clamp-2" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                  {item.description}
                </p>
              )}
            </div>
            <div className="mt-2">
              <span className="text-sm font-bold" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
                {item.price?.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  // Style 3 – List style
  if (style === 3) {
    return (
      <FadeIn delay={index * 50}>
        <div
          className={`flex items-center gap-3 py-3 relative transition-colors rounded-lg px-2 ${
            isSpecial ? 'bg-amber-50/60 ring-1 ring-amber-200 animate-glow-pulse' : ''
          }`}
          style={{ borderBottom: isSpecial ? 'none' : `1px solid ${theme.borderColor}` }}
        >
          {specialBadge && <div className="absolute top-1 left-1 z-20">{specialBadge}</div>}
          {item.imageUrl && (
            <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" style={{ fontSize: theme.bodyFontSize }}>
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs opacity-70 truncate" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                {item.description}
              </p>
            )}
          </div>
          <span className="text-sm font-bold whitespace-nowrap" style={{ color: theme.priceColor, fontSize: theme.bodyFontSize }}>
            {item.price?.toLocaleString()} تومان
          </span>
        </div>
      </FadeIn>
    );
  }

  // Style 4 – Image background overlay
  if (style === 4) {
    return (
      <FadeIn delay={index * 80} className="h-full">
        <div className={`${baseCardClass} h-full`} style={{ ...cardStyleProps, minHeight: '180px' }}>
          {specialBadge}
          {item.imageUrl && (
            <>
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
          <div className="relative z-10 flex flex-col justify-end p-4 text-white h-full">
            <h3 className="font-semibold" style={{ fontSize: theme.bodyFontSize }}>
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1 text-xs opacity-90 line-clamp-2" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                {item.description}
              </p>
            )}
            <div className="mt-2">
              <span className="text-sm font-bold" style={{ fontSize: theme.bodyFontSize }}>
                {item.price?.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  // Style 5 – Glassmorphism
  if (style === 5) {
    return (
      <FadeIn delay={index * 80} className="h-full">
        <div
          className={`${baseCardClass} flex flex-col h-full backdrop-blur-2xl border-white/30 shadow-lg`}
          style={{
            borderRadius: `${theme.borderRadius}px`,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
            boxShadow: isSpecial
              ? '0 8px 32px rgba(250,204,21,0.3)'
              : '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          {specialBadge && <div className="absolute top-3 left-3 z-20">{specialBadge}</div>}
          {item.imageUrl && (
            <div className="w-full relative" style={imagePad ? { paddingBottom: imagePad } : { height: '50%' }}>
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
            </div>
          )}
          <div className="flex flex-col justify-between p-4 flex-1">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 drop-shadow-sm" style={{ fontSize: theme.bodyFontSize }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs text-gray-700/80 line-clamp-2 drop-shadow-sm" style={{ fontSize: theme.bodyFontSize * 0.8 }}>
                  {item.description}
                </p>
              )}
            </div>
            <div className="mt-2">
              <span className="text-sm font-bold text-gray-900 drop-shadow-sm" style={{ fontSize: theme.bodyFontSize }}>
                {item.price?.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  return null;
}

/* ---------- Category Heading ---------- */
function CategoryHeading({ category, theme }) {
  const name = category.categoryName;
  const catStyle = theme.categoryStyle || 1;
  const bgImage = catStyle === 5 ? category.items.find((item) => item.imageUrl)?.imageUrl : null;

  if (catStyle === 1)
    return (
      <h2 className="mb-6 text-center font-semibold" style={{ color: theme.primaryColor, fontSize: theme.headingFontSize * 0.75, borderBottom: `2px solid ${theme.borderColor}`, paddingBottom: '0.5rem' }}>
        {name}
      </h2>
    );
  if (catStyle === 2)
    return (
      <div className="mb-6 flex justify-center">
        <span className="inline-block rounded-full px-5 py-2 text-center font-semibold text-white shadow-md" style={{ backgroundColor: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </span>
      </div>
    );
  if (catStyle === 3)
    return (
      <div className="mb-6 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
        <h2 className="font-semibold" style={{ color: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </h2>
      </div>
    );
  if (catStyle === 4)
    return (
      <div className="mb-6 flex justify-center">
        <h2 className="inline-block rounded-xl border-2 px-6 py-2 text-center font-semibold" style={{ color: theme.primaryColor, borderColor: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </h2>
      </div>
    );
  if (catStyle === 5)
    return (
      <div className="relative mb-6 h-24 w-full rounded-xl overflow-hidden flex items-center justify-center" style={{ borderRadius: `${theme.borderRadius}px` }}>
        {bgImage && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(8px) brightness(0.7)', transform: 'scale(1.1)' }} />
            <div className="absolute inset-0 bg-black/30" />
          </>
        )}
        <h2 className="relative z-10 font-bold text-white drop-shadow-lg" style={{ fontSize: theme.headingFontSize * 0.8 }}>
          {name}
        </h2>
      </div>
    );
  return null;
}

/* ---------- Header / Footer ---------- */
function CafeHeader({ logoUrl, cafeName, workingHours, theme }) {
  const style = theme.headerStyle || 1;
  const primary = theme.primaryColor;

  if (style === 1)
    return (
      <header className="mb-8 text-center animate-fade-in">
        {logoUrl && <img src={logoUrl} alt={cafeName} className="mx-auto mb-4 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white" />}
        <h1 className="font-bold tracking-tight" style={{ fontSize: theme.headingFontSize, color: primary }}>
          {cafeName}
        </h1>
        {workingHours && <p className="mt-2 text-sm opacity-70">{workingHours}</p>}
      </header>
    );
  if (style === 2)
    return (
      <header className="mb-8 animate-fade-in">
        {logoUrl && <img src={logoUrl} alt={cafeName} className="w-full h-32 object-cover rounded-xl mb-4 shadow-md" />}
        <h1 className="font-bold text-center" style={{ fontSize: theme.headingFontSize, color: primary }}>
          {cafeName}
        </h1>
        {workingHours && <p className="text-center text-sm opacity-70 mt-1">{workingHours}</p>}
      </header>
    );
  if (style === 3)
    return (
      <header className="mb-8 flex items-center gap-4 animate-fade-in">
        {logoUrl && <img src={logoUrl} alt={cafeName} className="h-16 w-16 rounded-lg object-cover shadow" />}
        <div>
          <h1 className="font-bold" style={{ fontSize: theme.headingFontSize, color: primary }}>
            {cafeName}
          </h1>
          {workingHours && <p className="text-sm opacity-70">{workingHours}</p>}
        </div>
      </header>
    );
  if (style === 4)
    return (
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="inline-block font-bold px-6 py-2 rounded-full border-2" style={{ fontSize: theme.headingFontSize, color: primary, borderColor: primary }}>
          {cafeName}
        </h1>
        {workingHours && <p className="mt-2 text-sm opacity-70">{workingHours}</p>}
      </header>
    );
  return null;
}

function CafeFooter({ address, phone, instagram, workingHours, cafeName, theme }) {
  const style = theme.footerStyle || 1;
  const primary = theme.primaryColor;
  const secondary = theme.secondaryColor;
  const year = new Date().getFullYear();
  const copyright = `© ${year} ${cafeName}`;

  const content = (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
      {address && <div className="flex items-center gap-2"><MapPin size={16} style={{ color: primary }} /><span>{address}</span></div>}
      {phone && <div className="flex items-center gap-2"><Phone size={16} style={{ color: primary }} /><span dir="ltr">{phone}</span></div>}
      {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80" style={{ color: secondary }}><ExternalLink size={16} /><span>اینستاگرام</span></a>}
      {workingHours && <div className="flex items-center gap-2"><Clock size={16} style={{ color: primary }} /><span>{workingHours}</span></div>}
    </div>
  );

  if (style === 1)
    return (
      <footer className="mt-16 p-6 text-center text-sm animate-fade-in" style={{ backgroundColor: theme.cardBackground, borderColor: theme.borderColor, border: `1px solid ${theme.borderColor}`, borderRadius: `${theme.borderRadius}px`, boxShadow: theme.shadow }}>
        {content}
        <p className="mt-4 opacity-50 text-xs">{copyright} | طراحی شده با افتخار</p>
      </footer>
    );
  if (style === 2)
    return (
      <footer className="mt-16 p-6 text-center text-sm animate-fade-in" style={{ backgroundColor: theme.cardBackground, borderRadius: `${theme.borderRadius}px`, boxShadow: theme.shadow }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {address && <div className="flex flex-col items-center"><MapPin size={18} style={{ color: primary }} /><span className="text-xs">{address}</span></div>}
          {phone && <div className="flex flex-col items-center"><Phone size={18} style={{ color: primary }} /><span dir="ltr" className="text-xs">{phone}</span></div>}
          {instagram && <a href={instagram} className="flex flex-col items-center"><ExternalLink size={18} style={{ color: secondary }} /><span className="text-xs">اینستاگرام</span></a>}
          {workingHours && <div className="flex flex-col items-center"><Clock size={18} style={{ color: primary }} /><span className="text-xs">{workingHours}</span></div>}
        </div>
        <p className="opacity-50 text-xs">{copyright}</p>
      </footer>
    );
  if (style === 3)
    return (
      <footer className="mt-16 p-6 text-center text-sm animate-fade-in" style={{ backgroundColor: theme.cardBackground, borderRadius: `${theme.borderRadius}px`, boxShadow: theme.shadow }}>
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-lg font-bold" style={{ color: primary }}>
            <Sparkles size={20} /> {cafeName}
          </div>
          {address && <p className="text-xs">{address}</p>}
        </div>
        {content}
        <p className="mt-4 opacity-50 text-xs">{copyright}</p>
      </footer>
    );
  if (style === 4)
    return (
      <footer className="mt-16 p-6 text-center text-sm animate-fade-in" style={{ backgroundColor: theme.cardBackground, borderRadius: '999px', boxShadow: theme.shadow, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-bold" style={{ color: primary }}>{cafeName}</div>
          {content}
        </div>
        <p className="mt-4 opacity-50 text-xs">{copyright}</p>
      </footer>
    );
  return null;
}

/* ---------- Category Nav Bar ---------- */
function CategoryNavBar({ categories, selected, onSelect, theme }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories]);
  const allImages = useMemo(() => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allItems]);
  const categoryImages = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      if (cat.items.length > 0) map[cat.categoryName] = getRandomItem(cat.items).imageUrl;
    });
    return map;
  }, [categories]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8">
      {showLeftArrow && (
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-1 shadow-md hover:bg-white transition">
          <ChevronUp size={20} className="-rotate-90 text-gray-600" />
        </button>
      )}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide scroll-smooth">
        {/* All card */}
        <button
          onClick={() => onSelect('all')}
          className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:scale-105 ${
            selected === 'all' ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100'
          }`}
          style={{ borderRadius: `${theme.borderRadius}px` }}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-white/20">
            {allImages.map((item, idx) => (
              <div key={idx} className="relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
                )}
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-1 py-0.5">
            <span className="text-xs font-medium text-white text-center block">همه</span>
          </div>
        </button>

        {categories.map((cat) => {
          const image = categoryImages[cat.categoryName];
          return (
            <button
              key={cat.categoryName}
              onClick={() => onSelect(cat.categoryName)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:scale-105 ${
                selected === cat.categoryName ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100'
              }`}
              style={{ borderRadius: `${theme.borderRadius}px` }}
            >
              {image ? (
                <img src={image} alt={cat.categoryName} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{cat.categoryName.charAt(0)}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-1 py-0.5">
                <span className="text-xs font-medium text-white truncate text-center block">{cat.categoryName}</span>
              </div>
            </button>
          );
        })}
      </div>
      {showRightArrow && (
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-1 shadow-md hover:bg-white transition">
          <ChevronUp size={20} className="rotate-90 text-gray-600" />
        </button>
      )}
    </div>
  );
}

/* ---------- Background Light Effect ---------- */
function BackgroundLights({ theme }) {
  if (!theme.backgroundLightEnabled) return null;

  const intensity = theme.backgroundLightIntensity ?? 50; // percent
  const leftColor = theme.backgroundLightLeftColor || '#a78bfa';
  const rightColor = theme.backgroundLightRightColor || '#60a5fa';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left light */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 opacity-70"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${leftColor}${Math.round(intensity * 2.55).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
      />
      {/* Right light */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 opacity-70"
        style={{
          background: `radial-gradient(circle at 80% 50%, ${rightColor}${Math.round(intensity * 2.55).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ---------- MAIN PUBLIC MENU PAGE ---------- */
export default function PublicMenuPage() {
  // ---------- ALL HOOKS FIRST (unconditionally) ----------
  const { cafeId, accessKey } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Data fetching
  useEffect(() => {
    apiFetch(`/public/${cafeId}/${accessKey}`)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cafeId, accessKey]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fadeInUp 0.5s ease-out both; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fadeIn 0.8s ease-out; }
      @keyframes glowPulse {
        0% { box-shadow: 0 0 8px rgba(250,204,21,0.4); }
        50% { box-shadow: 0 0 25px rgba(250,204,21,0.8); }
        100% { box-shadow: 0 0 8px rgba(250,204,21,0.4); }
      }
      .animate-glow-pulse { animation: glowPulse 2.5s infinite; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Derived data
  const categories = useMemo(() => (Array.isArray(data?.menu) ? data.menu : []), [data]);

  const filteredCategories = useMemo(() => {
    return selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.categoryName === selectedCategory);
  }, [categories, selectedCategory]);

  const categoryNames = useMemo(() => categories.map((c) => c.categoryName).filter(Boolean), [categories]);
  const theme = data?.theme || {};
  const useTwoColumns = theme.cardWidth <= 200;
  const gridClass = useTwoColumns ? 'grid-cols-2' : 'grid-cols-1';
  const isListStyle = theme.cardStyle === 3;

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-rose-500">
        <p>کافه پیدا نشد</p>
      </div>
    );
  }

  if (!data) return null;

  const { cafeName, logoUrl, address, phone, instagram, workingHours } = data;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Fixed background lighting (editable from theme editor) */}
      <BackgroundLights theme={theme} />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <CafeHeader logoUrl={logoUrl} cafeName={cafeName} workingHours={workingHours} theme={theme} />

        {categoryNames.length > 0 && (
          <CategoryNavBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} theme={theme} />
        )}

        {filteredCategories.map((category) => {
          const specialItems = category.items.filter((i) => i.isSpecial);
          const normalItems = category.items.filter((i) => !i.isSpecial);
          const allCatItems = [...specialItems, ...normalItems];

          return (
            <section key={category.categoryName} className="mb-12">
              <CategoryHeading category={category} theme={theme} />
              {isListStyle ? (
                <div className="space-y-2">
                  {allCatItems.map((item, idx) => (
                    <MenuItemCard key={item.id} item={item} theme={theme} isSpecial={item.isSpecial} index={idx} />
                  ))}
                </div>
              ) : (
                <div className={`grid ${gridClass} gap-4`}>
                  {allCatItems.map((item, idx) => (
                    <MenuItemCard key={item.id} item={item} theme={theme} isSpecial={item.isSpecial} index={idx} />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <CafeFooter
          address={address}
          phone={phone}
          instagram={instagram}
          workingHours={workingHours}
          cafeName={cafeName}
          theme={theme}
        />
      </div>

      {/* Floating scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 rounded-full bg-white/80 backdrop-blur-sm p-2 shadow-lg hover:bg-white transition-all animate-fade-in-up"
        >
          <ChevronUp size={22} className="text-gray-700" />
        </button>
      )}
    </div>
  );
}