import React from 'react';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
        <span className="font-mono font-bold text-2xl text-neutral-900">404</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-2 font-heading">
        Page Not Found
      </h1>

      <p className="text-sm text-neutral-600 max-w-md mb-8 font-sans">
        The route you are trying to access does not exist on Soham's portfolio or has been moved.
      </p>

      <a
        href="/"
        className="px-6 py-3.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2 shadow-sm font-sans"
      >
        <Home className="w-4 h-4" />
        <span>Return to Portfolio</span>
      </a>
    </div>
  );
};
