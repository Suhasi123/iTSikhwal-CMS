import { cn } from "../../utils/cn.js";

export default function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
