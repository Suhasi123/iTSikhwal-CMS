import { Menu, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let acc = "";
  segments.forEach((seg) => {
    acc += `/${seg}`;
    crumbs.push({
      label: seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      to: acc,
    });
  });
  return crumbs;
}

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const crumbs = useBreadcrumbs();
  const initials = (user?.name || user?.email || "A")
    .split(/[ @.]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="flex items-center text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-900">
            Home
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.to} className="flex items-center">
              <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400" />
              {i === crumbs.length - 1 ? (
                <span className="font-medium text-gray-900">{c.label}</span>
              ) : (
                <Link to={c.to} className="hover:text-gray-900">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium text-gray-900">
            {user?.name || user?.email || "Admin"}
          </div>
          <div className="text-xs text-gray-500">{user?.role || "Administrator"}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
