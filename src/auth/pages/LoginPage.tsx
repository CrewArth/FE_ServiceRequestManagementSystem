import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { dashboardPath } from "../../common/constants/routes";
import { authApi } from "../../utils/api";
import { AuthShell } from "../components/AuthShell";
import { ButtonSpinner } from "../../common/components/ButtonSpinner";
import { AuthInput } from "../components/AuthInput";
import { isValidEmail } from "../authValidation";

export function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const emailError = touched.email && !isValidEmail(email) ? 'Enter a valid email address.' : '';
  const passwordError = touched.password && !password ? 'Enter your password.' : '';
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    try {
      const result = await authApi.login(email, password);
      signIn(result);
      navigate(dashboardPath(result.user.role), { replace: true });
    } catch (cause) {
      toast.error(
        /credential|invalid email or password/i.test((cause as Error).message)
          ? 'Incorrect email or password.'
          : 'Unable to sign in. Please try again.',
        { autoClose: 5000, toastId: 'login-error' },
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Welcome back" description="Sign in to manage and track your service requests.">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput id="login-email" label="Email" type="email" value={email} onChange={setEmail} onBlur={() => setTouched((current) => ({ ...current, email: true }))} placeholder="you@company.com" autoComplete="email" required disabled={saving} error={emailError} />
          <AuthInput id="login-password" label="Password" type="password" value={password} onChange={setPassword} onBlur={() => setTouched((current) => ({ ...current, password: true }))} placeholder="Enter your password" autoComplete="current-password" required disabled={saving} error={passwordError} />
          <button className="button w-full" disabled={saving}>
            {saving && <ButtonSpinner />}
            {saving ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            className="font-semibold text-blue-700 hover:underline"
            to="/register"
          >
            Sign up
          </Link>
        </p>
    </AuthShell>
  );
}
