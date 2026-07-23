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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Feedback message (since we haven't installed sonner yet, use state)
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

    const fetchCategories = async () => {
        try {
            const data = await apiFetch('/category');   // GET /api/category
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

  // Filter and search (client‑side)
  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Add / Edit ---
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
        // PUT – backend not yet implemented, will show error if fails
        await apiFetch(`/category/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: formName.trim() }),
        });
        showFeedback('دسته‌بندی با موفقیت ویرایش شد');
      } else {
        // POST – implemented
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

  // --- Delete ---
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
      showFeedback(err.message || 'حذف با مشکل مواجه شد (ممکن است endpoint وجود نداشته باشد)', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
    <div className="space-y-6">
      {/* Feedback toast */}
      {feedback.show && (
        <div
          className={`fixed bottom-6 left-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">دسته‌بندی‌ها</h1>
          <p className="text-sm text-gray-500">مدیریت دسته‌بندی‌های منو</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus size={16} />
          افزودن دسته‌بندی
        </Button>
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

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نام دسته‌بندی</TableHead>
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
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(cat)}
                        title="ویرایش"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDeleteDialog(cat)}
                        title="حذف"
                        className="text-red-500 hover:text-red-700"
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
        <DialogContent>
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
            <Button onClick={handleSave}>
              {editingCategory ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف دسته‌بندی</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            آیا از حذف «{deletingCategory?.name}» اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}