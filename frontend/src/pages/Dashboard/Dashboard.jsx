import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Archive,
  Star,
  FolderTree,
} from "lucide-react";
import { getDashboard } from "../../services/dashboardService.js";
import Card from "../../components/ui/Card.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { StatusBadge } from "../../components/ui/Badge.jsx";
import { formatDate } from "../../utils/slug.js";

const STAT_META = [
  { key: "total_blogs", label: "Total Blogs", icon: FileText, tone: "bg-gray-900 text-white" },
  { key: "published_blogs", label: "Published", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  { key: "draft_blogs", label: "Drafts", icon: FileEdit, tone: "bg-gray-100 text-gray-700" },
  { key: "archived_blogs", label: "Archived", icon: Archive, tone: "bg-red-50 text-red-700" },
  { key: "featured_blogs", label: "Featured", icon: Star, tone: "bg-amber-50 text-amber-700" },
  { key: "total_categories", label: "Categories", icon: FolderTree, tone: "bg-blue-50 text-blue-700" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getDashboard();
        if (active) setData(res);
      } catch {
        /* toast handled elsewhere */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = data?.stats || {};
  const recent = data?.recent_blogs || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          An overview of your content performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_META.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {loading ? <Skeleton className="h-8 w-16" /> : stats[s.key] ?? 0}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Blogs</h2>
          <Link
            to="/blogs"
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-5 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  </tr>
                ))}
              {!loading && recent.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No blogs yet. Create your first blog to get started.
                  </td>
                </tr>
              )}
              {!loading &&
                recent.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <Link
                        to={`/blogs/${b.id}/edit`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {b.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.category || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(b.updated_at || b.created_at)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
