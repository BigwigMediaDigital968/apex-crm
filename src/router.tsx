import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardDispatcher } from "@/features/dashboard";
import { EmployeeFormPage, EmployeeListPage, UserProfilePage } from "@/features/employees";
import { BranchListPage } from "@/features/branches";
import { LeadListPage } from "@/features/leads";
import { AuditLogPage } from "@/features/logs";
import { LoginPage, ProfilePage } from "@/features/auth";

import GuestRoute from "@/routes/GuestRoute";
import PermissionRoute from "./routes/PermissionRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ComingSoonPage from "./pages/ComingSoonPage";

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
            element: <PermissionRoute permission={'user:view'} />,
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
          {
            element: <PermissionRoute permission={'user:update'} />,
            children: [
              { path: "/employees/:id/edit", element: <EmployeeFormPage /> },
            ],
          },
          {
            element: <PermissionRoute permission={'user:view'} />,
            children: [
              { path: "/employees/:id/profile", element: <UserProfilePage /> },
            ],
          },
          {
            element: <PermissionRoute permission={'branch:view'} />,
            children: [
              { path: "/branches", element: <BranchListPage /> },
            ],
          },
          {
            element: <PermissionRoute permission={'lead:view'} />,
            children: [
              { path: "/leads", element: <LeadListPage /> },
            ],
          },

          { path: "/profile", element: <ProfilePage /> },

           {
            element: <PermissionRoute permission={'audit:view'} />,
            children: [
              { path: "/logs", element: <AuditLogPage /> },
            ],
          },

          { path: "/tasks", element: <ComingSoonPage featureName={"Tasks"} /> },
          { path: "/attendance", element: <ComingSoonPage featureName="Attendance" /> },
          { path: "/achievements", element: <ComingSoonPage featureName="Achievements" /> },
          { path: "/settings", element: <ComingSoonPage featureName="Settings" /> },
          { path: "/dialer", element: <ComingSoonPage featureName="Dialer" /> },

          { path: "/dialer/*", element: <ComingSoonPage featureName="Dialer" /> },

          { path: "/unauthorized", element: <UnauthorizedPage /> },
          { path: "*", element: <NotFoundPage /> }

        ],
      },
    ],
  },
]);