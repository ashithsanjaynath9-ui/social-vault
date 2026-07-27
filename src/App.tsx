/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, HelpCircle, Bookmark, Ticket, Compass, User, Film, Search, Menu, X, Smartphone } from 'lucide-react';
import { Movie, AppStats } from './types';
import { INITIAL_MOVIES } from './data';
import WatchlistDashboard from './components/WatchlistDashboard';
import CineSaveAssistant from './components/CineSaveAssistant';
import Onboarding from './components/Onboarding';
import HomeScreen from './components/HomeScreen';
import MovieDetailModal from './components/MovieDetailModal';
import ProfileScreen from './components/ProfileScreen';
import { IdentityId, IDENTITY_DIRECTIONS } from './components/BrandIdentity';
import GlobalSearch from './components/GlobalSearch';
import AuthModal from './components/AuthModal';
import ReservePage from './components/ReservePage';
import PlotLogo from './components/PlotLogo';
import { PWASplashScreen } from './components/PWASplashScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasPlottedFirstFilm, setHasPlottedFirstFilm] = useState<boolean>(() => {
    try {
      return localStorage.getItem('plot_first_film_plotted') === 'true';
    } catch {
      return false;
    }
  });
  const [isSeatReserved, setIsSeatReserved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('plot_seat_reserved') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<'second_movie' | 'sync_device' | 'save_permanent' | 'general'>('general');
  const [pendingAddMovies, setPendingAddMovies] = useState<Omit<Movie, 'id' | 'addedAt' | 'watched'>[] | null>(null);
  const [activeIdentity, setActiveIdentity] = useState<IdentityId>(() => {
    try {
      const saved = localStorage.getItem('plot_identity');
      return (saved as IdentityId) || 'bookmark';
    } catch {
      return 'bookmark';
    }
  });
  const [viewMode, setViewMode] = useState<'home' | 'library' | 'profile' | 'reserve'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.includes('/reserve') || path.includes('/invite') || path.includes('/premiere') ||
        hash.includes('reserve') || hash.includes('invite') || hash.includes('premiere')
      ) {
        return 'reserve';
      }
    }
    return 'home';
  });

  // Listen for URL changes
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.includes('/reserve') || path.includes('/invite') || path.includes('/premiere') ||
        hash.includes('reserve') || hash.includes('invite') || hash.includes('premiere')
      ) {
        setViewMode('reserve');
      }
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);
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
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(true);
  const [justFinishedOnboarding, setJustFinishedOnboarding] = useState<boolean>(false);

  // Premium Toast Notification State & Auto-dismiss
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
      if (onboardingStored === 'false') {
        setOnboardingComplete(false);
      } else {
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

  // Save onboarding state
  const handleCompleteOnboarding = () => {
    setOnboardingComplete(true);
    setJustFinishedOnboarding(true);
    localStorage.setItem('plot_onboarding_complete', 'true');
    setViewMode('home');
  };

  const handleResetOnboarding = () => {
    setOnboardingComplete(false);
    setJustFinishedOnboarding(false);
    localStorage.setItem('plot_onboarding_complete', 'false');
  };

  // 2. High-level dashboard statistics calculation
  const stats: AppStats = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    const watched = movies.filter(m => m.watched);
    const totalSaved = unwatched.length;
    const watchedCount = watched.length;
    const savedHours = Math.round(totalSaved * 2);

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
  const handleSeatReserved = (email: string, name?: string) => {
    setIsSeatReserved(true);
    localStorage.setItem('plot_seat_reserved', 'true');
    setUserEmail(email);

    if (pendingAddMovies && pendingAddMovies.length > 0) {
      const decorated: Movie[] = pendingAddMovies.map((m, idx) => ({
        ...m,
        id: `movie-${Date.now()}-${idx}-${Math.floor(Math.random() * 10000)}`,
        addedAt: new Date().toISOString(),
        watched: false,
      }));
      setMovies(prev => [...decorated, ...prev]);
      setPendingAddMovies(null);
      setCurrentTab('unwatched');
      setViewMode('library');
    }

    setToast({
      message: "Seat Reserved!",
      sub: `Welcome to plot early access, ${name || email.split('@')[0]}.`,
      visible: true
    });
  };

  const handleAddMovies = (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => {
    // If the user hasn't reserved early access seat and ALREADY plotted their 1st film, trigger early access modal for 2nd+ addition
    if (!isSeatReserved && hasPlottedFirstFilm) {
      setPendingAddMovies(newMovies);
      setAuthModalReason('second_movie');
      setIsAuthModalOpen(true);
      return;
    }

    // First extraction OR seat already reserved
    const decorated: Movie[] = newMovies.map((m, idx) => ({
      ...m,
      id: `movie-${Date.now()}-${idx}-${Math.floor(Math.random() * 10000)}`,
      addedAt: new Date().toISOString(),
      watched: false,
    }));
    
    setMovies(prev => [...decorated, ...prev]);
    setCurrentTab('unwatched');
    setViewMode('library');

    if (!hasPlottedFirstFilm) {
      setHasPlottedFirstFilm(true);
      localStorage.setItem('plot_first_film_plotted', 'true');
    }

    setToast({
      message: "Added to plot.",
      sub: `Successfully plotted ${newMovies.length} recommendations to your sanctuary.`,
      visible: true
    });
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

    if (!isSeatReserved && hasPlottedFirstFilm) {
      setPendingAddMovies([newMovie]);
      setAuthModalReason('second_movie');
      setIsAuthModalOpen(true);
      return;
    }

    const decorated: Movie = {
      ...newMovie,
      id: `movie-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      addedAt: new Date().toISOString(),
      watched: false,
    };
    setMovies(prev => [decorated, ...prev]);

    if (!hasPlottedFirstFilm) {
      setHasPlottedFirstFilm(true);
      localStorage.setItem('plot_first_film_plotted', 'true');
    }

    setToast({
      message: "Added to plot.",
      sub: `"${newMovie.title}" added to plot.`,
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
      <div className="min-h-screen bg-[#07060D] flex flex-col items-center justify-center font-sans relative overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C8CFF]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <PlotLogo variant="full" size="xl" animate="breathe" hoverGlow={false} />
          <p className="text-xs text-[#7A798C] font-sans font-light tracking-wide">Loading your plot sanctuary...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'reserve') {
    return (
      <ReservePage
        onReserveComplete={handleSeatReserved}
        onNavigateToApp={() => setViewMode('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F3] pb-28 md:pb-12 relative px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* PWA Native Features */}
      <PWASplashScreen />
      <OfflineBanner />
      <PWAInstallPrompt forceOpen={isPWAInstallOpen} onClose={() => setIsPWAInstallOpen(false)} />

      {/* Onboarding Overlay when user hasn't completed onboarding */}
      {!onboardingComplete && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto pt-2 sm:pt-6 space-y-6 sm:space-y-8 relative">
        
        {/* TOP BAR - Clean, mobile-first top navigation with plot icon, Reserve Your Seat, and Menu */}
        <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.08] -mx-4 px-4 sm:px-6 py-2.5 pt-safe flex items-center justify-between gap-3 shadow-md">
          {/* Left: plot icon */}
          <div 
            className="flex items-center gap-2 select-none cursor-pointer group active:scale-95 transition-transform" 
            onClick={() => setViewMode('home')}
            title="plot - Home"
          >
            <PlotLogo variant="full" size="sm" hoverGlow={true} />
          </div>

          {/* Right Controls: Reserve Your Seat + Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reserve Your Seat Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setViewMode('reserve')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#12131C] hover:bg-[#1C1D2A] border border-[#7F72FF]/40 hover:border-[#7F72FF]/80 text-[#E0DCFF] hover:text-white text-xs font-medium tracking-wide flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all shrink-0"
              title="Reserve Your Seat"
            >
              <Ticket className="w-3.5 h-3.5 text-[#8E7BFF]" />
              <span className="text-xs font-medium">Reserve Your Seat</span>
            </motion.button>

            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsMenuOpen(true)}
              className="px-3.5 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-medium tracking-wide flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4 text-[#A89CFF]" />
              <span className="text-xs font-medium">Menu</span>
            </motion.button>
          </div>
        </header>

        {/* SLIDE-OVER MENU DRAWER */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 flex justify-end font-sans">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative z-10 w-full max-w-xs sm:max-w-sm h-full bg-[#0C0D14] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <PlotLogo variant="full" size="sm" />
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div>
                    <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                      Search Movies
                    </label>
                    <GlobalSearch movies={movies} onAddMovie={handleAddSingleMovie} />
                  </div>

                  {/* Menu Nav Links */}
                  <div className="space-y-1.5 pt-2">
                    <button
                      onClick={() => { setViewMode('home'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        viewMode === 'home' 
                          ? 'bg-[#7F72FF]/20 text-white border border-[#7F72FF]/40 shadow-[0_0_15px_rgba(127,114,255,0.2)]' 
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-[#8E7BFF]" />
                      <span>Home</span>
                    </button>

                    <button
                      onClick={() => { setViewMode('library'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        viewMode === 'library' 
                          ? 'bg-[#7F72FF]/20 text-white border border-[#7F72FF]/40 shadow-[0_0_15px_rgba(127,114,255,0.2)]' 
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4 text-[#8E7BFF]" />
                        <span>Your Plot</span>
                      </div>
                      {movies.length > 0 && (
                        <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-[#7F72FF]/30 text-[#D2C9FF]">
                          {movies.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { setIsAssistantOpen(true); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#8E7BFF]" />
                      <span>Ask plot (AI Assistant)</span>
                    </button>

                    <button
                      onClick={() => { setViewMode('profile'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        viewMode === 'profile' 
                          ? 'bg-[#7F72FF]/20 text-white border border-[#7F72FF]/40 shadow-[0_0_15px_rgba(127,114,255,0.2)]' 
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4 text-[#8E7BFF]" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => { setViewMode('reserve'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        viewMode === 'reserve' 
                          ? 'bg-[#7F72FF]/20 text-white border border-[#7F72FF]/40 shadow-[0_0_15px_rgba(127,114,255,0.2)]' 
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <Ticket className="w-4 h-4 text-[#8E7BFF]" />
                      <span>Reserve Your Seat</span>
                    </button>

                    <button
                      onClick={() => { setIsPWAInstallOpen(true); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-[#7C8CFF] bg-[#7C8CFF]/10 hover:bg-[#7C8CFF]/20 border border-[#7C8CFF]/30 transition-all cursor-pointer mt-2"
                    >
                      <Smartphone className="w-4 h-4 text-[#7C8CFF]" />
                      <span>Install plot App</span>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-white/10 text-center">
                  <p className="text-xs text-zinc-500 font-serif italic">
                    plot &mdash; Less deciding. More watching.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Display Area based on Selected Tab */}
        <AnimatePresence mode="wait">
          {viewMode === 'home' && (
            <motion.div
              key="homescreen-view"
              initial={
                justFinishedOnboarding
                  ? { opacity: 0, scale: 0.96, filter: 'blur(8px)', y: 0 }
                  : { opacity: 0, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={
                justFinishedOnboarding
                  ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                  : { type: 'spring', stiffness: 350, damping: 30 }
              }
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
                autoFocusInput={justFinishedOnboarding}
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
                isSeatReserved={isSeatReserved}
                onOpenReserveModal={(reason) => {
                  setAuthModalReason(reason);
                  setIsAuthModalOpen(true);
                }}
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
                onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
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

        {/* Footer (FULL Logo for Premium Brand Moment) */}
        <footer className="pt-16 border-t border-zinc-950 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-sans gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <PlotLogo variant="full" size="sm" />
            <div className="flex flex-wrap items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-3 sm:pt-0 sm:pl-6">
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
              <button
                onClick={() => setViewMode('reserve')}
                className="text-zinc-500 hover:text-[#7F72FF] transition-colors cursor-pointer underline bg-transparent border-0"
              >
                Early Access Premiere
              </button>
            </div>
          </div>
          <p className="italic text-zinc-500 text-center sm:text-right">
            Your quiet cinematic archive. Made with care.
          </p>
        </footer>

        {/* Toast Notification */}
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

        {/* Global Floating AI Assistant */}
        <CineSaveAssistant
          movies={movies}
          onMarkWatched={handleToggleWatched}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          activeIdentity={activeIdentity}
          isOpenControlled={isAssistantOpen}
          onToggleControlled={setIsAssistantOpen}
        />

        {/* Early Access / Reserve Your Seat Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          reason={authModalReason}
          plottedCount={movies.length}
          onAuthenticate={handleSeatReserved}
        />

      </div>

      {/* NATIVE iOS BOTTOM NAVIGATION BAR (Visible on Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-[#090A10]/90 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-10px_35px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-around max-w-sm mx-auto relative">
          
          {/* 1. Home Tab */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setViewMode('home')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer relative z-10 min-w-[72px] ${
              viewMode === 'home' ? 'text-white' : 'text-[#7A798C] hover:text-[#C5C4D8]'
            }`}
          >
            {viewMode === 'home' && (
              <motion.div
                layoutId="mobileActiveTabHighlight"
                className="absolute inset-0 bg-[#7F72FF]/15 border border-[#7F72FF]/35 rounded-2xl shadow-[0_0_15px_rgba(127,114,255,0.25)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Compass className={`w-5 h-5 transition-transform ${viewMode === 'home' ? 'text-[#8E7BFF] scale-110' : ''}`} />
            <span className={`text-[11px] font-sans mt-1 tracking-tight z-10 ${viewMode === 'home' ? 'font-semibold text-white' : 'font-normal text-[#7A798C]'}`}>
              Home
            </span>
          </motion.button>

          {/* 2. Your Plot Tab */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setViewMode('library')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer relative z-10 min-w-[72px] ${
              viewMode === 'library' ? 'text-white' : 'text-[#7A798C] hover:text-[#C5C4D8]'
            }`}
          >
            {viewMode === 'library' && (
              <motion.div
                layoutId="mobileActiveTabHighlight"
                className="absolute inset-0 bg-[#7F72FF]/15 border border-[#7F72FF]/35 rounded-2xl shadow-[0_0_15px_rgba(127,114,255,0.25)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <div className="relative z-10">
              <Bookmark className={`w-5 h-5 transition-transform ${viewMode === 'library' ? 'text-[#8E7BFF] scale-110' : ''}`} />
              {movies.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#6E54FF] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-[#090A10] shadow-sm">
                  {movies.length}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-sans mt-1 tracking-tight z-10 ${viewMode === 'library' ? 'font-semibold text-white' : 'font-normal text-[#7A798C]'}`}>
              Your Plot
            </span>
          </motion.button>

          {/* 3. Profile Tab */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setViewMode('profile')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer relative z-10 min-w-[72px] ${
              viewMode === 'profile' ? 'text-white' : 'text-[#7A798C] hover:text-[#C5C4D8]'
            }`}
          >
            {viewMode === 'profile' && (
              <motion.div
                layoutId="mobileActiveTabHighlight"
                className="absolute inset-0 bg-[#7F72FF]/15 border border-[#7F72FF]/35 rounded-2xl shadow-[0_0_15px_rgba(127,114,255,0.25)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <User className={`w-5 h-5 transition-transform z-10 ${viewMode === 'profile' ? 'text-[#8E7BFF] scale-110' : ''}`} />
            <span className={`text-[11px] font-sans mt-1 tracking-tight z-10 ${viewMode === 'profile' ? 'font-semibold text-white' : 'font-normal text-[#7A798C]'}`}>
              Profile
            </span>
          </motion.button>

        </div>
      </nav>
    </div>
  );
}
