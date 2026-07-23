/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Tv, 
  Check, 
  Sparkles, 
  Bell, 
  Lock, 
  Download, 
  Info, 
  LogOut, 
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import { Movie, AppStats } from '../types';

import AuthModal from './AuthModal';

interface ProfileScreenProps {
  movies: Movie[];
  stats: AppStats;
  onReplayOnboarding: () => void;
  userEmail?: string;
  activeIdentity?: string;
  onChangeIdentity?: (id: any) => void;
  onUpdateEmail?: (email: string) => void;
}

export default function ProfileScreen({
  movies,
  stats,
  onReplayOnboarding,
  userEmail = 'cinephile@plot.com',
  activeIdentity,
  onChangeIdentity,
  onUpdateEmail
}: ProfileScreenProps) {
  
  // Calculate Favorite Genres from actual live movie list data
  const favoriteGenres = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach(m => {
      if (m.genres) {
        m.genres.forEach(g => {
          counts[g] = (counts[g] || 0) + 1;
        });
      }
    });
    
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    return sorted.length > 0 ? sorted.join(', ') : 'Drama, Thriller';
  }, [movies]);

  // Clean UI states for interactive settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateLibrary, setPrivateLibrary] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Real Export Library logic - triggers watchlist file download
  const handleExportLibrary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "plot_watchlist.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isLoggedOut) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center space-y-6 select-none font-sans" id="logged-out-state">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#7F72FF] mx-auto shadow-inner">
          <User className="w-6 h-6 text-[#7F72FF]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display italic text-zinc-100">Welcome back to plot</h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Sign in or create your plot to manage your movie recommendations and sync across devices.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto pt-2">
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="w-full py-2.5 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Welcome back to plot
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setAuthModalOpen(true);
            }}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Create your plot
          </button>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
          onAuthenticate={(email) => {
            setIsLoggedOut(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-6 px-4 text-zinc-100 font-sans select-none" id="profile-panel">
      
      {/* Page Heading aligned with other screens */}
      <div className="text-center sm:text-left space-y-1.5 pb-4 border-b border-zinc-900 select-none">
        <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500">
          Personal Preferences
        </p>
        <h2 className="text-3xl sm:text-4xl font-display font-light italic text-zinc-100">
          Profile Settings
        </h2>
        <p className="text-xs text-zinc-450 leading-relaxed max-w-sm">
          Manage your private database preferences, download archives, and view statistics.
        </p>
      </div>

      {/* 1. Spotify-style Minimal Avatar Header */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center text-xl shadow-md overflow-hidden shrink-0">
            <User className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="min-w-0 text-left">
            <h3 className="text-sm font-medium text-zinc-200 truncate">
              {userEmail.split('@')[0]}
            </h3>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[11px] font-medium rounded-lg text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setAuthModalOpen(true);
            }}
            className="px-2.5 py-1.5 bg-[#7F72FF]/15 hover:bg-[#7F72FF]/25 text-[11px] font-medium rounded-lg text-[#7F72FF] border border-[#7F72FF]/30 transition-all cursor-pointer"
          >
            Create Plot
          </button>
        </div>
      </div>

      {/* 2. Compact Statistics (Movies Saved, Movies Watched, Favorite Genres) */}
      <div className="space-y-2.5">
        <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500 px-1">Your Screening Stats</p>
        <div className="bg-zinc-900/30 border border-zinc-850/60 rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Plotted</span>
            <span className="font-mono text-zinc-200 bg-zinc-900/60 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
              {movies.length}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Movies Watched</span>
            <span className="font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded text-[11px]">
              {movies.filter(m => m.watched).length}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Favorite Genres</span>
            <span className="text-zinc-300 font-medium truncate max-w-[200px]" title={favoriteGenres}>
              {favoriteGenres}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Spotify-Style Calm Settings Area */}
      <div className="space-y-2.5">
        <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500 px-1">Settings & Privacy</p>
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-900">
          
          {/* Notifications Setting */}
          <div className="flex items-center justify-between p-4 hover:bg-zinc-900/35 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                <Bell className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-medium text-zinc-200">Notifications</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Alerts for newly curated recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-9 h-5 rounded-full p-[2.5px] transition-colors focus:outline-none cursor-pointer shrink-0 ${
                notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 hover:bg-zinc-900/35 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-medium text-zinc-200">Private Library</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Only accessible on this client device</p>
              </div>
            </div>
            <button
              onClick={() => setPrivateLibrary(!privateLibrary)}
              className={`w-9 h-5 rounded-full p-[2.5px] transition-colors focus:outline-none cursor-pointer shrink-0 ${
                privateLibrary ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                privateLibrary ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Export Library Setting */}
          <button
            onClick={handleExportLibrary}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/35 transition-colors text-left border-0 bg-transparent cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                <Download className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-medium text-zinc-200">Export Library</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Download your curated watchlist as JSON</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
          </button>

          {/* About Setting */}
          <button
            onClick={() => setShowAbout(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/35 transition-colors text-left border-0 bg-transparent cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                <Info className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-medium text-zinc-200">About plot</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Learn about this quiet cinematic sanctuary</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
          </button>

          {/* User Guide Replay trigger */}
          <button
            onClick={onReplayOnboarding}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/35 transition-colors text-left border-0 bg-transparent cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                <HelpCircle className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-medium text-zinc-200">Replay User Guide</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Launch the initial screen tutorial</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
          </button>

        </div>
      </div>

      {/* 4. Simple Logout Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 bg-zinc-900/40 hover:bg-red-550/10 border border-zinc-900 hover:border-red-500/25 rounded-2xl text-xs font-medium text-zinc-400 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of plot</span>
        </button>
      </div>

      {/* About plot Overlay Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-zinc-950 border border-zinc-850 rounded-2xl max-w-sm w-full p-6 text-left relative space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1.5 rounded-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1 select-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">plot</span>
                <h3 className="text-base font-display italic text-zinc-100">Quiet Sanctuary</h3>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed font-sans space-y-3">
                <p>
                  plot is designed as a peaceful, visual database for your curated plot. By eliminating aggressive algorithms, infinite scroll feeds, and comment section noise, we return control to the curator.
                </p>
                <p>
                  Plot movie suggestions immediately from messaging lists, podcasts, or friends. Categorize them under custom vibe tags, and let plot's calm recommendation assistant pick the absolute perfect choice for tonight.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowAbout(false)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-zinc-950 border border-zinc-850 rounded-2xl max-w-sm w-full p-6 text-left space-y-4 shadow-2xl"
            >
              <div className="space-y-1 select-none">
                <h3 className="text-sm font-sans font-medium text-zinc-100">Sign Out</h3>
                <p className="text-xs text-zinc-400 leading-normal font-normal">
                  Are you sure you want to sign out of plot? Your plot state will be securely preserved on this browser cache.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    setIsLoggedOut(true);
                  }}
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-600 text-white text-xs font-medium rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthenticate={(email) => {
          if (onUpdateEmail) onUpdateEmail(email);
        }}
      />

    </div>
  );
}
