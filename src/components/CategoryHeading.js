function CategoryHeading({ category, theme }) {
  const name = category.categoryName;
  const catStyle = theme.categoryStyle || 1;
  const bgImage = catStyle === 5 ? category.items.find(item => item.imageUrl)?.imageUrl : null;

  if (catStyle === 1) {
    return (
      <h2 className="mb-6 text-center font-semibold" style={{ color: theme.primaryColor, fontSize: theme.headingFontSize * 0.75, borderBottom: `2px solid ${theme.borderColor}`, paddingBottom: '0.5rem' }}>
        {name}
      </h2>
    );
  }

  if (catStyle === 2) {
    return (
      <div className="mb-6 flex justify-center">
        <span className="inline-block rounded-full px-4 py-1.5 text-center font-semibold text-white" style={{ backgroundColor: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </span>
      </div>
    );
  }

  if (catStyle === 3) {
    return (
      <div className="mb-6 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
        <h2 className="font-semibold" style={{ color: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </h2>
      </div>
    );
  }

  if (catStyle === 4) {
    return (
      <div className="mb-6 flex justify-center">
        <h2 className="inline-block rounded-lg border px-6 py-2 text-center font-semibold" style={{ color: theme.primaryColor, borderColor: theme.primaryColor, fontSize: theme.headingFontSize * 0.75 }}>
          {name}
        </h2>
      </div>
    );
  }

  if (catStyle === 5) {
    return (
      <div className="relative mb-6 h-24 w-full rounded-xl overflow-hidden flex items-center justify-center" style={{ borderRadius: `${theme.borderRadius}px`, boxShadow: theme.shadow !== 'none' ? theme.shadow : undefined }}>
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
  }

  return null;
}