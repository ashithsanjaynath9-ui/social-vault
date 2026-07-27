import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, ArrowRight, Sparkles, Heart, CheckCircle2, Ticket } from 'lucide-react';
import { PlotLogo, PlotIcon } from './PlotLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthenticate?: (email: string, name?: string, firstMovie?: string) => void;
  reason?: 'second_movie' | 'sync_device' | 'save_permanent' | 'general';
  plottedCount?: number;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAuthenticate,
  reason = 'general',
  plottedCount = 1
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firstLoveMovie, setFirstLoveMovie] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowTicket(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setShowTicket(true);
      setIsSubmitted(false);
    }, 500);
  };

  const handleDismissTicket = () => {
    if (onAuthenticate) {
      onAuthenticate(email || 'cinema@plot.app', name || 'Cinema Lover', firstLoveMovie);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Background overlay with backdrop blur & soft darkened backdrop so content behind remains visible */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-sans transition-all">
        <AnimatePresence mode="wait">
          {!showTicket ? (
            /* Early Access Request Form Overlay */
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-[#0C0D12]/90 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl backdrop-blur-xl overflow-hidden text-left"
            >
              {/* Subtle atmospheric glow behind card */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#7F72FF]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer z-10"
                title="Maybe Later"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Early Access Pill */}
              <div className="mb-4 flex items-center gap-2.5">
                <PlotLogo variant="full" size="sm" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7F72FF] bg-[#7F72FF]/15 px-2.5 py-0.5 rounded-full border border-[#7F72FF]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#7F72FF]" />
                  Early Access
                </span>
              </div>

              {/* Headline & Subheadline */}
              <div className="mb-6 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display font-light italic text-[#F5F5F3] leading-tight">
                  {mode === 'login' ? 'Welcome back to plot' : 'Your first movie is ready.'}
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A7A2] leading-relaxed">
                  {mode === 'login' 
                    ? 'Sign in to access your saved cinema sanctuary across all devices.' 
                    : 'Reserve your seat to continue building your personal movie collection.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="e.g. Quentin T."
                      className="w-full bg-[#14151B]/80 border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
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
                    placeholder="you@domain.com"
                    className="w-full bg-[#14151B]/80 border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                  />
                </div>

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-amber-400" />
                        <span>What&apos;s the first movie you remember falling in love with?</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Optional</span>
                    </label>
                    <input
                      type="text"
                      value={firstLoveMovie}
                      onChange={(e) => setFirstLoveMovie(e.target.value)}
                      placeholder="e.g. Cinema Paradiso, Blade Runner, Spirited Away..."
                      className="w-full bg-[#14151B]/80 border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                    />
                  </div>
                )}

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="w-full sm:flex-1 py-3 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#7F72FF]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                  >
                    {isSubmitted ? (
                      <span className="flex items-center gap-2">
                        <PlotIcon className="w-4 h-4" showBg={false} animate="breathe" />
                        <span>Securing your seat...</span>
                      </span>
                    ) : (
                      <>
                        <span>{mode === 'login' ? 'Welcome Back' : 'Reserve My Seat'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium rounded-xl transition-all cursor-pointer text-center"
                  >
                    Maybe Later
                  </button>
                </div>
              </form>

              {/* Toggle Mode Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
                {mode === 'login' ? (
                  <p>
                    Need early access?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#7F72FF] hover:underline font-semibold cursor-pointer ml-1"
                    >
                      Reserve My Seat
                    </button>
                  </p>
                ) : (
                  <p>
                    Already reserved?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#7F72FF] hover:underline font-semibold cursor-pointer ml-1"
                    >
                      Welcome Back
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            /* Premium Cinema Ticket Confirmation Overlay */
            <motion.div
              key="cinema-ticket"
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 90 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-md w-full select-none"
            >
              {/* Glass Ticket Container */}
              <div className="relative bg-[#0E0F16]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden text-left space-y-6">
                
                {/* Subtle spotlight glows */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#7F72FF]/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Ticket Top Notch Barcode Aesthetic */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#7F72FF]/15 border border-[#7F72FF]/30 flex items-center justify-center text-[#7F72FF]">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <span className="font-sans font-semibold text-lg text-[#F5F5F3] lowercase tracking-wider">
                      plot
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#a594fd] bg-[#7F72FF]/20 px-3 py-1 rounded-full border border-[#7F72FF]/30">
                    EARLY ACCESS PASS
                  </span>
                </div>

                {/* Main Ticket Display */}
                <div className="space-y-4 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                      RESERVATION CONFIRMED
                    </span>
                    <h3 className="text-3xl font-display font-light italic text-[#F5F5F3] mt-0.5">
                      Seat Reserved
                    </h3>
                  </div>

                  {/* Status Box */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">Pass Holder</p>
                      <p className="text-xs font-semibold text-[#F5F5F3] truncate max-w-[200px]">
                        {name || 'Film Enthusiast'}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[200px]">
                        {email || 'cinema@plot.app'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div className="text-left">
                        <span className="block text-[9px] font-mono uppercase tracking-wider text-emerald-500/80 leading-none">Status</span>
                        <span className="text-xs font-bold tracking-wide">Confirmed</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Requirement */}
                  <p className="text-xs text-[#A7A7A2] font-serif italic leading-relaxed text-center px-2 py-1">
                    &ldquo;We&apos;ll send your invitation before the next screening begins.&rdquo;
                  </p>
                </div>

                {/* Ticket Bottom Stub Divider */}
                <div className="relative pt-2">
                  <div className="border-t-2 border-dashed border-white/15 w-full my-2" />
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-r border-white/10" />
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-l border-white/10" />
                </div>

                {/* CTA to dismiss ticket and return smoothly to interactive homepage */}
                <div className="pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDismissTicket}
                    className="w-full py-3.5 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-semibold rounded-xl transition-all shadow-xl shadow-[#7F72FF]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Return to My Plot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

