import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { useLogout } from "@/hooks/useAuth";
import { Link } from "react-router";
import QuickAddMenu from "./QuickAddMenu";

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();
  const { collapsed, toggleSidebar, toggleMobileSidebar } = useSidebarStore();
  const [profileOpen, setProfileOpen] = useState(false);

  // Fallback initials calculation
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "GU";

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface/85 px-4 backdrop-blur-md transition-all duration-300 sm:px-6 ${
        collapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      {/* Left Action & Search Section */}
      <div className="flex flex-1 items-center gap-3">
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobileSidebar}
          aria-label="Toggle Mobile Menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface lg:hidden transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="hidden h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface lg:flex transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">
            {collapsed ? "menu" : "menu_open"}
          </span>
        </button>

        {/* Search Bar */}
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-1.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all md:flex">
          <span className="material-symbols-outlined text-xl text-on-surface-variant/70">
            search
          </span>
          <input
            type="text"
            placeholder="Search leads, employees..."
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
          <kbd className="hidden rounded bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant/70 xl:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Add Action Button */}
        {/* <button className="hidden items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm hover:bg-primary/90 transition-all sm:flex">
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Quick Add</span>
        </button> */}
        <QuickAddMenu />

        {/* Notification Icon */}
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
          </span>
        </button>

        <div className="h-6 w-px bg-outline-variant/40" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl p-1 text-left hover:bg-surface-container-high transition-colors focus:outline-none"
          >
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-none text-on-surface">
                {user?.name ?? "Guest User"}
              </p>
              <p className="mt-1 text-[10px] font-bold leading-none tracking-wider text-on-surface-variant/70 uppercase">
                {user?.role ?? "Member"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary shadow-sm ring-2 ring-primary/20">
              {initials}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <>
              {/* Overlay listener to dismiss on click outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-1.5 shadow-xl transition-all">
                <div className="px-3 py-2 sm:hidden border-b border-outline-variant/20 mb-1">
                  <p className="text-xs font-semibold text-on-surface">
                    {user?.name ?? "Guest User"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase">
                    {user?.role ?? "Member"}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={()=>setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-on-surface-variant">
                    person
                  </span>
                  My Profile
                </Link>
                <a
                  href="#settings"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-on-surface-variant">
                    settings
                  </span>
                  Account Settings
                </a>

                <div className="my-1 border-t border-outline-variant/20" />

                <button
                  onClick={() => logout()}
                        disabled={isPending}

                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                  {isPending ? "Logging out..." : "Log out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;