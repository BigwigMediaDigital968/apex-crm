import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardDispatcher } from "@/features/dashboard";
import { EmployeeListPage, OnboardEmployeePage } from "@/features/employees";
import { LeadListPage } from "@/features/leads";
import GuestRoute from "@/routes/GuestRoute";
import LoginPage from "@/features/auth/pages/LoginPage";

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
          { path: "/employees", element: <EmployeeListPage /> },
          { path: "/employees/onboard", element: <OnboardEmployeePage /> },
          { path: "/leads", element: <LeadListPage /> },
        ],
      },
    ],
  },
]);