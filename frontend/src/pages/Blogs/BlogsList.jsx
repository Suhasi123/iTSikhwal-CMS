import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  Archive,
  RotateCcw,
  Star,
  StarOff,
  MoreHorizontal,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Badge, { StatusBadge } from "../../components/ui/Badge.jsx";
import Pagination from "../../components/tables/Pagination.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import {
  listBlogs,
  deleteBlog,
  publishBlog,
  archiveBlog,
  restoreBlog,
  featureBlog,
} from "../../services/blogService.js";
import { listCategories } from "../../services/categoryService.js";
import { formatDate } from "../../utils/slug.js";

export default function BlogsList() {
  const navigate = useNavigate();
  const [data, setData] = useState({ blogs: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", category: "" });
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, item: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true); 
    try {
      const params = { page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      const res = await listBlogs(params);
      setData({
        blogs: res.items || [],
        pagination: res.pagination || { page: 1, pages: 1, total: 0 },
      });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    listCategories()
      .then((d) => setCategories(Array.isArray(d) ? d : d?.categories || []))
      .catch(() => {});
  }, []);

  const runAction = async (fn, successMessage, item) => {
    try {
      await fn(item.id);
      toast.success(successMessage);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Action failed");
    } finally {
      setOpenMenu(null);
    }
  };

  const toggleFeature = async (item) => {
    try {
      await featureBlog(item.id, !item.is_featured);
      toast.success(item.is_featured ? "Blog unfeatured" : "Blog featured");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Action failed");
    } finally {
      setOpenMenu(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm.item) return;
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await deleteBlog(confirm.item.id);
      toast.success("Blog deleted");
      setConfirm({ open: false, item: null, loading: false });
      load();
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
            Blogs
          </h1>
          <p className="text-sm text-gray-500">Manage all your posts.</p>
        </div>
        <Button onClick={() => navigate("/blogs/new")}>
          <Plus className="h-4 w-4" /> New Blog
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blogs…"
              className="pl-9"
              value={filters.search}
              onChange={(e) => {
                setPage(1);
                setFilters((f) => ({ ...f, search: e.target.value }));
              }}
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, status: e.target.value }));
            }}
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
          <Select
            value={filters.category}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, category: e.target.value }));
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-medium">Thumbnail</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-5 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading && data.blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No blogs found.
                  </td>
                </tr>
              )}
              {!loading &&
                data.blogs.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      {b.thumbnail_url ? (
                        <img
                          src={b.thumbnail_url}
                          alt=""
                          className="h-10 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-16 items-center justify-center rounded-md bg-gray-100 text-[10px] text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/blogs/${b.id}/edit`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {b.title}
                      </Link>
                      <div className="text-xs text-gray-500">/{b.slug}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.category || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3">
                      {b.is_featured ? (
                        <Badge variant="gold">
                          <Star className="h-3 w-3" /> Featured
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(b.published_at)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(b.updated_at || b.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="relative flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setOpenMenu(openMenu === b.id ? null : b.id)
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openMenu === b.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenu(null)}
                            />
                            <div className="absolute right-0 top-9 z-20 w-52 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                              <MenuItem
                                icon={Pencil}
                                onClick={() => {
                                  setOpenMenu(null);
                                  navigate(`/blogs/${b.id}/edit`);
                                }}
                              >
                                Edit
                              </MenuItem>
                              {b.status !== "published" && (
                                <MenuItem
                                  icon={CheckCircle2}
                                  onClick={() =>
                                    runAction(publishBlog, "Blog published", b)
                                  }
                                >
                                  Publish
                                </MenuItem>
                              )}
                              {b.status !== "archived" && (
                                <MenuItem
                                  icon={Archive}
                                  onClick={() =>
                                    runAction(archiveBlog, "Blog archived", b)
                                  }
                                >
                                  Archive
                                </MenuItem>
                              )}
                              {b.status === "archived" && (
                                <MenuItem
                                  icon={RotateCcw}
                                  onClick={() =>
                                    runAction(restoreBlog, "Blog restored", b)
                                  }
                                >
                                  Restore
                                </MenuItem>
                              )}
                              <MenuItem
                                icon={b.is_featured ? StarOff : Star}
                                onClick={() => toggleFeature(b)}
                              >
                                {b.is_featured ? "Unfeature" : "Feature"}
                              </MenuItem>
                              <MenuItem
                                icon={Trash2}
                                destructive
                                onClick={() => {
                                  setOpenMenu(null);
                                  setConfirm({
                                    open: true,
                                    item: b,
                                    loading: false,
                                  });
                                }}
                              >
                                Delete
                              </MenuItem>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 p-4">
          <Pagination
            page={data.pagination.page}
            pages={data.pagination.total_pages}
            total={data.pagination.total_items}
            onChange={setPage}
          />
        </div>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        title="Delete Blog?"
        message={`This will permanently delete "${confirm.item?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        loading={confirm.loading}
        onCancel={() => setConfirm({ open: false, item: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function MenuItem({ icon: Icon, children, onClick, destructive }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
