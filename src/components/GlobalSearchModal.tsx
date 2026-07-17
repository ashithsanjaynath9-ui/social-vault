import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Film, 
  User, 
  Tv, 
  Compass, 
  Tag, 
  TrendingUp, 
  History, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  CornerDownLeft,
  Clapperboard
} from 'lucide-react';
import { Movie } from '../types';
import { REEL_TEMPLATES, ReelTemplate } from '../data';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onSelectMovie: (id: string) => void;
  onSelectCollection: (template: ReelTemplate) => void;
  onApplySearchFilter: (query: string) => void;
  onApplyGenreFilter: (genre: string) => void;
  onApplyStreamFilter: (stream: string) => void;
}

const TRENDING_SEARCHES = [
  { term: 'Interstellar', type: 'Movie' },
  { term: 'Sci-Fi', type: 'Genre' },
  { term: 'Timothée Chalamet', type: 'Actor' },
  { term: 'Miyazaki', type: 'Director' },
  { term: 'Netflix', type: 'Streaming' },
  { term: 'Cozy', type: 'Vibe' }
];

export default function GlobalSearchModal({
  isOpen,
  onClose,
  movies,
  onSelectMovie,
  onSelectCollection,
  onApplySearchFilter,
  onApplyGenreFilter,
  onApplyStreamFilter
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('cine_save_recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
      // Focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle saving a search term
  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('cine_save_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term);
      localStorage.setItem('cine_save_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('cine_save_recent_searches');
  };

  // Instant matching logic across dimensions
  const results = useMemo(() => {
    const searchVal = query.toLowerCase().trim();
    if (!searchVal) return null;

    // 1. Movie title / synopsis / vibe match
    const matchedMovies = movies.filter(movie => 
      movie.title.toLowerCase().includes(searchVal) ||
      movie.synopsis.toLowerCase().includes(searchVal) ||
      (movie.vibe && movie.vibe.toLowerCase().includes(searchVal))
    );

    // 2. Actors match: Extract actors starring in movies that match searchVal
    const matchedActors: { actorName: string; movies: Movie[] }[] = [];
    const actorMovieMap: Record<string, Movie[]> = {};

    movies.forEach(movie => {
      if (movie.cast) {
        movie.cast.forEach(actor => {
          if (actor.toLowerCase().includes(searchVal)) {
            if (!actorMovieMap[actor]) {
              actorMovieMap[actor] = [];
            }
            actorMovieMap[actor].push(movie);
          }
        });
      }
    });

    Object.entries(actorMovieMap).forEach(([actorName, list]) => {
      matchedActors.push({ actorName, movies: list });
    });

    // 3. Directors match
    const matchedDirectors: { directorName: string; movies: Movie[] }[] = [];
    const directorMovieMap: Record<string, Movie[]> = {};

    movies.forEach(movie => {
      if (movie.director && movie.director.toLowerCase().includes(searchVal)) {
        if (!directorMovieMap[movie.director]) {
          directorMovieMap[movie.director] = [];
        }
        directorMovieMap[movie.director].push(movie);
      }
    });

    Object.entries(directorMovieMap).forEach(([directorName, list]) => {
      matchedDirectors.push({ directorName, movies: list });
    });

    // 4. Genres match
    const matchedGenres: string[] = [];
    const allGenres = Array.from(new Set(movies.flatMap(m => m.genres || [])));
    allGenres.forEach(genre => {
      if (genre.toLowerCase().includes(searchVal)) {
        matchedGenres.push(genre);
      }
    });

    // 5. Streaming Platforms match
    const matchedPlatforms: string[] = [];
    const allPlatforms = Array.from(new Set(movies.flatMap(m => m.streamingServices || [])));
    allPlatforms.forEach(platform => {
      if (platform.toLowerCase().includes(searchVal)) {
        matchedPlatforms.push(platform);
      }
    });

    // 6. Collections (Reel Templates) match
    const matchedCollections = REEL_TEMPLATES.filter(tmpl => 
      tmpl.title.toLowerCase().includes(searchVal) ||
      tmpl.description.toLowerCase().includes(searchVal) ||
      tmpl.creator.toLowerCase().includes(searchVal) ||
      tmpl.text.toLowerCase().includes(searchVal)
    );

    const hasAnyResults = 
      matchedMovies.length > 0 ||
      matchedActors.length > 0 ||
      matchedDirectors.length > 0 ||
      matchedGenres.length > 0 ||
      matchedPlatforms.length > 0 ||
      matchedCollections.length > 0;

    return {
      movies: matchedMovies.slice(0, 5),
      actors: matchedActors.slice(0, 4),
      directors: matchedDirectors.slice(0, 4),
      genres: matchedGenres.slice(0, 4),
      platforms: matchedPlatforms.slice(0, 4),
      collections: matchedCollections.slice(0, 3),
      hasAnyResults
    };
  }, [query, movies]);

  // Handle key listeners inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSelectMovieResult = (id: string) => {
    saveSearchTerm(query);
    onSelectMovie(id);
    onClose();
  };

  const handleSelectCollectionResult = (collection: ReelTemplate) => {
    saveSearchTerm(query);
    onSelectCollection(collection);
    onClose();
  };

  const handleSelectActorResult = (actor: string) => {
    saveSearchTerm(query);
    onApplySearchFilter(actor);
    onClose();
  };

  const handleSelectDirectorResult = (director: string) => {
    saveSearchTerm(query);
    onApplySearchFilter(director);
    onClose();
  };

  const handleSelectGenreResult = (genre: string) => {
    saveSearchTerm(query);
    onApplyGenreFilter(genre);
    onClose();
  };

  const handleSelectPlatformResult = (platform: string) => {
    saveSearchTerm(query);
    onApplyStreamFilter(platform);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 md:px-6" id="global-search-modal">
        {/* Deep immersive backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
        />

        {/* Modal Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-850 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[75vh] z-10"
        >
          {/* Header Search Input */}
          <div className="relative p-5 border-b border-zinc-900 flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, actors, directors, genres, platforms..."
              className="w-full bg-transparent text-white font-sans text-base focus:outline-none placeholder-zinc-500 pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-16 p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-full transition-all"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono text-zinc-500 font-bold select-none shrink-0">
              ESC
            </kbd>
          </div>

          {/* Main content body (scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {/* 1. Default view (No query typed) */}
            {!query && (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        <span>Recent Searches</span>
                      </h4>
                      <button 
                        onClick={clearAllRecent}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono font-semibold"
                      >
                        Clear History
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <div
                          key={`${term}-${idx}`}
                          onClick={() => handleRecentClick(term)}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-850 hover:border-zinc-700 rounded-full text-xs font-medium text-zinc-300 hover:text-white cursor-pointer transition-all"
                        >
                          <span>{term}</span>
                          <button
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-zinc-500 group-hover:text-zinc-300 hover:text-rose-400 p-0.5"
                            title="Remove search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>Trending Curations</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TRENDING_SEARCHES.map(({ term, type }) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="flex items-center justify-between p-3 bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-2xl text-left transition-all cursor-pointer group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 group-hover:text-blue-400 transition-colors truncate">{term}</p>
                          <p className="text-[9px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">{type}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search helper tip */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-600 font-mono">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Instant full-catalog search index</span>
                  </div>
                  <div>
                    Type characters to filter
                  </div>
                </div>
              </div>
            )}

            {/* 2. Results view (Query typed) */}
            {query && results && (
              <div className="space-y-6">
                {!results.hasAnyResults ? (
                  <div className="text-center py-12 space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500 mb-3">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-400">No matching search results found</p>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Try searching for a different movie, cast member, director, genre, or select from trending options.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 text-left">
                    {/* A. Movies category */}
                    {results.movies.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                          <Film className="w-3.5 h-3.5 text-blue-400" />
                          <span>Movies ({results.movies.length})</span>
                        </h4>
                        <div className="space-y-1.5">
                          {results.movies.map((movie) => (
                            <div
                              key={movie.id}
                              onClick={() => handleSelectMovieResult(movie.id)}
                              className="flex items-center gap-3.5 p-2 hover:bg-zinc-900/80 rounded-xl cursor-pointer transition-all border border-transparent hover:border-zinc-900 group"
                            >
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                referrerPolicy="no-referrer"
                                className="w-9 h-13 rounded object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                    {movie.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-500 shrink-0 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                                    {movie.year}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 truncate mt-0.5">
                                  Directed by <span className="text-zinc-300 font-medium">{movie.director}</span>
                                </p>
                                {movie.vibe && (
                                  <span className="inline-block text-[9px] font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-full mt-1">
                                    ✦ {movie.vibe}
                                  </span>
                                )}
                              </div>
                              <CornerDownLeft className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* B. Collections category */}
                    {results.collections.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                          <Compass className="w-3.5 h-3.5 text-purple-400" />
                          <span>Collections ({results.collections.length})</span>
                        </h4>
                        <div className="space-y-1.5">
                          {results.collections.map((tmpl) => (
                            <div
                              key={tmpl.id}
                              onClick={() => handleSelectCollectionResult(tmpl)}
                              className="flex items-center justify-between p-3 hover:bg-zinc-900/80 border border-transparent hover:border-zinc-900 rounded-xl cursor-pointer transition-all group"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate flex items-center gap-2">
                                  <span>{tmpl.icon}</span>
                                  <span>{tmpl.title}</span>
                                </p>
                                <p className="text-xs text-zinc-400 truncate mt-1">
                                  {tmpl.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-850 text-zinc-500 px-2 py-0.5 rounded-full">
                                  {tmpl.platform}
                                </span>
                                <CornerDownLeft className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* C. Actors category */}
                    {results.actors.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                          <User className="w-3.5 h-3.5 text-teal-400" />
                          <span>Cast & Actors ({results.actors.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {results.actors.map(({ actorName, movies: actorMovies }) => (
                            <div
                              key={actorName}
                              onClick={() => handleSelectActorResult(actorName)}
                              className="p-3 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-zinc-200 group-hover:text-teal-400 transition-colors truncate">
                                  {actorName}
                                </p>
                                <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-mono">
                                  Starring in: {actorMovies.map(m => m.title).join(', ')}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* D. Directors category */}
                    {results.directors.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                          <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                          <span>Directors ({results.directors.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {results.directors.map(({ directorName, movies: dirMovies }) => (
                            <div
                              key={directorName}
                              onClick={() => handleSelectDirectorResult(directorName)}
                              className="p-3 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors truncate">
                                  {directorName}
                                </p>
                                <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-mono">
                                  Directed: {dirMovies.map(m => m.title).join(', ')}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* E. Genres & Streaming Platform badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      {/* Genres results */}
                      {results.genres.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            <Tag className="w-3 h-3 text-sky-400" />
                            <span>Genres</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {results.genres.map((genre) => (
                              <button
                                key={genre}
                                onClick={() => handleSelectGenreResult(genre)}
                                className="text-xs font-sans font-semibold text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/15 hover:border-sky-500/30 px-2.5 py-1 rounded-xl transition-all"
                              >
                                {genre}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Platforms results */}
                      {results.platforms.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            <Tv className="w-3 h-3 text-red-400" />
                            <span>Platforms</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {results.platforms.map((platform) => (
                              <button
                                key={platform}
                                onClick={() => handleSelectPlatformResult(platform)}
                                className="text-xs font-mono font-bold text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 rounded-xl transition-all uppercase"
                              >
                                🎬 {platform}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
