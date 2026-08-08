import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { useCreateBranch, useUpdateBranch } from "../hooks/useBranches";
import type { Branch, BranchFormInput } from "@/types/branch";

interface BranchFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Pass an existing branch to edit it; omit to create a new one. */
  branch?: Branch | null;
}

const EMPTY_FORM: BranchFormInput = {
  name: "",
  code: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  phone: "",
  email: "",
};

const CODE_PATTERN = /^[A-Z0-9-]+$/;

const toFormInput = (branch: Branch): BranchFormInput => ({
  name: branch.name,
  code: branch.code,
  description: branch.description ?? "",
  address: branch.address ?? "",
  city: branch.city ?? "",
  state: branch.state ?? "",
  country: branch.country ?? "India",
  phone: branch.phone ?? "",
  email: branch.email ?? "",
});

const BranchFormModal = ({ open, onClose, branch }: BranchFormModalProps) => {
  const isEditMode = Boolean(branch);
  // Lazy-initialized from props — the parent remounts this component (via a
  // `key` that changes per open) whenever a different target should be edited,
  // so there's no need for an effect to resynchronize state after the fact.
  const [form, setForm] = useState<BranchFormInput>(() =>
    branch ? toFormInput(branch) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof BranchFormInput, string>>>({});

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const isSubmitting = createBranch.isPending || updateBranch.isPending;

  const setField = (key: keyof BranchFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof BranchFormInput, string>> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }
    if (!CODE_PATTERN.test(form.code.trim())) {
      nextErrors.code = "Uppercase letters, numbers and hyphens only";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && branch) {
      // Code is immutable after creation on the backend — only send the editable fields.
      const { name, description, address, city, state, country, phone, email } = form;
      await updateBranch.mutateAsync({
        id: branch._id,
        payload: {
          name: name.trim(),
          description,
          address,
          city,
          state,
          country,
          phone,
          email,
        },
      });
    } else {
      await createBranch.mutateAsync({
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
      });
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Branch" : "Create Branch"}
      description={
        isEditMode
          ? `Update details for ${branch?.name}.`
          : "Add a new regional office to your organization."
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="branch-name"
            label="Branch Name"
            placeholder="e.g. Mumbai"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
            required
          />
          <FormField
            id="branch-code"
            label="Branch Code"
            placeholder="e.g. MUM-01"
            value={form.code}
            onChange={(e) => setField("code", e.target.value.toUpperCase())}
            error={errors.code}
            disabled={isEditMode}
            hint={isEditMode ? "Code cannot be changed after creation" : undefined}
            required
          />
        </div>

        <FormField
          id="branch-description"
          label="Description"
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />

        <FormField
          id="branch-address"
          label="Address"
          placeholder="Street address (optional)"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            id="branch-city"
            label="City"
            placeholder="City"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
          />
          <FormField
            id="branch-state"
            label="State"
            placeholder="State"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
          />
          <FormField
            id="branch-country"
            label="Country"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="branch-phone"
            label="Phone"
            placeholder="Contact number (optional)"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
          <FormField
            id="branch-email"
            label="Email"
            type="email"
            placeholder="branch@company.com (optional)"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 font-label-md text-xs font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-xs font-bold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-base">
              {isSubmitting ? "sync" : isEditMode ? "save" : "add_business"}
            </span>
            <span>
              {isSubmitting
                ? "Saving…"
                : isEditMode
                ? "Save Changes"
                : "Create Branch"}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BranchFormModal;
