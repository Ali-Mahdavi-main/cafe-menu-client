import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploader from '../components/ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
  X,
  Star,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ListRestart,
  Loader2,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

/* ---------- Modern Toast with progress bar ---------- */
function Toast({ message, type, onClose }) {
  const progressRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    const bar = progressRef.current;
    if (bar) {
      bar.style.transition = 'width 4s linear';
      requestAnimationFrame(() => (bar.style.width = '0%'));
    }
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl animate-slide-up ${
        type === 'error'
          ? 'bg-rose-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} className="hidden sm:block" />}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
      {/* progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-white/30">
        <div ref={progressRef} className="h-full rounded-b-xl bg-white/70" style={{ width: '100%' }} />
      </div>
    </div>
  );
}

function CheckCircle({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ---------- Skeleton Loading ---------- */
function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function MenuItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    isAvailable: true,
    isSpecial: false,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  // --- Data Fetching ---
  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiFetch('/category');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      // silently ignore
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/menu');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      showToast('خطا در دریافت آیتم‌ها', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user?.cafeId) {
      fetchCategories();
      fetchItems();
    }
  }, [user?.cafeId, fetchCategories, fetchItems]);

  // --- Filtering & Pagination ---
  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory !== 'all') {
      const catName = categories.find((c) => c.id == selectedCategory)?.name;
      if (catName) result = result.filter((item) => item.categoryName === catName);
    }
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [items, selectedCategory, searchTerm, categories]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // --- Handlers ---
  const openAddDialog = () => {
    setEditingItem(null);
    setForm({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      categoryId: '',
      isAvailable: true,
      isSpecial: false,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    const cat = categories.find((c) => c.name === item.categoryName);
    setForm({
      title: item.title,
      description: item.description || '',
      price: item.price?.toString() || '',
      imageUrl: item.imageUrl || '',
      categoryId: cat?.id?.toString() || '',
      isAvailable: item.isAvailable,
      isSpecial: item.isSpecial || false,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'عنوان الزامی است';
    if (form.price && parseFloat(form.price) < 0) errors.price = 'قیمت نمی‌تواند منفی باشد';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      imageUrl: form.imageUrl.trim(),
      categoryId: form.categoryId ? parseInt(form.categoryId) : 0,
      isAvailable: form.isAvailable,
      isSpecial: form.isSpecial,
    };

    try {
      if (editingItem) {
        await apiFetch(`/menu/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast('آیتم با موفقیت ویرایش شد');
      } else {
        await apiFetch('/menu', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast('آیتم جدید اضافه شد');
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      showToast(err.message || 'خطا در ذخیره', 'error');
    }
  };

  const handleToggleAvailability = async (item) => {
    const payload = {
      title: item.title,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      categoryId: categories.find((c) => c.name === item.categoryName)?.id || 0,
      isAvailable: !item.isAvailable,
      isSpecial: item.isSpecial,
    };
    try {
      await apiFetch(`/menu/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('وضعیت آیتم تغییر کرد');
      fetchItems();
    } catch (err) {
      showToast(err.message || 'خطا در تغییر وضعیت', 'error');
    }
  };

  const openDeleteDialog = (item) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/menu/${deletingItem.id}`, { method: 'DELETE' });
      showToast('آیتم حذف شد');
      setDeleteDialogOpen(false);
      fetchItems();
    } catch (err) {
      showToast(err.message || 'حذف با خطا مواجه شد', 'error');
    }
  };

  // --- Render ---
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-2xl bg-rose-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-400" />
          <p className="mt-3 text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">آیتم‌های منو</h1>
          <p className="text-sm text-gray-500">مدیریت آیتم‌ها و قیمت‌ها</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30"
        >
          <Plus size={16} />
          افزودن آیتم
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        >
          <option value="all">همه دسته‌بندی‌ها</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {(searchTerm || selectedCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="text-gray-500 gap-1"
          >
            <ListRestart size={14} />
            پاک‌کردن فیلترها
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
                <div className="flex-1" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">هیچ آیتمی یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-right font-semibold">عنوان</TableHead>
                <TableHead className="text-right font-semibold">دسته‌بندی</TableHead>
                <TableHead className="text-right font-semibold">قیمت (تومان)</TableHead>
                <TableHead className="text-center font-semibold">وضعیت</TableHead>
                <TableHead className="text-center font-semibold">ویژه</TableHead>
                <TableHead className="w-28 text-right font-semibold">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="transition-all duration-200 hover:bg-blue-50/50 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell className="text-gray-600">{item.categoryName}</TableCell>
                  <TableCell className="text-gray-700">
                    {item.price?.toLocaleString('fa-IR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className="inline-flex transform transition-transform hover:scale-110"
                      title={item.isAvailable ? 'موجود' : 'ناموجود'}
                    >
                      {item.isAvailable ? (
                        <ToggleRight size={24} className="text-emerald-500" />
                      ) : (
                        <ToggleLeft size={24} className="text-gray-300" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.isSpecial ? (
                      <Star size={18} className="mx-auto text-amber-400" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(item)}
                        className="hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDeleteDialog(item)}
                        className="hover:bg-rose-100 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ArrowUp size={16} className="rotate-90" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="min-w-[2.5rem]"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ArrowDown size={16} className="rotate-90" />
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: کاپوچینو"
                className={formErrors.title ? 'border-red-500 ring-1 ring-red-200' : ''}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="توضیح کوتاه"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">قیمت (تومان)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="۰"
                  className={formErrors.price ? 'border-red-500' : ''}
                />
                {formErrors.price && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">بدون دسته‌بندی</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ImageUploader
              currentImage={form.imageUrl}
              onImageUploaded={(url) => setForm({ ...form, imageUrl: url })}
            />
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">موجود</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSpecial}
                  onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Star size={14} className="text-amber-400" />
                  آیتم ویژه
                </span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 size={20} />
              حذف آیتم
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            آیا از حذف «{deletingItem?.title}» اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              بله، حذف شود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS animations */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}