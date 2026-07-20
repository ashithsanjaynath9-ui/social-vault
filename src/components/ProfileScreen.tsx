/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Tv, 
  Check, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  Film,
  Camera,
  LogOut,
  Calendar
} from 'lucide-react';
import { Movie, AppStats } from '../types';
import { IdentityId, IdentityShowcase } from './BrandIdentity';

interface ProfileScreenProps {
  movies: Movie[];
  stats: AppStats;
  onReplayOnboarding: () => void;
  userEmail?: string;
  activeIdentity: IdentityId;
  onChangeIdentity: (id: IdentityId) => void;
}

export default function ProfileScreen({
  movies,
  stats,
  onReplayOnboarding,
  userEmail = 'cinephile@cinesave.com',
  activeIdentity,
  onChangeIdentity
}: ProfileScreenProps) {
  
  // Calculate some fun curated metrics for the Profile screen
  const recentWatched = useMemo(() => {
    return movies
      .filter(m => m.watched)
      .sort((a, b) => {
        const dateA = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
        const dateB = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [movies]);

  // Determine Curating Level title
  const curatingLevel = useMemo(() => {
    const total = movies.length;
    if (total === 0) return 'Novice Archivist';
    if (total <= 5) return 'Cinema Explorer';
    if (total <= 12) return 'Aesthetic Selector';
    return 'Master Curator';
  }, [movies]);

  return (
    <div className="max-w-xl mx-auto space-y-10 py-6 px-4 text-zinc-100 font-sans" id="profile-panel">
      
      {/* 1. Header & Identity Card */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-zinc-850 to-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl shadow-lg relative overflow-hidden select-none">
            👤
          </div>
          <div className="absolute -bottom-1 -right-1 bg-zinc-950 border border-zinc-800 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
            ✨
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-display font-light italic text-zinc-100">
            {userEmail.split('@')[0]}
          </h2>
          <p className="text-[11px] font-sans tracking-wider text-zinc-400 uppercase">
            {curatingLevel} • Curator since 2026
          </p>
        </div>
      </div>

      {/* 2. Sleek Core Statistics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 text-center space-y-1.5">
          <p className="text-[10px] font-sans tracking-wider text-zinc-500 uppercase">In Shelf</p>
          <p className="text-xl font-normal text-zinc-100">{stats.totalSaved}</p>
          <p className="text-[9px] text-zinc-500 font-sans">unwatched films</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 text-center space-y-1.5">
          <p className="text-[10px] font-sans tracking-wider text-zinc-500 uppercase">Watched</p>
          <p className="text-xl font-normal text-[#B39CD0]">{stats.watchedCount}</p>
          <p className="text-[9px] text-zinc-500 font-sans">completed journeys</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850/60 text-center space-y-1.5">
          <p className="text-[10px] font-sans tracking-wider text-zinc-500 uppercase">Top Vibe</p>
          <p className="text-xs font-normal text-zinc-200 line-clamp-1 py-1 truncate" title={stats.topVibe}>
            {stats.topVibe}
          </p>
          <p className="text-[9px] text-zinc-500 font-sans">aesthetic focus</p>
        </div>
      </div>

      {/* 3. Recently Watched Timeline (Only if present) */}
      {recentWatched.length > 0 && (
        <div className="space-y-3.5">
          <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest">
            Your Recent Screening Log
          </p>
          <div className="space-y-2.5">
            {recentWatched.map((movie) => (
              <div 
                key={movie.id} 
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/20 border border-zinc-900"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-12 rounded bg-zinc-950 overflow-hidden border border-zinc-850 shrink-0">
                    {movie.posterUrl ? (
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px]">
                        🍿
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-normal text-zinc-100 truncate">{movie.title}</p>
                    <p className="text-[10px] text-zinc-500">{movie.year} • {movie.director}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Watched</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.5 Timeless Brand Identity Directions */}
      <div className="p-5 rounded-2xl bg-zinc-900/10 border border-zinc-900/60 space-y-6">
        <IdentityShowcase activeId={activeIdentity} onChangeIdentity={onChangeIdentity} />
      </div>

      {/* 4. Preference Insights & Level Milestones */}
      <div className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900/60 space-y-4">
        <h3 className="text-xs font-sans uppercase tracking-wider text-zinc-400">
          Curator's Path
        </h3>
        
        <div className="space-y-4 text-xs font-normal text-zinc-400 leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium text-zinc-200">The Ultimate Film Inbox</p>
              <p className="text-[11px] text-zinc-500">You've saved a total of {movies.length} custom movie recommendations found in Instagram Reels, TikTok, or podcasts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium text-zinc-200">Save hours calculated</p>
              <p className="text-[11px] text-zinc-500">You have curated approximately {stats.savedHours} hours of cinematic content awaiting your attention.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Clear, Non-Competing Settings Area */}
      <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-0.5">
          <p className="text-xs font-medium text-zinc-300">Need help curating?</p>
          <p className="text-[10px] text-zinc-500">Replay the introductory interactive tour guide at any time.</p>
        </div>

        <motion.button
          onClick={onReplayOnboarding}
          whileHover={{ scale: 1.02, color: "#FAF6F0", borderColor: "#3f3f46" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Replay User Guide</span>
        </motion.button>
      </div>

    </div>
  );
}
