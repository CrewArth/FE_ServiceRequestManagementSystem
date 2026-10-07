import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { dashboardPath } from '../../common/constants/routes';
import { authApi } from '../../utils/api';

export function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const result = await authApi.login(email, password);
      signIn(result); navigate(dashboardPath(result.user.role), { replace: true });
    } catch (cause) { setError((cause as Error).message); }
    finally { setSaving(false); }
  }

  return <main className="flex min-h-screen items-center justify-center px-4 py-12">
    <div className="w-full max-w-md rounded-md border border-blue-100 bg-white p-8 shadow-sm">
      <h1 className="text-center text-2xl font-extrabold text-blue-950">Sign in</h1>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-medium">Email<input className="field mt-1" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium">Password</label>
          <div className="relative">
            <input id="login-password" className="field mt-1 pr-16" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 hover:text-blue-900" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </div>
        {error && <p role="alert" className="rounded-lg bg-blue-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="button w-full" disabled={saving}>{saving ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">Employee without an account? <Link className="font-semibold text-blue-700 hover:underline" to="/register">Sign up</Link></p>
    </div>
  </main>;
}
