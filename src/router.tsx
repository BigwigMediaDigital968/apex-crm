import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardPage } from "@/features/dashboard";
import { EmployeeListPage } from "@/features/employees";
import { LeadListPage } from "@/features/leads";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/employees",
            element: <EmployeeListPage />,
          },
          {
            path: "/leads",
            element: <LeadListPage />,
          },
        ],
      },
    ],
  },
]);