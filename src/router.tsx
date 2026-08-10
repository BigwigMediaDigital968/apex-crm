import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardDispatcher } from "@/features/dashboard";
import { EmployeeFormPage, EmployeeListPage, UserProfilePage } from "@/features/employees";
import { BranchListPage } from "@/features/branches";
import { LeadListPage } from "@/features/leads";
import GuestRoute from "@/routes/GuestRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "./features/auth/pages/ProfilePage";
import PermissionRoute from "./routes/PermissionRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardDispatcher /> },
          {
            element: <PermissionRoute permission={'user:create'} />,
            children: [
              { path: "/employees", element: <EmployeeListPage /> },
            ],
          },
                    
          {
            element: <PermissionRoute permission={'user:create'} />,
            children: [
              { path: "/employees/onboard", element: <EmployeeFormPage /> },
            ],
          },
          { path: "/employees/:id/edit", element: <EmployeeFormPage /> },
          { path: "/employees/:id/profile", element: <UserProfilePage /> },
          { path: "/branches", element: <BranchListPage /> },
          { path: "/leads", element: <LeadListPage /> },
          { path: "/profile", element: <ProfilePage /> }
        ],
      },
    ],
  },
]);