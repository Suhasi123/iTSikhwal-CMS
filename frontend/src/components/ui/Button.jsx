import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn.js";

const VARIANTS = {
  primary:
    "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 disabled:bg-gray-400",
  secondary:
    "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
  icon: "p-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
