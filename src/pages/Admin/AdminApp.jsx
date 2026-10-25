import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import Login from "./Login";
import RequireAdmin from "./RequireAdmin";
import "./Admin.css";

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            {/* The next steps add: projects, posts, categories, profile */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}