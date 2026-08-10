import { useAuthStore } from "@/store/auth.store";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";


const ProfilePage = () => {
    const user = useAuthStore((s) => s.user);

    console.log(user)

    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name,
        email: user?.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (showPasswordChange && formData.newPassword !== formData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Updating profile:", formData);
            // TODO: Call your backend API endpoint (e.g., PUT /api/users/profile)

            setIsEditing(false);
            setShowPasswordChange(false);
            setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

            {/* 1. Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-5">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 font-label-md text-xs font-bold text-primary hover:underline mb-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
                        My Profile
                    </h1>
                    <p className="font-body-md text-sm text-on-surface-variant">
                        Manage your personal profile information and security settings.
                    </p>
                </div>

                {/* Action Controls */}
                {!isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto"
                    >
                        <span className="material-symbols-outlined text-base">edit</span>
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setShowPasswordChange(false);
                            }}
                            className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="my-profile-form"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">
                                {isSubmitting ? "sync" : "save"}
                            </span>
                            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Profile Overview Header Card */}
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-headline-md text-2xl font-extrabold">
                    {user?.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="space-y-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                            {user?.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                        </span>
                    </div>

                    <p className="font-body-md text-sm text-on-surface-variant">
                        {user?.email}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 font-label-sm text-xs">
                        <span className="rounded-lg bg-surface-container-high px-3 py-1 font-bold text-on-surface uppercase tracking-wider">
                            Role: {user?.role}
                        </span>
                        {
                            user?.createdAt && (
                                <span className="text-on-surface-variant/60">
                                    Member since {new Date(user?.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                </span>
                            )
                        }

                    </div>
                </div>
            </div>

            {/* 3. Form Content Area */}
            <form
                id="my-profile-form"
                onSubmit={handleSubmit}
                className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8 shadow-sm space-y-8"
            >
                {/* Personal Details */}
                <div className="space-y-4">
                    <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">person</span>
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block font-label-md text-xs font-medium text-on-surface-variant">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block font-label-md text-xs font-medium text-on-surface-variant">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-outline-variant/20" />

                {/* System & Branch Access Info (Read-Only) */}
                {
                    user?.role != 'head' && (
                        <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                            Assigned Operational Branches
                        </h3>
                        <span className="font-label-sm text-[11px] text-on-surface-variant/60 bg-surface-container-high px-2 py-0.5 rounded">
                            Managed by Admin
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {user?.branches.map((branch: any) => (
                            <div
                                key={branch._id}
                                className="flex items-center gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low px-3.5 py-2.5"
                            >
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                <span className="font-body-sm text-xs font-bold text-on-surface">
                                    {branch.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                    )
                }

                <hr className="border-outline-variant/20" />

                {/* Security / Password Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">lock</span>
                            Security & Password
                        </h3>

                        {isEditing && !showPasswordChange && (
                            <button
                                type="button"
                                onClick={() => setShowPasswordChange(true)}
                                className="font-label-md text-xs font-bold text-primary hover:underline"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {!showPasswordChange ? (
                        <p className="font-body-sm text-xs text-on-surface-variant">
                            •••••••••••• (Password last changed 3 months ago)
                        </p>
                    ) : (
                        <div className="space-y-4 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                            <div className="space-y-1.5">
                                <label htmlFor="currentPassword" className="block font-label-md text-xs font-medium text-on-surface-variant">
                                    Current Password
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-2 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required={showPasswordChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="newPassword" className="block font-label-md text-xs font-medium text-on-surface-variant">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-2 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required={showPasswordChange}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="confirmPassword" className="block font-label-md text-xs font-medium text-on-surface-variant">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-2 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required={showPasswordChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPasswordChange(false)}
                                className="font-label-sm text-xs text-on-surface-variant hover:text-on-surface"
                            >
                                Cancel Password Change
                            </button>
                        </div>
                    )}
                </div>
            </form>

        </div>
    );
};

export default ProfilePage;