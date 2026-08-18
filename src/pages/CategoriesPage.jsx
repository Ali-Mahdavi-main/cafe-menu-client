import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
import { Plus, Pencil,LayoutGrid , Trash2, Search, Sparkles, X } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/category');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.cafeId) fetchCategories();
  }, [user?.cafeId]);

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormName('');
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showFeedback('نام دسته‌بندی الزامی است', 'error');
      return;
    }
    try {
      if (editingCategory) {
        await apiFetch(`/category/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: formName.trim() }),
        });
        showFeedback('دسته‌بندی با موفقیت ویرایش شد');
      } else {
        await apiFetch('/category', {
          method: 'POST',
          body: JSON.stringify({ name: formName.trim() }),
        });
        showFeedback('دسته‌بندی جدید اضافه شد');
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (err) {
      showFeedback(err.message || 'خطا در ذخیره‌سازی', 'error');
    }
  };

  const openDeleteDialog = (category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/category/${deletingCategory.id}`, {
        method: 'DELETE',
      });
      showFeedback('دسته‌بندی حذف شد');
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (err) {
      showFeedback(err.message || 'حذف با مشکل مواجه شد', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-600">
        خطا در دریافت دسته‌بندی‌ها: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Feedback toast */}
      {feedback.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl ${
            feedback.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ show: false })}
            className="ml-auto rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)] sm:p-8">
    {/* decorative glow — subtle depth, not noise */}
    <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

    <div className="relative flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100 ring-1 ring-white/15">
          بخش دسته‌بندی‌ها
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">دسته‌بندی‌های منو</h1>
      </div>

    <Button
      onClick={openAddDialog}
      className="gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-md transition hover:bg-violet-50 hover:shadow-lg"
    >
          <Plus size={16} />
          افزودن دسته‌بندی
        </Button>
      </div>
    </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-9"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              نام دسته‌بندی
            </TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <LayoutGrid size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">هیچ دسته‌بندی‌ای یافت نشد</p>
                  <p className="text-xs text-slate-400">یک دسته‌بندی جدید اضافه کنید تا اینجا نمایش داده شود</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((cat) => (
              <TableRow
                key={cat.id}
                className="group border-slate-100 transition-colors hover:bg-violet-50/40"
              >
                <TableCell className="py-3.5 font-medium text-slate-800">
                  {cat.name}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(cat)}
                      title="ویرایش"
                      className="h-8 w-8 rounded-full text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openDeleteDialog(cat)}
                      title="حذف"
                      className="h-8 w-8 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="sm:max-w-md rounded-2xl border-0 bg-white/95 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-6">
    <DialogHeader className="space-y-1">
      <DialogTitle className="text-center text-lg font-semibold text-slate-900">
        {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
      </DialogTitle>
      <p className="text-center text-sm text-slate-500">
        {editingCategory ? 'اطلاعات دسته‌بندی را ویرایش کنید' : 'یک دسته‌بندی جدید برای منو ایجاد کنید'}
      </p>
    </DialogHeader>

    <div className="mt-6">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        نام دسته‌بندی
      </label>
      <Input
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="مثال: نوشیدنی گرم"
        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-right transition focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-300"
      />
    </div>

    <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
      <Button
        onClick={handleSave}
        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
      >
        {editingCategory ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی'}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-6">
        <DialogHeader className="items-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Trash2 size={20} />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-slate-900">
            حذف دسته‌بندی
          </DialogTitle>
        </DialogHeader>

        <p className="mt-1 text-center text-sm leading-relaxed text-slate-500">
          آیا از حذف «<span className="font-medium text-slate-700">{deletingCategory?.name}</span>» اطمینان دارید؟
          این عمل قابل بازگشت نیست.
        </p>

        <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
          <Button
            onClick={handleDelete}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 hover:shadow-md"
          >
            حذف دسته‌بندی
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
    </div>
  );
}