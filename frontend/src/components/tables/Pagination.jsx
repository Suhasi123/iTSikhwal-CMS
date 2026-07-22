import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, total, onChange }) {
  if (!pages || pages <= 1) {
    return (
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{total || 0} results</span>
      </div>
    );
  }
  const go = (p) => onChange(Math.max(1, Math.min(pages, p)));
  return (
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>
        Page {page} of {pages} · {total} results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </button>
        <button
          onClick={() => go(page + 1)}
          disabled={page >= pages}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
