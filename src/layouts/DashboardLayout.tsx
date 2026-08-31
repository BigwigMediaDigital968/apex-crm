import { Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useSidebarStore } from "@/store/sidebar.store";
import { ActiveContestPopup } from "@/features/contests/components/ActiveContestPopup";
import { ActiveCallPopup } from "@/features/dialer/components/ActiveCallPopup";

const DashboardLayout = () => {
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <ActiveContestPopup />

      <audio id="stringee-remote-audio" autoPlay playsInline />
      <audio id="stringee-local-audio" autoPlay playsInline muted />

      {/* Floating Call Bar for navigate-away active calls */}
      <ActiveCallPopup />

      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
      >
        <div className="p-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;