import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthenticate?: (email: string, name?: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthenticate
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      if (onAuthenticate) {
        onAuthenticate(email || 'batman@gotham.com', name || 'Bruce Wayne');
      }
      setIsSubmitted(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="bg-[#0D0E12] border border-[#1F2028] rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#7F72FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800/50 transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Logo */}
          <div className="mb-6 flex items-center gap-2">
            <span className="font-sans font-semibold text-lg text-[#F5F5F3] tracking-wider lowercase">
              plot
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#7F72FF] bg-[#7F72FF]/10 px-2 py-0.5 rounded-full border border-[#7F72FF]/20">
              Account
            </span>
          </div>

          {/* Title & Mode toggle */}
          <div className="mb-6 space-y-1.5 text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-light italic text-[#F5F5F3]">
              {mode === 'login' ? 'Welcome back to plot' : 'Create your plot'}
            </h2>
            <p className="text-xs text-[#A7A7A2] leading-relaxed">
              {mode === 'login'
                ? 'Sign in to sync your movie shelf across all your devices.'
                : 'Start building your personal cinema sanctuary in seconds.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7F72FF]" />
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bruce Wayne"
                  className="w-full bg-[#14151B] border border-[#262833] focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7F72FF]" />
                <span>Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="batman@gotham.com"
                className="w-full bg-[#14151B] border border-[#262833] focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#7F72FF]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#14151B] border border-[#262833] focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full py-3 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#7F72FF]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitted ? (
                <span>Entering plot...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Welcome back to plot' : 'Create your plot'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode Footer */}
          <div className="mt-6 pt-4 border-t border-[#1F2028] text-center text-xs text-zinc-400">
            {mode === 'login' ? (
              <p>
                Don&apos;t have a plot yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#7F72FF] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Create your plot
                </button>
              </p>
            ) : (
              <p>
                Already have a plot?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#7F72FF] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Welcome back to plot
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
