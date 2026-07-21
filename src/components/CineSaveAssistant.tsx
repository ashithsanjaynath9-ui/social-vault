/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Tv, 
  Play, 
  Check, 
  Compass, 
  Heart, 
  Clock, 
  UserCheck, 
  Gift, 
  Shuffle, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';
import { Movie } from '../types';
import { IDENTITY_DIRECTIONS } from './BrandIdentity';

interface CineSaveAssistantProps {
  movies: Movie[];
  onMarkWatched: (id: string) => void;
  onSelectMovie: (id: string) => void;
  activeIdentity: string;
}

// Curated Mood Categories
interface Category {
  id: string;
  title: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  whyGenerator: (m: Movie) => string;
  filter: (m: Movie) => boolean;
  poeticSubtitle: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'mind_bending',
    title: 'Mind-bending',
    shortLabel: 'Mind-bending',
    icon: Compass,
    whyGenerator: (m) => `A mind-expanding narrative to challenge your perspective tonight.`,
    filter: (m) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('mind-bending') || text.includes('cosmic') || text.includes('sci-fi') || text.includes('thriller') || text.includes('mystery') || text.includes('cerebral') || text.includes('psych');
    },
    poeticSubtitle: "Intricate puzzles and deep cosmic realities."
  },
  {
    id: 'hidden_gems',
    title: 'Hidden Gems',
    shortLabel: 'Hidden Gems',
    icon: Gift,
    whyGenerator: (m) => `A beautifully crafted, overlooked piece of cinema waiting to be uncovered.`,
    filter: (m) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('indie') || text.includes('artistic') || text.includes('foreign') || text.includes('cult') || text.includes('mysterious') || text.includes('gentle') || text.includes('underrated');
    },
    poeticSubtitle: "Underrated masterworks rescued from the algorithmic feed."
  },
  {
    id: 'under_90',
    title: 'Under 90 Minutes',
    shortLabel: 'Under 90 Min',
    icon: Clock,
    whyGenerator: (m) => `A beautifully paced, concise cinematic story completed in under 90 minutes.`,
    filter: (m) => {
      if (!m.runtime) return true;
      const minsMatch = m.runtime.match(/(\d+)\s*min/i);
      if (minsMatch) return parseInt(minsMatch[1], 10) <= 90;
      return true;
    },
    poeticSubtitle: "Compact, punchy tales that respect your clock."
  },
  {
    id: 'friends_recommended',
    title: 'Friends Recommended',
    shortLabel: 'Friends Recs',
    icon: UserCheck,
    whyGenerator: (m) => m.socialSource?.author 
      ? `Acclaimed recommendation shared with love by ${m.socialSource.author}.` 
      : `Recommended by trusted movie-loving peers in your shared circle.`,
    filter: (m) => {
      const text = `${m.socialSource?.author || ''} ${m.socialSource?.platform || ''}`.toLowerCase();
      return text.length > 0 || !!m.socialSource?.textSnippet;
    },
    poeticSubtitle: "Warm stories with the physical warmth of human review."
  },
  {
    id: 'surprise_me',
    title: 'Surprise Me',
    shortLabel: 'Surprise Me',
    icon: Shuffle,
    whyGenerator: (m) => `A blind draw from your shelf, selected specifically to refresh your evening.`,
    filter: () => true, // Surprise Me can pull any unwatched movie
    poeticSubtitle: "Leave the selection to chance and trust your archives."
  },
  {
    id: 'comfort_movies',
    title: 'Comfort Movies',
    shortLabel: 'Comfort',
    icon: Heart,
    whyGenerator: (m) => `A cozy, comforting, and nostalgic story to wrap yourself in.`,
    filter: (m) => {
      const text = `${m.genres.join(' ')} ${m.vibe}`.toLowerCase();
      return text.includes('comedy') || text.includes('romance') || text.includes('animation') || text.includes('cozy') || text.includes('warm') || text.includes('feel-good') || text.includes('nostalgia') || text.includes('gentle');
    },
    poeticSubtitle: "Familiar rhythms and stories that feel like home."
  }
];

export default function CineSaveAssistant({ 
  movies, 
  onMarkWatched, 
  onSelectMovie,
  activeIdentity 
}: CineSaveAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('surprise_me');

  // Filter unwatched movies
  const unwatchedMovies = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    return unwatched.length > 0 ? unwatched : movies;
  }, [movies]);

  // Find active category
  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === activeCategoryId) || CATEGORIES[4];
  }, [activeCategoryId]);

  // Filter movies for active category and get exactly 3 recommendations
  const recommendedMovies = useMemo(() => {
    let filtered = unwatchedMovies.filter(activeCategory.filter);
    
    // For "Surprise Me", we shuffle or pick a pseudo-random seed
    if (activeCategoryId === 'surprise_me') {
      filtered = [...unwatchedMovies].sort(() => 0.5 - Math.random());
    }

    // Graceful padding if a category has no matching films on the user's shelf
    if (filtered.length === 0) {
      filtered = unwatchedMovies;
    }

    // Return maximum of 3 distinct, beautiful items
    return filtered.slice(0, 3);
  }, [unwatchedMovies, activeCategory, activeCategoryId]);

  // Determine current brand identity configuration
  const brandConfig = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentity) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentity]);

  return (
    <>
      {/* FLOATING ACTION ASSISTANT BUTTON (Persistent Bottom Right across all screens) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-zinc-100 to-zinc-200 hover:from-white hover:to-white text-zinc-950 rounded-full shadow-[0_12px_28px_rgba(0,0,0,0.5),_0_0_20px_rgba(124,140,255,0.15)] border border-white/20 select-none cursor-pointer group"
          id="cine-assistant-trigger"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#7C8CFF] group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C8CFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7C8CFF]"></span>
            </span>
          </div>
          <span className="text-xs font-sans font-semibold tracking-wide uppercase text-zinc-900">
            Decide Tonight
          </span>
        </motion.button>
      </div>

      {/* DRAW EXPANDABLE BOTTOM DRAWER AND OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Apple Maps / Spotify AI DJ tactile drawer sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-[#0C0B0A] border-t border-zinc-900 rounded-t-[28px] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden font-sans pb-8 max-h-[92vh] flex flex-col"
              id="cine-assistant-drawer"
            >
              {/* Top Drag Notch Handle */}
              <div 
                className="w-12 h-1 bg-zinc-800 hover:bg-zinc-700 rounded-full mx-auto my-3 cursor-pointer shrink-0" 
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer Content */}
              <div className="overflow-y-auto px-6 sm:px-8 space-y-6 flex-1 min-h-0 no-scrollbar">
                
                {/* Header branding */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 text-[#7C8CFF] flex items-center justify-center">
                        {brandConfig.logoSvg("w-3.5 h-3.5")}
                      </div>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-500 font-mono">
                        {brandConfig.name} Decider Assistant
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 leading-tight">
                      What are you in the mood for?
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Spotify DJ Style Segmented Pill Selector (Horizontal category scroll list) */}
                <div className="overflow-x-auto -mx-6 px-6 no-scrollbar shrink-0">
                  <div className="flex gap-2.5 pb-2">
                    {CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = category.id === activeCategoryId;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategoryId(category.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium font-sans flex items-center gap-2 shrink-0 border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-100 border-zinc-50 text-zinc-950 shadow-md font-semibold'
                              : 'bg-zinc-900/40 border-zinc-850/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#7C8CFF]' : 'text-zinc-500'}`} />
                          <span>{category.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtitle describing selection */}
                <div className="text-left py-0.5 border-b border-zinc-900/60">
                  <p className="text-xs text-[#7C8CFF] font-mono tracking-wide uppercase">
                    CURATED TRACK: {activeCategory.title}
                  </p>
                  <p className="text-xs text-zinc-500 italic mt-0.5">
                    {activeCategory.poeticSubtitle}
                  </p>
                </div>

                {/* VISUAL CARDS GRID (3 options chosen from the user's shelf) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <AnimatePresence mode="popLayout">
                    {recommendedMovies.map((movie, index) => {
                      const reason = activeCategory.whyGenerator(movie);
                      return (
                        <motion.div
                          key={`${activeCategoryId}-${movie.id}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="relative overflow-hidden rounded-2xl bg-zinc-900/35 border border-zinc-850/60 p-4 flex flex-col text-left group hover:border-zinc-800 hover:bg-zinc-900/60 transition-all duration-300"
                        >
                          {/* Aesthetic Ticket notch style lines */}
                          <div className="absolute top-1/2 -left-1.5 w-3 h-5 rounded-r-full bg-[#0C0B0A] border border-zinc-900 border-l-transparent z-10" />
                          <div className="absolute top-1/2 -right-1.5 w-3 h-5 rounded-l-full bg-[#0C0B0A] border border-zinc-900 border-r-transparent z-10" />

                          {/* Movie Poster & Title block */}
                          <div className="flex gap-4 items-start flex-1">
                            {/* Visual Poster */}
                            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-zinc-950 border border-zinc-850 shadow-md">
                              {movie.posterUrl ? (
                                <img 
                                  src={movie.posterUrl} 
                                  alt={movie.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xl">
                                  🍿
                                </div>
                              )}
                            </div>

                            {/* Info Block */}
                            <div className="space-y-1 flex-1 min-w-0">
                              <span className="text-[9px] font-mono uppercase bg-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850">
                                {movie.year}
                              </span>
                              <h4 className="font-display font-light text-base sm:text-lg text-zinc-100 group-hover:text-white transition-colors truncate">
                                {movie.title}
                              </h4>
                              {movie.streamingServices && movie.streamingServices.length > 0 && (
                                <p className="text-[10px] font-medium text-[#7C8CFF] font-sans truncate">
                                  Stream: {movie.streamingServices[0]}
                                </p>
                              )}
                              <p className="text-[10px] text-zinc-400 font-sans leading-none truncate">
                                Dir: {movie.director}
                              </p>
                            </div>
                          </div>

                          {/* Curated Curator Note reasoning */}
                          <div className="mt-4 p-3 rounded-xl bg-zinc-950/40 border border-zinc-900/60 flex-1 flex flex-col justify-between">
                            <p className="text-xs text-zinc-400 leading-relaxed font-sans italic">
                              "{reason}"
                            </p>
                            
                            {/* Streaming platform label or vibe */}
                            <div className="mt-2.5 pt-2 border-t border-zinc-900/30 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                              <span>Vibe: {movie.vibe}</span>
                              <span className="uppercase text-emerald-500/80">★ {movie.rating || "IMDb 8+"}</span>
                            </div>
                          </div>

                          {/* TACTILE CALLS TO ACTION (Watch / Open) */}
                          <div className="mt-4 grid grid-cols-2 gap-2 shrink-0">
                            <button
                              onClick={() => {
                                onMarkWatched(movie.id);
                                // Optional friendly click effect
                              }}
                              className="px-3 py-2 bg-[#7C8CFF]/10 hover:bg-[#7C8CFF]/15 border border-[#7C8CFF]/25 text-[#7C8CFF] hover:text-[#9AA8FF] rounded-xl text-[11px] font-sans font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Watch Now</span>
                            </button>

                            <button
                              onClick={() => {
                                onSelectMovie(movie.id);
                              }}
                              className="px-3 py-2 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-xl text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer border border-zinc-750"
                            >
                              <span>Open Card</span>
                              <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Friendly bottom curator prompt */}
                <div className="py-4 text-center shrink-0">
                  <p className="text-[10px] text-zinc-600 font-sans max-w-md mx-auto">
                    CineSave Assistant filters your own saved films. There is no social feeds, no sponsored bias, and no artificial loops. Just the films you trusted yourself to remember.
                  </p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
