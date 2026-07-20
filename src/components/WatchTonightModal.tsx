/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Sparkles,
  Search,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Movie } from '../types';

interface WatchTonightModalProps {
  movies: Movie[];
  onClose?: () => void;
  onMarkWatched: (id: string) => void;
  isInline?: boolean;
}

type StepType = 'time' | 'companionship' | 'mood' | 'loading' | 'result';

export default function WatchTonightModal({ movies, onClose, onMarkWatched, isInline = false }: WatchTonightModalProps) {
  // Filter unwatched movies as candidates
  const unwatchedMovies = useMemo(() => movies.filter(m => !m.watched), [movies]);

  // Flow State
  const [currentStep, setCurrentStep] = useState<StepType>('time');
  const [timeLimit, setTimeLimit] = useState<'short' | 'feature' | 'any'>('any');
  const [companionship, setCompanionship] = useState<'solo' | 'together'>('solo');
  const [mood, setMood] = useState<'comfort' | 'thought' | 'energy' | 'rainy' | 'any'>('any');
  
  // Results
  const [selectedSuggestions, setSelectedSuggestions] = useState<Movie[]>([]);

  // Parse runtime string to number helper
  const parseRuntime = (runtimeStr?: string): number => {
    if (!runtimeStr) return 110;
    const minsMatch = runtimeStr.match(/(\d+)\s*min/i);
    if (minsMatch) return parseInt(minsMatch[1], 10);
    const hrsMatch = runtimeStr.match(/(\d+)\s*h/i);
    const minsSubMatch = runtimeStr.match(/(\d+)\s*m/i);
    let total = 0;
    if (hrsMatch) total += parseInt(hrsMatch[1], 10) * 60;
    if (minsSubMatch && !runtimeStr.includes('h')) {
      total += parseInt(minsSubMatch[1], 10);
    } else if (hrsMatch && minsSubMatch) {
      const matchBoth = runtimeStr.match(/(\d+)\s*h\s*(\d+)\s*m/i);
      if (matchBoth) {
        return parseInt(matchBoth[1], 10) * 60 + parseInt(matchBoth[2], 10);
      }
    }
    return total || 110;
  };

  // Advanced scoring engine to determine the best 1 or 2 movies from the user's shelf
  const generateSuggestions = () => {
    if (unwatchedMovies.length === 0) return;

    const scored = unwatchedMovies.map(movie => {
      let score = 0;

      // 1. Runtime fit
      const mins = parseRuntime(movie.runtime);
      if (timeLimit === 'short') {
        if (mins <= 95) score += 6;
        else if (mins <= 115) score += 2;
      } else if (timeLimit === 'feature') {
        if (mins > 90 && mins <= 125) score += 6;
        else if (mins <= 145) score += 2;
      } else {
        score += 4; // any duration
      }

      // 2. Companionship style
      const mGenres = movie.genres.map(g => g.toLowerCase());
      const mVibe = movie.vibe.toLowerCase();
      if (companionship === 'together') {
        const isCozyOrComedKey = mGenres.some(g => ['romance', 'comedy', 'adventure', 'fantasy', 'animation'].includes(g)) || 
                                 mVibe.includes('charming') || mVibe.includes('date') || mVibe.includes('warm') || mVibe.includes('fun') || mVibe.includes('cozy');
        if (isCozyOrComedKey) score += 4;
      } else {
        const isDeepOrThrillerKey = mGenres.some(g => ['drama', 'sci-fi', 'thriller', 'mystery', 'crime', 'documentary'].includes(g)) || 
                                   mVibe.includes('mind-bending') || mVibe.includes('cosmic') || mVibe.includes('burn') || mVibe.includes('melanchol');
        if (isDeepOrThrillerKey) score += 4;
      }

      // 3. Mood alignment
      if (mood === 'comfort') {
        if (mVibe.includes('cozy') || mVibe.includes('comfort') || mVibe.includes('warm') || mVibe.includes('nostalg') || mVibe.includes('heartwarming') || mGenres.some(g => ['comedy', 'romance'].includes(g))) {
          score += 10;
        }
      } else if (mood === 'thought') {
        if (mVibe.includes('mind-bending') || mVibe.includes('cosmic') || mVibe.includes('psych') || mVibe.includes('cerebral') || mVibe.includes('puzzle') || mGenres.some(g => ['sci-fi', 'mystery', 'drama'].includes(g))) {
          score += 10;
        }
      } else if (mood === 'energy') {
        if (mVibe.includes('adrenaline') || mVibe.includes('energy') || mVibe.includes('pulse') || mVibe.includes('thrill') || mGenres.some(g => ['action', 'thriller', 'horror', 'adventure'].includes(g))) {
          score += 10;
        }
      } else if (mood === 'rainy') {
        if (mVibe.includes('atmospher') || mVibe.includes('melanchol') || mVibe.includes('quiet') || mVibe.includes('slow') || mVibe.includes('gorgeous') || mVibe.includes('aesthetic') || mGenres.some(g => ['drama', 'music'].includes(g))) {
          score += 10;
        }
      } else {
        // Surprise me gets a random boost to add excitement
        score += Math.floor(Math.random() * 5);
      }

      return { movie, score };
    });

    // Sort by score descending and take top 2
    const sorted = scored.sort((a, b) => b.score - a.score);
    const top2 = sorted.slice(0, 2).map(item => item.movie);
    setSelectedSuggestions(top2);
  };

  const startProcessing = () => {
    setCurrentStep('loading');
    setTimeout(() => {
      generateSuggestions();
      setCurrentStep('result');
    }, 1200); // 1.2s loading state feels magical but is extremely snappy
  };

  const handleReset = () => {
    setTimeLimit('any');
    setCompanionship('solo');
    setMood('any');
    setCurrentStep('time');
    setSelectedSuggestions([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={isInline ? "w-full max-w-xl mx-auto py-2 font-sans text-zinc-100" : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md font-sans text-zinc-100"}
      id="decide-tonight-modal"
    >
      <motion.div
        initial={isInline ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={isInline ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.98, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-full max-w-xl bg-zinc-900/40 border border-zinc-850/80 rounded-[32px] p-6 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Absolute cinematic glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-zinc-700/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-zinc-700/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Quiet Close button */}
        {!isInline && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-zinc-200 bg-transparent hover:bg-zinc-900/60 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <AnimatePresence mode="wait">
          
          {/* Zero State: empty library */}
          {unwatchedMovies.length === 0 ? (
            <motion.div
              key="empty-library-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 text-lg">
                🍿
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-medium text-zinc-200">Your Movie Shelf is Empty</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Decide Tonight helps you instantly pick the perfect film, but first we need some recommendations stored. Paste a Reel link or recommendation transcript in the main tab to fill your shelf.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-xl transition-all shadow cursor-pointer"
              >
                Go back to CineSave
              </button>
            </motion.div>
          ) :

          /* Step 1: Time selection */
          currentStep === 'time' ? (
            <motion.div
              key="step-time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 py-4"
            >
              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-sans tracking-wider text-zinc-500 uppercase">1 of 3</span>
                <h2 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 tracking-tight">
                  How much time do you have?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => {
                    setTimeLimit('short');
                    setCurrentStep('companionship');
                  }}
                  whileHover={{ y: -3, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Short & sweet</p>
                    <p className="text-xs text-zinc-500 font-normal">Under 90 minutes. A quick, satisfying escape.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    setTimeLimit('feature');
                    setCurrentStep('companionship');
                  }}
                  whileHover={{ y: -3, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Feature length</p>
                    <p className="text-xs text-zinc-500 font-normal">Under 2 hours. The classical cinematic window.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    setTimeLimit('any');
                    setCurrentStep('companionship');
                  }}
                  whileHover={{ y: -3, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">No limit</p>
                    <p className="text-xs text-zinc-500 font-normal">Any duration. Ready for epic runtimes.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1.5 pt-2">
                <div className="w-5 h-1.5 rounded-full bg-zinc-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              </div>
            </motion.div>
          ) :

          /* Step 2: Companionship selection */
          currentStep === 'companionship' ? (
            <motion.div
              key="step-companionship"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 py-4"
            >
              <div className="space-y-1.5 text-center relative">
                <button
                  onClick={() => setCurrentStep('time')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-sans tracking-wider text-zinc-500 uppercase">2 of 3</span>
                <h2 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 tracking-tight">
                  Watching alone or together?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => {
                    setCompanionship('solo');
                    setCurrentStep('mood');
                  }}
                  whileHover={{ y: -3, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex flex-col justify-between aspect-[4/3] group cursor-pointer"
                >
                  <span className="text-xl">🕯️</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Solo screen</p>
                    <p className="text-xs text-zinc-500 leading-normal">Deep focus, atmospheric quiet, or intellectual puzzles.</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setCompanionship('together');
                    setCurrentStep('mood');
                  }}
                  whileHover={{ y: -3, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex flex-col justify-between aspect-[4/3] group cursor-pointer"
                >
                  <span className="text-xl">🍿</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Shared screen</p>
                    <p className="text-xs text-zinc-500 leading-normal">Crowd-pleasers, comedies, romance, or engaging thrillers.</p>
                  </div>
                </motion.button>
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1.5 pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-5 h-1.5 rounded-full bg-zinc-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              </div>
            </motion.div>
          ) :

          /* Step 3: Mood selection */
          currentStep === 'mood' ? (
            <motion.div
              key="step-mood"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 py-4"
            >
              <div className="space-y-1.5 text-center relative">
                <button
                  onClick={() => setCurrentStep('companionship')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-sans tracking-wider text-zinc-500 uppercase">3 of 3</span>
                <h2 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 tracking-tight">
                  What is the mood tonight?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  onClick={() => {
                    setMood('comfort');
                    startProcessing();
                  }}
                  whileHover={{ y: -2, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <span className="text-lg">☕</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Comfort & Cozy</p>
                    <p className="text-[11px] text-zinc-500 font-normal">Familiar, warm, gentle storytelling.</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setMood('thought');
                    startProcessing();
                  }}
                  whileHover={{ y: -2, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <span className="text-lg">🧠</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Thought-provoking</p>
                    <p className="text-[11px] text-zinc-500 font-normal">Cerebral puzzles, mind-benders, sci-fi.</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setMood('energy');
                    startProcessing();
                  }}
                  whileHover={{ y: -2, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <span className="text-lg">⚡</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">High-energy</p>
                    <p className="text-[11px] text-zinc-500 font-normal">Thrills, pacing, adrenaline & action.</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setMood('rainy');
                    startProcessing();
                  }}
                  whileHover={{ y: -2, scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.7)", borderColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <span className="text-lg">🌧️</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">Rainy Day</p>
                    <p className="text-[11px] text-zinc-500 font-normal">Atmospheric, aesthetic, quiet cinema.</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setMood('any');
                    startProcessing();
                  }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(24, 24, 27, 0.5)", borderColor: "rgba(39, 39, 42, 0.6)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="sm:col-span-2 p-4 rounded-2xl bg-zinc-900/20 border border-dashed border-zinc-800 transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
                  <span className="text-xs font-sans uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Surprise me / Open to anything</span>
                </motion.button>
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1.5 pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-5 h-1.5 rounded-full bg-zinc-200" />
              </div>
            </motion.div>
          ) :

          /* Step 4: Loading transition (Magical but snappy) */
          currentStep === 'loading' ? (
            <motion.div
              key="step-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center space-y-6 select-none"
            >
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-zinc-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-sans text-zinc-400 tracking-wider">Looking through your movie shelf...</p>
                <p className="text-[10px] font-sans text-zinc-500">Choosing a cozy match for tonight</p>
              </div>
            </motion.div>
          ) : (
            
            /* Step 5: Beautiful custom suggestions */
            <motion.div
              key="step-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 py-2"
            >
              <div className="text-center space-y-1.5">
                <span className="text-[11px] font-sans tracking-wider text-zinc-400 uppercase bg-zinc-950/40 px-3 py-1 rounded-full border border-zinc-850">
                  Your quiet matches
                </span>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-normal">
                  No infinite feeds, no algorithms. Just perfect movies from your library matching your evening.
                </p>
              </div>

              {/* Suggestions shelf */}
              <div className="space-y-5">
                {selectedSuggestions.map((movie) => {
                  const whySaved = movie.whySave || (movie.socialSource?.author ? `Recommended by @${movie.socialSource.author}` : null);
                  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(movie.title + ' ' + movie.year + ' streaming showtimes where to watch')}`;

                  return (
                    <div 
                      key={movie.id}
                      className="group flex flex-col sm:flex-row gap-5 p-4 rounded-3xl bg-zinc-900/30 border border-zinc-850/80 hover:bg-zinc-900/50 transition-all duration-300"
                    >
                      {/* Movie poster: emotions focus */}
                      <div className="relative w-full sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shrink-0">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 text-2xl">
                            🍿
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>

                      {/* Content block: What, Where, Why */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          {/* What movie is this? */}
                          <div>
                            <h3 className="text-xl font-display font-light italic text-zinc-100 leading-tight">
                              {movie.title} <span className="text-xs text-zinc-500 font-sans">({movie.year})</span>
                            </h3>
                          </div>

                          {/* Where can I watch it? */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-sans tracking-wider text-zinc-500 uppercase">
                              Available on
                            </p>
                            <p className="text-xs text-zinc-300 font-medium">
                              {movie.streamingServices.length > 0 
                                ? movie.streamingServices.join('  •  ') 
                                : 'Check local showtimes'}
                            </p>
                          </div>

                          {/* Why did I save it? */}
                          {whySaved && (
                            <div className="pt-2 border-t border-zinc-900">
                              <p className="text-xs text-zinc-400 italic font-normal leading-relaxed pl-2 border-l border-zinc-800">
                                "{whySaved}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Card actions */}
                        <div className="flex items-center gap-3.5 pt-2">
                          <a
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono tracking-wider text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-1"
                          >
                            <span>Where to Stream</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <span className="text-zinc-800">|</span>

                          <button
                            onClick={() => {
                              onMarkWatched(movie.id);
                              // Simple feedback: remove movie or close
                              onClose();
                            }}
                            className="text-[11px] font-mono tracking-wider text-emerald-500 hover:text-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Mark Watched</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom modal actions */}
              <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02, color: "#FAF6F0" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-4 py-2 text-xs font-sans text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
                >
                  Start Over
                </motion.button>
                <motion.button
                  onClick={onClose || handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
