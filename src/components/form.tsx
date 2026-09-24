"use client";

import { useFormStatus } from "react-dom";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Spinner } from "@/components/Spinner";

/**
 * Piezas de formulario compartidas. Todas son "no controladas" (defaultValue):
 * los Server Actions leen FormData, y cuando hay un error la action devuelve
 * los valores enviados para que el formulario los vuelva a mostrar.
 */

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue"> & {
  label: string;
  name: string;
  hint?: React.ReactNode;
  defaultValue?: string | number | null;
  inputClassName?: string;
};

export function Field({ label, hint, className = "", inputClassName = "", defaultValue, id, ...props }: InputProps) {
  const inputId = id ?? `f-${props.name}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label">
        {label}
        {!props.required && <span className="ml-1.5 font-normal text-ink-3">(opcional)</span>}
      </label>
      <input
        id={inputId}
        className={`field ${inputClassName}`}
        defaultValue={defaultValue ?? undefined}
        aria-describedby={hintId}
        {...props}
      />
      {hint && (
        <p id={hintId} className="hint mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}

type TextAreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "defaultValue"> & {
  label: string;
  name: string;
  hint?: React.ReactNode;
  defaultValue?: string | null;
};

export function TextArea({ label, hint, className = "", defaultValue, id, ...props }: TextAreaProps) {
  const inputId = id ?? `f-${props.name}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label">
        {label}
        {!props.required && <span className="ml-1.5 font-normal text-ink-3">(opcional)</span>}
      </label>
      <textarea
        id={inputId}
        className="field"
        rows={3}
        defaultValue={defaultValue ?? undefined}
        aria-describedby={hintId}
        {...props}
      />
      {hint && (
        <p id={hintId} className="hint mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  className = "",
  required,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
  required?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {!required && <span className="ml-1.5 font-normal text-ink-3">(opcional)</span>}
      </label>
      <select id={id} name={name} defaultValue={defaultValue} required={required} className="field">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckField({
  name,
  label,
  hint,
  defaultChecked,
  value,
}: {
  name: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  defaultChecked?: boolean;
  value?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="check mt-0.5" />
      <span>
        <span className="block font-medium text-ink">{label}</span>
        {hint && <span className="hint mt-0.5 block">{hint}</span>}
      </span>
    </label>
  );
}

/** Botón de envío con estado "pendiente" (lee el form padre con useFormStatus). */
export function SubmitButton({
  children,
  pendingLabel,
  className = "btn btn-primary",
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} name={name} value={value} aria-busy={pending}>
      {pending && <Spinner />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (error) {
    return (
      <p role="alert" className="notice notice-error anim-fade-in">
        <CircleAlert size={20} className="mt-px shrink-0 text-danger" aria-hidden />
        <span>{error}</span>
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="notice notice-ok anim-fade-in">
        <CircleCheck size={20} className="mt-px shrink-0 text-ok" aria-hidden />
        <span>{success}</span>
      </p>
    );
  }
  return null;
}
