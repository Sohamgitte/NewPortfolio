import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, LogOut, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4 shadow-sm text-white">
          <span className="font-mono font-bold text-sm">SG</span>
        </div>
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-neutral-500">Verifying Admin Privileges...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated, but NOT authorized
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-red-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2 font-heading">Access Denied: Not Authorized</h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              User account (<span className="text-neutral-900 font-mono font-bold">{user.email}</span>) does not have administrator privileges in the database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left font-mono text-xs text-neutral-700 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-900 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Bootstrap Instructions:</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Run <code className="text-neutral-900 font-bold">admin_bootstrap.sql</code> in your Supabase SQL Editor with your User UID:
            </p>
            <div className="p-2 rounded bg-white border border-neutral-200 text-[10px] text-neutral-800 break-all select-all font-mono">
              {user.id}
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border border-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors font-sans"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Current Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
