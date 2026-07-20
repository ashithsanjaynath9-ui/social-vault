/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Share2, 
  ArrowRight, 
  ChevronRight, 
  Film, 
  Sparkles, 
  MessageSquare, 
  Camera, 
  FileText, 
  Search, 
  Tv, 
  Check, 
  Layers, 
  Inbox, 
  Smartphone,
  Play,
  RotateCcw,
  Bookmark
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Screen 1: Sub-phases for the automatic storytelling sequence
  // 'scrolling' -> 'filling' -> 'blackout' -> 'you-saved-it' -> 'the-question'
  const [screen1Phase, setScreen1Phase] = useState<'scrolling' | 'filling' | 'blackout' | 'saved-text' | 'question'>('scrolling');
  const [savedCount, setSavedCount] = useState(0);

  // Screen 1: Auto-advance the story phases to match a pristine theatrical flow
  useEffect(() => {
    if (currentStep !== 0) return;

    // Reset state when entering screen 1
    setScreen1Phase('scrolling');
    setSavedCount(0);

    // Timeline sequence
    const interval = setInterval(() => {
      setSavedCount(prev => {
        if (prev < 8) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 600);

    const t1 = setTimeout(() => {
      setScreen1Phase('filling');
    }, 4200);

    const t2 = setTimeout(() => {
      setScreen1Phase('blackout');
    }, 7200);

    const t3 = setTimeout(() => {
      setScreen1Phase('saved-text');
    }, 9000);

    const t4 = setTimeout(() => {
      setScreen1Phase('question');
    }, 11500);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentStep]);

  // Screen 2: Phase for collapse animation
  // 'scattered' -> 'collapsing' -> 'merged'
  const [screen2Phase, setScreen2Phase] = useState<'scattered' | 'collapsing' | 'merged'>('scattered');

  useEffect(() => {
    if (currentStep !== 1) {
      setScreen2Phase('scattered');
      return;
    }

    // Auto trigger the collapse after a short dramatic pause
    const t1 = setTimeout(() => {
      setScreen2Phase('collapsing');
    }, 1800);

    const t2 = setTimeout(() => {
      setScreen2Phase('merged');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentStep]);

  // Screen 3: Auto-trigger film waterfall
  const [showPosters, setShowPosters] = useState(false);
  useEffect(() => {
    if (currentStep !== 2) {
      setShowPosters(false);
      return;
    }
    const t1 = setTimeout(() => {
      setShowPosters(true);
    }, 800);
    return () => clearTimeout(t1);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Movie posters for Step 3 waterfall
  const demoPosters = [
    { title: 'Inception', year: '2010', vibe: 'Mind-bending', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80' },
    { title: 'Interstellar', year: '2014', vibe: 'Cosmic Journey', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80' },
    { title: 'Dune: Part Two', year: '2024', vibe: 'Desert Epic', img: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=300&q=80' },
    { title: 'Blade Runner 2049', year: '2017', vibe: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=300&q=80' },
    { title: 'Coherence', year: '2013', vibe: 'Cosmic Puzzle', img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=300&q=80' },
    { title: 'Arrival', year: '2016', vibe: 'First Contact', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#120716] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none font-sans text-white">
      
      {/* Cinematic ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#B39CD0]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B39CD0]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Elegant Header */}
      <header className="flex items-center justify-between relative z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-[#B39CD0]" />
          </div>
          <span className="text-xs font-display italic tracking-widest text-zinc-300">CineSave</span>
        </div>

        <button 
          onClick={onComplete}
          className="text-[10px] font-sans font-medium tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors uppercase cursor-pointer"
        >
          Skip Intro
        </button>
      </header>

      {/* Main Interactive Screen Content */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full relative z-20 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* ========================================================
              SCREEN 1: THE DISCOVERY AMNESIA
              ======================================================== */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              {/* Left Side: Smooth Infinite Reel List Mockup */}
              <div className="flex justify-center select-none">
                <div className="w-64 aspect-[9/16] bg-[#1d0e22] border border-zinc-850/80 rounded-[40px] p-4 flex flex-col relative overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] animate-fade-in">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-900/80 mb-2">
                    <Instagram className="w-4 h-4 text-zinc-500" />
                    <div className="w-20 h-1.5 rounded bg-zinc-850" />
                    <div className="w-4 h-4 rounded-full bg-zinc-850" />
                  </div>

                  {/* Scrolling Stack */}
                  <div className="flex-1 flex flex-col gap-4 relative overflow-hidden">
                    <motion.div 
                      animate={{ y: [0, -260, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 12, 
                        ease: "linear" 
                      }}
                      className="space-y-4"
                    >
                      {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="bg-[#26142c] border border-zinc-850/60 rounded-2xl p-3 h-28 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="w-24 h-2 bg-zinc-850 rounded" />
                              <div className="w-16 h-1.5 bg-zinc-900 rounded" />
                            </div>
                            <Instagram className="w-3 h-3 text-pink-500/20" />
                          </div>
                          
                          <div className="w-full h-10 rounded bg-[#120716] flex items-center justify-center text-[9px] font-sans text-zinc-500">
                            Saved Movie Recommendation
                          </div>

                          <div className="flex justify-between items-center text-[8px] text-zinc-650">
                            <span>@cinemafan</span>
                            <span className="text-pink-500/40 font-bold">♥ Save</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right Side: Clear Value Proposition and Action */}
              <div className="space-y-6 text-left">
                <div className="space-y-3">
                  <span className="text-[11px] font-sans text-zinc-500 uppercase tracking-widest block">The Endless Feed</span>
                  <h1 className="text-4xl sm:text-5xl font-display font-light italic text-zinc-100 leading-tight">
                    But did you <span className="text-[#B39CD0] not-italic font-sans font-semibold">ever</span> watch them?
                  </h1>
                  <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                    We all save reels, screenshots, and texts containing great movie recommendations. But they get lost forever in digital noise and app saves.
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed font-normal">
                    CineSave is a simple, quiet archive to extract, catalog, and finally watch the movies you want to remember.
                  </p>
                </div>

                <div className="pt-4">
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.975 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>What's next?</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCREEN 2: CHAOTIC SPRAWL COLLAPSING
              ======================================================== */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center space-y-12 md:space-y-16"
            >
              {/* Header Headline */}
              <div className="text-center space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase">
                  Scattered Scrapbooks
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-light italic text-zinc-100 tracking-tight leading-[1.1]">
                  A quiet sanctuary <br className="sm:hidden" />
                  <span className="text-[#B39CD0]">for all your lists.</span>
                </h1>
                <p className="text-xs text-zinc-400 font-sans">
                  All your scattered watchlists, notes, and screenshots in one single space.
                </p>
              </div>

              {/* Chaos Collapse Canvas */}
              <div className="relative w-full max-w-lg h-72 flex items-center justify-center border border-zinc-900/60 bg-zinc-950/20 rounded-[32px] overflow-hidden">
                
                {/* Central Cinema Vault container */}
                <motion.div 
                  className={`z-20 w-36 h-36 rounded-3xl bg-zinc-900 border flex flex-col items-center justify-center shadow-2xl relative transition-all duration-700 ${
                    screen2Phase === 'merged' 
                      ? 'border-[#B39CD0] bg-zinc-950 shadow-[0_0_50px_rgba(179,156,208,0.15)] scale-110' 
                      : 'border-zinc-800'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {screen2Phase !== 'merged' ? (
                      <motion.div 
                        key="vault-icon"
                        className="flex flex-col items-center space-y-2"
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <Film className="w-7 h-7 text-zinc-500 animate-pulse" />
                        <span className="text-[10px] font-display italic text-zinc-400">CineSave</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="vault-ready"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center space-y-1.5 text-center p-2"
                      >
                        <Sparkles className="w-8 h-8 text-[#B39CD0] animate-bounce" />
                        <span className="text-[10px] font-sans text-[#B39CD0] font-bold uppercase tracking-widest">Library Ready</span>
                        <span className="text-[8px] font-sans text-zinc-400 leading-none">12 Movies Curated</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Floating Scattered Chaos Cards */}
                <AnimatePresence>
                  {screen2Phase === 'scattered' && (
                    <>
                      {/* Instagram Saves */}
                      <motion.div 
                        initial={{ x: -160, y: -60, opacity: 0 }}
                        animate={{ opacity: 1, x: -140, y: -50 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-pink-400 flex items-center gap-1.5 shadow-lg"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        <span>Instagram Saves</span>
                      </motion.div>

                      {/* WhatsApp messages */}
                      <motion.div 
                        initial={{ x: 160, y: -40, opacity: 0 }}
                        animate={{ opacity: 1, x: 130, y: -30 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.05 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp links</span>
                      </motion.div>

                      {/* Photo Screenshots */}
                      <motion.div 
                        initial={{ x: -120, y: 80, opacity: 0 }}
                        animate={{ opacity: 1, x: -100, y: 70 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-amber-400 flex items-center gap-1.5 shadow-lg"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Screenshots</span>
                      </motion.div>

                      {/* Notes App */}
                      <motion.div 
                        initial={{ x: 120, y: 80, opacity: 0 }}
                        animate={{ opacity: 1, x: 110, y: 65 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.15 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-lg"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Notes lists</span>
                      </motion.div>

                      {/* Netflix Watchlist */}
                      <motion.div 
                        initial={{ x: -30, y: -100, opacity: 0 }}
                        animate={{ opacity: 1, x: -20, y: -90 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-red-400 flex items-center gap-1.5 shadow-lg"
                      >
                        <Tv className="w-3.5 h-3.5 text-red-500" />
                        <span>Netflix Watchlist</span>
                      </motion.div>

                      {/* Google Search Results */}
                      <motion.div 
                        initial={{ x: 100, y: -110, opacity: 0 }}
                        animate={{ opacity: 1, x: 80, y: -95 }}
                        exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.25 }}
                        className="absolute bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-mono text-blue-400 flex items-center gap-1.5 shadow-lg"
                      >
                        <Search className="w-3.5 h-3.5 text-blue-500" />
                        <span>Google Search Tabs</span>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>                {/* Pull gravity rings during collapsing phase */}
                {screen2Phase === 'collapsing' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 0.5, opacity: 1 }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-80 h-80 rounded-full border border-[#B39CD0]/20"
                    />
                    <motion.div 
                      initial={{ scale: 2.2, opacity: 0 }}
                      animate={{ scale: 0.3, opacity: 0.8 }}
                      transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
                      className="w-96 h-96 rounded-full border border-[#B39CD0]/10"
                    />
                  </div>
                )}
              </div>
 
              {/* Next navigation controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02, backgroundColor: "#18181b" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-6 py-3 rounded-xl border border-zinc-800 text-xs font-sans font-bold uppercase tracking-widest cursor-pointer text-zinc-300"
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02, backgroundColor: "#cbb6e5" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-8 py-3.5 rounded-xl bg-[#B39CD0] text-[#120716] text-xs font-sans font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-4 h-4 text-[#120716]" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCREEN 3: THE DEMONSTRATION WATERFALL
              ======================================================== */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center space-y-12"
            >
              {/* Headline */}
              <div className="text-center space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase">
                  Curation without effort
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-light italic text-zinc-100 tracking-tight leading-[1.1]">
                  From a friend's text, <br />
                  <span className="text-[#B39CD0]">straight to your shelf.</span>
                </h1>
                <p className="text-xs text-zinc-400 font-sans">
                  Instantly capture descriptions, years, and directors.
                </p>
              </div>

              {/* Visual Pipeline Block */}
              <div className="w-full max-w-2xl bg-zinc-950/40 border border-zinc-900 rounded-[28px] p-6 md:p-8 space-y-8 relative overflow-hidden">
                {/* Visual Pipeline Track */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 relative z-10">
                  {/* Left: Source */}
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 w-48 shadow-lg">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-[#B39CD0]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Friend's Text</h4>
                      <p className="text-[9px] font-sans text-zinc-500">Or a podcast transcript</p>
                    </div>
                  </div>

                  {/* Arrow Pipeline Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div 
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="hidden sm:block text-[#B39CD0]"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                    <span className="text-[9px] font-sans text-[#B39CD0] bg-[#B39CD0]/5 border border-[#B39CD0]/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      REMEMBER THIS
                    </span>
                  </div>

                  {/* Right: Destination */}
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 w-48 shadow-lg">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shadow-md">
                      <Bookmark className="w-4 h-4 text-[#B39CD0]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300 font-display italic">Your Library</h4>
                      <p className="text-[9px] font-sans text-zinc-400 font-extrabold">✓ Saved Forever</p>
                    </div>
                  </div>
                </div>

                {/* Waterfall of beautiful film cards importing dynamically */}
                <div className="pt-6 border-t border-zinc-900">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {demoPosters.map((movie, idx) => (
                      <motion.div
                        key={movie.title}
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={showPosters ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
                        transition={{ 
                          delay: idx * 0.15, 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 15 
                        }}
                        className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden aspect-[3/4] flex flex-col justify-end p-2 relative group shadow-lg"
                      >
                        <img 
                          src={movie.img} 
                          alt={movie.title} 
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                        <div className="relative z-10 space-y-0.5">
                          <span className="text-[8px] font-sans bg-[#B39CD0]/20 text-[#B39CD0] px-1 py-0.2 rounded font-extrabold">
                            {movie.vibe}
                          </span>
                          <h4 className="text-[10px] font-bold text-white truncate leading-tight pt-1">
                            {movie.title}
                          </h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Master call to action buttons */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02, backgroundColor: "#18181b" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-6 py-3.5 rounded-xl border border-zinc-800 text-xs font-sans font-bold uppercase tracking-widest cursor-pointer text-zinc-300"
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={onComplete}
                  whileHover={{ scale: 1.015, backgroundColor: "#cbb6e5" }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-12 py-4 rounded-xl bg-[#B39CD0] text-[#120716] text-xs font-sans font-bold tracking-widest uppercase shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Build My Library</span>
                  <Bookmark className="w-4 h-4 text-[#120716]" />
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Elegant minimalist Stepper dots base footer */}
      <footer className="flex justify-between items-center relative z-10 border-t border-zinc-950/60 pt-6">
        <div className="text-zinc-500 text-[10px] font-sans tracking-wider font-semibold uppercase">
          Introduction
        </div>

        {/* Dynamic Slide Counter dots */}
        <div className="flex items-center gap-2.5">
          {[0, 1, 2].map(idx => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentStep === idx ? 'w-8 bg-[#B39CD0]' : 'w-2 bg-zinc-850'
              }`}
            />
          ))}
        </div>
      </footer>

    </div>
  );
}
