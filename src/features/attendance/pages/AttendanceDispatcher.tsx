import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/types/auth";
import AdminAttendancePage from "./AdminAttendancePage";
import EmployeeAttendancePage from "./EmployeeAttendancePage";

export const AttendanceDispatcher = () => {
    const user = useAuthStore((s) => s.user);

    const isExecutive = user?.role === ROLES.HEAD || user?.role === ROLES.ADMIN;

    return (
        <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">
            {isExecutive ? (
                <AdminAttendancePage />
            ) : (
                <EmployeeAttendancePage />
            )}
        </div>
    );
};