import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { dashboardPath } from "../../common/constants/routes";
import { authApi } from "../../utils/api";
import { AuthShell } from "../components/AuthShell";
import { ButtonSpinner } from "../../common/components/ButtonSpinner";

export function RegisterPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const nameError = touched.name && name.trim().length < 2 ? 'Enter at least 2 characters.' : '';
  const emailError = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email address.' : '';
  const passwordError = touched.password && password.length < 8 ? 'Use at least 8 characters.' : '';
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await authApi.register(name, email, password);
      signIn(result);
      navigate(dashboardPath(result.user.role), { replace: true });
    } catch (cause) {
      setError((cause as Error).message.toLowerCase().includes('already') ? 'An account with this email already exists.' : 'Unable to create your account. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Create your account" description="Create an employee account to submit and track service requests.">
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">
            Name
            <input
              className="field mt-1"
              minLength={2}
              maxLength={80}
              required
              placeholder="Your full name"
              autoComplete="name"
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {nameError && <span className="mt-1 block text-xs text-red-700">{nameError}</span>}
          </label>
          <label className="block text-sm font-medium">
            Email
            <input
              className="field mt-1"
              type="email"
              placeholder="you@company.com"
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {emailError && <span className="mt-1 block text-xs text-red-700">{emailError}</span>}
          </label>
          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                className="field mt-1 !pr-16"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 hover:text-blue-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-xs text-red-700">{passwordError}</p>}
          </div>
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
        <p className="mt-6 text-center text-sm text-slate-600">
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
