/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, Tv, Check, Flame, Play, Trash, Search, Shuffle, Calendar, RefreshCw, Compass, HelpCircle, X, User } from 'lucide-react';
import { Movie, AppStats } from './types';
import { INITIAL_MOVIES, ReelTemplate } from './data';
import { parseRuntimeMinutes } from './utils';
import WatchlistDashboard from './components/WatchlistDashboard';
import WatchTonightModal from './components/WatchTonightModal';
import Onboarding from './components/Onboarding';
import HomeScreen from './components/HomeScreen';
import MovieDetailModal from './components/MovieDetailModal';
import ProfileScreen from './components/ProfileScreen';
import { IdentityId, IDENTITY_DIRECTIONS } from './components/BrandIdentity';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIdentity, setActiveIdentity] = useState<IdentityId>(() => {
    try {
      const saved = localStorage.getItem('cinesave_identity');
      return (saved as IdentityId) || 'bookmark';
    } catch {
      return 'bookmark';
    }
  });
  const [viewMode, setViewMode] = useState<'home' | 'library' | 'decide' | 'profile'>('home');
  const [currentTab, setCurrentTab] = useState<'unwatched' | 'watched' | 'all'>('unwatched');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Computed selected movie
  const selectedMovie = useMemo(() => {
    return movies.find(m => m.id === selectedMovieId) || null;
  }, [movies, selectedMovieId]);

  // Selected Brand Identity Metadata
  const selectedIdentity = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentity) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentity]);

  // Onboarding
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);

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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cinesave_identity', activeIdentity);
    }
  }, [activeIdentity, isLoaded]);

  // Keyboard shortcut listener for global search modal (Cmd+K / Ctrl+K)
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
    setViewMode('library');

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Soft background reflections */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7C8CFF]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#7C8CFF]/5" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-[#7C8CFF]/40"
            />
            {/* Handcrafted active logo mark instead of generic icon */}
            <div className="text-[#7C8CFF]">
              {selectedIdentity.logoSvg("w-7 h-7")}
            </div>
          </div>
          <div className="text-center space-y-1.5">
            {selectedIdentity.wordmark("text-xl")}
            <p className="text-xs text-zinc-500 font-sans">Loading your cinema shelf...</p>
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
      
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto pt-8 sm:pt-12 space-y-8 relative">
        
        {/* Header Branding section */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-900/60">
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => setViewMode('home')}>
            <div className="p-2 w-10 h-10 rounded-xl bg-zinc-900/35 border border-zinc-850/50 text-[#7C8CFF] flex items-center justify-center shadow-sm">
              {selectedIdentity.logoSvg("w-6 h-6")}
            </div>
            <div className="flex flex-col text-left">
              {selectedIdentity.wordmark("text-base sm:text-lg")}
              <span className="text-[10px] text-zinc-500 font-sans tracking-wide leading-none mt-0.5">
                {selectedIdentity.name}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-end">
            
            {/* Unified 4-tab premium Segmented Controller */}
            <nav className="bg-zinc-900/60 backdrop-blur-md border border-zinc-850/85 p-1 rounded-xl flex items-center relative" id="main-tabs-nav">
              <button
                onClick={() => setViewMode('home')}
                className={`relative px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer z-10 tracking-wide ${
                  viewMode === 'home' 
                    ? 'text-white' 
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
                <Compass className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => setViewMode('library')}
                className={`relative px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer z-10 tracking-wide ${
                  viewMode === 'library' 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'library' && (
                  <motion.div
                    layoutId="mainNavIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Tv className="w-4 h-4" />
                <span>Library</span>
              </button>

              <button
                onClick={() => setViewMode('decide')}
                className={`relative px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer z-10 tracking-wide ${
                  viewMode === 'decide' 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'decide' && (
                  <motion.div
                    layoutId="mainNavIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Shuffle className="w-4 h-4" />
                <span>Decide Tonight</span>
              </button>

              <button
                onClick={() => setViewMode('profile')}
                className={`relative px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer z-10 tracking-wide ${
                  viewMode === 'profile' 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'profile' && (
                  <motion.div
                    layoutId="mainNavIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Dynamic Display Area based on Selected Tab */}
        <AnimatePresence mode="wait">
          {viewMode === 'home' && (
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
                onViewAllWatchlist={() => setViewMode('library')}
                onSelectMovie={(id) => setSelectedMovieId(id)}
                onAddMovie={handleAddSingleMovie}
                onMoviesAdded={handleAddMovies}
              />
            </motion.div>
          )}

          {viewMode === 'library' && (
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
                stats={stats}
                currentTab={currentTab}
                onChangeTab={setCurrentTab}
                searchQuery={searchQuery}
                onChangeSearch={setSearchQuery}
                onToggleWatched={handleToggleWatched}
                onDelete={handleDeleteMovie}
                onSelectMovie={(id) => setSelectedMovieId(id)}
                onGoToCapture={() => setViewMode('home')}
              />
            </motion.div>
          )}

          {viewMode === 'decide' && (
            <motion.div
              key="decide-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <WatchTonightModal
                movies={movies}
                onMarkWatched={handleToggleWatched}
                onSelectMovie={(id) => setSelectedMovieId(id)}
                isInline={true}
              />
            </motion.div>
          )}

          {viewMode === 'profile' && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <ProfileScreen
                movies={movies}
                stats={stats}
                onReplayOnboarding={handleResetOnboarding}
                activeIdentity={activeIdentity}
                onChangeIdentity={setActiveIdentity}
                userEmail="ashithsanjaynath9@gmail.com"
              />
            </motion.div>
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
              activeIdentity={activeIdentity}
              userEmail="ashithsanjaynath9@gmail.com"
            />
          )}
        </AnimatePresence>

        {/* Subtle, ultra-clean Footer */}
        <footer className="pt-16 border-t border-zinc-950 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-sans gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} CineSave.</p>
            <motion.button
              onClick={handleResetOnboarding}
              whileHover={{ scale: 1.02, color: "#7C8CFF" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer underline bg-transparent border-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Replay Guide
            </motion.button>
          </div>
          <p className="italic text-zinc-500">
            Your quiet cinematic archive. Made with care.
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
                <p className="text-xs font-sans font-medium text-emerald-400 leading-none">
                  {toast.message}
                </p>
                <p className="text-xs text-zinc-450 leading-normal font-normal pr-1">
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
