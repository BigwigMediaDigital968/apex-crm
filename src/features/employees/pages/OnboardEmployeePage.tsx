import { apiClient } from "@/services/apiClient";
import { ROLES, type Role } from "@/types/auth";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router"; // Or 'next/navigation' / 'next/router' depending on your framework

const BRANCH_OPTIONS = [
    { id: "delhi", label: "Delhi (HQ)" },
    { id: "mumbai", label: "Mumbai" },
    { id: "bengaluru", label: "Bengaluru" },
    { id: "pune", label: "Pune" },
];

const OnboardEmployeePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        officialEmail: "",
        phone: "",
        password: "",
        role: "",
        branches: [] as string[],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBranchToggle = (branchId: string) => {
        setFormData((prev) => ({
            ...prev,
            branches: prev.branches.includes(branchId)
                ? prev.branches.filter((b) => b !== branchId)
                : [...prev.branches, branchId],
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log("Submitting new employee:", formData);
            await apiClient.post('/users', {
                name: formData.fullName,
                email: formData.officialEmail,
                password: formData.password,
                role: formData.role,
                branches: formData.branches
            });
            toast.success("User created successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500); // Redirect after 1.5 seconds
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create user");
            console.error("Failed to onboard employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-5">
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 font-label-md text-xs font-bold text-primary hover:underline mb-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
                        Onboard New Employee
                    </h1>
                    <p className="font-body-md text-sm text-on-surface-variant">
                        Create an account, set system access permissions, and assign operational branches.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="onboard-employee-form"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">
                            {isSubmitting ? "sync" : "person_add"}
                        </span>
                        <span>{isSubmitting ? "Saving..." : "Create Employee"}</span>
                    </button>
                </div>
            </div>

            {/* Main Form Area Container */}
            <div className="max-w-4xl mx-auto">
                <form
                    id="onboard-employee-form"
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8 shadow-sm space-y-8"
                >
                    {/* Section 1: Personal & Account Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-primary">
                            <span className="material-symbols-outlined text-2xl">
                                person_add
                            </span>
                            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                                Personal & Account Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="fullName"
                                    className="block font-label-md text-xs font-medium text-on-surface-variant"
                                >
                                    Full Name
                                </label>
                                <div className="relative flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <span className="material-symbols-outlined text-xl text-on-surface-variant/60 mr-2.5">
                                        person
                                    </span>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="e.g. Rahul Desai"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                        className="w-full bg-transparent font-body-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Official Email */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="officialEmail"
                                    className="block font-label-md text-xs font-medium text-on-surface-variant"
                                >
                                    Official Email
                                </label>
                                <div className="relative flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <span className="material-symbols-outlined text-xl text-on-surface-variant/60 mr-2.5">
                                        mail
                                    </span>
                                    <input
                                        id="officialEmail"
                                        type="email"
                                        placeholder="rahul.desai@company.com"
                                        value={formData.officialEmail}
                                        onChange={(e) =>
                                            setFormData({ ...formData, officialEmail: e.target.value })
                                        }
                                        className="w-full bg-transparent font-body-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="phone"
                                    className="block font-label-md text-xs font-medium text-on-surface-variant"
                                >
                                    Phone Number
                                </label>
                                <div className="relative flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <span className="px-3 py-2.5 border-r border-outline-variant/40 font-label-md text-xs font-bold text-on-surface-variant/80">
                                        +91
                                    </span>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="98765 43210"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="w-full bg-transparent px-3.5 py-2.5 font-body-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Temporary Password */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="password"
                                    className="block font-label-md text-xs font-medium text-on-surface-variant"
                                >
                                    Temporary Password
                                </label>
                                <div className="relative flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <span className="material-symbols-outlined text-xl text-on-surface-variant/60 mr-2.5">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        className="w-full bg-transparent font-body-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-on-surface-variant/60 hover:text-on-surface transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-outline-variant/20" />

                    {/* Section 2: Role & Assignment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-primary">
                            <span className="material-symbols-outlined text-2xl">
                                work
                            </span>
                            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                                Role & Assignment
                            </h2>
                        </div>

                        {/* System Role Selection */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="role"
                                className="block font-label-md text-xs font-medium text-on-surface-variant"
                            >
                                System Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value as Role })
                                    }
                                    className="w-full appearance-none rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-2.5 pr-10 font-body-md text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>
                                        Select a role...
                                    </option>
                                    <option value={ROLES.HEAD}>Head</option>
                                    <option value={ROLES.ADMIN}>Administrator</option>
                                    <option value={ROLES.MANAGER}>Manager</option>
                                    <option value={ROLES.EMPLOYEE}>Employee</option>
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                                    expand_more
                                </span>
                            </div>
                            <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                                Determines access level and permissions within the CRM.
                            </p>
                        </div>

                        {/* Assigned Branches Checkboxes */}
                        <div className="space-y-2 pt-2">
                            <label className="block font-label-md text-xs font-medium text-on-surface-variant">
                                Assigned Branches
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {BRANCH_OPTIONS.map((branch) => {
                                    const isChecked = formData.branches.includes(branch.id);
                                    return (
                                        <label
                                            key={branch.id}
                                            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all cursor-pointer ${isChecked
                                                ? "border-primary bg-primary/5 text-primary font-medium"
                                                : "border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleBranchToggle(branch.id)}
                                                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                            />
                                            <span className="font-body-sm text-xs truncate">
                                                {branch.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-xl px-5 py-2.5 font-label-md text-xs font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">
                                person_add
                            </span>
                            <span>{isSubmitting ? "Creating..." : "Create Employee"}</span>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default OnboardEmployeePage;