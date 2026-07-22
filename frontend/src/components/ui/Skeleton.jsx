import { cn } from "../../utils/cn.js";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-100", className)}
      aria-hidden="true"
    />
  );
}
