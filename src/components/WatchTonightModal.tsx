/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, X, Tv, Check, Play, Shuffle, Smile, AlertCircle, ExternalLink } from 'lucide-react';
import { Movie } from '../types';
import { getTrailerUrl } from '../utils';

interface WatchTonightModalProps {
  movies: Movie[];
  onClose: () => void;
  onMarkWatched: (id: string) => void;
}

export default function WatchTonightModal({ movies, onClose, onMarkWatched }: WatchTonightModalProps) {
  const [selectedVibe, setSelectedVibe] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [matchResult, setMatchResult] = useState<Movie | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);

  // Extract all unique Vibes and Streaming services from user's watchlist
  const activeUnwatchedMovies = movies.filter(m => !m.watched);
  
  const vibes = ['All', ...Array.from(new Set(activeUnwatchedMovies.map(m => m.vibe))).filter(Boolean)];
  const streams = ['All', ...Array.from(new Set(activeUnwatchedMovies.flatMap(m => m.streamingServices))).filter(Boolean)];

  const handleShuffleMatch = () => {
    let filtered = activeUnwatchedMovies;

    if (selectedVibe !== 'All') {
      filtered = filtered.filter(m => m.vibe === selectedVibe);
    }
    if (selectedStream !== 'All') {
      filtered = filtered.filter(m => m.streamingServices.includes(selectedStream));
    }

    if (filtered.length === 0) {
      setNoMatchFound(true);
      setMatchResult(null);
    } else {
      setNoMatchFound(false);
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setMatchResult(filtered[randomIndex]);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setNoMatchFound(false);
    setSelectedVibe('All');
    setSelectedStream('All');
  };

  const searchUrl = matchResult 
    ? `https://www.google.com/search?q=${encodeURIComponent(matchResult.title + ' ' + matchResult.year + ' streaming showtimes where to watch')}`
    : '#';

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 }
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl"
      >
        {/* Abstract cinematic vector graphics */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {!matchResult && !noMatchFound ? (
            /* Step 1: Filters selector */
            <motion.div
              key="match-selector"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-xs font-mono font-medium mb-3">
                  <Film className="w-3.5 h-3.5" />
                  No more searching. Just watching.
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  What are we watching tonight?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Tell us your current mood & streaming services, and we'll instantly find the perfect match from your watchlist.
                </p>
              </div>

              {/* Grid selectors */}
              <div className="space-y-5">
                {/* Vibe Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5 font-mono">
                    Select current Vibe
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                    {vibes.map(v => (
                      <button
                        key={v}
                        onClick={() => setSelectedVibe(v)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                          selectedVibe === v
                            ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                            : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-850 hover:border-zinc-800 text-zinc-300'
                        }`}
                      >
                        {v === 'All' ? 'Surprise Me' : v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Streaming Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5 font-mono">
                    Streaming on
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-1">
                    {streams.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedStream(s)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedStream === s
                            ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                            : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-850 hover:border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <Tv className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                        {s === 'All' ? 'Any Service' : s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 font-mono">
                  {activeUnwatchedMovies.length} eligible movies in library
                </span>
                <button
                  onClick={handleShuffleMatch}
                  disabled={activeUnwatchedMovies.length === 0}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/40 disabled:text-zinc-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4 animate-pulse" />
                  <span>Decide For Me</span>
                </button>
              </div>
            </motion.div>
          ) : noMatchFound ? (
            /* No Match state */
            <motion.div
              key="no-match"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 space-y-5"
            >
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-white">No exact match in your watchlist</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We couldn't find any unwatched movies matching Vibe <span className="text-blue-400 font-mono">"{selectedVibe}"</span> on <span className="text-blue-400 font-mono">"{selectedStream}"</span>.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold px-6 py-2.5 rounded-xl border border-zinc-800 transition-all cursor-pointer"
                >
                  Adjust Filters
                </button>
                <button
                  onClick={() => {
                    setSelectedVibe('All');
                    setSelectedStream('All');
                    // wait a tick
                    setTimeout(() => {
                      let filtered = activeUnwatchedMovies;
                      if (filtered.length > 0) {
                        const randomIndex = Math.floor(Math.random() * filtered.length);
                        setMatchResult(filtered[randomIndex]);
                        setNoMatchFound(false);
                      }
                    }, 50);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Surprise Me Completely
                </button>
              </div>
            </motion.div>
          ) : (
            /* Step 2: Cinematic Match Result Reveal */
            <motion.div
              key="match-result"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
              className="space-y-6"
            >
              <div className="text-center mb-1">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-bold">
                  Movie Night Match
                </span>
              </div>

              {/* Movie Spotlight layout */}
              <div className="flex flex-col sm:flex-row gap-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 sm:p-5">
                {/* Poster Display */}
                <div className="w-full sm:w-36 h-52 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800 shadow-xl shrink-0">
                  <img
                    src={matchResult.posterUrl}
                    alt={matchResult.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Display */}
                <div className="flex-1 space-y-3.5 text-left">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-baseline gap-2">
                      {matchResult.title}
                      <span className="text-sm font-mono font-medium text-zinc-500">({matchResult.year})</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Directed by <span className="text-zinc-200 font-medium">{matchResult.director}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-0.5 rounded-full font-bold">
                      ✦ {matchResult.vibe}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      ⭐ {matchResult.rating}
                    </span>
                    {matchResult.genres.map(g => (
                      <span key={g} className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {matchResult.synopsis}
                  </p>

                  {/* Why you saved it citation */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-3 text-xs text-zinc-300 italic">
                    <p className="font-semibold text-zinc-400 not-italic text-[10px] uppercase tracking-wider font-mono mb-1">
                      Why you saved this recommendation:
                    </p>
                    "{matchResult.whySave}"
                  </div>
                </div>
              </div>

              {/* Streaming provider bar */}
              <div className="bg-zinc-900/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left border border-zinc-900">
                <div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Available to watch on</p>
                  <p className="text-xs text-zinc-200 font-bold mt-0.5 flex flex-wrap gap-1.5 mt-1.5">
                    {matchResult.streamingServices.map(s => (
                      <span key={s} className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 font-mono text-zinc-300 text-[10px]">{s}</span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Modal controls */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900 justify-end items-center">
                {/* Pick another - subtle tertiary text */}
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto text-zinc-500 hover:text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider py-2 px-4 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Pick Another</span>
                </button>

                {/* Mark watched - secondary button */}
                <button
                  onClick={() => {
                    onMarkWatched(matchResult.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Watched</span>
                </button>

                {/* Stream / watch now - primary CTA */}
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-500/15 cursor-pointer border border-blue-400/10 text-center uppercase tracking-wider font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                  <span>Search Where to Watch</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
