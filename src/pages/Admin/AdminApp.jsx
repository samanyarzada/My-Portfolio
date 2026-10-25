import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ProjectForm from "./ProjectForm";
import ProjectsList from "./ProjectsList";
import RequireAdmin from "./RequireAdmin";
// The field styles live here, and they are only loaded with the Contact page otherwise
import "../../components/FormField/FormField.css";
import "./Admin.css";

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              {/* The next steps add: posts, categories, profile */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}