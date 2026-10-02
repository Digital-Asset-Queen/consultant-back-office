import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";

type FieldType = "text" | "number" | "date" | "select" | "textarea";

interface SelectOption {
  value: string;
  label: string;
}

interface InlineFormField {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  defaultValue?: string | number;
}

interface InlineFormProps {
  fields: InlineFormField[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
  className?: string;
  loading?: boolean;
}

export function InlineForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  className,
  loading = false,
}: InlineFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = f.defaultValue !== undefined ? String(f.defaultValue) : "";
    }
    return init;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const set = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const inputClass =
    "h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground w-full";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-wrap items-end gap-2 p-3 bg-secondary rounded border border-border",
        className,
      )}
    >
      {fields.map((field) => (
        <FormField
          key={field.key}
          label={field.label}
          required={field.required}
        >
          {field.type === "select" && field.options ? (
            <select
              className={inputClass}
              value={values[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              required={field.required}
            >
              <option value="">Select…</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              className={cn(inputClass, "h-auto py-1 resize-none")}
              rows={2}
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              required={field.required}
            />
          ) : (
            <input
              type={field.type ?? "text"}
              className={inputClass}
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              required={field.required}
            />
          )}
        </FormField>
      ))}
      <div className="flex items-center gap-1.5 mb-0 self-end">
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          data-ocid="inline_form.submit_button"
        >
          {loading ? "Saving…" : submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          data-ocid="inline_form.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default InlineForm;
