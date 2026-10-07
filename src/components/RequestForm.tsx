import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  Meta,
  RequestFields,
  ServiceRequest,
} from "../common/types/api.types";
import { ButtonSpinner } from '../common/components/ButtonSpinner';

const label = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export function RequestForm({
  meta,
  request,
  saving,
  onSubmit,
  onCancel,
}: {
  meta: Meta;
  request?: ServiceRequest;
  saving: boolean;
  onSubmit: (fields: RequestFields) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RequestFields>({
    defaultValues: {
      title: "",
      description: "",
      category: meta.categories[0],
      priority: meta.priorities[0],
    },
  });
  const descriptionLength = watch('description')?.length ?? 0;
  useEffect(() => {
    reset(
      request
        ? {
            title: request.title,
            description: request.description,
            category: request.category,
            priority: request.priority,
          }
        : {
            title: "",
            description: "",
            category: meta.categories[0],
            priority: meta.priorities[0],
          },
    );
  }, [request, meta, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block text-sm font-medium">
        Title
        <input
          className="field mt-1"
          placeholder="Example: Office printer not working"
          {...register("title", {
            setValueAs: (value: string) => value.trim(),
            required: "Title is required",
            minLength: { value: 3, message: "Use at least 3 characters" },
            maxLength: { value: 120, message: "Use at most 120 characters" },
          })}
        />
        {errors.title && (
          <span className="text-xs text-red-700">{errors.title.message}</span>
        )}
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          rows={5}
          className="field mt-1"
          placeholder="Describe the issue and what help you need"
          {...register("description", {
            setValueAs: (value: string) => value.trim(),
            required: "Description is required",
            minLength: { value: 10, message: "Use at least 10 characters" },
            maxLength: { value: 2000, message: "Use at most 2000 characters" },
          })}
        />
        <span className="mt-1 block text-right text-xs text-slate-500">{descriptionLength} / 2000</span>
        {errors.description && (
          <span className="text-xs text-red-700">
            {errors.description.message}
          </span>
        )}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Category
          <select
            className="field mt-1"
            {...register("category", { required: true })}
          >
            {meta.categories.map((value) => (
              <option key={value} value={value}>
                {label(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Priority
          <select
            className="field mt-1"
            {...register("priority", { required: true })}
          >
            {meta.priorities.map((value) => (
              <option key={value} value={value}>
                {label(value)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <button className="button" disabled={saving}>
          {saving && <ButtonSpinner />}
          {saving ? request ? "Saving…" : "Creating…" : request ? "Save changes" : "Create request"}
        </button>
        <button type="button" className="button-secondary" disabled={saving} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
