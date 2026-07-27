import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlotLogo } from './PlotLogo';
import { Share, PlusSquare, Download, X, Check, Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import { isIOSDevice, isStandaloneMode } from '../pwaRegister';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ forceOpen = false, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = isStandaloneMode();
    setIsStandalone(standalone);
    setIsIOS(isIOSDevice());

    // If already in standalone mode, don't show prompt unless explicitly requested
    if (standalone && !forceOpen) {
      return;
    }

    const dismissed = localStorage.getItem('plot_pwa_dismissed');
    if (dismissed && !forceOpen) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed || forceOpen) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not standalone, trigger after a short delay
    if (isIOSDevice() && !standalone && (!dismissed || forceOpen)) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [forceOpen]);

  useEffect(() => {
    if (forceOpen) {
      setShowPrompt(true);
    }
  }, [forceOpen]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setTimeout(() => {
          setShowPrompt(false);
          onClose?.();
        }, 2000);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('plot_pwa_dismissed', 'true');
    setShowPrompt(false);
    onClose?.();
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9500] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans select-none pb-safe">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-[#0A0F1E] border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden text-left"
        >
          {/* iOS Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-4 sm:hidden shrink-0" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer z-10"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ambient Spotlight */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#7C8CFF]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand & Badge */}
          <div className="flex items-center gap-3 mb-4">
            <PlotLogo variant="icon" size="md" />
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7C8CFF]/15 border border-[#7C8CFF]/30 text-[10px] uppercase font-mono tracking-wider text-[#7C8CFF] font-semibold">
                <Sparkles className="w-3 h-3 text-[#7C8CFF]" />
                Progressive Web App
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-light italic text-[#F8FAFF] mt-1">
                Install plot on your Home Screen
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A8B3CF] leading-relaxed mb-6">
            Enjoy a full-screen, ultra-fast native app experience with offline watchlist access and 1-tap extraction.
          </p>

          {/* iOS Instructions or 1-Tap Android Install */}
          {isIOS ? (
            <div className="space-y-3 bg-[#12192B] border border-white/10 rounded-2xl p-4 mb-6 text-xs text-[#F8FAFF]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Step 1: Tap Share</p>
                  <p className="text-zinc-400 text-[11px]">
                    Tap the Share icon at the bottom of your Safari toolbar
                  </p>
                </div>
              </div>

              <div className="border-t border-white/5 my-2" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#7C8CFF]/15 border border-[#7C8CFF]/30 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4 text-[#7C8CFF]" />
                </div>
                <div>
                  <p className="font-semibold text-white">Step 2: Add to Home Screen</p>
                  <p className="text-zinc-400 text-[11px]">
                    Scroll down in the share sheet and select &apos;Add to Home Screen&apos;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            deferredPrompt && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleInstallClick}
                disabled={installed}
                className="w-full mb-4 py-3.5 bg-[#7C8CFF] hover:bg-[#97A5FF] text-[#0A0F1E] font-bold text-sm rounded-2xl shadow-lg shadow-[#7C8CFF]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {installed ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>App Installed!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Install plot App Now</span>
                  </>
                )}
              </motion.button>
            )
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <Smartphone className="w-3.5 h-3.5 text-[#7C8CFF]" />
              Standalone Ready
            </span>
            <button
              onClick={handleDismiss}
              className="text-zinc-400 hover:text-white font-medium cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
