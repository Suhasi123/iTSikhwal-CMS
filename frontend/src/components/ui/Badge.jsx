import { cn } from "../../utils/cn.js";

const VARIANTS = {
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  gold: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function Badge({ variant = "gray", children, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  if (key === "published") return <Badge variant="green">Published</Badge>;
  if (key === "archived") return <Badge variant="red">Archived</Badge>;
  return <Badge variant="gray">Draft</Badge>;
}
