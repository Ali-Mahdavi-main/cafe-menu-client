import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function ImageUploader({ currentImage, onImageUploaded }) {
  const [preview, setPreview] = useState(null); // data URL from file reader, or null
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Determine the image source to display:
  // - If we have a local preview (data URL), use it.
  // - Otherwise, if there's a currentImage (relative path), convert to full URL.
  const imageSrc = preview || (currentImage ? currentImage : null);

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('فقط فایل‌های JPG، PNG و WebP مجاز هستند');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
      return;
    }

    // Show preview locally
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await apiFetch('/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type
      });

      // Return the relative URL to parent
      onImageUploaded(data.imageUrl);
    } catch (err) {
      setError(err.message || 'خطا در آپلود تصویر');
      setPreview(null); // revert preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(''); // clear URL in parent form
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">تصویر</label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt="پیش‌نمایش"
              className="h-40 w-full object-contain rounded-lg"
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            {uploading ? (
              <Loader2 size={32} className="animate-spin mb-2" />
            ) : (
              <ImageIcon size={32} className="mb-2" />
            )}
            <span className="text-sm">
              {uploading ? 'در حال آپلود...' : 'کلیک کنید یا فایل را اینجا رها کنید'}
            </span>
            <span className="mt-1 text-xs text-gray-400">JPG, PNG, WebP (حداکثر ۵MB)</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}