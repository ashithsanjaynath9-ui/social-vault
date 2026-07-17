/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Instagram, Tv, Film, Compass, ChevronRight, Play, Heart, Smartphone, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Slides configuration matching guidelines:
  // Pages: Welcome, Share Reel, Auto Organize, Done
  const steps = [
    {
      id: 'welcome',
      title: 'Turn every movie recommendation into movie night.',
      subtitle: 'The fastest link between discovery and watching.',
      badge: 'INTRODUCING CINESAVE'
    },
    {
      id: 'share',
      title: 'Watch Reel. Tap Share.',
      subtitle: 'No more notes. No more manual searches.',
      badge: 'EFFORTLESS SYNC'
    },
    {
      id: 'organize',
      title: 'AI instantly extracts every movie detail.',
      subtitle: 'Smart genre categorization. Accurate stream options.',
      badge: 'INTELLIGENT PARSING'
    },
    {
      id: 'done',
      title: 'Never lose a movie recommendation again.',
      subtitle: 'Your personal cinema guide is fully primed.',
      badge: 'READY TO WATCH'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none font-sans">
      
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-display font-bold tracking-tight text-white">CineSave</span>
        </div>

        <button 
          onClick={onComplete}
          className="text-xs font-mono font-semibold tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors uppercase cursor-pointer"
        >
          Skip Intro
        </button>
      </header>

      {/* Core Dynamic Screen Content */}
      <main className="max-w-4xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-8">
        
        {/* Left Side: Copywriting (No Paragraphs. Only short headlines.) */}
        <div className="text-left space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Premium Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono font-medium text-zinc-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {steps[currentStep].badge}
              </span>

              {/* Master Headline */}
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
                {steps[currentStep].title}
              </h2>

              {/* Minimalist Sub-headline */}
              <p className="text-sm sm:text-base text-zinc-400 font-medium font-mono">
                ✦ {steps[currentStep].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Stepper Dots Indicator */}
          <div className="flex items-center gap-2 pt-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  currentStep === idx ? 'w-8 bg-blue-500' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: High-fidelity Interactive Visualizations */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/5] bg-zinc-950/40 border border-zinc-900 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
            
            {/* Subtle card glow backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                /* Slide 1 Visual: Dynamic Hero Stack Poster Stack */
                <motion.div
                  key="v-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 p-6 flex flex-col justify-end"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden rotate-[-6deg]">
                    <img 
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80" 
                      className="w-full h-full object-cover opacity-80" 
                      alt="Cosmic space"
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden rotate-[6deg] z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80" 
                      className="w-full h-full object-cover" 
                      alt="Inception style abstract"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs font-bold text-white truncate">Inception</p>
                      <p className="text-[9px] text-blue-400 font-mono">✦ Mind-bending Thriller</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                /* Slide 2 Visual: Instagram -> App -> Watchlist Animation Mockup */
                <motion.div
                  key="v-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col justify-center items-center gap-6"
                >
                  {/* Phone Screen Instagram Layout Mockup */}
                  <div className="w-full max-w-[200px] rounded-2xl bg-zinc-900 border border-zinc-800 p-3 flex flex-col gap-2 relative">
                    <div className="flex items-center gap-1.5 border-b border-zinc-850 pb-1.5">
                      <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <Instagram className="w-2.5 h-2.5 text-pink-500" />
                      </div>
                      <span className="text-[8px] font-mono text-zinc-500">Instagram Reel</span>
                    </div>

                    <div className="w-full h-20 rounded-lg bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                      <Play className="w-5 h-5 text-white/50" />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <div className="w-12 h-1.5 rounded bg-zinc-800" />
                        <span className="text-[7px] text-pink-400 font-bold font-mono">❤️ Share</span>
                      </div>
                    </div>

                    {/* Animated Arrow leading down */}
                    <motion.div 
                      animate={{ y: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 z-20 text-blue-500"
                    >
                      ↓
                    </motion.div>
                  </div>

                  {/* Watchlist Mockup Result */}
                  <div className="w-full max-w-[200px] rounded-2xl bg-zinc-900 border border-blue-500/40 p-3 flex gap-2 shadow-lg shadow-blue-500/5">
                    <div className="w-10 h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=150&q=80" 
                        className="w-full h-full object-cover" 
                        alt="Dune aesthetics"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center gap-1">
                      <p className="text-[9px] font-bold text-white truncate">Dune</p>
                      <span className="text-[7px] font-mono bg-blue-500/10 text-blue-400 px-1 py-0.2 rounded w-fit">
                        Sci-Fi Epic
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                /* Slide 3 Visual: AI Auto-Organization Representation */
                <motion.div
                  key="v-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full h-full flex flex-col justify-center gap-4 text-left"
                >
                  <div className="space-y-1.5 border-b border-zinc-900 pb-3">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Raw post text:</span>
                    <div className="p-2.5 rounded-lg bg-zinc-900/50 text-[9px] font-mono text-zinc-400 line-clamp-2 italic border border-zinc-900">
                      "I just watched Coherence (2013). This low-budget sci-fi thriller is mind-blowing. Check it out on Netflix!"
                    </div>
                  </div>

                  {/* Animated mapping arrows */}
                  <div className="text-zinc-700 font-mono text-[9px] text-center">
                    ↓ AI STRUCTURING ENGINE ↓
                  </div>

                  {/* Result structured badges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-900 border border-zinc-850">
                      <span className="text-[10px] text-zinc-400">Title</span>
                      <span className="text-[10px] font-bold text-white">Coherence (2013)</span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-900 border border-zinc-850">
                      <span className="text-[10px] text-zinc-400">Vibe Tag</span>
                      <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20 font-bold">
                        ✦ Cosmic Puzzle
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-900 border border-zinc-850">
                      <span className="text-[10px] text-zinc-400">Streams</span>
                      <span className="text-[9px] font-mono bg-zinc-950 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800 font-medium">
                        Netflix
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                /* Slide 4 Visual: Pristine success check */
                <motion.div
                  key="v-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col justify-center items-center gap-4"
                >
                  <div className="relative">
                    {/* Ring glow background */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                    
                    <div className="relative w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400">
                      <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Setup Completed</p>
                    <p className="text-[11px] text-zinc-500">Curated with Gemini 3.5 Flash</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Micro-status at base of visual preview frame */}
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 text-[9px] font-mono text-zinc-500">
              <span>SECURE OFFLINE CACHE</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom controls panel */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 pt-6 relative z-10">
        <div className="text-left">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            STEP {currentStep + 1} of {steps.length}
          </p>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5 hidden sm:block">
            {currentStep === steps.length - 1 ? 'Unlock your personalized home library' : 'Interactive Walkthrough'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 sm:flex-none text-xs font-bold text-zinc-400 hover:text-white px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
