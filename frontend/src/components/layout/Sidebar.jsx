import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, FolderTree, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/blogs", label: "Blogs", icon: FileText },
  { to: "/categories", label: "Categories", icon: FolderTree },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">iTSikhwal CMS</div>
            <div className="text-[11px] text-gray-500">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
