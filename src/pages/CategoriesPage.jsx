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
import { Plus, Pencil, LayoutGrid, Trash2, Search, Sparkles, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [parentDialogOpen, setParentDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [parentFormName, setParentFormName] = useState('');

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [subFormName, setSubFormName] = useState('');
  const [subFormParentId, setSubFormParentId] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteType, setDeleteType] = useState('parent');

  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [expandedParents, setExpandedParents] = useState({});

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchData = async () => {
    try {
      const [parents, subs] = await Promise.all([
        apiFetch('/parent-category'),
        apiFetch('/category'),
      ]);
      setParentCategories(Array.isArray(parents) ? parents : []);
      setSubCategories(Array.isArray(subs) ? subs : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.cafeId) fetchData();
  }, [user?.cafeId]);

  const getSubCategoriesForParent = (parentId) => {
    return subCategories.filter((sc) => sc.parentCategoryId === parentId);
  };

  const openAddParentDialog = () => {
    setEditingParent(null);
    setParentFormName('');
    setParentDialogOpen(true);
  };

  const openEditParentDialog = (parent) => {
    setEditingParent(parent);
    setParentFormName(parent.name);
    setParentDialogOpen(true);
  };

  const openAddSubDialog = (parentId) => {
    setEditingSub(null);
    setSubFormName('');
    setSubFormParentId(parentId?.toString() || '');
    setSubDialogOpen(true);
  };

  const openEditSubDialog = (sub) => {
    setEditingSub(sub);
    setSubFormName(sub.name);
    setSubFormParentId(sub.parentCategoryId?.toString() || '');
    setSubDialogOpen(true);
  };

  const handleSaveParent = async () => {
    if (!parentFormName.trim()) {
      showFeedback('نام دسته‌بندی والد الزامی است', 'error');
      return;
    }
    try {
      if (editingParent) {
        await apiFetch(`/parent-category/${editingParent.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: parentFormName.trim(), isEnabled: editingParent.isEnabled }),
        });
        showFeedback('دسته‌بندی والد با موفقیت ویرایش شد');
      } else {
        await apiFetch('/parent-category', {
          method: 'POST',
          body: JSON.stringify({ name: parentFormName.trim() }),
        });
        showFeedback('دسته‌بندی والد جدید اضافه شد');
      }
      setParentDialogOpen(false);
      fetchData();
    } catch (err) {
      showFeedback(err.message || 'خطا در ذخیره‌سازی', 'error');
    }
  };

  const handleSaveSub = async () => {
    if (!subFormName.trim()) {
      showFeedback('نام دسته‌بندی الزامی است', 'error');
      return;
    }
    if (!subFormParentId) {
      showFeedback('انتخاب دسته‌بندی والد الزامی است', 'error');
      return;
    }
    try {
      if (editingSub) {
        await apiFetch(`/category/${editingSub.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: subFormName.trim(), parentCategoryId: parseInt(subFormParentId) || null }),
        });
        showFeedback('دسته‌بندی فرعی با موفقیت ویرایش شد');
      } else {
        await apiFetch('/category', {
          method: 'POST',
          body: JSON.stringify({ name: subFormName.trim(), parentCategoryId: parseInt(subFormParentId) }),
        });
        showFeedback('دسته‌بندی فرعی جدید اضافه شد');
      }
      setSubDialogOpen(false);
      fetchData();
    } catch (err) {
      showFeedback(err.message || 'خطا در ذخیره‌سازی', 'error');
    }
  };

  const openParentDeleteDialog = (parent) => {
    setDeletingItem(parent);
    setDeleteType('parent');
    setDeleteDialogOpen(true);
  };

  const openSubDeleteDialog = (sub) => {
    setDeletingItem(sub);
    setDeleteType('sub');
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const endpoint = deleteType === 'parent'
        ? `/parent-category/${deletingItem.id}`
        : `/category/${deletingItem.id}`;
      await apiFetch(endpoint, { method: 'DELETE' });
      showFeedback(deleteType === 'parent' ? 'دسته‌بندی والد حذف شد' : 'دسته‌بندی فرعی حذف شد');
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      showFeedback(err.message || 'حذف با مشکل مواجه شد', 'error');
    }
  };

  const toggleParent = async (parent) => {
    try {
      await apiFetch(`/parent-category/${parent.id}/toggle`, { method: 'POST' });
      showFeedback(parent.isEnabled ? 'دسته‌بندی والد غیرفعال شد' : 'دسته‌بندی والد فعال شد');
      fetchData();
    } catch (err) {
      showFeedback(err.message || 'خطا در تغییر وضعیت', 'error');
    }
  };

  const toggleExpand = (parentId) => {
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
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

  const filteredParents = parentCategories.filter((pc) =>
    pc.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
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

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-fuchsia-700 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_20px_50px_-20px_rgba(91,33,182,0.65)] sm:p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100 ring-1 ring-white/15">
              بخش مدیریت دسته‌بندی‌ها
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">مدیریت دسته‌بندی‌های منو</h1>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={openAddParentDialog}
              className="gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-md transition hover:bg-violet-50 hover:shadow-lg"
            >
              <Plus size={16} />
              دسته‌بندی والد
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

      {/* ============ PARENT CATEGORIES ============ */}
      <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid size={20} className="text-violet-600" />
            دسته‌بندی‌های والد
            <span className="text-xs font-normal text-slate-400 ml-auto">{parentCategories.length}</span>
          </h2>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                نام دسته‌بندی والد
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                تعداد فرعی
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                وضعیت
              </TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <LayoutGrid size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-500">هیچ دسته‌بندی والدی یافت نشد</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredParents.map((parent) => {
                const subs = getSubCategoriesForParent(parent.id);
                const isExpanded = expandedParents[parent.id];
                return (
                  <>
                    <TableRow
                      key={parent.id}
                      className="group border-slate-100 transition-colors hover:bg-violet-50/40"
                    >
                      <TableCell className="py-3.5 font-medium text-slate-800">
                        <button
                          onClick={() => toggleExpand(parent.id)}
                          className="flex items-center gap-2 hover:text-violet-700 transition-colors"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          {parent.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-slate-500">{subs.length}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleParent(parent)}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: parent.isEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                            color: parent.isEnabled ? '#059669' : '#e11d48',
                          }}
                        >
                          {parent.isEnabled ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                          {parent.isEnabled ? 'فعال' : 'غیرفعال'}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditParentDialog(parent)}
                            title="ویرایش"
                            className="h-8 w-8 rounded-full text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                          >
                            <Pencil size={15} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openParentDeleteDialog(parent)}
                            title="حذف"
                            className="h-8 w-8 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && subs.length > 0 && (
                      <>
                        {subs.map((sub) => (
                          <TableRow
                            key={sub.id}
                            className="bg-slate-50/50"
                          >
                            <TableCell className="py-2 pl-10 text-sm text-slate-600">
                              <span className="mr-1 text-slate-400">└─</span>
                              {sub.name}
                            </TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openEditSubDialog(sub)}
                                  title="ویرایش"
                                  className="h-7 w-7 rounded-full text-slate-500 hover:bg-amber-100 hover:text-amber-700"
                                >
                                  <Pencil size={12} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openSubDeleteDialog(sub)}
                                  title="حذف"
                                  className="h-7 w-7 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ============ SUB CATEGORIES ============ */}
      <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_-24px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-600" />
            دسته‌بندی‌های فرعی
            <span className="text-xs font-normal text-slate-400 ml-auto">{subCategories.length}</span>
          </h2>
          <Button
            size="sm"
            onClick={() => openAddSubDialog(null)}
            className="gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200 transition"
          >
            <Plus size={13} />
            فرعی
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                نام دسته‌بندی فرعی
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                والد
              </TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="py-16 text-center">
                  <p className="text-sm font-medium text-slate-500">هیچ دسته‌بندی فرعی یافت نشد</p>
                  <p className="text-xs text-slate-400">ابتدا دسته‌بندی والد اضافه کنید</p>
                </TableCell>
              </TableRow>
            ) : (
              subCategories.map((sub) => {
                const parentName = parentCategories.find((p) => p.id === sub.parentCategoryId)?.name || '—';
                return (
                  <TableRow
                    key={sub.id}
                    className="group border-slate-100 transition-colors hover:bg-violet-50/40"
                  >
                    <TableCell className="py-3.5 font-medium text-slate-800">
                      {sub.name}
                    </TableCell>
                    <TableCell className="text-slate-500">{parentName}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditSubDialog(sub)}
                          title="ویرایش"
                          className="h-8 w-8 rounded-full text-slate-500 hover:bg-amber-100 hover:text-amber-700"
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openSubDeleteDialog(sub)}
                          title="حذف"
                          className="h-8 w-8 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ============ ADD/EDIT PARENT DIALOG ============ */}
      <Dialog open={parentDialogOpen} onOpenChange={setParentDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 bg-white/95 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-center text-lg font-semibold text-slate-900">
              {editingParent ? 'ویرایش دسته‌بندی والد' : 'افزودن دسته‌بندی والد جدید'}
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              {editingParent ? 'اطلاعات دسته‌بندی والد را ویرایش کنید' : 'یک دسته‌بندی والد جدید برای منو ایجاد کنید'}
            </p>
          </DialogHeader>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              نام دسته‌بندی والد
            </label>
            <Input
              value={parentFormName}
              onChange={(e) => setParentFormName(e.target.value)}
              placeholder="مثال: کافی شاپ"
              className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-right transition focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-300"
            />
          </div>

          <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={handleSaveParent}
              className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
            >
              {editingParent ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی والد'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setParentDialogOpen(false)}
              className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ ADD/EDIT SUB DIALOG ============ */}
      <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 bg-white/95 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-center text-lg font-semibold text-slate-900">
              {editingSub ? 'ویرایش دسته‌بندی فرعی' : 'افزودن دسته‌بندی فرعی جدید'}
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              {editingSub ? 'اطلاعات دسته‌بندی فرعی را ویرایش کنید' : 'یک دسته‌بندی فرعی جدید برای منو ایجاد کنید'}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                نام دسته‌بندی فرعی
              </label>
              <Input
                value={subFormName}
                onChange={(e) => setSubFormName(e.target.value)}
                placeholder="مثال: نوشیدنی گرم"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-right transition focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                دسته‌بندی والد
              </label>
              <select
                value={subFormParentId}
                onChange={(e) => setSubFormParentId(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">انتخاب دسته‌بندی والد</option>
                {parentCategories.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={handleSaveSub}
              className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
            >
              {editingSub ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی فرعی'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSubDialogOpen(false)}
              className="flex-1 rounded-xl border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ DELETE DIALOG ============ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-6">
          <DialogHeader className="items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 size={20} />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-slate-900">
              {deleteType === 'parent' ? 'حذف دسته‌بندی والد' : 'حذف دسته‌بندی فرعی'}
            </DialogTitle>
          </DialogHeader>

          <p className="mt-1 text-center text-sm leading-relaxed text-slate-500">
            آیا از حذف «<span className="font-medium text-slate-700">{deletingItem?.name}</span>» اطمینان دارید؟
            این عمل قابل بازگشت نیست.
          </p>

          <DialogFooter className="mt-8 flex-row-reverse gap-2 sm:justify-start">
            <Button
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 hover:shadow-md"
            >
              {deleteType === 'parent' ? 'حذف دسته‌بندی والد' : 'حذف دسته‌بندی فرعی'}
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
