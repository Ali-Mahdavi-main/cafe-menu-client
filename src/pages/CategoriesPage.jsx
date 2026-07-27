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
import { Plus, Pencil, Trash2, Search, Sparkles, X } from 'lucide-react';

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
      <div className="rounded-[32px] bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-violet-100">بخش دسته‌بندی‌ها</p>
            <h1 className="mt-2 text-2xl font-bold">دسته‌بندی‌های منو</h1>
            <p className="mt-2 max-w-2xl text-sm text-violet-100">
              دسته‌بندی‌های خود را مدیریت کنید تا آیتم‌های منو به صورت سازمان‌یافته نمایش داده شوند.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <Button
              onClick={openAddDialog}
              className="gap-2 bg-white/20 text-white hover:bg-white/30 border-0"
            >
              <Plus size={16} />
              افزودن دسته‌بندی
            </Button>
          </div>
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
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-right font-semibold">نام دسته‌بندی</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-400 py-8">
                  هیچ دسته‌بندی‌ای یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-violet-50/50">
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(cat)}
                        title="ویرایش"
                        className="hover:bg-violet-100 hover:text-violet-600"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDeleteDialog(cat)}
                        title="حذف"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
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
        <DialogContent className="rounded-[28px] border-slate-200 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="مثال: نوشیدنی گرم"
            />
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
              {editingCategory ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[28px] shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)]">
          <DialogHeader>
            <DialogTitle className="text-rose-600">حذف دسته‌بندی</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            آیا از حذف «{deletingCategory?.name}» اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}