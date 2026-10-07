import { useState } from 'react';

type AuthInputProps = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  autoComplete: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string;
  hint?: string;
};

function FieldIcon({ type }: { type: AuthInputProps['type'] }) {
  if (type === 'email') return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (type === 'password') return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

export function AuthInput({ id, label, type, value, onChange, onBlur, placeholder, autoComplete, disabled, required, minLength, maxLength, error, hint }: AuthInputProps) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';

  return <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-blue-950">{label}</label>
    <div className="group relative">
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600">
        <span className="h-5 w-5"><FieldIcon type={type} /></span>
      </span>
      <input
        id={id}
        type={password && visible ? 'text' : type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`h-12 w-full rounded-xl border bg-white pl-11 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${password ? 'pr-14' : 'pr-4'} ${error ? 'border-red-400' : 'border-blue-200'}`}
      />
      {password && <button
        type="button"
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-1 right-1 flex w-11 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {visible ? <><path d="M3 3l18 18" /><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c5 0 9 4 10 7a12.8 12.8 0 0 1-3.3 4.2M6.1 6.1C4.2 7.5 2.8 9.6 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.8" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
        </svg>
      </button>}
    </div>
    {error ? <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-700">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
  </div>;
}
