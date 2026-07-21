/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Plus,
  Compass,
  Archive
} from 'lucide-react';
import { Movie, AppStats } from '../types';

interface WatchlistDashboardProps {
  movies: Movie[];
  stats: AppStats;
  currentTab: 'unwatched' | 'watched' | 'all';
  onChangeTab: (tab: 'unwatched' | 'watched' | 'all') => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectMovie: (id: string) => void;
  onGoToCapture?: () => void;
}

interface EmotionalCollection {
  id: string;
  name: string;
  emoji: string;
  description: string;
  filterFn: (m: Movie) => boolean;
}

export default function WatchlistDashboard({
  movies,
  stats,
  currentTab,
  onChangeTab,
  searchQuery,
  onChangeSearch,
  onToggleWatched,
  onDelete,
  onSelectMovie,
  onGoToCapture
}: WatchlistDashboardProps) {

  // Local state to toggle between the physical movie shelf and the completed archive
  const [libraryMode, setLibraryMode] = useState<'shelf' | 'completed'>('shelf');

  // Human-focused emotional collections exactly matching the user requested categories and examples
  const COLLECTIONS: EmotionalCollection[] = useMemo(() => [
    {
      id: 'recently-saved',
      name: 'Recently Saved',
      emoji: '✨',
      description: 'Quiet discoveries and fresh captures waiting to be unspooled.',
      filterFn: (m) => !m.watched
    },
    {
      id: 'friday-night',
      name: 'Friday Night',
      emoji: '🍿',
      description: 'Comfort, spectacle, and high-energy picks for a perfect evening.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('comfort') || 
        m.vibe.toLowerCase().includes('gargantuan') || 
        m.vibe.toLowerCase().includes('adrenaline') || 
        m.genres.some(g => ['Action', 'Adventure', 'Comedy', 'Thriller'].includes(g))
      )
    },
    {
      id: 'mind-bending',
      name: 'Mind-bending',
      emoji: '🧠',
      description: 'Cerebral puzzles, sci-fi realities, and mind-expanding plots.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('mind-bending') || 
        m.vibe.toLowerCase().includes('cosmic') || 
        m.vibe.toLowerCase().includes('wonder') || 
        m.vibe.toLowerCase().includes('cerebral') || 
        m.genres.includes('Sci-Fi')
      )
    },
    {
      id: 'date-night',
      name: 'Date Night',
      emoji: '🕯️',
      description: 'Enchanting, romantic, and whimsical films made to share.',
      filterFn: (m) => !m.watched && (
        m.genres.some(g => ['Romance', 'Drama', 'Comedy'].includes(g)) || 
        m.vibe.toLowerCase().includes('cozy') || 
        m.vibe.toLowerCase().includes('aesthetic') || 
        m.vibe.toLowerCase().includes('whimsical')
      )
    },
    {
      id: 'rainy-evening',
      name: 'Rainy Evening',
      emoji: '🌧️',
      description: 'Atmospheric, quiet, and deeply immersive comfort stories.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('cozy') || 
        m.vibe.toLowerCase().includes('aesthetic') || 
        m.vibe.toLowerCase().includes('rainy') || 
        m.vibe.toLowerCase().includes('nostalgia') || 
        m.genres.some(g => ['Drama', 'Romance', 'Mystery', 'Animation'].includes(g))
      )
    },
    {
      id: 'from-friends',
      name: 'From Friends',
      emoji: '💬',
      description: 'Quiet gems shared by people who know you best.',
      filterFn: (m) => !m.watched && (
        m.socialSource?.platform === 'manual' || 
        m.whySave.toLowerCase().includes('friend') || 
        m.whySave.toLowerCase().includes('chat') || 
        m.whySave.toLowerCase().includes('sent')
      )
    },
    {
      id: 'comfort-movies',
      name: 'Comfort Movies',
      emoji: '😌',
      description: 'Gentle, heartwarming, and familiar stories that feel like home.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('comfort') || 
        m.vibe.toLowerCase().includes('feel-good') || 
        m.vibe.toLowerCase().includes('cozy') || 
        m.genres.includes('Animation')
      )
    },
    {
      id: 'hidden-gems',
      name: 'Hidden Gems',
      emoji: '💎',
      description: 'High-rated or premium cinema entries with exceptional detail.',
      filterFn: (m) => !m.watched && (
        m.favorite || 
        (m.confidence ? m.confidence >= 95 : false) || 
        m.rating.toLowerCase().includes('9.') || 
        m.rating.toLowerCase().includes('8.8') || 
        m.rating.toLowerCase().includes('8.9')
      )
    }
  ], []);

  // Remember the user's last selected collection across sessions
  const [activeCollectionId, setActiveCollectionId] = useState<string>(() => {
    const saved = localStorage.getItem('cinesave_active_collection');
    const validIds = COLLECTIONS.map(c => c.id);
    if (saved && validIds.includes(saved)) {
      return saved;
    }
    return 'recently-saved';
  });

  const handleSelectCollection = (id: string) => {
    setActiveCollectionId(id);
    localStorage.setItem('cinesave_active_collection', id);
  };

  // Compute search results across all unwatched movies when query is present
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return movies.filter(m => 
      !m.watched && 
      (m.title.toLowerCase().includes(q) ||
       m.director.toLowerCase().includes(q) ||
       m.vibe.toLowerCase().includes(q) ||
       m.synopsis.toLowerCase().includes(q) ||
       m.genres.some(genre => genre.toLowerCase().includes(q)))
    );
  }, [movies, searchQuery]);

  // Compute completed watched movies
  const completedMovies = useMemo(() => {
    return movies.filter(m => m.watched).sort((a, b) => {
      const timeA = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
      const timeB = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [movies]);

  return (
    <div className="space-y-8 animate-fade-in text-zinc-100 font-sans max-w-5xl mx-auto py-2 px-4 sm:px-6" id="personal-movie-shelf">
      
      {/* Sleek Header & Search Room */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900/60">
        <div className="space-y-1.5 text-left">
          <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500 font-mono">
            Private Archive
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-light italic text-zinc-100">
            The Cinema Shelf
          </h2>
          <p className="text-xs sm:text-sm text-zinc-455 font-sans max-w-md">
            A silent space for the films you've chosen to remember, free from endless feed noise.
          </p>
        </div>

        {/* Quiet Mode Selector + Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          
          {/* Elegant Slate Pill Switcher */}
          <div className="flex items-center bg-zinc-900/40 p-1 rounded-xl border border-zinc-850/65 self-start sm:self-auto">
            <button
              onClick={() => {
                setLibraryMode('shelf');
                onChangeTab('unwatched');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all duration-250 cursor-pointer flex items-center gap-1.5 ${
                libraryMode === 'shelf'
                  ? 'bg-zinc-800 text-zinc-100 shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>My Shelves</span>
            </button>
            <button
              onClick={() => {
                setLibraryMode('completed');
                onChangeTab('watched');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all duration-250 cursor-pointer flex items-center gap-1.5 ${
                libraryMode === 'completed'
                  ? 'bg-zinc-800 text-zinc-100 shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Completed Archive</span>
            </button>
          </div>

          {/* Minimal Search Input */}
          <div className="relative w-full sm:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-650" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search your shelf..."
              className="block w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-850/60 focus:border-zinc-800 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 text-zinc-200 placeholder-zinc-550 outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearch('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HORIZONTAL COLLECTION SELECTOR (Positioned directly below the search/header bar) */}
      {libraryMode === 'shelf' && !searchQuery.trim() && (
        <div className="space-y-2 border-b border-zinc-900/40 pb-5 text-left">
          <p className="text-[10px] tracking-wider uppercase font-semibold text-zinc-500 font-mono pl-1 mb-1">
            Shelf Collections
          </p>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
            {COLLECTIONS.map((collection) => {
              const isActive = activeCollectionId === collection.id;
              const count = movies.filter(collection.filterFn).length;
              return (
                <button
                  key={collection.id}
                  onClick={() => handleSelectCollection(collection.id)}
                  style={{
                    backgroundColor: isActive ? '#1B2540' : 'rgba(24, 24, 27, 0.4)',
                    border: isActive ? '1px solid rgba(124, 140, 255, 0.36)' : '1px solid rgba(63, 63, 70, 0.4)',
                    color: isActive ? '#F8FAFF' : '#A1A1AA',
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer whitespace-nowrap shrink-0 hover:scale-[1.02] ${
                    isActive ? 'shadow-[0_4px_12px_rgba(10,15,30,0.35)]' : 'hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm select-none">{collection.emoji}</span>
                  <span>{collection.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#97A5FF]/15 text-[#97A5FF]' : 'bg-zinc-800/40 text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Interactive Shelf Display */}
      <div>
        <AnimatePresence mode="wait">
          
          {/* SEARCH STATE */}
          {searchQuery.trim() !== '' ? (
            <motion.div
              key="search-results-shelf"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="space-y-1 text-left">
                <h3 className="text-lg font-display font-light italic text-zinc-100">
                  Search Results
                </h3>
                <p className="text-xs text-zinc-500 font-sans">
                  Found {searchResults.length} matching films on your shelves
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {searchResults.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 220, damping: 25 }}
                      onClick={() => onSelectMovie(movie.id)}
                      className="group flex flex-col cursor-pointer text-left select-none w-full"
                    >
                      {/* Tactile 3D-like Framed Movie Poster */}
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-[0_12px_24px_rgba(0,0,0,0.75)] ring-1 ring-white/5 transition-all duration-300 group-hover:border-zinc-700/80 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.95),_0_0_20px_rgba(124,140,255,0.05)]">
                        {/* Left Edge 3D Spine Highlight */}
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/15 via-white/5 to-transparent z-20 pointer-events-none" />
                        
                        {/* Glossy Diagonal Reflection Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600 p-3 text-center">
                            <span className="text-xl mb-1">🍿</span>
                            <span className="text-[9px] text-zinc-500 font-medium truncate w-full">{movie.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                      </div>

                      {/* Museum-Grade Label Pane */}
                      <div className="mt-3.5 space-y-1.5 px-0.5">
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] sm:text-[11.5px] font-sans font-semibold text-zinc-200 truncate group-hover:text-white transition-colors" title={movie.title}>
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
                          <p className="text-[9.5px] text-zinc-500 italic font-sans truncate font-normal leading-normal border-l border-zinc-800/80 pl-1.5" title={movie.whySave}>
                            "{movie.whySave}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl text-zinc-550 text-xs">
                  No matching films found on your shelves.
                </div>
              )}
            </motion.div>
          ) : libraryMode === 'shelf' ? (
            
            /* ACTIVE SHELVES (Displaying single selected collection in a clean responsive grid) */
            <motion.div
              key={`selected-collection-${activeCollectionId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 text-left"
            >
              {(() => {
                const collection = COLLECTIONS.find(c => c.id === activeCollectionId) || COLLECTIONS[0];
                let shelfMovies = movies.filter(collection.filterFn);

                // Sort Recently Saved by addedAt desc to make it feel fresh
                if (collection.id === 'recently-saved') {
                  shelfMovies = [...shelfMovies].sort((a, b) => 
                    new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
                  );
                } else {
                  shelfMovies = [...shelfMovies].sort((a, b) => a.title.localeCompare(b.title));
                }

                return (
                  <>
                    <div className="flex items-baseline justify-between px-1 border-b border-zinc-900/35 pb-3">
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-display font-light italic text-zinc-150 flex items-center gap-2">
                          <span className="text-base select-none">{collection.emoji}</span>
                          <span>{collection.name}</span>
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-sans font-normal max-w-xl">
                          {collection.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-650 font-mono tracking-wide shrink-0">
                        {shelfMovies.length} {shelfMovies.length === 1 ? 'film' : 'films'}
                      </span>
                    </div>

                    {shelfMovies.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-1">
                        {shelfMovies.map((movie) => (
                          <motion.div
                            key={`${collection.id}-${movie.id}`}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 220, damping: 25 }}
                            onClick={() => onSelectMovie(movie.id)}
                            className="w-full flex flex-col cursor-pointer text-left select-none group"
                          >
                            {/* Tactile 3D-like Framed Movie Poster */}
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-[0_12px_24px_rgba(0,0,0,0.75)] ring-1 ring-white/5 transition-all duration-300 group-hover:border-zinc-700/80 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.95),_0_0_20px_rgba(124,140,255,0.05)]">
                              {/* Left Edge 3D Spine Highlight */}
                              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/15 via-white/5 to-transparent z-20 pointer-events-none" />
                              
                              {/* Glossy Diagonal Reflection Sheen */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                              {movie.posterUrl ? (
                                <img
                                  src={movie.posterUrl}
                                  alt={movie.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-650 p-4 text-center">
                                  <span className="text-2xl mb-1.5">🍿</span>
                                  <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{movie.title}</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                            </div>

                            {/* Museum-Grade Label Pane */}
                            <div className="mt-3.5 space-y-1.5 px-0.5">
                              <div className="space-y-0.5">
                                <h4 className="text-[11px] sm:text-[11.5px] font-sans font-medium text-zinc-200 truncate group-hover:text-white transition-colors" title={movie.title}>
                                  {movie.title}
                                </h4>
                                <p className="text-[9.5px] text-zinc-550 font-sans font-normal">
                                  {movie.year}
                                </p>
                              </div>

                              <div className="text-[9.5px] text-zinc-400 font-sans truncate font-normal">
                                {movie.streamingServices && movie.streamingServices.length > 0 
                                  ? `Stream: ${movie.streamingServices.slice(0, 2).join(', ')}`
                                  : 'Find channels'}
                              </div>

                              {movie.whySave && (
                                <p className="text-[9.5px] text-zinc-500 italic font-sans truncate font-normal leading-normal border-l border-zinc-800/80 pl-1.5" title={movie.whySave}>
                                  "{movie.whySave}"
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* Special Add Ticket slot at the end of Recently Saved shelf */}
                        {collection.id === 'recently-saved' && onGoToCapture && (
                          <motion.div
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onGoToCapture}
                            className="w-full aspect-[2/3] rounded-xl border-2 border-dashed border-zinc-850 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none transition-all group"
                          >
                            <div className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-850 flex items-center justify-center mb-2.5">
                              <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 animate-pulse" />
                            </div>
                            <span className="text-[10px] font-sans text-zinc-500 tracking-wide font-medium">Add Film</span>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="py-24 text-center max-w-sm mx-auto space-y-4">
                        <div className="text-3xl select-none">📽️</div>
                        <div className="space-y-1">
                          <p className="font-display font-light italic text-zinc-200 text-lg">This shelf is currently empty</p>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            No films match this category yet. Capture recommendations to start building this collection!
                          </p>
                        </div>
                        {onGoToCapture && (
                          <div className="pt-2">
                            <motion.button
                              onClick={onGoToCapture}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-sans font-medium rounded-xl cursor-pointer"
                            >
                              Add a Film
                            </motion.button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            
            /* COMPLETED ARCHIVE VAULT (Faded grid of completed movie tickets) */
            <motion.div
              key="completed-archive-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-display font-light italic text-zinc-150 flex items-center gap-2">
                  <span>🏆 Completed Archive</span>
                </h3>
                <p className="text-xs text-zinc-500 font-sans">
                  A classic vault of completed tickets and finished cinematic journeys ({completedMovies.length} total)
                </p>
              </div>

              {completedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {completedMovies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 220, damping: 25 }}
                      onClick={() => onSelectMovie(movie.id)}
                      className="group flex flex-col cursor-pointer text-left select-none opacity-70 hover:opacity-100 transition-opacity duration-300 w-full"
                    >
                      {/* Archive-styled slightly grayed poster with tactile 3D frame */}
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-[0_12px_24px_rgba(0,0,0,0.75)] ring-1 ring-white/5 transition-all duration-300 group-hover:border-zinc-700/80">
                        {/* Left Edge 3D Spine Highlight */}
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/10 via-white/5 to-transparent z-20 pointer-events-none" />
                        
                        {/* Glossy Diagonal Reflection Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 text-xl">
                            ✓
                          </div>
                        )}
                        {/* Stamp indicating watched status */}
                        <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-sans px-1.5 py-0.5 rounded uppercase tracking-wider z-20 shadow-md font-medium">
                          Watched
                        </div>
                      </div>

                      {/* Label Pane */}
                      <div className="mt-3.5 space-y-1.5 px-0.5">
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] sm:text-[11.5px] font-sans font-medium text-zinc-300 truncate group-hover:text-white transition-colors" title={movie.title}>
                            {movie.title}
                          </h4>
                          <p className="text-[9.5px] text-zinc-550 font-sans font-normal">
                            {movie.year}
                          </p>
                        </div>

                        <div className="text-[9.5px] text-zinc-500 font-sans truncate font-normal">
                          {movie.streamingServices && movie.streamingServices.length > 0 
                            ? `Stream: ${movie.streamingServices.slice(0, 2).join(', ')}`
                            : 'Find channels'}
                        </div>

                        {movie.whySave && (
                          <p className="text-[9.5px] text-zinc-600 italic font-sans truncate font-normal leading-normal border-l border-zinc-900 pl-1.5" title={movie.whySave}>
                            "{movie.whySave}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-zinc-900 rounded-2xl text-zinc-550 text-xs max-w-sm mx-auto space-y-1.5">
                  <p className="font-medium text-zinc-400">Empty Archive Vault</p>
                  <p className="text-zinc-650">When you finish a film on your shelf, mark it as completed to store its digital stub here.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
