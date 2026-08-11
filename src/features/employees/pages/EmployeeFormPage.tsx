import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { useBranchesQuery } from "@/features/branches";
import { useAuthStore } from "@/store/auth.store";
import { ROLE_LABELS, ROLES, getAssignableRoles, type Role } from "@/types/auth";
import {
    useCreateEmployee,
    useEmployeeQuery,
    useUpdateEmployee,
    useUpdateEmployeeBranches,
} from "../hooks/useEmployees";

const EmployeeFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const currentUser = useAuthStore((s) => s.user);
    const isSelfEdit = isEditMode && currentUser?._id === id;

    const { data: existingEmployee, isLoading: employeeLoading } =
        useEmployeeQuery(id);

    console.log(existingEmployee);
    const { data: branches, isLoading: branchesLoading } = useBranchesQuery();

    const createEmployee = useCreateEmployee();
    const updateEmployee = useUpdateEmployee();
    const updateBranches = useUpdateEmployeeBranches();

    const assignableRoles = useMemo(() => {
        if (!currentUser) return [];
        const roles = getAssignableRoles(currentUser.role);
        // keep the employee's current role selectable even if the editor
        // couldn't have assigned it themselves (e.g. inherited from a HEAD)
        if (
            isEditMode &&
            existingEmployee &&
            !roles.includes(existingEmployee.role)
        ) {
            return [...roles, existingEmployee.role];
        }
        return roles;
    }, [currentUser, isEditMode, existingEmployee]);

    const [formData, setFormData] = useState({
        fullName: "",
        officialEmail: "",
        password: "",
        role: "" as Role | "",
        branches: [] as string[],
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    // prefill once the employee record arrives
    useEffect(() => {
        if (!isEditMode || !existingEmployee) return;
        setFormData({
            fullName: existingEmployee.name,
            officialEmail: existingEmployee.email,
            password: "",
            role: existingEmployee.role,
            branches: existingEmployee.branches.map((b: any) => b._id),
            isActive: existingEmployee.isActive,
        });
    }, [isEditMode, existingEmployee]);

    const handleBranchToggle = (branchId: string) => {
        setFormData((prev) => ({
            ...prev,
            branches: prev.branches.includes(branchId)
                ? prev.branches.filter((b) => b !== branchId)
                : [...prev.branches, branchId],
        }));

        if(['employee', 'manager'].includes(formData.role)){
            setFormData((prev) => ({
            ...prev,
            branches: [branchId],
        }));
        }
    };

    useEffect(()=>{

        setFormData((prev) => ({
            ...prev,
            branches: isEditMode && existingEmployee ? existingEmployee.branches.map((b: any) => b._id):[],
        }));

    },[formData.role, existingEmployee])

    const validate = () => {
        const nextErrors: Record<string, string> = {};
        if (formData.fullName.trim().length < 2)
            nextErrors.fullName = "Name must be at least 2 characters";
        if (!/^\S+@\S+\.\S+$/.test(formData.officialEmail))
            nextErrors.officialEmail = "Enter a valid email address";
        if (!isEditMode && formData.password.length < 8)
            nextErrors.password = "Password must be at least 8 characters";
        if (!formData.role) nextErrors.role = "Select a role";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate() || !formData.role) return;

        try {
            if (isEditMode && id) {

                const originalBranchIds = (existingEmployee?.branches ?? [])
                    .map((b: any) => b._id)
                    .sort();
                const nextBranchIds = [...formData.branches].sort();
                const branchesChanged =
                    JSON.stringify(originalBranchIds) !== JSON.stringify(nextBranchIds);

                await updateEmployee.mutateAsync({
                    id,
                    payload: {
                        name: formData.fullName.trim(),
                        email: formData.officialEmail.trim().toLowerCase(),
                        role: formData.role,
                        ...(branchesChanged && {
                            branches: formData.branches,
                        }),
                        isActive: formData.isActive
                    }

                });
            } else {
                await createEmployee.mutateAsync({
                    name: formData.fullName.trim(),
                    email: formData.officialEmail.trim().toLowerCase(),
                    password: formData.password,
                    role: formData.role,
                    branches: formData.branches,
                });
            }
            navigate("/employees");
        } catch {
            // toast already shown by mutation onError handlers
        }
    };

    const isSubmitting =
        createEmployee.isPending ||
        updateEmployee.isPending ||
        updateBranches.isPending;

    const isLoadingRecord = isEditMode && employeeLoading;

    // guard rails matching backend rules
    const isHeadTarget = isEditMode && existingEmployee?.role === ROLES.HEAD;
    const isBlocked = isSelfEdit || isHeadTarget;

    const copy = isEditMode
        ? {
            title: "Edit Employee",
            subtitle: "Update role, access permissions, and assigned branches.",
            submitIdle: "Save Changes",
            submitBusy: "Saving...",
            icon: "edit",
        }
        : {
            title: "Onboard New Employee",
            subtitle:
                "Create an account, set system access permissions, and assign operational branches.",
            submitIdle: "Create Employee",
            submitBusy: "Saving...",
            icon: "person_add",
        };

    if (isLoadingRecord) {
        return (
            <div className="min-h-screen bg-surface p-6 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                    progress_activity
                </span>
            </div>
        );
    }

    if (isBlocked) {
        return (
            <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center gap-3 text-center">
                <span className="material-symbols-outlined text-3xl text-error">
                    block
                </span>
                <p className="font-body-md text-on-surface-variant max-w-sm">
                    {isSelfEdit
                        ? "You can't edit your own account through this form."
                        : "Head-level accounts can't be modified through this form."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/employees")}
                    className="mt-2 rounded-xl border border-outline-variant/40 px-4 py-2 font-label-md text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                >
                    Back to Employees
                </button>
            </div>
        );
    }

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
                        <span className="material-symbols-outlined text-sm">
                            arrow_back
                        </span>
                        Back
                    </button>
                    <h1 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface">
                        {copy.title}
                    </h1>
                    <p className="font-body-md text-sm text-on-surface-variant">
                        {copy.subtitle}
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
                        form="employee-form"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">
                            {isSubmitting ? "sync" : copy.icon}
                        </span>
                        <span>{isSubmitting ? copy.submitBusy : copy.submitIdle}</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <form
                    id="employee-form"
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8 shadow-sm space-y-8"
                >
                    {/* Section 1: Personal & Account Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-primary">
                            <span className="material-symbols-outlined text-2xl">
                                {copy.icon}
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
                                <div
                                    className={`relative flex items-center rounded-xl border bg-surface-container-low px-3.5 py-2.5 focus-within:ring-2 transition-all ${errors.fullName
                                        ? "border-error focus-within:border-error focus-within:ring-error/20"
                                        : "border-outline-variant/40 focus-within:border-primary focus-within:ring-primary/20"
                                        }`}
                                >
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
                                {errors.fullName && (
                                    <p className="font-body-sm text-[11px] text-error">
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Official Email */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="officialEmail"
                                    className="block font-label-md text-xs font-medium text-on-surface-variant"
                                >
                                    Official Email
                                </label>
                                <div
                                    className={`relative flex items-center rounded-xl border bg-surface-container-low px-3.5 py-2.5 focus-within:ring-2 transition-all ${errors.officialEmail
                                        ? "border-error focus-within:border-error focus-within:ring-error/20"
                                        : "border-outline-variant/40 focus-within:border-primary focus-within:ring-primary/20"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl text-on-surface-variant/60 mr-2.5">
                                        mail
                                    </span>
                                    <input
                                        id="officialEmail"
                                        type="email"
                                        placeholder="rahul.desai@company.com"
                                        value={formData.officialEmail}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                officialEmail: e.target.value,
                                            })
                                        }
                                        className="w-full bg-transparent font-body-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                        required
                                    />
                                </div>
                                {errors.officialEmail && (
                                    <p className="font-body-sm text-[11px] text-error">
                                        {errors.officialEmail}
                                    </p>
                                )}
                            </div>

                            {/* Temporary Password — create mode only, backend has no
                  password field on update */}
                            {!isEditMode && (
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label
                                        htmlFor="password"
                                        className="block font-label-md text-xs font-medium text-on-surface-variant"
                                    >
                                        Temporary Password
                                    </label>
                                    <div
                                        className={`relative flex items-center rounded-xl border bg-surface-container-low px-3.5 py-2.5 focus-within:ring-2 transition-all ${errors.password
                                            ? "border-error focus-within:border-error focus-within:ring-error/20"
                                            : "border-outline-variant/40 focus-within:border-primary focus-within:ring-primary/20"
                                            }`}
                                    >
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
                                            aria-label={
                                                showPassword ? "Hide password" : "Show password"
                                            }
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.password ? (
                                        <p className="font-body-sm text-[11px] text-error">
                                            {errors.password}
                                        </p>
                                    ) : (
                                        <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                                            Minimum 8 characters. The employee should change this
                                            after first login.
                                        </p>
                                    )}
                                </div>
                            )}

                            {isEditMode && (
                                <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                                    <span className="material-symbols-outlined text-lg text-on-surface-variant/60">
                                        info
                                    </span>
                                    <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                                        Password changes aren't handled from this form. Use the
                                        dedicated reset-password action instead.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-outline-variant/20" />

                    {/* Section 2: Role & Assignment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-primary">
                            <span className="material-symbols-outlined text-2xl">work</span>
                            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                                Role & Assignment
                            </h2>
                        </div>

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
                                        setFormData({
                                            ...formData,
                                            role: e.target.value as Role,
                                        })
                                    }
                                    className={`w-full appearance-none rounded-xl border bg-surface-container-low px-3.5 py-2.5 pr-10 font-body-md text-sm text-on-surface outline-none focus:ring-2 transition-all cursor-pointer ${errors.role
                                        ? "border-error focus:border-error focus:ring-error/20"
                                        : "border-outline-variant/40 focus:border-primary focus:ring-primary/20"
                                        }`}
                                    required
                                >
                                    <option value="" disabled>
                                        Select a role...
                                    </option>
                                    {assignableRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {ROLE_LABELS[role]}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                                    expand_more
                                </span>
                            </div>
                            {errors.role ? (
                                <p className="font-body-sm text-[11px] text-error">
                                    {errors.role}
                                </p>
                            ) : (
                                <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                                    Determines access level and permissions within the CRM.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="block font-label-md text-xs font-medium text-on-surface-variant">
                                Assigned Branches
                            </label>
                            {branchesLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-11 rounded-xl bg-surface-container-high animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : !branches || branches.length === 0 ? (
                                <p className="font-body-sm text-xs text-on-surface-variant/70 italic">
                                    No active branches yet — create one from the Branches page
                                    first.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {branches.map((branch) => {
                                        const isChecked = formData.branches.includes(branch._id);
                                        return (
                                            <label
                                                key={branch._id}
                                                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all cursor-pointer ${isChecked
                                                    ? "border-primary bg-primary/5 text-primary font-medium"
                                                    : "border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleBranchToggle(branch._id)}
                                                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                                />
                                                <span className="font-body-sm text-xs truncate">
                                                    {branch.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    {isEditMode && (
                        <>
                            <hr className="border-outline-variant/20" />
                            {/* Section 3: Account Status */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5 text-primary">
                                    <span className="material-symbols-outlined text-2xl">
                                        toggle_on
                                    </span>
                                    <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                                        Account Status
                                    </h2>
                                </div>

                                <div
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: !prev.isActive,
                                        }))
                                    }
                                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${formData.isActive
                                            ? "border-outline-variant/30 bg-surface-container-low hover:border-outline-variant/60"
                                            : "border-error/30 bg-error/5 hover:border-error/50"
                                        }`}
                                >
                                    {/* Left Info Section */}
                                    <div className="flex items-center gap-3.5 select-none">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${formData.isActive
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : "bg-error/10 text-error"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {formData.isActive ? "check_circle" : "block"}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="font-label-md text-xs font-bold text-on-surface">
                                                Account Status: {formData.isActive ? "Active" : "Deactivated"}
                                            </p>
                                            <p className="font-body-sm text-[11px] text-on-surface-variant/70">
                                                {formData.isActive
                                                    ? "Employee can log in and access assigned CRM resources."
                                                    : "Employee will be immediately signed out and blocked from logging in."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Toggle Switch Control */}
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={formData.isActive}
                                        aria-label="Toggle user status"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents double triggers when clicking directly on the switch knob
                                            setFormData((prev) => ({
                                                ...prev,
                                                isActive: !prev.isActive,
                                            }));
                                        }}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${formData.isActive ? "bg-emerald-600" : "bg-outline-variant/60"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${formData.isActive ? "translate-x-5" : "translate-x-0.5"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

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
                                {copy.icon}
                            </span>
                            <span>{isSubmitting ? copy.submitBusy : copy.submitIdle}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default EmployeeFormPage;