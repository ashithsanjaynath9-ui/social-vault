/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Check, Film, Tv, Clock, Star, HelpCircle, X, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { GLOBAL_MOVIE_DATABASE } from '../globalDatabase';

interface GlobalSearchProps {
  movies: Movie[];
  onAddMovie: (newMovie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => void;
}

export default function GlobalSearch({ movies, onAddMovie }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for Cmd+K or Ctrl+K to trigger Spotlight Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when Spotlight modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Combine our global catalog with current user movies to construct a rich world database
  const worldDatabase = useMemo(() => {
    // Collect all movies to prevent duplicates (by title check)
    const uniqueList: Omit<Movie, 'id' | 'addedAt' | 'watched'>[] = [...GLOBAL_MOVIE_DATABASE];
    
    movies.forEach(m => {
      const exists = uniqueList.some(ul => ul.title.toLowerCase() === m.title.toLowerCase());
      if (!exists) {
        uniqueList.push({
          title: m.title,
          year: m.year,
          director: m.director,
          synopsis: m.synopsis,
          rating: m.rating,
          genres: m.genres,
          vibe: m.vibe,
          streamingServices: m.streamingServices,
          whySave: m.whySave,
          socialSource: m.socialSource,
          posterUrl: m.posterUrl,
          runtime: m.runtime,
          confidence: m.confidence,
          language: m.language,
          favorite: m.favorite,
          cast: m.cast
        });
      }
    });

    return uniqueList;
  }, [movies]);

  // Fast fuzzy match for search terms
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      // Show curated popular recommendation suggestions if empty
      return worldDatabase.slice(0, 5);
    }
    const cleanQuery = query.toLowerCase().trim();
    return worldDatabase.filter(m => {
      const titleMatch = m.title.toLowerCase().includes(cleanQuery);
      const genreMatch = m.genres.some(g => g.toLowerCase().includes(cleanQuery));
      const castMatch = m.cast?.some(c => c.toLowerCase().includes(cleanQuery)) || false;
      const directorMatch = m.director.toLowerCase().includes(cleanQuery);
      const vibeMatch = m.vibe?.toLowerCase().includes(cleanQuery) || false;
      return titleMatch || genreMatch || castMatch || directorMatch || vibeMatch;
    });
  }, [worldDatabase, query]);

  // Check if a movie from results is already in the library
  const isMovieInLibrary = (title: string) => {
    return movies.some(m => m.title.toLowerCase() === title.toLowerCase());
  };

  return (
    <>
      {/* PERMANENT TOP NAV SEARCH TRIGGER BAR */}
      <div className="w-full max-w-xs md:max-w-sm relative">
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between gap-3 px-3 py-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850/60 hover:border-zinc-800 rounded-xl cursor-pointer select-none transition-all group shadow-sm text-left"
          id="global-spotlight-trigger"
        >
          <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-200">
            <Search className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 shrink-0" />
            <span className="text-xs font-sans tracking-wide">Search movies globally...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950 border border-zinc-850 text-zinc-500 font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* IMMERSIVE SPOTLIGHT SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blurring layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Spotlight Container Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed top-[12%] left-4 right-4 md:left-1/2 md:right-auto md:w-[680px] md:-ml-[340px] bg-[#0E0E10] border border-zinc-850 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-sans flex flex-col max-h-[70vh]"
              ref={containerRef}
              id="global-spotlight-modal"
            >
              {/* Top Quick-Search Input Block */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-900 bg-zinc-950/40 shrink-0">
                <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a title, genre, director, vibe, or actor..."
                  className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm font-sans tracking-wide border-none outline-none"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-1 text-zinc-500 hover:text-zinc-300 rounded-full bg-zinc-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">
                  Esc to close
                </div>
              </div>

              {/* Spotlight Autocomplete Result Output */}
              <div className="overflow-y-auto p-2 flex-1 space-y-1.5 no-scrollbar min-h-[250px]">
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    {query ? `Search Results (${searchResults.length})` : 'Popular Cinematic Gems'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans italic">
                    Indexes external global dataset
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <span className="text-3xl">🍿</span>
                    <h5 className="text-sm font-display font-light italic text-zinc-200">Your plot found no matches for "{query}"</h5>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      Try searching broader terms like "Sci-Fi", "Christopher Nolan", "Drama", or "Comedy".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((item) => {
                      const saved = isMovieInLibrary(item.title);
                      return (
                        <div
                          key={item.title}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/40 border border-zinc-950 hover:border-zinc-850/60 transition-all duration-200 group text-left"
                        >
                          {/* Left: Poster miniature */}
                          <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-850 shadow-sm">
                            {item.posterUrl ? (
                              <img 
                                src={item.posterUrl} 
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-lg font-mono">
                                🍿
                              </div>
                            )}
                          </div>

                          {/* Middle: Rich Details details */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <h4 className="font-display font-light text-base text-zinc-100 group-hover:text-white transition-colors truncate">
                                {item.title}
                              </h4>
                              <span className="text-xs text-zinc-500">({item.year})</span>
                              <span className="text-[10px] text-amber-500/90 font-mono font-semibold ml-auto sm:ml-0">
                                ★ {item.rating}
                              </span>
                            </div>

                            {/* Synopsis (1-2 lines) */}
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {item.synopsis}
                            </p>

                            {/* Meta flags */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {item.runtime && (
                                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">
                                  {item.runtime}
                                </span>
                              )}
                              {item.genres.slice(0, 2).map(g => (
                                <span key={g} className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850">
                                  {g}
                                </span>
                              ))}
                              {item.streamingServices && item.streamingServices.length > 0 && (
                                <span className="text-[9px] font-semibold text-[#7C8CFF] font-sans">
                                  Stream: {item.streamingServices.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Tactile Add to Library Action */}
                          <div className="self-stretch sm:self-auto flex items-center justify-end border-t sm:border-t-0 border-zinc-900/60 pt-2 sm:pt-0 shrink-0">
                            {saved ? (
                              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/20 font-medium">
                                <Check className="w-3.5 h-3.5" />
                                <span>Plotted</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  onAddMovie(item);
                                  // Auto-close overlay with a neat delay or let them continue adding
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Plot</span>
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Quick Help Info Strip */}
              <div className="bg-zinc-950/60 px-4 py-2 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-sans shrink-0">
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-zinc-600" /> Matches movies from global datasets.
                </span>
                <span className="hidden sm:inline font-mono">
                  Press <kbd className="text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850 font-semibold">esc</kbd> to close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
