import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import BlogsList from "./pages/Blogs/BlogsList.jsx";
import BlogForm from "./pages/Blogs/BlogForm.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/blogs/new" element={<BlogForm />} />
        <Route path="/blogs/:id/edit" element={<BlogForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
