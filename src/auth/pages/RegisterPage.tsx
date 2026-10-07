import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { dashboardPath } from "../../common/constants/routes";
import { authApi } from "../../utils/api";
import { AuthShell } from "../components/AuthShell";
import { ButtonSpinner } from "../../common/components/ButtonSpinner";
import { AuthInput } from "../components/AuthInput";
import { isValidEmail } from "../authValidation";

export function RegisterPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const nameError = touched.name && name.trim().length < 2 ? 'Enter at least 2 characters.' : '';
  const emailError = touched.email && !isValidEmail(email) ? 'Enter a valid email address.' : '';
  const passwordError = touched.password && password.length < 8 ? 'Use at least 8 characters.' : '';
  const confirmPasswordError = touched.confirmPassword
    ? !confirmPassword ? 'Confirm your password.' : confirmPassword !== password ? 'Passwords do not match.' : ''
    : '';
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    if (name.trim().length < 2 || !isValidEmail(email) || password.length < 8 || password.length > 128 || confirmPassword !== password) {
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      if (confirmPassword !== password) document.getElementById('register-confirm-password')?.focus();
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      const result = await authApi.register(name, email, password);
      signIn(result);
      navigate(dashboardPath(result.user.role), { replace: true });
    } catch (cause) {
      setError((cause as Error).message.toLowerCase().includes('already') ? 'An account with this email already exists.' : 'Unable to create your account. Please try again.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Create your account" description="Create an employee account to submit and track service requests." compact>
        <form onSubmit={submit} className="space-y-4">
          <AuthInput id="register-name" label="Name" type="text" value={name} onChange={setName} onBlur={() => setTouched((current) => ({ ...current, name: true }))} placeholder="Your full name" autoComplete="name" minLength={2} maxLength={80} required disabled={saving} error={nameError} />
          <AuthInput id="register-email" label="Email" type="email" value={email} onChange={setEmail} onBlur={() => setTouched((current) => ({ ...current, email: true }))} placeholder="you@company.com" autoComplete="email" maxLength={254} required disabled={saving} error={emailError} />
          <AuthInput id="register-password" label="Password" type="password" value={password} onChange={setPassword} onBlur={() => setTouched((current) => ({ ...current, password: true }))} placeholder="Create a password" autoComplete="new-password" minLength={8} maxLength={128} required disabled={saving} error={passwordError}/>
          <AuthInput id="register-confirm-password" label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))} placeholder="Re-enter your password" autoComplete="new-password" required disabled={saving} error={confirmPasswordError} />
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button className="button w-full" disabled={saving}>
            {saving && <ButtonSpinner />}
            {saving ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-semibold text-blue-700 hover:underline"
            to="/login"
          >
            Sign in
          </Link>
        </p>
    </AuthShell>
  );
}
