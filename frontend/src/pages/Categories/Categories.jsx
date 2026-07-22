import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService.js";
import { slugify, formatDate } from "../../utils/slug.js";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, editing: null });
  const [confirm, setConfirm] = useState({ open: false, item: null, loading: false });

  const load = async () => {
    setLoading(true);
    try {
      const data = await listCategories();
      setItems(Array.isArray(data) ? data : data?.categories || []);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => setModal({ open: true, editing: null });
  const openEdit = (item) => setModal({ open: true, editing: item });
  const close = () => setModal({ open: false, editing: null });

  const handleDelete = async () => {
    if (!confirm.item) return;
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await deleteCategory(confirm.item.id);
      toast.success("Category deleted");
      setItems((arr) => arr.filter((x) => x.id !== confirm.item.id));
      setConfirm({ open: false, item: null, loading: false });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Delete failed");
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500">
            Organize your blogs into categories.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2 border-b border-gray-100 p-4">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="ml-auto h-6 w-24" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.slug}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {c.description || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(c)}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setConfirm({ open: true, item: c, loading: false })}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CategoryFormModal
        key={modal.editing?.id || "new"}
        open={modal.open}
        editing={modal.editing}
        onClose={close}
        onSaved={(saved, isNew) => {
          setItems((arr) =>
            isNew ? [saved, ...arr] : arr.map((x) => (x.id === saved.id ? saved : x))
          );
          close();
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete Category?"
        message={`This will permanently delete "${confirm.item?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        loading={confirm.loading}
        onCancel={() => setConfirm({ open: false, item: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function CategoryFormModal({ open, editing, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: editing?.name || "",
      slug: editing?.slug || "",
      description: editing?.description || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editing?.name || "",
        slug: editing?.slug || "",
        description: editing?.description || "",
      });
    }
  }, [open, editing, reset]);

  const nameVal = watch("name");
  useEffect(() => {
    if (!editing && nameVal) setValue("slug", slugify(nameVal));
  }, [nameVal, editing, setValue]);

  const submit = async (values) => {
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, values);
        toast.success("Category updated");
        onSaved(updated, false);
      } else {
        const created = await createCategory(values);
        toast.success("Category created");
        onSaved(created, true);
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Save failed");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Category" : "New Category"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(submit)} loading={isSubmitting}>
            {editing ? "Save changes" : "Create"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="Name"
          placeholder="e.g. Engineering"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Slug"
          placeholder="engineering"
          error={errors.slug?.message}
          {...register("slug", { required: "Slug is required" })}
        />
        <Textarea
          label="Description"
          placeholder="Short description (optional)"
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
