// import { useMemo, useState } from "react";
// import { NavLink, useLocation } from "react-router";

// import { ROUTES } from "@/config/routes";
// import { useSidebarStore } from "@/store/sidebar.store";
// import { usePermissions } from "@/hooks/usePermissions";
// import { PERMISSIONS, type Permission } from "@/types/auth";
// import { useAuthStore } from "@/store/auth.store";
// import { usePendingLateCheckInCount } from "@/features/attendance/api/lateCheckInApi";
// import { usePendingLateCheckInCount } from "@/features/attendance/api/lateCheckInApi";

// export interface NavChild {
//   label: string;
//   path: string;
//   permissions?: Permission[];
//   permissionMode?: "any" | "all";
//   badgeCount?: number; // Added badge support
// }

// export interface NavItem {
//   label: string;
//   path?: string;
//   icon: string;
//   permissions?: Permission[];
//   permissionMode?: "any" | "all";
//   children?: NavChild[];
// }

// export interface NavGroup {
//   title: string;
//   items: NavItem[];
// }

// /**
//  * Navigation configuration
//  *
//  * Every item declares the permission required to see it.
//  *
//  * No permissions = public/common navigation item.
//  */
// export const NAV_GROUPS: NavGroup[] = [
//   {
//     title: "MAIN",
//     items: [
//       {
//         label: "Dashboard",
//         path: ROUTES.dashboard,
//         icon: "dashboard",
//       },

//       {
//         label: "Leads",
//         icon: "group",
//         permissions: [PERMISSIONS.LEAD_VIEW],
//         children: [
//           {
//             label: "All Leads",
//             path: ROUTES.leads,
//             permissions: [PERMISSIONS.LEAD_VIEW],
//           },
//           {
//             label: "My Leads",
//             path: `${ROUTES.leads}?view=mine`,
//             permissions: [PERMISSIONS.LEAD_VIEW],
//           },
//           {
//             label: "Follow-ups",
//             path: `${ROUTES.leads}?view=followups`,
//             permissions: [PERMISSIONS.LEAD_FOLLOWUP_VIEW],
//           },
//           // {
//           //   label: "Hot Leads",
//           //   path: `${ROUTES.leads}?view=hot`,
//           //   permissions: [PERMISSIONS.LEAD_VIEW],
//           // },
//         ],
//       },

//       /*
//        * Dialer currently has no corresponding permissions
//        * in the backend permission matrix.
//        *
//        * Do not expose it as a permission-protected feature
//        * until permissions such as dialer:view exist.
//        */
//       {
//         label: "Dialer",
//         icon: "call",
//         permissions: [PERMISSIONS.CALL_INITIATE],
//         children: [
//           {
//             label: "Dialer",
//             path: "/dialer",
//             permissions: [PERMISSIONS.CALL_INITIATE],
//           },
//           {
//             label: "History",
//             path: "/dialer/history",
//             permissions: [PERMISSIONS.CALL_LOG_VIEW],
//           },
//         ],
//       },

//       {
//         label: "Tasks",
//         path: "/tasks",
//         icon: "check_circle",
//         permissions: [PERMISSIONS.TASK_VIEW],
//       },

//       // {
//       //   label: "Attendance",
//       //   path: ROUTES.attendance,
//       //   icon: "calendar_today",
//       //   permissions: [PERMISSIONS.ATTENDANCE_VIEW],
//       // },

//       {
//         label: "Attendance",
//         icon: "calendar_today",
//         permissions: [PERMISSIONS.ATTENDANCE_VIEW],
//         children: [
//           {
//             label: "My Attendance",
//             path: ROUTES.attendance,
//             permissions: [PERMISSIONS.ATTENDANCE_VIEW],
//           },
//           {
//             label: "Late Check-in Approvals",
//             path: "/attendance/late-approvals",
//             // Protect with attendance approve permission if available, or rely on role check
//             permissions: [PERMISSIONS.ATTENDANCE_MANAGE],
//           },
//           {
//             label: "Late History",
//             path: "/attendance/late-history",
//             permissions: [PERMISSIONS.ATTENDANCE_VIEW],
//           },
//         ],
//       },

//       {
//         label: "Performance",
//         path: "/performance",
//         icon: "show_chart",
//         permissions: [PERMISSIONS.PERFORMANCE_VIEW],
//       },
//       {
//         label: "Revenue",
//         path: "/revenue",
//         icon: "payments",
//         permissions: [PERMISSIONS.REVENUE_VIEW],
//       },
//       {
//         label: "Achievements",
//         path: "/achievements",
//         icon: "military_tech",
//         permissions: [PERMISSIONS.ACHIEVEMENT_VIEW],
//       },
//       {
//         label: "Contests",
//         path: "/contests",
//         icon: "military_tech",
//       },
//     ],
//   },

//   {
//     title: "SYSTEM",
//     items: [
//       {
//         label: "Employees",
//         path: ROUTES.employees,
//         icon: "badge",
//         permissions: [PERMISSIONS.USER_VIEW],
//       },

//       {
//         label: "Branches",
//         path: ROUTES.branches,
//         icon: "domain",
//         permissions: [PERMISSIONS.BRANCH_VIEW],
//       },

//       {
//         label: "Logs",
//         path: ROUTES.logs,
//         icon: "timer",
//         permissions: [PERMISSIONS.AUDIT_VIEW],
//       },

//       /*
//        * Settings currently has no settings:view permission
//        * in the backend permission matrix.
//        *
//        * Either keep it public or add a backend permission
//        * such as settings:view and use it here.
//        */
//       {
//         label: "Settings",
//         path: ROUTES.settings,
//         icon: "settings",
//       },
//     ],
//   },
// ];

// const Sidebar = () => {
//   const { collapsed, mobileOpen, closeMobileSidebar } = useSidebarStore();

//   const location = useLocation();

//   const user = useAuthStore((s) => s.user);

//   const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

//   const canApproveLateCheckIn = hasAnyPermission([PERMISSIONS.LATE_CHECKIN_APPROVE]);

//   // Only query badge count if user has approval permission
//   const { data: pendingLateCount = 0 } = usePendingLateCheckInCount(canApproveLateCheckIn);

//   /**
//    * Check whether a navigation item is accessible.
//    */
//   const canAccess = (
//     permissions?: Permission[],
//     mode: "any" | "all" = "any",
//   ) => {
//     // No permission requirement means everyone can see it.
//     if (!permissions?.length) {
//       return true;
//     }

//     return mode === "all"
//       ? hasAllPermissions(permissions)
//       : hasAnyPermission(permissions);
//   };

//   /**
//    * Filter navigation according to the logged-in
//    * user's permissions.
//    *
//    * Children are filtered first.
//    *
//    * A parent is displayed when:
//    * - the user has the parent's permission, OR
//    * - at least one child is accessible.
//    */
//   const filteredNavGroups = useMemo(() => {
//     if (isLoading) {
//       return [];
//     }

//     return NAV_GROUPS.filter((group) => {
//       // Hardcoded role restriction for SYSTEM menu
//       if (group.title === "SYSTEM" && user?.role === "employee") {
//         return false;
//       }
//       return true;
//     })
//       .map((group) => {
//         const items = group.items
//           .map((item) => {
//             const visibleChildren = item.children?.filter((child) =>
//               canAccess(child.permissions, child.permissionMode),
//             );

//             const itemHasAccess = canAccess(
//               item.permissions,
//               item.permissionMode,
//             );

//             /*
//              * If the parent itself is restricted and the user
//              * doesn't have access, allow it only when one of
//              * its children is accessible.
//              */
//             if (item.path === "/contests" && user?.role !== "head") {
//               return null;
//             }
//             if (!itemHasAccess && !visibleChildren?.length) {
//               return null;
//             }

//             return {
//               ...item,
//               children: visibleChildren,
//             };
//           })
//           .filter((item) => item !== null);

//         return {
//           ...group,
//           items,
//         };
//       })
//       .filter((group) => group.items.length > 0);
//   }, [isLoading, hasAnyPermission, hasAllPermissions]);

//   // Track expanded parent menu items
//   const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
//     Leads: true,
//   });

//   const toggleSubmenu = (label: string) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [label]: !prev[label],
//     }));
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar Container */}
//       <aside
//         className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-primary text-on-primary shadow-2xl transition-all duration-300 select-none ${
//           collapsed ? "w-20" : "w-64"
//         } ${
//           mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Brand Header */}
//         <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5 shrink-0">
//           <div className="flex h-16 shrink-0 items-center justify-center rounded-lg">
//             <img
//               src="/brand-logo.png"
//               className="h-10 w-auto grayscale-100 brightness-0 invert-100"
//             />
//           </div>

//           {!collapsed && (
//             <img
//               src="/brand-name.png"
//               className="h-8 w-auto grayscale-100 brightness-0 invert-100"
//             />
//           )}
//         </div>

//         {/* Navigation List */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
//           {filteredNavGroups.map((group) => (
//             <div key={group.title} className="space-y-1">
//               {/* Group Section Header */}
//               {!collapsed && (
//                 <p className="px-3 text-[11px] font-bold tracking-wider text-on-primary/50 uppercase mb-2">
//                   {group.title}
//                 </p>
//               )}

//               {group.items.map((item) => {
//                 const hasChildren = Boolean(item?.children?.length);

//                 const isExpanded = Boolean(openSubmenus[item?.label]);

//                 const isChildActive = item?.children?.some(
//                   (child) => location.pathname + location.search === child.path,
//                 );

//                 /*
//                  * Standard Single Link
//                  */
//                 if (!hasChildren && item?.path) {
//                   return (
//                     <NavLink
//                       key={item.label}
//                       to={item.path}
//                       onClick={closeMobileSidebar}
//                       title={collapsed ? item.label : undefined}
//                       className={({ isActive }) =>
//                         `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
//                           isActive
//                             ? "bg-white/15 text-white font-semibold shadow-sm"
//                             : "text-on-primary/75 hover:bg-white/10 hover:text-white"
//                         }`
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           {isActive && (
//                             <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white" />
//                           )}

//                           <span className="material-symbols-outlined text-xl shrink-0">
//                             {item.icon}
//                           </span>

//                           {!collapsed && (
//                             <span className="truncate">{item.label}</span>
//                           )}
//                         </>
//                       )}
//                     </NavLink>
//                   );
//                 }

//                 /*
//                  * Expandable Dropdown Parent
//                  */
//                 return (
//                   <div key={item?.label} className="space-y-1">
//                     <button
//                       type="button"
//                       onClick={() => toggleSubmenu(item?.label)}
//                       title={collapsed ? item?.label : undefined}
//                       className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
//                         isChildActive
//                           ? "text-white font-semibold"
//                           : "text-on-primary/75 hover:bg-white/10 hover:text-white"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3.5">
//                         <span className="material-symbols-outlined text-xl shrink-0">
//                           {item?.icon}
//                         </span>

//                         {!collapsed && <span>{item?.label}</span>}
//                       </div>

//                       {!collapsed && (
//                         <span
//                           className={`material-symbols-outlined text-lg transition-transform duration-200 ${
//                             isExpanded ? "rotate-180" : ""
//                           }`}
//                         >
//                           expand_more
//                         </span>
//                       )}
//                     </button>

//                     {/* Nested Sub-navigation Links */}
//                     {!collapsed && isExpanded && item?.children && (
//                       <div className="ml-9 space-y-1 border-l border-white/10 pl-3 my-1">
//                         {item.children.map((child) => (
//                           <NavLink
//                             key={child.path}
//                             to={child.path}
//                             onClick={closeMobileSidebar}
//                             end
//                             className={({ isActive }) =>
//                               `block rounded-lg px-3 py-1.5 text-sm font-normal transition-colors ${
//                                 isActive
//                                   ? "text-white font-medium bg-white/10"
//                                   : "text-on-primary/65 hover:text-white hover:bg-white/5"
//                               }`
//                             }
//                           >
//                             {child.label}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";

import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/store/sidebar.store";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, type Permission } from "@/types/auth";
import { useAuthStore } from "@/store/auth.store";
import { usePendingLateCheckInCount } from "@/features/attendance/api/lateCheckInApi";

export interface NavChild {
  label: string;
  path: string;
  permissions?: Permission[];
  permissionMode?: "any" | "all";
  badgeCount?: number;
}

export interface NavItem {
  label: string;
  path?: string;
  icon: string;
  permissions?: Permission[];
  permissionMode?: "any" | "all";
  children?: NavChild[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: ROUTES.dashboard,
        icon: "dashboard",
      },
      {
        label: "Leads",
        icon: "group",
        permissions: [PERMISSIONS.LEAD_VIEW],
        children: [
          {
            label: "All Leads",
            path: ROUTES.leads,
            permissions: [PERMISSIONS.LEAD_VIEW],
          },
          {
            label: "My Leads",
            path: `${ROUTES.leads}?view=mine`,
            permissions: [PERMISSIONS.LEAD_VIEW],
          },
          {
            label: "Follow-ups",
            path: `${ROUTES.leads}?view=followups`,
            permissions: [PERMISSIONS.LEAD_FOLLOWUP_VIEW],
          },
        ],
      },
      {
        label: "Dialer",
        icon: "call",
        permissions: [PERMISSIONS.CALL_INITIATE],
        children: [
          {
            label: "Dialer",
            path: "/dialer",
            permissions: [PERMISSIONS.CALL_INITIATE],
          },
          {
            label: "History",
            path: "/dialer/history",
            permissions: [PERMISSIONS.CALL_LOG_VIEW],
          },
          {
            label: "Numbers",
            path: "/dialer/numbers",
            permissions: [PERMISSIONS.STRINGEE_NUMBER_VIEW],
          },
        ],
      },
      {
        label: "Tasks",
        path: "/tasks",
        icon: "check_circle",
        permissions: [PERMISSIONS.TASK_VIEW],
      },
      {
        label: "Attendance",
        icon: "calendar_today",
        permissions: [PERMISSIONS.ATTENDANCE_VIEW],
        children: [
          {
            label: "My Attendance",
            path: ROUTES.attendance,
            permissions: [PERMISSIONS.ATTENDANCE_VIEW],
          },
          {
            label: "Late Check-in",
            path: "/attendance/late-approvals",
            permissions: [PERMISSIONS.ATTENDANCE_MANAGE],
          },
          {
            label: "Late History",
            path: "/attendance/late-history",
            permissions: [PERMISSIONS.ATTENDANCE_VIEW],
          },
        ],
      },
      {
        label: "Performance",
        path: "/performance",
        icon: "show_chart",
        permissions: [PERMISSIONS.PERFORMANCE_VIEW],
      },
      {
        label: "Revenue",
        path: "/revenue",
        icon: "payments",
        permissions: [PERMISSIONS.REVENUE_VIEW],
      },
      {
        label: "Achievements",
        path: "/achievements",
        icon: "military_tech",
        permissions: [PERMISSIONS.ACHIEVEMENT_VIEW],
      },
      {
        label: "Contests",
        path: "/contests",
        icon: "military_tech",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Employees",
        path: ROUTES.employees,
        icon: "badge",
        permissions: [PERMISSIONS.USER_VIEW],
      },
      {
        label: "Branches",
        path: ROUTES.branches,
        icon: "domain",
        permissions: [PERMISSIONS.BRANCH_VIEW],
      },
      {
        label: "Logs",
        path: ROUTES.logs,
        icon: "timer",
        permissions: [PERMISSIONS.AUDIT_VIEW],
      },
      {
        label: "Settings",
        path: ROUTES.settings,
        icon: "settings",
      },
    ],
  },
];

const Sidebar = () => {
  const { collapsed, mobileOpen, closeMobileSidebar } = useSidebarStore();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  const canApproveLateCheckIn = hasAnyPermission([PERMISSIONS.LATE_CHECKIN_APPROVE]);
  const { data: pendingLateCount = 0 } = usePendingLateCheckInCount(canApproveLateCheckIn);

  const canAccess = (
    permissions?: Permission[],
    mode: "any" | "all" = "any",
  ) => {
    if (!permissions?.length) {
      return true;
    }

    return mode === "all"
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  };

  const filteredNavGroups = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return NAV_GROUPS.filter((group) => {
      if (group.title === "SYSTEM" && user?.role === "employee") {
        return false;
      }
      return true;
    })
      .map((group) => {
        const items = group.items
          .map((item) => {
            const visibleChildren = item.children
              ?.filter((child) => canAccess(child.permissions, child.permissionMode))
              .map((child) => {
                // Attach dynamic badge count to Late Check-in Approvals child item
                if (child.path === "/attendance/late-approvals") {
                  return { ...child, badgeCount: pendingLateCount };
                }
                return child;
              });

            const itemHasAccess = canAccess(
              item.permissions,
              item.permissionMode,
            );

            if (item.path === "/contests" && user?.role !== "head") {
              return null;
            }
            if (!itemHasAccess && !visibleChildren?.length) {
              return null;
            }

            return {
              ...item,
              children: visibleChildren,
            };
          })
          .filter((item) => item !== null);

        return {
          ...group,
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [isLoading, hasAnyPermission, hasAllPermissions, pendingLateCount, user?.role]);

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Leads: true,
    Attendance: true,
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-primary text-on-primary shadow-2xl transition-all duration-300 select-none ${collapsed ? "w-20" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5 shrink-0">
          <div className="flex h-16 shrink-0 items-center justify-center rounded-lg">
            <img
              src="/brand-logo.png"
              className="h-10 w-auto grayscale-100 brightness-0 invert-100"
            />
          </div>

          {!collapsed && (
            <img
              src="/brand-name.png"
              className="h-8 w-auto grayscale-100 brightness-0 invert-100"
            />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {filteredNavGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[11px] font-bold tracking-wider text-on-primary/50 uppercase mb-2">
                  {group.title}
                </p>
              )}

              {group.items.map((item) => {
                const hasChildren = Boolean(item?.children?.length);
                const isExpanded = Boolean(openSubmenus[item?.label]);
                const isChildActive = item?.children?.some(
                  (child) => location.pathname + location.search === child.path,
                );

                // Calculate cumulative total badges for parent item when collapsed
                const totalParentBadgeCount = item?.children?.reduce(
                  (acc, child) => acc + (child.badgeCount || 0),
                  0,
                );

                if (!hasChildren && item?.path) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={closeMobileSidebar}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
                          ? "bg-white/15 text-white font-semibold shadow-sm"
                          : "text-on-primary/75 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white" />
                          )}

                          <span className="material-symbols-outlined text-xl shrink-0">
                            {item.icon}
                          </span>

                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                }

                return (
                  <div key={item?.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item?.label)}
                      title={collapsed ? item?.label : undefined}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isChildActive
                          ? "text-white font-semibold"
                          : "text-on-primary/75 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined text-xl shrink-0">
                            {item?.icon}
                          </span>
                          {Boolean(collapsed && totalParentBadgeCount && totalParentBadgeCount > 0) && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-primary" />
                          )}
                        </div>

                        {!collapsed && <span>{item?.label}</span>}
                      </div>

                      {!collapsed && (
                        <div className="flex items-center gap-2">
                          {Boolean(!isExpanded && totalParentBadgeCount && totalParentBadgeCount > 0) && (
                            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                              {totalParentBadgeCount}
                            </span>
                          )}
                          <span
                            className={`material-symbols-outlined text-lg transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                          >
                            expand_more
                          </span>
                        </div>
                      )}
                    </button>

                    {!collapsed && isExpanded && item?.children && (
                      <div className="ml-9 space-y-1 border-l border-white/10 pl-3 my-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={closeMobileSidebar}
                            end
                            className={({ isActive }) =>
                              `flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-normal transition-colors ${isActive
                                ? "text-white font-medium bg-white/10"
                                : "text-on-primary/65 hover:text-white hover:bg-white/5"
                              }`
                            }
                          >
                            <span className="truncate">{child.label}</span>
                            {Boolean(child.badgeCount && child.badgeCount > 0) && (
                              <span className="ml-2 shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                {child.badgeCount}
                              </span>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;