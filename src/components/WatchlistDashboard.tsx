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
import MovieCard from './MovieCard';

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
      name: 'Recently Plotted',
      emoji: '✨',
      description: 'Quiet discoveries and fresh plots waiting to be unspooled.',
      filterFn: (m) => !m.watched
    },
    {
      id: 'mind-bending',
      name: 'Mind-bending',
      emoji: '🧠',
      description: 'Cerebral puzzles, sci-fi realities, and mind-expanding plots.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('mind-bending') || 
        m.vibe.toLowerCase().includes('cosmic') || 
        m.vibe.toLowerCase().includes('cerebral') || 
        m.genres.some(g => ['Sci-Fi', 'Mystery', 'Thriller'].includes(g))
      )
    },
    {
      id: 'friday-night',
      name: 'Friday Night',
      emoji: '🍿',
      description: 'Comfort, spectacle, and high-energy picks for a perfect evening.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('comfort') || 
        m.vibe.toLowerCase().includes('adrenaline') || 
        m.genres.some(g => ['Action', 'Adventure', 'Comedy', 'Thriller'].includes(g))
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
      id: 'romance',
      name: 'Romance',
      emoji: '❤️',
      description: 'Enchanting stories, romantic spark, and whimsical cinema.',
      filterFn: (m) => !m.watched && (
        m.genres.includes('Romance') || 
        m.vibe.toLowerCase().includes('romantic') || 
        m.vibe.toLowerCase().includes('cozy')
      )
    },
    {
      id: 'horror',
      name: 'Horror',
      emoji: '👻',
      description: 'Chilling atmosphere, psychological dread, and thrilling scares.',
      filterFn: (m) => !m.watched && (
        m.genres.includes('Horror') || 
        m.genres.includes('Thriller') || 
        m.vibe.toLowerCase().includes('eerie') || 
        m.vibe.toLowerCase().includes('dark')
      )
    },
    {
      id: 'comfort-movies',
      name: 'Comfort',
      emoji: '😌',
      description: 'Gentle, heartwarming, and familiar stories that feel like home.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('comfort') || 
        m.vibe.toLowerCase().includes('feel-good') || 
        m.vibe.toLowerCase().includes('cozy') || 
        m.genres.includes('Animation') ||
        m.genres.includes('Comedy')
      )
    },
    {
      id: 'action',
      name: 'Action',
      emoji: '💥',
      description: 'High-octane adrenaline, grand spectacles, and kinetic cinema.',
      filterFn: (m) => !m.watched && (
        m.genres.some(g => ['Action', 'Adventure', 'Thriller'].includes(g)) ||
        m.vibe.toLowerCase().includes('adrenaline') ||
        m.vibe.toLowerCase().includes('gargantuan')
      )
    },
    {
      id: 'sci-fi',
      name: 'Sci-Fi',
      emoji: '🚀',
      description: 'Futuristic visions, outer space journeys, and speculative realities.',
      filterFn: (m) => !m.watched && (
        m.genres.includes('Sci-Fi') ||
        m.vibe.toLowerCase().includes('cosmic') ||
        m.vibe.toLowerCase().includes('futuristic')
      )
    },
    {
      id: 'anime',
      name: 'Anime',
      emoji: '🌸',
      description: 'Captivating hand-drawn animation, fantasy worlds, and Japanese classics.',
      filterFn: (m) => !m.watched && (
        m.genres.some(g => ['Anime', 'Animation'].includes(g)) ||
        m.vibe.toLowerCase().includes('anime')
      )
    },
    {
      id: 'comedy',
      name: 'Comedy',
      emoji: '🎭',
      description: 'Witty humor, lighthearted warmth, and joyous cinema.',
      filterFn: (m) => !m.watched && (
        m.genres.includes('Comedy') ||
        m.vibe.toLowerCase().includes('funny') ||
        m.vibe.toLowerCase().includes('comfort')
      )
    },
    {
      id: 'hidden-gems',
      name: 'Hidden Gems',
      emoji: '💎',
      description: 'High-rated or premium cinema entries with exceptional detail.',
      filterFn: (m) => !m.watched && (
        m.favorite || 
        (m.confidence ? m.confidence >= 90 : false) || 
        m.rating.toLowerCase().includes('9.') || 
        m.rating.toLowerCase().includes('8.')
      )
    },
    {
      id: 'from-friends',
      name: 'Friends',
      emoji: '💬',
      description: 'Quiet gems shared by people who know you best.',
      filterFn: (m) => !m.watched && (
        m.socialSource?.platform === 'manual' || 
        m.whySave.toLowerCase().includes('friend') || 
        m.whySave.toLowerCase().includes('chat') || 
        m.whySave.toLowerCase().includes('sent') ||
        m.whySave.toLowerCase().includes('tiktok') ||
        m.whySave.toLowerCase().includes('reel')
      )
    },
    {
      id: 'international',
      name: 'International',
      emoji: '🌍',
      description: 'Global masterworks and visionary foreign language films.',
      filterFn: (m) => !m.watched && (
        (m.language && m.language !== 'English') ||
        m.genres.some(g => ['International', 'Foreign', 'Drama'].includes(g))
      )
    }
  ], []);

  // Remember the user's last selected collection across sessions
  const [activeCollectionId, setActiveCollectionId] = useState<string>(() => {
    const saved = localStorage.getItem('plot_active_collection') || localStorage.getItem('cinesave_active_collection');
    const validIds = COLLECTIONS.map(c => c.id);
    if (saved && validIds.includes(saved)) {
      return saved;
    }
    return 'recently-saved';
  });

  const handleSelectCollection = (id: string) => {
    setActiveCollectionId(id);
    localStorage.setItem('plot_active_collection', id);
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1 text-left">
          <p className="text-[10px] tracking-widest uppercase font-medium text-zinc-500 font-mono">
            Private Archive
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-light italic text-zinc-100">
            Your Plot
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-sans max-w-md leading-relaxed">
            A quiet space for the films you've plotted.
          </p>
        </div>

        {/* Quiet Mode Selector + Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Elegant Slate Pill Switcher */}
          <div className="flex items-center bg-zinc-900/30 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
            <button
              onClick={() => {
                setLibraryMode('shelf');
                onChangeTab('unwatched');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                libraryMode === 'shelf'
                  ? 'bg-zinc-800/90 text-zinc-100 shadow-sm'
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                libraryMode === 'completed'
                  ? 'bg-zinc-800/90 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>
          </div>

          {/* Minimal Search Input */}
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search plot..."
              className="block w-full bg-zinc-900/30 hover:bg-zinc-900/50 focus:bg-zinc-900/80 border border-white/5 focus:border-zinc-700 text-xs rounded-xl pl-8 pr-7 py-2 text-zinc-200 placeholder-zinc-600 outline-none transition-all duration-200"
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

      {/* HORIZONTAL COLLECTION SELECTOR (Midnight Glass Navigation) */}
      {libraryMode === 'shelf' && !searchQuery.trim() && (
        <div className="pt-2 pb-2 text-left">
          <div className="relative flex flex-nowrap gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
            {COLLECTIONS.map((collection) => {
              const isActive = activeCollectionId === collection.id;
              const count = movies.filter(collection.filterFn).length;
              return (
                <button
                  key={collection.id}
                  onClick={() => handleSelectCollection(collection.id)}
                  className={`relative group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 select-none cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#F5F5F3]'
                      : 'text-zinc-400 hover:text-zinc-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Active Midnight Glass Surface with Indigo Glow */}
                  {isActive ? (
                    <motion.div
                      layoutId="activeShelfPill"
                      className="absolute inset-0 rounded-xl bg-[#0E111C]/90 backdrop-blur-md border border-[#7F72FF]/40 shadow-[0_0_18px_rgba(127,114,255,0.18)] z-0"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : (
                    <div className="absolute inset-0 rounded-xl bg-[#0B0D12]/60 backdrop-blur-md border border-white/5 group-hover:border-zinc-800 group-hover:bg-[#0E1017]/60 transition-all duration-200 z-0" />
                  )}

                  {/* Active Animated Bottom Glow Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="activeShelfUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#7F72FF] rounded-full shadow-[0_0_6px_#7F72FF] z-10"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  {/* Inner Content (Icon, Title, Badge) */}
                  <span className="relative z-10 text-sm select-none opacity-90 transition-transform duration-200 group-hover:scale-105">
                    {collection.emoji}
                  </span>
                  <span className="relative z-10 font-medium">{collection.name}</span>
                  <span
                    className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#7F72FF]/20 text-[#A095FF]'
                        : 'bg-white/5 text-zinc-500'
                    }`}
                  >
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
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => onSelectMovie(movie.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl text-zinc-500 text-xs font-sans">
                  Your plot is quiet—no matching films found.
                </div>
              )}
            </motion.div>
          ) : libraryMode === 'shelf' ? (
            
            /* ACTIVE SHELVES (Displaying single selected collection in a clean responsive grid) */
            <motion.div
              key={`selected-collection-${activeCollectionId}`}
              initial={{ opacity: 0, x: 12, filter: 'blur(1px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -12, filter: 'blur(1px)' }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
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
                    <div className="flex items-baseline justify-between px-1 mb-4">
                      <div className="space-y-0.5">
                        <h3 className="text-lg sm:text-xl font-display font-light italic text-zinc-150 flex items-center gap-2">
                          <span className="text-base select-none">{collection.emoji}</span>
                          <span>{collection.name}</span>
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-sans font-normal max-w-xl">
                          {collection.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono tracking-wide shrink-0">
                        {shelfMovies.length} {shelfMovies.length === 1 ? 'film' : 'films'}
                      </span>
                    </div>

                    {shelfMovies.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-1">
                        {shelfMovies.map((movie) => (
                          <MovieCard
                            key={`${collection.id}-${movie.id}`}
                            movie={movie}
                            onClick={() => onSelectMovie(movie.id)}
                          />
                        ))}

                        {/* Special Add Ticket slot at the end of Recently Saved shelf */}
                        {collection.id === 'recently-saved' && onGoToCapture && (
                          <motion.div
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onGoToCapture}
                            className="w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-zinc-850 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none transition-all group"
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
                          <p className="font-display font-light italic text-zinc-200 text-lg">Your plot is waiting.</p>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Paste a Reel or link to start your plot.
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
                              Plot a Film
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
            
            /* COMPLETED ARCHIVE VAULT (Grid of completed movie collection) */
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
                  A completed record of finished cinematic journeys ({completedMovies.length} total)
                </p>
              </div>

              {completedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {completedMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => onSelectMovie(movie.id)}
                      isCompleted={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-zinc-900 rounded-2xl text-zinc-500 text-xs max-w-sm mx-auto space-y-1.5">
                  <p className="font-display font-light italic text-zinc-300 text-sm">Your archive is empty—for now.</p>
                  <p className="text-zinc-600">When you finish a film in your plot, mark it as completed to store its record here.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
