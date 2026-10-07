import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { dashboardPath } from "../../common/constants/routes";
import { authApi } from "../../utils/api";
import { AuthShell } from "../components/AuthShell";
import { ButtonSpinner } from "../../common/components/ButtonSpinner";

export function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await authApi.login(email, password);
      signIn(result);
      navigate(dashboardPath(result.user.role), { replace: true });
    } catch (cause) {
      setError(/credential|invalid email or password/i.test((cause as Error).message) ? 'Incorrect email or password.' : 'Unable to sign in. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Welcome back" description="Sign in to manage and track your service requests.">
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              className="field mt-1"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              disabled={saving}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                className="field mt-1 !pr-16"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={saving}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 hover:text-blue-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={saving}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
