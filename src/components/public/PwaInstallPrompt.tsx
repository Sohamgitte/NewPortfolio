import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user previously dismissed prompt
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show native browser install prompt
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User installed SohamLabs PWA');
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-fade-in">
      <div className="p-4 rounded-2xl bg-white/95 border border-neutral-200/90 backdrop-blur-xl shadow-2xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-neutral-900 font-heading">SohamLabs Admin</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono font-semibold">PWA</span>
          </div>
          <p className="text-xs text-neutral-600 leading-normal mb-3 font-sans">
            Install on your phone home screen for standalone mobile CMS editing & camera uploads.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-semibold border border-neutral-200"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-neutral-700 p-1"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
