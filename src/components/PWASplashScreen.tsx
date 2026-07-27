import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlotLogo } from './PlotLogo';
import { Sparkles, Film } from 'lucide-react';

interface PWASplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const PWASplashScreen: React.FC<PWASplashScreenProps> = ({
  onComplete,
  minDurationMs = 1100,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0A0F1E] flex flex-col items-center justify-between p-8 select-none text-center pt-safe pb-safe"
        >
          {/* Top subtle badge */}
          <div className="pt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-mono tracking-widest text-[#7C8CFF]">
              <Sparkles className="w-3 h-3 text-[#7C8CFF]" />
              <span>Native Experience</span>
            </span>
          </div>

          {/* Center Brand Identity */}
          <div className="flex flex-col items-center space-y-5">
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="absolute -inset-6 bg-[#7C8CFF]/25 rounded-full blur-2xl animate-pulse" />
              <PlotLogo variant="icon" size="xl" animate="breath" />
            </motion.div>

            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-4xl font-display font-light italic text-[#F8FAFF] tracking-tight">
                plot
              </h1>
              <p className="text-xs font-sans text-[#A8B3CF] tracking-wide">
                Less deciding. More watching.
              </p>
            </motion.div>
          </div>

          {/* Bottom Loading Progress Indicator */}
          <div className="w-full max-w-xs space-y-3 pb-6">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: minDurationMs / 1000, ease: 'easeInOut' }}
                className="h-full w-full bg-gradient-to-r from-[#7C8CFF] to-[#97A5FF] rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3 text-[#7C8CFF]" />
                <span>Cinematic Engine</span>
              </span>
              <span>Ready</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
