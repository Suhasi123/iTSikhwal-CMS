import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar onMenuClick={() => setOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
