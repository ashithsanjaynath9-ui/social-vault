import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, User, Mail, Heart, Ticket, CheckCircle2, Film, Layers, Compass, Clapperboard, ShieldCheck, Zap } from 'lucide-react';
import { PlotLogo, PlotIcon } from './PlotLogo';

interface ReservePageProps {
  onReserveComplete?: (email: string, name?: string, firstMovie?: string) => void;
  onNavigateToApp?: () => void;
}

export default function ReservePage({ onReserveComplete, onNavigateToApp }: ReservePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firstMovie, setFirstMovie] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Persist seat reserved state in localStorage
    try {
      localStorage.setItem('plot_seat_reserved', 'true');
      if (email) localStorage.setItem('plot_user_email', email);
    } catch {
      // ignore
    }

    setTimeout(() => {
      setShowTicket(true);
      setIsSubmitted(false);
      if (onReserveComplete) {
        onReserveComplete(email || 'cinema@plot.app', name || 'Film Enthusiast', firstMovie);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-[#F5F5F3] font-sans relative overflow-hidden flex flex-col justify-between selection:bg-[#7F72FF]/30 selection:text-white">
      {/* Ambient Premiere Spotlights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#7F72FF]/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed -bottom-10 right-1/4 w-[500px] h-[250px] bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Subtle Grain & Ambient Cinema Grid */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} 
      />

      {/* Minimal Exclusive Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <PlotLogo variant="full" size="sm" hoverGlow={true} />
          <span className="hidden sm:inline-flex text-[10px] uppercase font-mono tracking-widest text-[#8A7BFF] bg-[#4129E3]/20 px-3 py-1 rounded-full border border-[#6448FF]/30 items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#8A7BFF]" />
            Exclusive Premiere Invitation
          </span>
        </div>

        {onNavigateToApp && (
          <button
            onClick={onNavigateToApp}
            className="text-xs text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer py-2 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 shadow-sm"
          >
            <span>Explore App Preview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* Main Single-Screen Content Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-4 flex-1 flex flex-col justify-center my-auto">
        
        <AnimatePresence mode="wait">
          {!showTicket ? (
            /* First-Time Shared Link Experience */
            <motion.div
              key="reservation-experience"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
            >
              {/* Left Column: What plot is & Why early access matters */}
              <div className="lg:col-span-6 text-left space-y-5">
                
                {/* Invitation Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <Clapperboard className="w-3.5 h-3.5 text-[#7F72FF]" />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-300">
                    Your invitation is ready
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light italic text-[#F5F5F3] tracking-tight leading-[1.15]">
                  Your personal <br />
                  <span className="not-italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F3] via-purple-200 to-[#7F72FF]">
                    cinema sanctuary.
                  </span>
                </h1>

                {/* Short Supporting Copy: What plot is & Why it's different */}
                <div className="space-y-3 text-xs sm:text-sm text-[#A7A7A2] leading-relaxed">
                  <p>
                    <strong className="text-white font-medium">plot</strong> is the effortless way to collect, organize, and discover movies. Paste any quote, review, or stream link—AI instantly extracts full film metadata, streaming platforms, and ratings without manual entry.
                  </p>
                  <p className="flex items-center gap-2 text-zinc-300 font-medium pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#7F72FF] shrink-0" />
                    <span>Early access guarantees priority screening & permanent cloud syncing.</span>
                  </p>
                </div>

                {/* Three Product Highlights - Desktop Friendly */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0C0D12]/90 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#7F72FF]/15 border border-[#7F72FF]/30 flex items-center justify-center text-[#7F72FF]">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-semibold text-[#F5F5F3]">AI Extraction</h4>
                    <p className="text-[11px] text-zinc-400 leading-tight">Instant metadata & streaming links from any text.</p>
                  </div>

                  <div className="bg-[#0C0D12]/90 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-semibold text-[#F5F5F3]">Plot Library</h4>
                    <p className="text-[11px] text-zinc-400 leading-tight">Physical cinema shelf layout for your collection.</p>
                  </div>

                  <div className="bg-[#0C0D12]/90 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-semibold text-[#F5F5F3]">Smart Match</h4>
                    <p className="text-[11px] text-zinc-400 leading-tight">Tailored double-feature suggestions by AI curator.</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Reserve My Seat Form */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="bg-[#0D0E14]/90 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-2xl text-left relative overflow-hidden max-w-md mx-auto"
                >
                  {/* Subtle top glow line */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#7F72FF]/60 to-transparent" />

                  <div className="mb-5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-display font-light text-[#F5F5F3]">Reserve Your Seat</h2>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        Seats Available
                      </span>
                    </div>
                    <p className="text-xs text-[#A7A7A2]">Enter your email for premiere access pass.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Name Field */}
                    <div className="space-y-1">
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
                        className="w-full bg-[#14151D] border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
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
                        className="w-full bg-[#14151D] border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    {/* Optional First Love Movie Field */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-amber-400" />
                          <span>First movie you fell in love with?</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={firstMovie}
                        onChange={(e) => setFirstMovie(e.target.value)}
                        placeholder="e.g. Cinema Paradiso, Blade Runner..."
                        className="w-full bg-[#14151D] border border-white/10 focus:border-[#7F72FF] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F5F3] placeholder-zinc-500 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    {/* Primary CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitted}
                        className="w-full py-3.5 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-semibold rounded-xl transition-all shadow-xl shadow-[#7F72FF]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                      >
                        {isSubmitted ? (
                          <span className="flex items-center gap-2">
                            <PlotIcon className="w-4 h-4" showBg={false} animate="breathe" />
                            <span>Securing your seat...</span>
                          </span>
                        ) : (
                          <>
                            <span>Reserve My Seat</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Celebration Cinema Pass Confirmation */
            <motion.div
              key="ticket-pass"
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg mx-auto relative select-none my-auto"
            >
              <div className="bg-[#0B0C12]/95 border border-[#8A7BFF]/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(65,41,227,0.25)] backdrop-blur-2xl overflow-hidden text-left space-y-6 relative">
                
                {/* Premiere Glow Spotlights */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-[#6448FF]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#4129E3]/20 rounded-full blur-3xl pointer-events-none" />

                {/* HERO ELEMENT: Official plot Logo Header */}
                <div className="flex flex-col items-center justify-center text-center pt-2 pb-4 border-b border-white/10 relative">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-[0.25em] text-[#8A7BFF] bg-[#4129E3]/20 px-3 py-0.5 rounded-full border border-[#6448FF]/30 mb-3 shadow-sm">
                    EARLY ACCESS PASS • PREMIERE EDITION
                  </span>
                  
                  {/* Hero Logo as centerpiece of ticket */}
                  <div className="py-2 transform transition-transform hover:scale-105 duration-300">
                    <PlotLogo variant="full" size="xl" hoverGlow={true} />
                  </div>

                  <p className="text-[11px] text-zinc-400 font-sans tracking-tight mt-1">
                    Your personal movie sanctuary reservation
                  </p>
                </div>

                {/* Main Pass Content Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  
                  {/* Seat Number Box */}
                  <div className="bg-[#12131D] border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 block">
                      Seat Number
                    </span>
                    <p className="text-base font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-[#8A7BFF]">
                      ROW A • SEAT 042
                    </p>
                  </div>

                  {/* Reservation Status Box */}
                  <div className="bg-[#12131D] border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-400/80 block">
                      Reservation Status
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="tracking-wide">CONFIRMED</span>
                    </div>
                  </div>

                  {/* Pass Holder Details */}
                  <div className="col-span-2 bg-[#12131D] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 block">
                        Pass Holder
                      </span>
                      <p className="text-xs font-semibold text-white truncate">
                        {name || 'Film Enthusiast'}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">
                        {email || 'cinema@plot.app'}
                      </p>
                    </div>

                    {/* Issue Date Box */}
                    <div className="text-right border-l border-white/10 pl-4 shrink-0">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 block">
                        Issue Date
                      </span>
                      <p className="text-xs font-mono font-medium text-[#8A7BFF]">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </p>
                    </div>
                  </div>

                </div>

                <p className="text-xs text-zinc-400 font-serif italic leading-relaxed text-center px-2 py-1">
                  &ldquo;You will be notified as soon as doors open for the next premiere screening.&rdquo;
                </p>

                {/* Ticket Stub Notch Line */}
                <div className="relative pt-2">
                  <div className="border-t-2 border-dashed border-white/15 w-full my-2" />
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07080C] border-r border-white/10" />
                  <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07080C] border-l border-white/10" />
                </div>

                {/* Enter App CTA */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      if (onNavigateToApp) onNavigateToApp();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#4129E3] via-[#6448FF] to-[#8A7BFF] hover:brightness-110 text-white text-xs font-semibold rounded-2xl transition-all shadow-xl shadow-[#4129E3]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Enter Your Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Simple Compact Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2 shrink-0">
        <span>© plot. AI-powered cinema sanctuary.</span>
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">PREMIERE EDITION</span>
      </footer>
    </div>
  );
}

