import { useBranchesQuery } from "@/features/branches";
import { useNavigate, useParams } from "react-router";
import { useEmployeeQuery } from "../hooks/useEmployees";
import { useAuthStore } from "@/store/auth.store";
import { Can } from "@/components/Auth/Can";

// Mock CURRENT LOGGED-IN USER & Permissions context


const UserProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const currentUser = useAuthStore((s) => s.user);
    

    // Fetch user and branch data
    const { isLoading: branchesLoading } = useBranchesQuery();
    const { data: userProfile, isLoading: userProfileLoading } = useEmployeeQuery(id);

    // Permission Checks
    const isOwnProfile = Boolean(userProfile && currentUser?.id === userProfile._id);
    const canUpdateUser = true;
    // const canUpdateUser = LOGGED_IN_USER_PERMISSIONS.includes("user:update") || isOwnProfile;

    if (userProfileLoading || branchesLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface">
                <div className="flex items-center gap-2 text-on-surface-variant font-body-md">
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface">
                <p className="text-on-surface-variant font-body-md">User not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface pb-24 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Navigation */}
            <div className="border-b border-outline-variant/30 pb-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 font-label-md text-xs font-bold text-primary hover:underline mb-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
                        {isOwnProfile ? "My Profile" : `${userProfile.name}'s Profile`}
                    </h1>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            userProfile.isActive
                                ? "bg-emerald-500/10 text-emerald-700"
                                : "bg-error/10 text-error"
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${
                                userProfile.isActive ? "bg-emerald-500" : "bg-error"
                            }`}
                        />
                        {userProfile.isActive ? "Active Account" : "Deactivated"}
                    </span>
                </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Left Identity Card */}
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-6 h-fit">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary font-headline-md text-3xl font-bold">
                            {userProfile.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                                {userProfile.name}
                            </h2>
                            <p className="font-body-md text-xs text-on-surface-variant">
                                {userProfile.email}
                            </p>
                        </div>
                        <span className="inline-block rounded-lg bg-surface-container-high px-3 py-1 font-label-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                            {userProfile.role.replace("_", " ")}
                        </span>
                    </div>

                    <hr className="border-outline-variant/20" />

                    {/* Metadata Section */}
                    <div className="space-y-3 font-body-sm text-xs">
                        <p className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                            System Details
                        </p>
                        <div className="flex items-center justify-between text-on-surface-variant">
                            <span>User ID:</span>
                            <span className="font-mono text-[11px] font-bold text-on-surface">
                                {userProfile._id}
                            </span>
                        </div>
                        {userProfile.createdBy && (
                            <div className="flex items-center justify-between text-on-surface-variant">
                                <span>Created By:</span>
                                <span className="font-medium text-on-surface">
                                    {userProfile.createdBy}
                                </span>
                            </div>
                        )}
                        {userProfile.createdAt && (
                            <div className="flex items-center justify-between text-on-surface-variant">
                                <span>Member Since:</span>
                                <span className="font-medium text-on-surface">
                                    {new Date(userProfile.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                        {userProfile.updatedAt && (
                            <div className="flex items-center justify-between text-on-surface-variant">
                                <span>Last Updated:</span>
                                <span className="font-medium text-on-surface">
                                    {new Date(userProfile.updatedAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Details Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Overview */}
                    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
                        <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                            <span className="material-symbols-outlined text-primary text-xl">
                                badge
                            </span>
                            Account Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <span className="block text-xs font-medium text-on-surface-variant">
                                    Full Name
                                </span>
                                <p className="text-sm font-semibold text-on-surface mt-0.5">
                                    {userProfile.name}
                                </p>
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-on-surface-variant">
                                    Official Email
                                </span>
                                <p className="text-sm font-semibold text-on-surface mt-0.5">
                                    {userProfile.email}
                                </p>
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-on-surface-variant">
                                    System Role
                                </span>
                                <p className="text-sm font-semibold text-on-surface mt-0.5 capitalize">
                                    {userProfile.role.replace("_", " ")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Branches */}
                    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm space-y-4">
                        <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                            <span className="material-symbols-outlined text-primary text-xl">
                                storefront
                            </span>
                            Assigned Operational Branches
                        </h3>

                        {userProfile.branches && userProfile.branches.length > 0 ? (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {userProfile.branches.map((branch) => (
                                    <span
                                        key={branch._id}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 font-body-sm text-xs font-semibold text-primary"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            location_on
                                        </span>
                                        {branch.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-on-surface-variant/70 italic py-2">
                                No operational branches currently assigned.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <Can permission={'user:update'}>
                <div className="rounded-2xl bottom-0 left-0 right-0 border-t border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-md p-4 shadow-lg z-10">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <p className="text-xs text-on-surface-variant hidden sm:block">
                            Need to update this user's information or change branch access?
                        </p>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(`/users/${id}/edit`)}
                                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all"
                            >
                                <span className="material-symbols-outlined text-base">edit</span>
                                <span>Edit Profile Page</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Can>
        </div>
    );
};

export default UserProfilePage;