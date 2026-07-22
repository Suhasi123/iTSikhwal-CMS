import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ImageUpload from "../../components/forms/ImageUpload.jsx";
import RichTextEditor from "../../components/editor/RichTextEditor.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import {
  createBlog,
  getBlog,
  updateBlog,
  publishBlog,
  checkSlug,
  deleteThumbnail,
  deleteCover,
} from "../../services/blogService.js";
import { listCategories } from "../../services/categoryService.js";
import { slugify } from "../../utils/slug.js";

const DEFAULTS = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category_id: "",
  reading_time: 5,
  meta_title: "",
  meta_description: "",
  keywords: "",
  is_featured: false,
  show_newsletter: false,
  status: "draft",
};

export default function BlogForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [cover, setCover] = useState(null);
  const [confirmImg, setConfirmImg] = useState({ open: false, type: null });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULTS });

  const titleVal = watch("title");
  const slugVal = watch("slug");

  useEffect(() => {
    listCategories()
      .then((d) => setCategories(Array.isArray(d) ? d : d?.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!editing) return;
    let active = true;
    (async () => {
      try {
        const b = await getBlog(id);
        if (!active) return;
        reset({
          title: b.title || "",
          slug: b.slug || "",
          excerpt: b.excerpt || "",
          content: b.content || "",
          category_id: b.category?.id || b.category_id || "",
          reading_time: b.reading_time || 5,
          meta_title: b.meta_title || "",
          meta_description: b.meta_description || "",
          keywords: Array.isArray(b.keywords) ? b.keywords.join(", ") : b.keywords || "",
          is_featured: !!b.is_featured,
          show_newsletter: !!b.show_newsletter,
          status: b.status || "draft",
        });
        setThumbnail(
          b.thumbnail_url
            ? { url: b.thumbnail_url, public_id: b.thumbnail_public_id }
            : null
        );
        setCover(
          b.cover_image_url
            ? { url: b.cover_image_url, public_id: b.cover_image_public_id }
            : null
        );
      } catch (e) {
        toast.error(e?.response?.data?.detail || "Failed to load blog");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, editing, reset]);

  useEffect(() => {
    if (editing) return;
    if (titleVal) setValue("slug", slugify(titleVal));
  }, [titleVal, editing, setValue]);

  useEffect(() => {
    if (editing || !titleVal) return;
    const t = setTimeout(async () => {
      try {
        const res = await checkSlug(titleVal);
        if (res?.slug) setValue("slug", res.slug);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [titleVal, editing, setValue]);

  const buildPayload = (values, status) => ({
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    category_id: values.category_id ? Number(values.category_id) : null,
    reading_time: Number(values.reading_time) || 0,
    meta_title: values.meta_title,
    meta_description: values.meta_description,
    keywords: values.keywords
      ? values.keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    is_featured: !!values.is_featured,
    show_newsletter: !!values.show_newsletter,
    status: status || values.status || "draft",
    thumbnail_url: thumbnail?.url || null,
    thumbnail_public_id: thumbnail?.public_id || null,
    cover_image_url: cover?.url || null,
    cover_image_public_id: cover?.public_id || null,
  });

  const save = async (values, opts = {}) => {
    const payload = buildPayload(values, opts.status);
    if (opts.publish) setPublishing(true);
    else setSaving(true);
    try {
      let saved;
      if (editing) {
        saved = await updateBlog(id, payload);
      } else {
        saved = await createBlog(payload);
      }
      if (opts.publish && saved?.id) {
        await publishBlog(saved.id);
        toast.success("Blog published");
      } else {
        toast.success(editing ? "Blog updated" : "Draft saved");
      }
      navigate("/blogs");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const removeThumbnail = async () => {
    if (editing) {
      try {
        await deleteThumbnail(id);
      } catch {
        /* backend may fail if none — proceed */
      }
    }
    setThumbnail(null);
    toast.success("Thumbnail removed");
    setConfirmImg({ open: false, type: null });
  };

  const removeCover = async () => {
    if (editing) {
      try {
        await deleteCover(id);
      } catch {
        /* ignore */
      }
    }
    setCover(null);
    toast.success("Cover image removed");
    setConfirmImg({ open: false, type: null });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {editing ? "Edit Blog" : "New Blog"}
            </h1>
            <p className="text-sm text-gray-500">
              {editing ? "Update your post details." : "Create a new blog post."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleSubmit((v) => save(v, { status: "draft" }))}
            loading={saving}
          >
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit((v) => save(v, { publish: true, status: "published" }))}
            loading={publishing}
          >
            <CheckCircle2 className="h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <Input
              label="Title"
              placeholder="Blog title"
              error={errors.title?.message}
              {...register("title", { required: "Title is required" })}
            />
            <Input
              label="Slug"
              placeholder="auto-generated-from-title"
              hint={`URL: /blog/${slugVal || "your-slug"}`}
              error={errors.slug?.message}
              {...register("slug", { required: "Slug is required" })}
            />
            <Textarea
              label="Excerpt"
              rows={3}
              placeholder="Short summary shown in listings"
              error={errors.excerpt?.message}
              {...register("excerpt", { required: "Excerpt is required" })}
            />
          </Card>

          <Card className="p-5 space-y-3">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <Controller
              control={control}
              name="content"
              rules={{
                validate: (v) =>
                  (v && v.replace(/<[^>]*>/g, "").trim().length > 0) ||
                  "Content is required",
              }}
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content?.message && (
              <p className="text-xs text-red-600">{errors.content.message}</p>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">SEO</h3>
            <Input
              label="Meta Title"
              placeholder="SEO title"
              {...register("meta_title")}
            />
            <Textarea
              label="Meta Description"
              rows={2}
              placeholder="Short description for search engines"
              {...register("meta_description")}
            />
            <Input
              label="Keywords"
              placeholder="comma, separated, keywords"
              {...register("keywords")}
            />
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Publishing</h3>
            <Select label="Status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
            <Select
              label="Category"
              error={errors.category_id?.message}
              {...register("category_id", { required: "Category is required" })}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min={1}
              label="Reading time (min)"
              {...register("reading_time")}
            />
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                {...register("is_featured")}
              />
              Featured blog
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                {...register("show_newsletter")}
              />
              Show newsletter block
            </label>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Thumbnail</h3>
            <ImageUpload
              value={thumbnail}
              onChange={setThumbnail}
              onRemove={() => setConfirmImg({ open: true, type: "thumbnail" })}
              aspect="16 / 9"
            />
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Cover Image</h3>
            <ImageUpload
              value={cover}
              onChange={setCover}
              onRemove={() => setConfirmImg({ open: true, type: "cover" })}
              aspect="16 / 6"
            />
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmImg.open}
        title="Delete Image?"
        message="This will permanently remove the image."
        confirmLabel="Delete"
        onCancel={() => setConfirmImg({ open: false, type: null })}
        onConfirm={confirmImg.type === "thumbnail" ? removeThumbnail : removeCover}
      />
    </div>
  );
}
