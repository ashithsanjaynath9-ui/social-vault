/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Plus 
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

interface Album {
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

  // Default active collection is "recently-saved"
  const [activeAlbumId, setActiveAlbumId] = useState<string>('recently-saved');

  // Human collections exactly as requested
  const ALBUMS: Album[] = useMemo(() => [
    {
      id: 'recently-saved',
      name: 'Recently Saved',
      emoji: '✨',
      description: 'Your fresh screen discoveries, waiting to be unspooled.',
      filterFn: (m) => !m.watched
    },
    {
      id: 'this-weekend',
      name: 'For This Weekend',
      emoji: '🍿',
      description: 'Grounded comfort, thrilling action, and perfect Saturday night pick-ups.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('comfort') || 
        m.vibe.toLowerCase().includes('gargantuan') || 
        m.vibe.toLowerCase().includes('adrenaline') || 
        ['init-1', 'init-2', 'init-3'].includes(m.id)
      )
    },
    {
      id: 'need-to-watch',
      name: 'Need To Watch',
      emoji: '🎯',
      description: 'Your absolute top priority cinema, no more putting them off.',
      filterFn: (m) => !m.watched && (
        m.favorite || 
        (m.confidence ? m.confidence >= 95 : true) || 
        m.id === 'init-1' || 
        m.id === 'init-6'
      )
    },
    {
      id: 'friends-rec',
      name: 'Friends Recommended',
      emoji: '💬',
      description: 'Quiet gems and cinema suggestions shared by your closest friends.',
      filterFn: (m) => !m.watched && (
        m.socialSource.platform === 'whatsapp' || 
        m.socialSource.platform === 'manual' || 
        m.whySave.toLowerCase().includes('friend') || 
        m.whySave.toLowerCase().includes('chat') || 
        m.whySave.toLowerCase().includes('sent') || 
        m.id === 'init-3' || 
        m.id === 'init-4'
      )
    },
    {
      id: 'instagram-saves',
      name: 'From Instagram',
      emoji: '📸',
      description: 'Visual aesthetics and captivating trailers captured from your social feeds.',
      filterFn: (m) => !m.watched && (
        m.socialSource.platform === 'instagram' || 
        m.whySave.toLowerCase().includes('instagram') || 
        m.id === 'init-2' || 
        m.id === 'init-5' || 
        m.id === 'init-7'
      )
    },
    {
      id: 'late-night',
      name: 'Late Night',
      emoji: '🌙',
      description: 'Atmospheric, moody, and deep cinematic journeys perfect after midnight.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('dark') || 
        m.vibe.toLowerCase().includes('cosmic') || 
        m.genres.some(g => ['Thriller', 'Sci-Fi', 'Mystery', 'Horror', 'War'].includes(g)) || 
        m.id === 'init-1' || 
        m.id === 'init-5' || 
        m.id === 'init-7'
      )
    },
    {
      id: 'mind-bending',
      name: 'Mind Bending',
      emoji: '🧠',
      description: 'Cerebral puzzles, existential scripts, and reality-warping masterworks.',
      filterFn: (m) => !m.watched && (
        m.vibe.toLowerCase().includes('mind-bending') || 
        m.vibe.toLowerCase().includes('cosmic') || 
        m.genres.includes('Sci-Fi') ||
        m.id === 'init-1' || 
        m.id === 'init-2'
      )
    },
    {
      id: 'oscars',
      name: 'Oscar Winners',
      emoji: '🏆',
      description: 'Decorated masterpieces and universally acclaimed stories.',
      filterFn: (m) => !m.watched && (
        m.rating.includes('8.') || 
        m.rating.includes('96%') || 
        m.whySave.toLowerCase().includes('oscar') || 
        m.whySave.toLowerCase().includes('academy') || 
        ['init-1', 'init-2', 'init-3', 'init-5', 'init-6'].includes(m.id)
      )
    },
    {
      id: 'all',
      name: 'My Whole Library',
      emoji: '📚',
      description: 'Your complete personal movie library and curated shelf.',
      filterFn: (m) => !m.watched
    },
    {
      id: 'completed',
      name: 'Watched Archive',
      emoji: '👀',
      description: 'Completed cinematic journeys and saved digital ticket stubs.',
      filterFn: (m) => m.watched
    }
  ], []);

  // Compute final movies on the shelf
  const processedMovies = useMemo(() => {
    const currentAlbum = ALBUMS.find(a => a.id === activeAlbumId) || ALBUMS[0];
    let list = movies.filter(currentAlbum.filterFn);

    // Dynamic search filtering
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

    // Default sorting for shelf: newest first for Recently Saved, and release date/alphabetical otherwise
    return [...list].sort((a, b) => {
      if (activeAlbumId === 'recently-saved') {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [movies, activeAlbumId, searchQuery, ALBUMS]);

  const activeAlbum = ALBUMS.find(a => a.id === activeAlbumId) || ALBUMS[0];

  return (
    <div className="space-y-12 animate-fade-in text-zinc-100 font-sans max-w-4xl mx-auto py-2" id="personal-movie-shelf">
      
      {/* 1. Interactive Personal Shelf Header */}
      <div className="space-y-5">
        <div className="flex items-end justify-between px-1.5">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-sans text-zinc-450 tracking-wide">
              My Archives
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-150 flex items-center gap-2">
              <span>Your Personal Movie Shelf</span>
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-sans text-zinc-450 tracking-wide">
            {movies.filter(m => !m.watched).length} unwatched • {movies.filter(m => m.watched).length} watched
          </span>
        </div>

        {/* 2. Human Collections Folder Belt */}
        <div className="flex gap-5 overflow-x-auto pb-6 pt-1.5 px-1.5 scrollbar-none snap-x">
          {ALBUMS.map((album) => {
            const isSelected = activeAlbumId === album.id;
            const count = movies.filter(album.filterFn).length;
            const coverMovie = movies.filter(album.filterFn)[0];

            return (
              <motion.button
                key={album.id}
                onClick={() => {
                  setActiveAlbumId(album.id);
                  if (album.id === 'completed') {
                    onChangeTab('watched');
                  } else {
                    onChangeTab('unwatched');
                  }
                }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="group flex flex-col items-start gap-2.5 shrink-0 snap-start text-left focus:outline-none cursor-pointer select-none"
              >
                {/* Visual Book/Folder Spine Card */}
                <div 
                  className={`relative w-28 sm:w-32 aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-300 ${
                    isSelected 
                      ? 'border-zinc-700 bg-zinc-900/80 ring-1 ring-zinc-800' 
                      : 'border-zinc-900/60 bg-zinc-950/40 opacity-50 group-hover:opacity-85'
                  }`}
                >
                  {coverMovie ? (
                    <div className="absolute inset-0">
                      <img 
                        src={coverMovie.posterUrl} 
                        alt={album.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-35 group-hover:opacity-50 transition-all duration-300 scale-105 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                    </div>
                  ) : null}
 
                  {/* Icon and label overlaid nicely */}
                  <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1 justify-end h-full z-10">
                    <span className="text-xl mb-0.5 filter drop-shadow">{album.emoji}</span>
                    <h4 className="text-sm font-medium text-zinc-100 tracking-wide leading-tight">
                      {album.name}
                    </h4>
                    <p className="text-xs font-sans text-zinc-400 tracking-wide">
                      {count} {count === 1 ? 'film' : 'films'}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. Sleek Title Card & Search Bar (Extremely Minimal) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-900/60 pb-6 px-1.5">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-display font-light italic text-zinc-150 flex items-center gap-2">
            <span>{activeAlbum.emoji} {activeAlbum.name}</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-xl">
            {activeAlbum.description}
          </p>
        </div>

        {/* Quiet Search Box */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-650" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search this shelf..."
            className="block w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-850/60 focus:border-zinc-800 text-xs sm:text-sm rounded-xl pl-10 pr-8 py-2.5 text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Elegant Movie Grid (Posters Dominate) */}
      <div>
        <AnimatePresence mode="popLayout">
          {processedMovies.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
            >
              {processedMovies.map((movie) => {
                const whySaved = movie.whySave || (movie.socialSource?.author ? `Recommended by @${movie.socialSource.author}` : null);
                
                return (
                  <motion.div
                    key={movie.id}
                    layoutId={`shelf-movie-${movie.id}`}
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    onClick={() => onSelectMovie(movie.id)}
                    className="group flex flex-col space-y-4 cursor-pointer text-left focus:outline-none select-none"
                  >
                    {/* Hero Movie Poster Card */}
                    <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden bg-zinc-950 shadow-[0_8px_30px_rgba(0,0,0,0.4)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-center">
                          <span className="text-3xl mb-2">🍿</span>
                          <span className="text-xs text-zinc-500 font-medium truncate w-full">{movie.title}</span>
                        </div>
                      )}
                      
                      {/* Quiet vignette on poster to enrich details */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Exquisite minimal text footer */}
                    <div className="space-y-1.5 px-1.5 transition-all">
                      {/* Title (What movie is this?) */}
                      <h4 className="text-base font-normal text-zinc-100 tracking-wide leading-snug group-hover:text-white transition-colors line-clamp-1">
                        {movie.title}
                      </h4>

                      {/* Streaming services (Where can I watch it?) */}
                      {movie.streamingServices.length > 0 ? (
                        <p className="text-xs font-sans text-zinc-500 tracking-wide">
                          Streaming on {movie.streamingServices.slice(0, 2).join(', ')}
                        </p>
                      ) : (
                        <p className="text-xs font-sans text-zinc-600 tracking-wide">
                          Saved to library
                        </p>
                      )}

                      {/* Why saved (Why did I save it?) */}
                      {whySaved && (
                        <p className="text-xs text-zinc-400 font-normal leading-relaxed line-clamp-2 pt-1 border-l border-zinc-850 pl-2.5 mt-1.5 group-hover:text-zinc-350 transition-colors italic">
                          {whySaved}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Magical "Continue Building" CTA grid slot */}
              {onGoToCapture && (
                <motion.div
                  key="continue-building-slot"
                  layout
                  whileHover={{ y: -6, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="group flex flex-col justify-between p-6 rounded-2xl border border-dashed border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-950/40 aspect-[2/3] cursor-pointer text-left select-none"
                  onClick={onGoToCapture}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-450 group-hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-350 group-hover:text-white transition-colors tracking-wide">
                      Add to collection
                    </h4>
                    <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                      Capture an Instagram Reel, TikTok, or podcast transcript to expand your shelf.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Empty collection placeholder state */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/10 text-zinc-500 font-sans text-xs space-y-4"
            >
              <div className="text-2xl">📽️</div>
              <div className="space-y-1">
                <p className="font-medium text-zinc-400">Empty shelf slot</p>
                <p className="max-w-xs mx-auto text-zinc-600">No films match this human collection or search filter.</p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                {searchQuery ? (
                  <motion.button
                    onClick={() => onChangeSearch('')}
                    whileHover={{ scale: 1.02, color: "#FAF6F0", borderColor: "#3f3f46" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer"
                  >
                    Clear search query
                  </motion.button>
                ) : (
                  onGoToCapture && (
                    <motion.button
                      onClick={onGoToCapture}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 250, damping: 20 }}
                      className="text-zinc-950 hover:text-black bg-zinc-100 hover:bg-white px-4 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Capture recommendations</span>
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
