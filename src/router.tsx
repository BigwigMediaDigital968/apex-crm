// import { createBrowserRouter, Navigate } from "react-router";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import ProtectedRoute from "@/routes/ProtectedRoute";
// import { DashboardDispatcher } from "@/features/dashboard";
// import {
//   EmployeeFormPage,
//   EmployeeListPage,
//   UserProfilePage,
// } from "@/features/employees";
// import {
//   BranchDetailPage,
//   BranchFormPage,
//   BranchListPage,
// } from "@/features/branches";
// import { LoginPage, ProfilePage } from "@/features/auth";
// import { LeadListPage } from "@/features/leads";
// import { AttendanceDispatcher, LateCheckInHistoryPage } from "@/features/attendance";
// import { TaskListPage, TaskFormPage, TaskDetailPage } from "@/features/tasks";

// import GuestRoute from "@/routes/GuestRoute";
// import PermissionRoute from "./routes/PermissionRoute";
// import UnauthorizedPage from "./pages/UnauthorizedPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import ComingSoonPage from "./pages/ComingSoonPage";
// import AuditLogPage from "./features/logs/pages/AuditLogPage";
// import { PERMISSIONS } from "./types/auth";
// import LeadDetailPage from "./features/leads/pages/LeadDetailPage";
// import { CallHistoryPage, DialerPage } from "./features/dialer";
// import { PerformanceDispatcher } from "./features/performance";
// import { CreateRevenuePage, RevenuePage } from "./features/revenue";
// import { ContestListPage } from "./features/contests";
// import ContestDetailsPage from "./features/contests/pages/ContestDetailsPage";
// import ContestFormPage from "./features/contests/pages/ContestFormPage";
// import { LateCheckInApprovalsPage } from "./features/attendance/pages/LateCheckInApprovalsPage";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navigate to="/dashboard" replace />,
//   },
//   {
//     element: <GuestRoute />,
//     children: [{ path: "/login", element: <LoginPage /> }],
//   },
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         element: <DashboardLayout />,
//         children: [
//           { path: "/dashboard", element: <DashboardDispatcher /> },
//           {
//             element: <PermissionRoute permission={"user:view"} />,
//             children: [{ path: "/employees", element: <EmployeeListPage /> }],
//           },
//           {
//             element: <PermissionRoute permission={"user:create"} />,
//             children: [
//               { path: "/employees/onboard", element: <EmployeeFormPage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"user:update"} />,
//             children: [
//               { path: "/employees/:id/edit", element: <EmployeeFormPage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"user:view"} />,
//             children: [
//               { path: "/employees/:id/profile", element: <UserProfilePage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"revenue:view"} />,
//             children: [
//               { path: "/revenue", element: <RevenuePage /> },
//               { path: "/revenue/create", element: <CreateRevenuePage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"branch:view"} />,
//             children: [
//               { path: "/branches", element: <BranchListPage /> },
//               { path: "/branches/:id", element: <BranchDetailPage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"branch:create"} />,
//             children: [{ path: "/branches/new", element: <BranchFormPage /> }],
//           },
//           {
//             element: <PermissionRoute permission={"branch:update"} />,
//             children: [
//               { path: "/branches/:id/edit", element: <BranchFormPage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"lead:view"} />,
//             children: [
//               { path: "/leads", element: <LeadListPage /> },
//               { path: "/leads/:leadId", element: <LeadDetailPage /> },
//             ],
//           },

//           { path: "/profile", element: <ProfilePage /> },

//           {
//             element: <PermissionRoute permission={"audit:view"} />,
//             children: [{ path: "/logs", element: <AuditLogPage /> }],
//           },

//           {
//             element: <PermissionRoute permission={"task:view"} />,
//             children: [
//               { path: "/tasks", element: <TaskListPage /> },
//               { path: "/tasks/:id", element: <TaskDetailPage /> },
//             ],
//           },
//           {
//             element: <PermissionRoute permission={"task:create"} />,
//             children: [{ path: "/tasks/new", element: <TaskFormPage /> }],
//           },
//           { path: "/attendance", element: <AttendanceDispatcher /> },
//           {
//             element: (
//               <PermissionRoute permission={PERMISSIONS.ATTENDANCE_VIEW} />
//             ),
//             children: [
//               { path: "/attendance", element: <AttendanceDispatcher /> },
//               {
//                 path: "/attendance/late-history",
//                 element: <LateCheckInHistoryPage />,
//               },
//             ],
//           },
//           {
//             element: (
//               <PermissionRoute permission={PERMISSIONS.LATE_CHECKIN_APPROVE} />
//             ),
//             children: [
//               {
//                 path: "/attendance/late-approvals",
//                 element: <LateCheckInApprovalsPage />,
//               },
//             ],
//           },
//           { path: "/performance", element: <PerformanceDispatcher /> },
//           {
//             path: "/achievements",
//             element: <ComingSoonPage featureName="Achievements" />,
//           },
//           {
//             path: "/settings",
//             element: <ComingSoonPage featureName="Settings" />,
//           },
//           {
//             element: <PermissionRoute permission={"call:initiate"} />,
//             children: [
//               { path: "/dialer", element: <DialerPage /> },
//               { path: "/dialer/history", element: <CallHistoryPage /> },
//             ],
//           },
//           // {
//           //   element: <PermissionRoute permission={[]} />,
//           //   children: [
//           //     { path: "/contests", element: <ContestListPage /> },
//           //   ]
//           // },
//           { path: "/contests", element: <ContestListPage /> },
//           { path: "/contest/new", element: <ContestFormPage /> },
//           { path: "/contest/:id", element: <ContestDetailsPage /> },
//           { path: "/contest/:id/edit", element: <ContestFormPage /> },

//           {
//             path: "/dialer/*",
//             element: <ComingSoonPage featureName="Dialer" />,
//           },

//           { path: "/unauthorized", element: <UnauthorizedPage /> },
//           { path: "*", element: <NotFoundPage /> },
//         ],
//       },
//     ],
//   },
// ]);


import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import GuestRoute from "@/routes/GuestRoute";
import PermissionRoute from "./routes/PermissionRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AuditLogPage from "./features/logs/pages/AuditLogPage";
import LeadDetailPage from "./features/leads/pages/LeadDetailPage";
import ContestDetailsPage from "./features/contests/pages/ContestDetailsPage";
import ContestFormPage from "./features/contests/pages/ContestFormPage";
import { LateCheckInApprovalsPage } from "./features/attendance/pages/LateCheckInApprovalsPage";
import { DashboardDispatcher } from "@/features/dashboard";
import {
  EmployeeFormPage,
  EmployeeListPage,
  UserProfilePage,
} from "@/features/employees";
import {
  BranchDetailPage,
  BranchFormPage,
  BranchListPage,
} from "@/features/branches";
import { LoginPage, ProfilePage } from "@/features/auth";
import { LeadListPage } from "@/features/leads";
import { AttendanceDispatcher, LateCheckInHistoryPage } from "@/features/attendance";
import { TaskListPage, TaskFormPage, TaskDetailPage } from "@/features/tasks";
import { CallHistoryPage, DialerPage } from "./features/dialer";
import { PerformanceDispatcher } from "./features/performance";
import { CreateRevenuePage, RevenuePage } from "./features/revenue";
import { ContestListPage } from "./features/contests";
import { PERMISSIONS } from "./types/auth";

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
          
          /* Employees */
          {
            element: <PermissionRoute permission={PERMISSIONS.USER_VIEW} />,
            children: [
              { path: "/employees", element: <EmployeeListPage /> },
              { path: "/employees/:id/profile", element: <UserProfilePage /> },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.USER_CREATE} />,
            children: [
              { path: "/employees/onboard", element: <EmployeeFormPage /> },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.USER_UPDATE} />,
            children: [
              { path: "/employees/:id/edit", element: <EmployeeFormPage /> },
            ],
          },

          /* Revenue */
          {
            element: <PermissionRoute permission={PERMISSIONS.REVENUE_VIEW} />,
            children: [
              { path: "/revenue", element: <RevenuePage /> },
              { path: "/revenue/create", element: <CreateRevenuePage /> },
            ],
          },

          /* Branches */
          {
            element: <PermissionRoute permission={PERMISSIONS.BRANCH_VIEW} />,
            children: [
              { path: "/branches", element: <BranchListPage /> },
              { path: "/branches/:id", element: <BranchDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.BRANCH_CREATE} />,
            children: [{ path: "/branches/new", element: <BranchFormPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.BRANCH_UPDATE} />,
            children: [
              { path: "/branches/:id/edit", element: <BranchFormPage /> },
            ],
          },

          /* Leads */
          {
            element: <PermissionRoute permission={PERMISSIONS.LEAD_VIEW} />,
            children: [
              { path: "/leads", element: <LeadListPage /> },
              { path: "/leads/:leadId", element: <LeadDetailPage /> },
            ],
          },

          /* Profile & Logs */
          { path: "/profile", element: <ProfilePage /> },
          {
            element: <PermissionRoute permission={PERMISSIONS.AUDIT_VIEW} />,
            children: [{ path: "/logs", element: <AuditLogPage /> }],
          },

          /* Tasks */
          {
            element: <PermissionRoute permission={PERMISSIONS.TASK_VIEW} />,
            children: [
              { path: "/tasks", element: <TaskListPage /> },
              { path: "/tasks/:id", element: <TaskDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.TASK_CREATE} />,
            children: [{ path: "/tasks/new", element: <TaskFormPage /> }],
          },

          /* Attendance */
          {
            element: <PermissionRoute permission={PERMISSIONS.ATTENDANCE_VIEW} />,
            children: [
              { path: "/attendance", element: <AttendanceDispatcher /> },
              {
                path: "/attendance/late-history",
                element: <LateCheckInHistoryPage />,
              },
            ],
          },
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.ATTENDANCE_MANAGE} />
            ),
            children: [
              {
                path: "/attendance/late-approvals",
                element: <LateCheckInApprovalsPage />,
              },
            ],
          },

          /* Performance & Other Modules */
          { path: "/performance", element: <PerformanceDispatcher /> },
          {
            path: "/achievements",
            element: <ComingSoonPage featureName="Achievements" />,
          },
          {
            path: "/settings",
            element: <ComingSoonPage featureName="Settings" />,
          },

          /* Dialer */
          {
            element: <PermissionRoute permission={PERMISSIONS.CALL_INITIATE} />,
            children: [
              { path: "/dialer", element: <DialerPage /> },
              { path: "/dialer/history", element: <CallHistoryPage /> },
            ],
          },

          /* Contests */
          { path: "/contests", element: <ContestListPage /> },
          { path: "/contest/new", element: <ContestFormPage /> },
          { path: "/contest/:id", element: <ContestDetailsPage /> },
          { path: "/contest/:id/edit", element: <ContestFormPage /> },

          /* Catch-all & Errors */
          { path: "/unauthorized", element: <UnauthorizedPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);