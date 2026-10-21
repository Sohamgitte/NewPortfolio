import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle, KeyRound, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login, resetPassword, isConfigured, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetSent(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSent(false);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Background architectural dot pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-neutral-900 items-center justify-center mb-4 shadow-md text-white">
            <span className="font-mono font-bold text-xl">SG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-heading">
            SohamLabs <span className="underline decoration-neutral-300 underline-offset-6">Admin</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans font-medium">
            Personal Portfolio CMS & Content Management System
          </p>
        </div>

        {/* Credentials Notice Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-neutral-200/90 text-xs text-neutral-700 leading-relaxed shadow-sm">
          <div className="flex items-center gap-2 text-neutral-900 font-bold mb-1 font-sans">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Admin Authentication</span>
          </div>
          <p className="text-neutral-500 text-[11px] mb-2 font-sans">
            Authorized administrator credentials for CMS access:
          </p>
          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-[11px] flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Email:</span>
              <span className="text-neutral-900 font-bold select-all"></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Password:</span>
              <span className="text-neutral-900 font-bold select-all"></span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-xl">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs mb-6 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sohamgitte125@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50/80 border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 font-sans">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 font-sans font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50/80 border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm font-sans"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
            <a
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-900 font-sans font-medium transition-colors"
            >
              &larr; Back to Public Portfolio
            </a>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 font-bold font-heading">
              <KeyRound className="w-5 h-5 text-neutral-900" />
              <span>Reset Admin Password</span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Enter your registered administrator email to receive a password recovery link.
            </p>

            {resetSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                Password recovery instructions dispatched! Check your email inbox.
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="sohamgitte125@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-sans font-semibold hover:bg-neutral-800 shadow-sm"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
