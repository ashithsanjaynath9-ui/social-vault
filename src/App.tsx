/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, Tv, Check, Flame, Play, Trash, Search, Shuffle, Calendar, RefreshCw, Compass, HelpCircle, X } from 'lucide-react';
import { Movie, AppStats } from './types';
import { INITIAL_MOVIES, ReelTemplate } from './data';
import { parseRuntimeMinutes } from './utils';
import AddMovieInput from './components/AddMovieInput';
import MovieCard from './components/MovieCard';
import WatchlistDashboard from './components/WatchlistDashboard';
import WatchTonightModal from './components/WatchTonightModal';
import Onboarding from './components/Onboarding';
import HomeScreen from './components/HomeScreen';
import MovieDetailModal from './components/MovieDetailModal';
import GlobalSearchModal from './components/GlobalSearchModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [viewMode, setViewMode] = useState<'home' | 'watchlist'>('home');
  const [currentTab, setCurrentTab] = useState<'unwatched' | 'watched' | 'all'>('unwatched');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedStream, setSelectedStream] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedRuntime, setSelectedRuntime] = useState('All');
  const [sortBy, setSortBy] = useState<'recent-added' | 'alphabetical' | 'ai-recommendation' | 'recent-available'>('recent-added');
  const [showWatchTonight, setShowWatchTonight] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Computed selected movie
  const selectedMovie = useMemo(() => {
    return movies.find(m => m.id === selectedMovieId) || null;
  }, [movies, selectedMovieId]);

  // Onboarding & Extractor Drawer States
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [showExtractor, setShowExtractor] = useState<boolean>(false);
  const [prefilledTemplate, setPrefilledTemplate] = useState<ReelTemplate | null>(null);

  // Premium Toast Notification State & Auto-dismiss (Delight Moment 3)
  const [toast, setToast] = useState<{ message: string; sub: string; visible: boolean } | null>(null);

  useEffect(() => {
    if (toast && toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. Local Storage Hydration & Sync
  useEffect(() => {
    try {
      // Load watch list
      const stored = localStorage.getItem('cine_extractor_watchlist');
      if (stored) {
        setMovies(JSON.parse(stored));
      } else {
        // Hydrate with default elegant curated movies if empty
        setMovies(INITIAL_MOVIES);
        localStorage.setItem('cine_extractor_watchlist', JSON.stringify(INITIAL_MOVIES));
      }

      // Load onboarding progress state
      const onboardingStored = localStorage.getItem('cine_save_onboarding_complete');
      if (onboardingStored === 'true') {
        setOnboardingComplete(true);
      }
    } catch (e) {
      console.error("Local storage read error", e);
      setMovies(INITIAL_MOVIES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cine_extractor_watchlist', JSON.stringify(movies));
    }
  }, [movies, isLoaded]);

  // Keyboard shortcut listener for global search modal (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save onboarding state
  const handleCompleteOnboarding = () => {
    setOnboardingComplete(true);
    localStorage.setItem('cine_save_onboarding_complete', 'true');
    setViewMode('home');
  };

  const handleResetOnboarding = () => {
    setOnboardingComplete(false);
    localStorage.removeItem('cine_save_onboarding_complete');
  };

  // 2. High-level dashboard statistics calculation
  const stats: AppStats = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    const watched = movies.filter(m => m.watched);
    const totalSaved = unwatched.length;
    const watchedCount = watched.length;
    const savedHours = Math.round(totalSaved * 2);

    // Calculate statistical Mode (highest frequency) Vibe Tag
    const vibeCounts = unwatched.reduce((acc, curr) => {
      if (curr.vibe) {
        acc[curr.vibe] = (acc[curr.vibe] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topVibeEntry = (Object.entries(vibeCounts) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
    const topVibe = topVibeEntry ? topVibeEntry[0] : 'Curated Vibes';

    return {
      totalSaved,
      watchedCount,
      savedHours,
      topVibe
    };
  }, [movies]);

  const hasActiveFilters = searchQuery !== '' || selectedVibe !== 'All' || selectedStream !== 'All';

  // 3. User operations handlers
  const handleAddMovies = (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => {
    const decorated: Movie[] = newMovies.map((m, idx) => ({
      ...m,
      id: `movie-${Date.now()}-${idx}-${Math.floor(Math.random() * 10000)}`,
      addedAt: new Date().toISOString(),
      watched: false,
    }));
    
    setMovies(prev => [...decorated, ...prev]);
    // Switch to active unwatched tab and View Mode to see the newly extracted items
    setCurrentTab('unwatched');
    setViewMode('watchlist');
    setShowExtractor(false);
    setPrefilledTemplate(null);

    setToast({
      message: "Extracted and Vaulted",
      sub: `Added ${newMovies.length} recommendations directly onto your shelves!`,
      visible: true
    });
  };

  const handleToggleWatched = (id: string) => {
    let movieTitle = '';
    let isMarkedWatched = false;

    setMovies(prev => prev.map(m => {
      if (m.id === id) {
        movieTitle = m.title;
        isMarkedWatched = !m.watched;
        // If finishing watch, remove progress tracker value to clear Continue Watching state
        const nextProgress = isMarkedWatched ? undefined : m.progress;
        return {
          ...m,
          watched: isMarkedWatched,
          progress: nextProgress,
          watchedAt: isMarkedWatched ? new Date().toISOString() : undefined
        };
      }
      return m;
    }));

    if (movieTitle) {
      if (isMarkedWatched) {
        setToast({
          message: "Moved to Watched Archive",
          sub: `"${movieTitle}" is now resting in your curated completed library.`,
          visible: true
        });
      } else {
        setToast({
          message: "Returned to Watchlist",
          sub: `"${movieTitle}" has been placed back in your active Watchlist queue.`,
          visible: true
        });
      }
    }
  };

  const handleDeleteMovie = (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  };

  const handleAddSingleMovie = (newMovie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => {
    if (movies.some(m => m.title.toLowerCase() === newMovie.title.toLowerCase())) {
      return;
    }
    const decorated: Movie = {
      ...newMovie,
      id: `movie-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      addedAt: new Date().toISOString(),
      watched: false,
    };
    setMovies(prev => [decorated, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setMovies(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          favorite: !m.favorite
        };
      }
      return m;
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedVibe('All');
    setSelectedStream('All');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedRuntime('All');
    setSortBy('recent-added');
  };

  // Extract from bento box collections
  const handleSelectCollection = (template: ReelTemplate) => {
    setPrefilledTemplate(template);
    setShowExtractor(true);
  };

  // 4. Client-side Search and Filters processing engine with Pinterest-style dynamic flow
  const filteredMovies = useMemo(() => {
    // 1. Filter phase
    const filtered = movies.filter(movie => {
      // Filter by Watch list tabs
      if (currentTab === 'unwatched' && movie.watched) return false;
      if (currentTab === 'watched' && !movie.watched) return false;

      // Filter by selected Vibe tag
      if (selectedVibe !== 'All' && movie.vibe !== selectedVibe) return false;

      // Filter by selected streaming provider
      if (selectedStream !== 'All' && !movie.streamingServices.includes(selectedStream)) return false;

      // Filter by selected Genre
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) return false;

      // Filter by selected Language
      const lang = movie.language || 'English';
      if (selectedLanguage !== 'All' && lang.toLowerCase() !== selectedLanguage.toLowerCase()) return false;

      // Filter by selected Runtime range
      if (selectedRuntime !== 'All') {
        const minutes = parseRuntimeMinutes(movie.runtime);
        if (selectedRuntime === 'under-90' && minutes >= 90) return false;
        if (selectedRuntime === '90-120' && (minutes < 90 || minutes > 120)) return false;
        if (selectedRuntime === 'over-120' && minutes <= 120) return false;
      }

      // Filter by title/director/synopsis text queries
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const titleMatch = movie.title.toLowerCase().includes(query);
        const directorMatch = movie.director.toLowerCase().includes(query);
        const vibeMatch = movie.vibe.toLowerCase().includes(query);
        const synopsisMatch = movie.synopsis.toLowerCase().includes(query);
        const genreMatch = movie.genres.some(g => g.toLowerCase().includes(query));
        const langMatch = (movie.language || 'English').toLowerCase().includes(query);
        return titleMatch || directorMatch || vibeMatch || synopsisMatch || genreMatch || langMatch;
      }

      return true;
    });

    // 2. Sort phase
    return [...filtered].sort((a, b) => {
      if (sortBy === 'recent-added') {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'ai-recommendation') {
        const confA = a.confidence ?? 95;
        const confB = b.confidence ?? 95;
        if (confB !== confA) {
          return confB - confA; // Higher match confidence first
        }
        // Fallback to IMDb or RT rating parsing if matching
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'recent-available') {
        return b.year - a.year; // Release year descending
      }
      return 0;
    });
  }, [movies, currentTab, searchQuery, selectedVibe, selectedStream, selectedGenre, selectedLanguage, selectedRuntime, sortBy]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Soft background reflections */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/10" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-blue-500"
            />
            <Film className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-sm font-display font-bold tracking-widest text-white uppercase">CineSave</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Loading social cinema guide...</p>
          </div>
        </div>
      </div>
    );
  }

  // If onboarding is not completed, enforce the walkthrough experience
  if (!onboardingComplete) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 relative px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-blue-900/5 via-purple-900/2 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto pt-8 sm:pt-12 space-y-8 relative">
        
        {/* Header Branding section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono font-medium text-zinc-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              NEVER LOSE A RECOMMENDATION AGAIN
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mt-2">
              Social Movie Extractor
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              Convert reels, TikToks, and shorts transcripts into a beautifully organized cinematic library.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            
            {/* Elegant Global Search Trigger Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="bg-zinc-900/80 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-850 hover:border-zinc-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-between gap-3 transition-all shadow-md cursor-pointer w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span>Search library...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[9px] font-mono text-zinc-500 font-bold select-none">
                ⌘K
              </kbd>
            </button>

            {/* Apple-quality segmented controller between Home & Library */}
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-850 p-1 rounded-xl flex items-center relative">
              <button
                onClick={() => setViewMode('home')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 ${
                  viewMode === 'home' 
                    ? 'text-white font-extrabold' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'home' && (
                  <motion.div
                    layoutId="mainNavIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Compass className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setViewMode('watchlist')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 ${
                  viewMode === 'watchlist' 
                    ? 'text-white font-extrabold' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'watchlist' && (
                  <motion.div
                    layoutId="mainNavIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Tv className="w-3.5 h-3.5" />
                <span>Watchlist Library</span>
              </button>
            </div>

            {/* Watch Tonight Bento Decision Solver Trigger */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWatchTonight(true)}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span>🍿 Decide Tonight</span>
            </motion.button>
          </div>
        </header>

        {/* Dynamic Display Area based on Selected Tab */}
        <AnimatePresence mode="wait">
          {viewMode === 'home' ? (
            <motion.div
              key="homescreen-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <HomeScreen
                movies={movies}
                onToggleWatched={handleToggleWatched}
                onDelete={handleDeleteMovie}
                onSelectCollection={handleSelectCollection}
                onViewAllWatchlist={() => setViewMode('watchlist')}
                onSelectMovie={(id) => setSelectedMovieId(id)}
                onOpenExtractor={() => setShowExtractor(true)}
                onAddMovie={handleAddSingleMovie}
              />
            </motion.div>
          ) : (
            <motion.div
              key="watchlist-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="space-y-6 pt-2"
            >
              <WatchlistDashboard
                movies={movies}
                filteredMovies={filteredMovies}
                stats={stats}
                currentTab={currentTab}
                onChangeTab={setCurrentTab}
                searchQuery={searchQuery}
                onChangeSearch={setSearchQuery}
                selectedVibe={selectedVibe}
                onChangeVibe={setSelectedVibe}
                selectedStream={selectedStream}
                onChangeStream={setSelectedStream}
                selectedGenre={selectedGenre}
                onChangeGenre={setSelectedGenre}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
                selectedRuntime={selectedRuntime}
                onChangeRuntime={setSelectedRuntime}
                sortBy={sortBy}
                onChangeSortBy={setSortBy}
                onClearFilters={handleClearFilters}
                onToggleWatched={handleToggleWatched}
                onDelete={handleDeleteMovie}
                onSelectMovie={(id) => setSelectedMovieId(id)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Floating Action Share/Extractor Button (Apple Quality) */}
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPrefilledTemplate(null);
              setShowExtractor(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-widest px-5 py-4 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400/20 cursor-pointer"
            id="floating-share-button"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>⚡ AI Extractor</span>
          </motion.button>
        </div>

        {/* 6. Extractor Overlay Sheet (Apple Blur Backdrop Drawer) */}
        <AnimatePresence>
          {showExtractor && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Blur backdrop clickable close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowExtractor(false);
                  setPrefilledTemplate(null);
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Slider Modal form wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-3xl z-10"
              >
                <AddMovieInput
                  onMoviesAdded={handleAddMovies}
                  prefilledTemplate={prefilledTemplate}
                  onClearPrefill={() => setPrefilledTemplate(null)}
                  onCloseDrawer={() => {
                    setShowExtractor(false);
                    setPrefilledTemplate(null);
                  }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Watch Tonight Bento Solver Modal overlay */}
        <AnimatePresence>
          {showWatchTonight && (
            <WatchTonightModal
              movies={movies}
              onClose={() => setShowWatchTonight(false)}
              onMarkWatched={handleToggleWatched}
            />
          )}
        </AnimatePresence>

        {/* Premium Movie Detail Modal overlay */}
        <AnimatePresence>
          {selectedMovieId && (
            <MovieDetailModal
              movie={selectedMovie}
              onClose={() => setSelectedMovieId(null)}
              onToggleWatched={handleToggleWatched}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </AnimatePresence>

        {/* Global Search Modal overlay with proper mounting and exit animations */}
        <AnimatePresence>
          {showSearchModal && (
            <GlobalSearchModal
              isOpen={true}
              onClose={() => setShowSearchModal(false)}
              movies={movies}
              onSelectMovie={(id) => setSelectedMovieId(id)}
              onSelectCollection={(collection) => {
                handleSelectCollection(collection);
                setViewMode('home');
              }}
              onApplySearchFilter={(search) => {
                setSearchQuery(search);
                setViewMode('watchlist');
              }}
              onApplyGenreFilter={(genre) => {
                setSelectedGenre(genre);
                setViewMode('watchlist');
              }}
              onApplyStreamFilter={(platform) => {
                setSelectedStream(platform);
                setViewMode('watchlist');
              }}
            />
          )}
        </AnimatePresence>

        {/* Subtle, ultra-clean Footer */}
        <footer className="pt-16 border-t border-zinc-950 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 font-mono gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} Social Movie Extractor.</p>
            <button
              onClick={handleResetOnboarding}
              className="text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Replay Guide
            </button>
          </div>
          <p className="flex items-center gap-1.5">
            Powered by <span className="text-blue-500 font-bold">Gemini 3.5 Flash</span>
          </p>
        </footer>

        {/* Custom Premium Notification Toast (Delight Moment 3) */}
        <AnimatePresence>
          {toast && toast.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-emerald-500/25 text-white font-sans rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(16,185,129,0.04)] px-5 py-4 z-[9999] flex items-center gap-4 max-w-sm sm:max-w-md backdrop-blur-md border-b-2"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400 leading-none">
                  {toast.message}
                </p>
                <p className="text-[11px] text-zinc-400 leading-normal font-medium pr-1">
                  {toast.sub}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
