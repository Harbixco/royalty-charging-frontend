import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, LogIn, ShieldCheck, Zap } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/layout/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your admin username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(username.trim(), password);
      toast.success(`Welcome back, ${user.name || user.username}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-core-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-spark-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-core-600/15 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl bg-core-900/80 p-3 border border-white/10 shadow-2xl backdrop-blur-md">
            <Logo />
          </div>
        </div>

        <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Admin Portal
        </h2>
        <p className="mt-1.5 text-center text-sm text-core-400">
          Sign in to manage gadget charging records and rates
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-white/10 bg-core-900/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300 animate-shake">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-core-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-core-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. admin"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-core-500 focus:border-spark-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-spark-400/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-core-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-core-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-core-500 focus:border-spark-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-spark-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-core-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={submitting}
              icon={LogIn}
              className="w-full font-bold shadow-lg shadow-spark-500/20"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Security / Manual Credential notice */}
          <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-2 text-xs text-core-400">
            <ShieldCheck size={16} className="text-spark-400 shrink-0" />
            <span>
              Manual login enabled. Set custom credentials in <code className="text-core-300 font-mono">server/.env</code>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
