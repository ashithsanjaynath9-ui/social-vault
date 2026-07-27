import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setReconnected(true);
      const timer = setTimeout(() => setReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-status-bar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-safe left-0 right-0 z-[9000] px-4 pt-2 pointer-events-none flex justify-center"
        >
          <div className="bg-[#12192B]/95 border border-amber-500/30 text-amber-200 px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-sans pointer-events-auto">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-medium">You are offline</span>
            <span className="text-zinc-400 text-[11px] border-l border-white/10 pl-2">
              Viewing cached plot watchlist
            </span>
          </div>
        </motion.div>
      )}

      {reconnected && (
        <motion.div
          key="online-status-bar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-safe left-0 right-0 z-[9000] px-4 pt-2 pointer-events-none flex justify-center"
        >
          <div className="bg-[#12192B]/95 border border-emerald-500/30 text-emerald-200 px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-sans pointer-events-auto">
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">Connection Restored</span>
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin ml-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
