/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Play, 
  RotateCw,
  Tv,
  Bookmark,
  Compass,
  Sparkles
} from 'lucide-react';
import { Movie } from '../types';
import { IDENTITY_DIRECTIONS } from './BrandIdentity';

interface WatchTonightModalProps {
  movies: Movie[];
  onClose?: () => void;
  onMarkWatched: (id: string) => void;
  onSelectMovie?: (id: string) => void;
  isInline?: boolean;
}

// 6 Curated Mood Draws (Simplified and quiet, no emoji spam)
const MOOD_DRAWS = [
  {
    id: 'quiet_choice',
    title: "A Quiet Choice",
    pill: "A Quiet Choice",
    whyGenerator: (m: Movie) => `A highly-regarded story waiting silently on your shelf, perfect for a peaceful evening.`,
    filter: (m: Movie) => !m.watched,
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  },
  {
    id: 'deep_cerebral',
    title: 'Deep & Cerebral',
    pill: 'Deep & Cerebral',
    whyGenerator: (m: Movie) => `An intricate, mind-expanding narrative to captivate your thoughts entirely.`,
    filter: (m: Movie) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('mind-bending') || text.includes('cosmic') || text.includes('sci-fi') || text.includes('thriller') || text.includes('mystery') || text.includes('cerebral') || text.includes('psych');
    },
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  },
  {
    id: 'from_friends',
    title: 'From Friends',
    pill: 'From Friends',
    whyGenerator: (m: Movie) => m.socialSource?.author 
      ? `Saved from a recommendation by ${m.socialSource.author}.` 
      : `An acclaimed recommendation that arrived from your shared circle of friends.`,
    filter: (m: Movie) => {
      const text = `${m.socialSource?.author || ''} ${m.socialSource?.platform || ''}`.toLowerCase();
      return text.length > 0 || m.socialSource?.textSnippet?.length > 0;
    },
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  },
  {
    id: 'overlooked_gems',
    title: 'Overlooked Treasures',
    pill: 'Overlooked Treasures',
    whyGenerator: (m: Movie) => `A beautifully crafted, underrated gem waiting to be uncovered.`,
    filter: (m: Movie) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('indie') || text.includes('artistic') || text.includes('foreign') || text.includes('cult') || text.includes('mysterious') || text.includes('gentle');
    },
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  },
  {
    id: 'quick_watch',
    title: 'Something Brief',
    pill: 'Something Brief (< 95m)',
    whyGenerator: (m: Movie) => `A fast, beautifully paced story under 95 minutes.`,
    filter: (m: Movie) => {
      if (!m.runtime) return true;
      const minsMatch = m.runtime.match(/(\d+)\s*min/i);
      if (minsMatch) return parseInt(minsMatch[1], 10) <= 95;
      return true;
    },
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  },
  {
    id: 'curators_choice',
    title: 'Curator\'s Choice',
    pill: 'Curator\'s Choice',
    whyGenerator: (m: Movie) => `A timeless pick matching your recent collection styles.`,
    filter: (m: Movie) => true,
    pillColor: 'border-zinc-800 text-zinc-300 bg-zinc-900/30'
  }
];

export default function WatchTonightModal({ 
  movies, 
  onClose, 
  onMarkWatched, 
  onSelectMovie,
  isInline = false 
}: WatchTonightModalProps) {
  // Read selected active brand identity for custom styled drawing orb
  const activeIdentityId = useMemo(() => {
    try {
      return localStorage.getItem('cinesave_identity') || 'bookmark';
    } catch {
      return 'bookmark';
    }
  }, []);

  const selectedIdentity = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentityId) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentityId]);

  // Graceful fallback to all movies if unwatched list is currently empty
  const unwatchedMovies = useMemo(() => {
    const list = movies.filter(m => !m.watched);
    return list.length > 0 ? list : movies;
  }, [movies]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Suggestions state
  const [isDjActive, setIsDjActive] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isRemixing, setIsRemixing] = useState(false);

  // Compute recommendation lists for each track, with fallback padding
  const recommendationsForTracks = useMemo(() => {
    return MOOD_DRAWS.reduce((acc, track) => {
      let filtered = unwatchedMovies.filter(track.filter);
      
      if (track.id === 'curators_choice') {
        filtered = [...unwatchedMovies].reverse();
      }
      
      // Pad if empty
      if (filtered.length === 0) {
        filtered = unwatchedMovies;
      }
      
      acc[track.id] = filtered.slice(0, 3); // 3 beautiful columns fits perfectly
      return acc;
    }, {} as Record<string, Movie[]>);
  }, [unwatchedMovies]);

  // Active track selection
  const activeTrack = MOOD_DRAWS[currentTrackIndex];
  const activeRecommendations = recommendationsForTracks[activeTrack.id] || [];

  // Filter shelf based on Search Query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return unwatchedMovies.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.vibe.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q))
    );
  }, [searchQuery, unwatchedMovies]);

  // Handle transition draw
  const handleDjSpin = () => {
    setIsRemixing(true);
    setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % MOOD_DRAWS.length);
      setIsRemixing(false);
      setIsDjActive(true);
    }, 450);
  };

  const handleSelectTrack = (index: number) => {
    setIsRemixing(true);
    setTimeout(() => {
      setCurrentTrackIndex(index);
      setIsRemixing(false);
      setIsDjActive(true);
    }, 300);
  };

  return (
    <div 
      className={isInline ? "w-full min-h-[60vh] py-4 font-sans text-zinc-100 flex flex-col justify-between" : "fixed inset-0 z-50 flex flex-col p-6 bg-zinc-950/98 backdrop-blur-xl font-sans text-zinc-100"}
      id="decide-tonight-pane"
    >
      {/* Background Soft Shadows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-900/20 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Header (Exit trigger if in modal mode) */}
      {!isInline && onClose && (
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-sans tracking-wide text-zinc-400 font-medium">Decide Tonight</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-4xl w-full mx-auto flex flex-col justify-start space-y-10">
        
        {/* Editorial Title (Visible when not actively searching) */}
        {searchQuery === '' && (
          <div className="text-center space-y-3 py-6 select-none max-w-lg mx-auto">
            <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500">
              Private Shelf Draws
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-light italic text-zinc-100 tracking-tight">
              Decide Tonight
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-sans">
              Draw suggestions from your custom shelves, or search your private movie notebook directly.
            </p>
          </div>
        )}

        {/* Large Cinematic Search Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value !== '') {
                  setIsDjActive(false);
                }
              }}
              placeholder="Search your movie shelf by title, genre, vibe..."
              className="w-full pl-13 pr-6 py-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-750 focus:bg-zinc-900/50 transition-all duration-300 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-sans cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 w-full relative min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* Search Results Display */}
            {searchQuery !== '' ? (
              <motion.div
                key="search-results-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-sans text-zinc-400 font-medium">
                    Search Shelf Results ({searchResults.length})
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-20 text-zinc-600 text-xs font-sans">
                    No matching movies found on your shelf.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {searchResults.map((movie) => (
                      <motion.div
                        key={movie.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 220, damping: 25 }}
                        onClick={() => onSelectMovie && onSelectMovie(movie.id)}
                        className="group flex flex-col cursor-pointer text-left select-none"
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-850 shadow-[0_12px_24px_rgba(0,0,0,0.75)] ring-1 ring-white/5 transition-all duration-300 group-hover:border-zinc-700">
                          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/10 via-white/5 to-transparent z-20 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-650 p-2 text-center">
                              <span className="text-xl mb-1">🍿</span>
                              <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{movie.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                        </div>

                        <div className="mt-3.5 space-y-1.5 px-0.5">
                          <div className="space-y-0.5">
                            <h4 className="text-[11px] font-sans font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                              {movie.title}
                            </h4>
                            <p className="text-[9.5px] text-zinc-500 font-sans font-normal">
                              {movie.year}
                            </p>
                          </div>

                          <div className="text-[9.5px] text-zinc-400 font-sans truncate font-normal">
                            {movie.streamingServices && movie.streamingServices.length > 0 
                              ? `Stream: ${movie.streamingServices.slice(0, 2).join(', ')}`
                              : 'Find channels'}
                          </div>

                          {movie.whySave && (
                            <p className="text-[9.5px] text-zinc-500 italic font-sans truncate font-normal leading-normal border-l border-zinc-800/80 pl-1.5">
                              "{movie.whySave}"
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : isDjActive ? (
              
              /* INTELLIGENT AI RECOMMENDATION STATE (Redesigned Editorial Drawing Module) */
              <motion.div
                key="dj-recommendation-pane"
                initial={{ opacity: 0, scale: 0.99, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -10 }}
                transition={{ type: 'spring', damping: 26, stiffness: 225 }}
                className="space-y-8"
              >
                
                {/* Visual Selection Header (Pure curation, zero chat/conversational bubbles) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans tracking-wide text-zinc-400 font-medium uppercase">
                      Shelf Suggestion Deck
                    </span>
                  </div>

                  {/* Dynamic Track Navigation Pills (Fast Interactions, Quiet Styling) */}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {MOOD_DRAWS.map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTrack(idx)}
                        className={`px-3.5 py-2.5 rounded-xl border text-[10.5px] font-sans transition-all duration-200 cursor-pointer ${
                          currentTrackIndex === idx 
                            ? 'border-zinc-700 bg-zinc-900 text-white font-medium shadow-sm' 
                            : 'border-zinc-900 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
                        }`}
                      >
                        {t.pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation Movie Cards Grid (Visual, Minimal Text, Quiet Editorial styling) */}
                <div className="relative min-h-[220px]">
                  {isRemixing ? (
                    <div className="absolute inset-0 flex items-center justify-center py-20">
                      <div className="flex items-center gap-2.5 text-zinc-500 text-xs font-mono">
                        <RotateCw className="w-4 h-4 animate-spin text-zinc-400" />
                        <span>Drawing from notebook shelf...</span>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                      {activeRecommendations.map((movie) => (
                        <motion.div
                          key={movie.id}
                          whileHover={{ y: -8, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 220, damping: 25 }}
                          className="group bg-zinc-900/10 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/20"
                        >
                          {/* Movie Poster Frame */}
                          <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden border-b border-zinc-900">
                            {/* Spine & sheen highlights */}
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/5 via-white/2 to-transparent z-20 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                            {movie.posterUrl ? (
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.015]"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600 p-4 text-center">
                                <span className="text-2xl mb-1">🍿</span>
                                <span className="text-xs text-zinc-500 font-medium truncate w-full">{movie.title}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />

                            {/* Streaming Platform Badge Overlay (Bottom Left, Quiet & Elegant) */}
                            <div className="absolute bottom-3 left-3 z-20">
                              <span className="text-[9.5px] font-sans text-zinc-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm flex items-center gap-1">
                                <Tv className="w-2.5 h-2.5 text-zinc-400" />
                                {movie.streamingServices?.[0] || 'Any channel'}
                              </span>
                            </div>
                          </div>

                          {/* Card Details Pane */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              {/* Title */}
                              <div>
                                <h4 className="text-xs sm:text-sm font-sans font-medium text-zinc-200 truncate group-hover:text-white transition-colors" title={movie.title}>
                                  {movie.title}
                               </h4>
                                <p className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                                  {movie.year}
                                </p>
                              </div>

                              {/* One sentence explaining why */}
                              <p className="text-[11px] leading-relaxed text-zinc-400 italic font-sans border-l border-zinc-800 pl-2">
                                "{activeTrack.whyGenerator(movie)}"
                              </p>
                            </div>

                            {/* Watch Action Button changed to View Details/Note */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectMovie) onSelectMovie(movie.id);
                              }}
                              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[11px] font-sans transition-all duration-300 flex items-center justify-center gap-1.5 border border-zinc-800/60 hover:border-zinc-700 cursor-pointer"
                            >
                              <span>View Note Details</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

              </motion.div>
            ) : (
              
              /* Pristine Empty State initially (Nothing else initially except assistant halo) */
              <motion.div
                key="empty-pristine-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-zinc-900/40 border border-zinc-850/60 flex items-center justify-center text-zinc-500 text-lg">
                  🍿
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 font-medium">Your movie deck is clear.</p>
                  <p className="text-[11px] text-zinc-500 font-normal max-w-xs mx-auto leading-relaxed">
                    Search above to retrieve a specific card, or tap the drawing seal below to open suggestions instantly.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* FLOATING DRAW TONIGHT BUTTON (Handcrafted Custom-Styled Seal) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none">
        <AnimatePresence>
          {!isDjActive && searchQuery === '' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xl text-[10px] text-zinc-300 font-sans tracking-wide max-w-xs text-right border-r-0 rounded-r-none pr-5 relative -mr-3"
            >
              <span>Tap to draw suggestions</span>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 rotate-45 bg-zinc-900 border-t border-r border-zinc-800" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Identity Emblem Drawing Button */}
        <motion.button
          onClick={handleDjSpin}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border relative cursor-pointer group transition-all duration-300 ${
            isDjActive 
              ? 'bg-zinc-900 border-zinc-700 shadow-zinc-950/50' 
              : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750 hover:bg-zinc-900'
          }`}
          title="Draw suggestions from your shelf"
        >
          {/* Background Highlight derived from selected brand identity metadata logo */}
          <div className="relative z-10 flex items-center justify-center text-[#7C8CFF]">
            {selectedIdentity.logoSvg("w-7 h-7")}
          </div>

          <span className="absolute -inset-1 rounded-full bg-[#7C8CFF]/5 scale-100 group-hover:scale-105 transition-all duration-300 pointer-events-none" />
        </motion.button>
      </div>
    </div>
  );
}

