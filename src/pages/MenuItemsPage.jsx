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
  ChevronRight,
  ChevronLeft,
  ListRestart,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

/* ---------- Toast ---------- */
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] animate-slide-up ${
        type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
      }`}
    >
      {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl bg-white/25">
        <div ref={progressRef} className="h-full bg-white/80" style={{ width: '100%' }} />
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
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export default function MenuItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const fetchCategories = useCallback(async () => {
    try {
      const [cats, parents] = await Promise.all([
        apiFetch('/category'),
        apiFetch('/parent-category'),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setParentCategories(Array.isArray(parents) ? parents : []);
    } catch {}
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

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.id == selectedCategory);
      if (cat) {
        result = result.filter((item) => item.categoryName === cat.name);
      }
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
    <div className="space-y-6" dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)] sm:p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100 ring-1 ring-white/15">
              بخش منو
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">آیتم‌های منو</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-violet-100/90">
              آیتم‌های منوی کافه خود را مدیریت کنید. تغییرات بلافاصله در منوی دیجیتال مشتریان نمایش داده می‌شود.
            </p>
          </div>

          <Button
            onClick={openAddDialog}
            className="gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-md transition hover:bg-violet-50 hover:shadow-lg"
          >
            <Plus size={16} />
            افزودن آیتم
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 rounded-full border-slate-200 bg-white pr-10 text-sm shadow-sm transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
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
            className="gap-1.5 text-slate-500 hover:text-slate-900"
          >
            <ListRestart size={14} />
            پاک‌کردن فیلترها
          </Button>
        )}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
        {loading ? (
          <div className="space-y-5 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
                <div className="flex-1" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">هیچ آیتمی یافت نشد</p>
            <p className="text-xs text-slate-400">فیلترها را تغییر دهید یا آیتم جدیدی اضافه کنید</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-12 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  عنوان
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  دسته‌بندی
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  قیمت (تومان)
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  وضعیت
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ویژه
                </TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="group animate-fade-in-up border-slate-100 transition-colors hover:bg-violet-50/40"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <TableCell className="py-3.5 font-medium text-slate-800">{item.title}</TableCell>
                  <TableCell className="text-slate-500">{item.categoryName || '—'}</TableCell>
                  <TableCell className="text-slate-700">
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
                        <ToggleLeft size={24} className="text-slate-300" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.isSpecial ? (
                      <Star size={17} className="mx-auto fill-amber-400 text-amber-400" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(item)}
                        title="ویرایش"
                        className="h-8 w-8 rounded-full text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDeleteDialog(item)}
                        title="حذف"
                        className="h-8 w-8 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
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
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-9 w-9 rounded-full border-slate-200"
          >
            <ChevronRight size={16} />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-[2.25rem] rounded-full text-sm font-medium ${
                currentPage === page
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-9 w-9 rounded-full border-slate-200"
          >
            <ChevronLeft size={16} />
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              {editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                عنوان <span className="text-rose-500">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: کاپوچینو"
                className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100 ${
                  formErrors.title ? 'border-rose-300 focus-visible:ring-rose-100' : ''
                }`}
              />
              {formErrors.title && <p className="mt-1 text-xs text-rose-500">{formErrors.title}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">توضیحات</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="توضیح کوتاه"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">قیمت (تومان)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="۰"
                  className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 transition focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100 ${
                    formErrors.price ? 'border-rose-300 focus-visible:ring-rose-100' : ''
                  }`}
                />
                {formErrors.price && <p className="mt-1 text-xs text-rose-500">{formErrors.price}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">دسته‌بندی</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">بدون دسته‌بندی</option>
                  {categories.map((cat) => {
                    const parentName = cat.parentCategoryName
                      ? parentCategories.find((p) => p.id === cat.parentCategoryId)?.name
                      : null;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {parentName ? `${parentName} → ${cat.name}` : cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <ImageUploader
              currentImage={form.imageUrl}
              onImageUploaded={(url) => setForm({ ...form, imageUrl: url })}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isAvailable: !f.isAvailable }))}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  form.isAvailable
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {form.isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                موجود
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isSpecial: !f.isSpecial }))}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  form.isSpecial
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Star size={14} className={form.isSpecial ? 'fill-amber-400 text-amber-400' : ''} />
                آیتم ویژه
              </button>
            </div>
          </div>

          <DialogFooter className="mt-4 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-md"
            >
              {editingItem ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl border-0 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] sm:max-w-md">
          <DialogHeader className="items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 size={20} />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-slate-900">
              حذف آیتم
            </DialogTitle>
          </DialogHeader>

          <p className="mt-1 text-center text-sm leading-relaxed text-slate-500">
            آیا از حذف «<span className="font-medium text-slate-700">{deletingItem?.title}</span>»
            اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>

          <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 hover:shadow-md"
            >
              بله، حذف شود
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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