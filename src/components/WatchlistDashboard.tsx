/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Search, 
  X, 
  Tag, 
  Hourglass, 
  SlidersHorizontal,
  Check,
  Trash2,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  MessageSquare,
  Sparkles,
  Tv,
  ArrowRight,
  FolderHeart,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { Movie, AppStats } from '../types';

interface WatchlistDashboardProps {
  movies: Movie[];
  filteredMovies: Movie[];
  stats: AppStats;
  currentTab: 'unwatched' | 'watched' | 'all';
  onChangeTab: (tab: 'unwatched' | 'watched' | 'all') => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  selectedVibe: string;
  onChangeVibe: (vibe: string) => void;
  selectedStream: string;
  onChangeStream: (stream: string) => void;
  selectedGenre: string;
  onChangeGenre: (genre: string) => void;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  selectedRuntime: string;
  onChangeRuntime: (runtime: string) => void;
  sortBy: 'recent-added' | 'alphabetical' | 'ai-recommendation' | 'recent-available';
  onChangeSortBy: (sort: 'recent-added' | 'alphabetical' | 'ai-recommendation' | 'recent-available') => void;
  onClearFilters: () => void;
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectMovie: (id: string) => void;
}

interface Album {
  id: string;
  name: string;
  emoji: string;
  description: string;
  filterFn: (m: Movie) => boolean;
}

export default function WatchlistDashboard({
  movies,
  filteredMovies,
  stats,
  currentTab,
  onChangeTab,
  searchQuery,
  onChangeSearch,
  selectedVibe,
  onChangeVibe,
  selectedStream,
  onChangeStream,
  selectedGenre,
  onChangeGenre,
  selectedLanguage,
  onChangeLanguage,
  selectedRuntime,
  onChangeRuntime,
  sortBy,
  onChangeSortBy,
  onClearFilters,
  onToggleWatched,
  onDelete,
  onSelectMovie
}: WatchlistDashboardProps) {

  const [activeAlbumId, setActiveAlbumId] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Define human collections matching exactly the requested examples
  const ALBUMS: Album[] = useMemo(() => [
    {
      id: 'all',
      name: 'All Savings',
      emoji: '📁',
      description: 'Your complete master cinema list',
      filterFn: (m) => !m.watched
    },
    {
      id: 'friday-night',
      name: 'Friday Night',
      emoji: '🍿',
      description: 'Blockbusters, thrilling, and gargantuan cinema',
      filterFn: (m) => !m.watched && (
        m.genres.some(g => ['Action', 'Adventure', 'Sci-Fi', 'Thriller'].includes(g)) || 
        m.vibe.toLowerCase().includes('gargantuan') || 
        m.vibe.toLowerCase().includes('wonder') || 
        m.title === 'Dune: Part Two'
      )
    },
    {
      id: 'mind-bending',
      name: 'Mind Bending',
      emoji: '🧠',
      description: 'Cerebral journeys that question reality',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('cosmic') || 
        m.vibe.toLowerCase().includes('mind-bending') || 
        m.vibe.toLowerCase().includes('brain') || 
        m.genres.includes('Sci-Fi') ||
        m.title === 'Coherence'
      )
    },
    {
      id: 'with-friends',
      name: 'With Friends',
      emoji: '👥',
      description: 'Thrilling rides and crowd-pleasing horror/drama',
      filterFn: (m) => !m.watched && (
        m.genres.some(g => ['Horror', 'Adventure', 'Comedy', 'Thriller'].includes(g)) || 
        m.vibe.toLowerCase().includes('tension') || 
        m.title === 'Talk to Me' || 
        m.title === 'Coherence'
      )
    },
    {
      id: 'rainy-evening',
      name: 'Rainy Evening',
      emoji: '🌧️',
      description: 'Cozy, aesthetic, slow and comforting masterpieces',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('cozy') || 
        m.vibe.toLowerCase().includes('aesthetic') || 
        m.vibe.toLowerCase().includes('comfort') || 
        m.title === 'Amélie' || 
        m.title === 'Her' || 
        m.title === 'Perfect Days'
      )
    },
    {
      id: 'saved-this-week',
      name: 'Saved This Week',
      emoji: '✨',
      description: 'Fresh films added within the last 7 days',
      filterFn: (m) => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return !m.watched && new Date(m.addedAt).getTime() >= weekAgo;
      }
    },
    {
      id: 'recently-imported',
      name: 'Recently Imported',
      emoji: '📥',
      description: 'Extracted automatically from social links & captions',
      filterFn: (m) => !m.watched && !!(m.socialSource.url || m.socialSource.platform)
    },
    {
      id: 'watched',
      name: 'Completed Archive',
      emoji: '👀',
      description: 'Your completed cinematic accomplishments',
      filterFn: (m) => m.watched
    }
  ], []);

  // Compute list based on active album, search text, and active dropdown filters
  const processedMovies = useMemo(() => {
    const currentAlbum = ALBUMS.find(a => a.id === activeAlbumId) || ALBUMS[0];
    
    // First, filter by the album classification
    let list = movies.filter(currentAlbum.filterFn);

    // Apply main text search queries
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.vibe.toLowerCase().includes(q) ||
        m.synopsis.toLowerCase().includes(q) ||
        m.genres.some(genre => genre.toLowerCase().includes(q))
      );
    }

    // Apply helper refiners if they are customized
    if (selectedGenre !== 'All') {
      list = list.filter(m => m.genres.includes(selectedGenre));
    }
    if (selectedVibe !== 'All') {
      list = list.filter(m => m.vibe === selectedVibe);
    }
    if (selectedStream !== 'All') {
      list = list.filter(m => m.streamingServices.includes(selectedStream));
    }

    // Apply sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'recent-added') {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'recent-available') {
        return (b.year || 0) - (a.year || 0);
      }
      return 0;
    });
  }, [movies, activeAlbumId, searchQuery, selectedGenre, selectedVibe, selectedStream, sortBy, ALBUMS]);

  // Extract unique metadata values from all stored movies for drop-downs
  const uniqueVibes = useMemo(() => Array.from(new Set(movies.map(m => m.vibe))).filter(Boolean).sort(), [movies]);
  const uniqueGenres = useMemo(() => Array.from(new Set(movies.flatMap(m => m.genres))).filter(Boolean).sort(), [movies]);
  const uniqueStreams = useMemo(() => Array.from(new Set(movies.flatMap(m => m.streamingServices))).filter(Boolean).sort(), [movies]);

  const activeAlbum = ALBUMS.find(a => a.id === activeAlbumId) || ALBUMS[0];

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedVibe !== 'All' || 
    selectedStream !== 'All' || 
    selectedGenre !== 'All' || 
    sortBy !== 'recent-added';

  const resetAllRefiners = () => {
    onClearFilters();
    setActiveAlbumId('all');
  };

  return (
    <div className="space-y-10 animate-fade-in text-zinc-100 font-sans max-w-4xl mx-auto" id="personal-watchlist-board">
      
      {/* 1. Human Collections Folder Belt - Apple Photos & Spotify inspired */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">
            Personal Collections
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">
            {movies.length} films total
          </span>
        </div>

        {/* Horizontal scroll grid of aesthetic Albums */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x">
          {ALBUMS.map((album) => {
            const isSelected = activeAlbumId === album.id;
            const albumMovies = movies.filter(album.filterFn);
            const count = albumMovies.length;
            const coverMovie = albumMovies[0];

            return (
              <button
                key={album.id}
                onClick={() => {
                  setActiveAlbumId(album.id);
                  // Sync tab mode with parent if viewing completed vs active watchlist
                  if (album.id === 'watched') {
                    onChangeTab('watched');
                  } else if (album.id === 'all') {
                    onChangeTab('all');
                  } else {
                    onChangeTab('unwatched');
                  }
                }}
                className="group flex flex-col items-start gap-2 shrink-0 snap-start text-left focus:outline-none cursor-pointer"
              >
                {/* Album Cover Art */}
                <div 
                  className={`relative w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-300 ${
                    isSelected 
                      ? 'scale-[1.02] ring-2 ring-zinc-500' 
                      : 'opacity-50 group-hover:opacity-85'
                  }`}
                >
                  {coverMovie ? (
                    <img 
                      src={coverMovie.posterUrl} 
                      alt={album.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    // Empty folder state
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/20 text-zinc-600 gap-1">
                      <span className="text-xl">{album.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Album Label */}
                <div className="px-1 max-w-[112px] sm:max-w-[128px]">
                  <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {album.emoji} {album.name}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    {count} {count === 1 ? 'film' : 'films'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Collection Header & Live Controller */}
      <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">{activeAlbum.emoji}</span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {activeAlbum.name}
            </h3>
          </div>
        </div>

        {/* Minimal Search & Filter Drawer Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Simple Search bar */}
          <div className="relative flex-1 md:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search in folder..."
              className="block w-full bg-zinc-900 text-xs rounded-xl pl-9 pr-8 py-2 text-zinc-200 placeholder-zinc-500 outline-none transition-all"
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

          {/* Minimal refiners trigger */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-zinc-900 text-white font-bold'
                : 'bg-transparent text-zinc-500 hover:text-zinc-200'
            }`}
            title="Refine Parameters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Collapsible Refiners Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Genre */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => onChangeGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All">All Genres</option>
                  {uniqueGenres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Vibe */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Vibe</label>
                <select
                  value={selectedVibe}
                  onChange={(e) => onChangeVibe(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All">All Vibes</option>
                  {uniqueVibes.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Streaming provider */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Streaming</label>
                <select
                  value={selectedStream}
                  onChange={(e) => onChangeStream(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All">All Streams</option>
                  {uniqueStreams.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Sort parameters */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => onChangeSortBy(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="recent-added">Recently Added</option>
                  <option value="alphabetical">Title (A-Z)</option>
                  <option value="recent-available">Release Date</option>
                </select>
              </div>

              {hasActiveFilters && (
                <div className="col-span-1 sm:col-span-4 flex justify-end pt-2">
                  <button
                    onClick={resetAllRefiners}
                    className="text-[10px] font-mono text-zinc-500 hover:text-white transition-all flex items-center gap-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset Parameters</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Elegant Pinterest/Notion style Grid of tactile movie cards */}
      <div className="pt-2">
        {processedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {processedMovies.map((movie) => {
              const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                `${movie.title} ${movie.year} streaming showtimes where to watch`
              )}`;

              return (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie.id)}
                  className="group flex flex-col space-y-3 cursor-pointer text-left focus:outline-none"
                  id={`movie-card-${movie.id}`}
                >
                  {/* Apple Photos / Pinterest-style large tactile poster block */}
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-300">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  {/* Clean footer answering the three core questions */}
                  <div className="space-y-1 px-1">
                    
                    {/* Q1: What is it? (Title & Year) */}
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-white leading-tight group-hover:text-zinc-300 transition-colors truncate">
                        {movie.title}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {movie.year}
                      </span>
                    </div>

                    {/* Q2: Where can I watch it? (Plain text separated by dots) */}
                    {movie.streamingServices.length > 0 && (
                      <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">
                        {movie.streamingServices.slice(0, 3).join('  •  ')}
                      </p>
                    )}

                    {/* Q3: Why did I save it? */}
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed pt-0.5">
                      {movie.whySave || movie.socialSource.textSnippet || 'Saved recommendation'}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Album View state */
          <div className="py-24 text-center rounded-2xl border border-dashed border-zinc-900 text-zinc-500 font-mono text-xs space-y-3">
            <Film className="w-7 h-7 text-zinc-700 mx-auto" />
            <p className="max-w-xs mx-auto">No movies matched this collection or search filter.</p>
            {hasActiveFilters && (
              <button
                onClick={resetAllRefiners}
                className="text-blue-400 hover:underline cursor-pointer font-sans font-semibold mt-1"
              >
                Clear active search filters
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
