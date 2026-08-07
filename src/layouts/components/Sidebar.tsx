import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { ROUTES } from "@/config/routes";
import { useSidebarStore } from "@/store/sidebar.store";

interface NavItem {
  label: string;
  path?: string;
  icon: string;
  children?: { label: string; path: string }[];
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", path: ROUTES.dashboard, icon: "dashboard" },
      {
        label: "Leads",
        icon: "group",
        children: [
          { label: "All Leads", path: ROUTES.leads },
          { label: "My Leads", path: `${ROUTES.leads}?view=mine` },
          { label: "Follow-ups", path: `${ROUTES.leads}?view=followups` },
          { label: "Hot Leads", path: `${ROUTES.leads}?view=hot` },
        ],
      },
      {
        label: "Dialer",
        icon: "call",
        children: [
          { label: "Dialer", path: "/dialer" },
          { label: "History", path: "/dialer/history" },
          { label: "Analytics", path: "/dialer/analytics" },
        ],
      },
      { label: "Tasks", path: "/tasks", icon: "check_circle" },
      { label: "Attendance", path: ROUTES.attendance, icon: "calendar_today" },
      { label: "Achievements", path: "/achievements", icon: "military_tech" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Employees", path: ROUTES.employees, icon: "badge" },
      { label: "Settings", path: ROUTES.settings, icon: "settings" },
    ],
  },
];

const Sidebar = () => {
  const { collapsed, mobileOpen, closeMobileSidebar } = useSidebarStore();
  const location = useLocation();

  // Track expanded parent menu items
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Leads: true,
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-primary text-on-primary shadow-2xl transition-all duration-300 select-none ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5 shrink-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-md">
            <span className="material-symbols-outlined text-xl text-on-primary">
              bolt
            </span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight whitespace-nowrap text-on-primary">
              Marketrixa
            </span>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {/* Group Section Header */}
              {!collapsed && (
                <p className="px-3 text-[11px] font-bold tracking-wider text-on-primary/50 uppercase mb-2">
                  {group.title}
                </p>
              )}

              {group.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = Boolean(openSubmenus[item.label]);
                const isChildActive = item.children?.some(
                  (child) => location.pathname + location.search === child.path
                );

                /* Standard Single Link */
                if (!hasChildren && item.path) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={closeMobileSidebar}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                          isActive
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

                /* Expandable Dropdown Parent Link */
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.label)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                        isChildActive
                          ? "text-white font-semibold"
                          : "text-on-primary/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="material-symbols-outlined text-xl shrink-0">
                          {item.icon}
                        </span>
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && (
                        <span
                          className={`material-symbols-outlined text-lg transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      )}
                    </button>

                    {/* Nested Sub-navigation Links */}
                    {!collapsed && isExpanded && item.children && (
                      <div className="ml-9 space-y-1 border-l border-white/10 pl-3 my-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={closeMobileSidebar}
                            end
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-1.5 text-sm font-normal transition-colors ${
                                isActive
                                  ? "text-white font-medium bg-white/10"
                                  : "text-on-primary/65 hover:text-white hover:bg-white/5"
                              }`
                            }
                          >
                            {child.label}
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