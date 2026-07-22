import { forwardRef } from "react";
import { cn } from "../../utils/cn.js";

const Input = forwardRef(function Input(
  { label, error, className = "", hint, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
          error ? "border-red-400" : "border-gray-200",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
