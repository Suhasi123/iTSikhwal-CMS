import { Loader2 } from "lucide-react";

export default function Spinner({ className = "h-5 w-5", label }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-500">
      <Loader2 className={`${className} animate-spin`} />
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  );
}
