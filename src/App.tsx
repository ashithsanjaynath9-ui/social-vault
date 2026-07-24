/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, Tv, Check, Flame, Play, Trash, Search, Shuffle, Calendar, RefreshCw, Compass, HelpCircle, X, User, Bookmark } from 'lucide-react';
import { Movie, AppStats } from './types';
import { INITIAL_MOVIES, ReelTemplate } from './data';
import { parseRuntimeMinutes } from './utils';
import WatchlistDashboard from './components/WatchlistDashboard';
import CineSaveAssistant from './components/CineSaveAssistant';
import Onboarding from './components/Onboarding';
import HomeScreen from './components/HomeScreen';
import MovieDetailModal from './components/MovieDetailModal';
import ProfileScreen from './components/ProfileScreen';
import { IdentityId, IDENTITY_DIRECTIONS } from './components/BrandIdentity';
import GlobalSearch from './components/GlobalSearch';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIdentity, setActiveIdentity] = useState<IdentityId>(() => {
    try {
      const saved = localStorage.getItem('plot_identity');
      return (saved as IdentityId) || 'bookmark';
    } catch {
      return 'bookmark';
    }
  });
  const [viewMode, setViewMode] = useState<'home' | 'library' | 'profile'>('home');
  const [currentTab, setCurrentTab] = useState<'unwatched' | 'watched' | 'all'>('unwatched');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Computed selected movie
  const selectedMovie = useMemo(() => {
    return movies.find(m => m.id === selectedMovieId) || null;
  }, [movies, selectedMovieId]);

  // Selected Brand Identity Metadata
  const selectedIdentity = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentity) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentity]);

  // User Account & Onboarding State
  const [userEmail, setUserEmail] = useState<string>('batman@gotham.com');
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
      const stored = localStorage.getItem('plot_watchlist') || localStorage.getItem('cine_extractor_watchlist');
      if (stored) {
        setMovies(JSON.parse(stored));
      } else {
        // Hydrate with default elegant curated movies if empty
        setMovies(INITIAL_MOVIES);
        localStorage.setItem('plot_watchlist', JSON.stringify(INITIAL_MOVIES));
      }

      // Load onboarding progress state
      const onboardingStored = localStorage.getItem('plot_onboarding_complete') || localStorage.getItem('cine_save_onboarding_complete');
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
      localStorage.setItem('plot_watchlist', JSON.stringify(movies));
    }
  }, [movies, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('plot_identity', activeIdentity);
    }
  }, [activeIdentity, isLoaded]);

  // Keyboard shortcut listener for global search modal (Cmd+K / Ctrl+K)
  // Save onboarding state
  const handleCompleteOnboarding = () => {
    setOnboardingComplete(true);
    localStorage.setItem('plot_onboarding_complete', 'true');
    setViewMode('home');
  };

  const handleResetOnboarding = () => {
    setOnboardingComplete(false);
    localStorage.removeItem('plot_onboarding_complete');
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
      message: "Added to plot.",
      sub: `Successfully plotted ${newMovies.length} recommendations.`,
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
          message: "Moved to Watched",
          sub: `"${movieTitle}" marked as watched.`,
          visible: true
        });
      } else {
        setToast({
          message: "Returned to plot.",
          sub: `"${movieTitle}" moved back to your active plot.`,
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
      setToast({
        message: "Already Plotted",
        sub: `"${newMovie.title}" is already in your plot.`,
        visible: true
      });
      return;
    }
    const decorated: Movie = {
      ...newMovie,
      id: `movie-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      addedAt: new Date().toISOString(),
      watched: false,
    };
    setMovies(prev => [decorated, ...prev]);
    setToast({
      message: "Added to plot.",
      sub: `"${newMovie.title}" added to plot.`,
      visible: true
    });
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
            <p className="text-xs text-zinc-500 font-sans">Loading your plot...</p>
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
    <div className="min-h-screen bg-[#050505] text-[#F5F5F3] pb-6 relative px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto pt-4 sm:pt-6 space-y-8 relative">
        
        {/* Header Branding section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#14151E]">
          
          {/* Left: Logo with Bookmark Icon & Subtitle */}
          <div 
            className="flex items-center gap-3.5 select-none cursor-pointer group" 
            onClick={() => setViewMode('home')}
          >
            <div className="w-[42px] h-[42px] rounded-xl bg-[#0E0F18] border border-[#2D2A4A] flex items-center justify-center text-[#8E7BFF] shadow-[0_0_20px_rgba(142,123,255,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#8E7BFF]/60 group-hover:shadow-[0_0_28px_rgba(142,123,255,0.5)]">
              <Bookmark className="w-[20px] h-[20px] fill-[#8E7BFF]/30 text-[#9E8FFF] stroke-[1.75]" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-sans font-semibold text-[22px] sm:text-[25px] text-[#F7F7F8] tracking-[-0.03em] leading-none lowercase antialiased">
                plot
              </span>
              <span className="text-[11px] sm:text-xs text-[#7A798C] font-sans font-normal leading-none mt-1.5 tracking-normal">
                Less deciding. More watching.
              </span>
            </div>
          </div>

          {/* Center: Navigation Links (Home, Your Plot, Profile) with Glowing Active Bar */}
          <nav className="flex items-center gap-8 py-1" id="main-tabs-nav">
            <button
              onClick={() => setViewMode('home')}
              className={`relative py-1 text-xs sm:text-sm font-medium transition-all cursor-pointer tracking-wide ${
                viewMode === 'home' ? 'text-[#F5F5F3]' : 'text-[#7A798C] hover:text-[#F5F5F3]'
              }`}
            >
              <span>Home</span>
              {viewMode === 'home' && (
                <motion.div
                  layoutId="mainNavIndicator"
                  className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#8E7BFF] shadow-[0_0_12px_#8E7BFF]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            
            <button
              onClick={() => setViewMode('library')}
              className={`relative py-1 text-xs sm:text-sm font-medium transition-all cursor-pointer tracking-wide ${
                viewMode === 'library' ? 'text-[#F5F5F3]' : 'text-[#7A798C] hover:text-[#F5F5F3]'
              }`}
            >
              <span>Your Plot</span>
              {viewMode === 'library' && (
                <motion.div
                  layoutId="mainNavIndicator"
                  className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#8E7BFF] shadow-[0_0_12px_#8E7BFF]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => setViewMode('profile')}
              className={`relative py-1 text-xs sm:text-sm font-medium transition-all cursor-pointer tracking-wide ${
                viewMode === 'profile' ? 'text-[#F5F5F3]' : 'text-[#7A798C] hover:text-[#F5F5F3]'
              }`}
            >
              <span>Profile</span>
              {viewMode === 'profile' && (
                <motion.div
                  layoutId="mainNavIndicator"
                  className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#8E7BFF] shadow-[0_0_12px_#8E7BFF]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </nav>

          {/* Right: Search & DECIDE TONIGHT Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="w-full md:w-64">
              <GlobalSearch movies={movies} onAddMovie={handleAddSingleMovie} />
            </div>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5035E6] via-[#7F72FF] to-[#8E7BFF] hover:opacity-95 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(127,114,255,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span className="hidden sm:inline">Ask plot</span>
            </button>
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
                onOpenAssistant={() => setIsAssistantOpen(true)}
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
                userEmail={userEmail}
                onUpdateEmail={setUserEmail}
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
              userEmail={userEmail}
            />
          )}
        </AnimatePresence>

        {/* Subtle, ultra-clean Footer */}
        <footer className="pt-16 border-t border-zinc-950 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-sans gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} plot.</p>
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

        {/* Global Floating AI Decider Assistant Drawer */}
        <CineSaveAssistant
          movies={movies}
          onMarkWatched={handleToggleWatched}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          activeIdentity={activeIdentity}
          isOpenControlled={isAssistantOpen}
          onToggleControlled={setIsAssistantOpen}
        />

      </div>
    </div>
  );
}
