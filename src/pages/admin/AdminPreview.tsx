import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw, ExternalLink } from 'lucide-react';

export const AdminPreview: React.FC = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [iframeKey, setIframeKey] = useState(0);

  const getFrameWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px] h-[780px] rounded-[40px] border-[10px] border-neutral-900 shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] h-[850px] rounded-[24px] border-[10px] border-neutral-900 shadow-2xl';
      case 'desktop':
        return 'w-full h-[850px] rounded-2xl border border-neutral-300 shadow-xl';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Live Portfolio Preview</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Real-time viewport preview of the public site displaying your latest CMS publications.
          </p>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200 shadow-xs">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                device === 'mobile' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Mobile Device"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                device === 'tablet' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Tablet Device"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>

            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                device === 'desktop' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs"
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs"
            title="Open in Full Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center p-4 sm:p-8 bg-neutral-100/70 rounded-3xl border border-neutral-200 overflow-hidden min-h-[820px]">
        <div className={`w-full transition-all duration-300 relative bg-white overflow-hidden ${getFrameWidth()}`}>
          <iframe
            key={iframeKey}
            src="/"
            title="Live Site Preview"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
