/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  Tv, 
  Flame, 
  Instagram, 
  Youtube, 
  Clock, 
  Compass, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Heart,
  ChevronRight,
  MonitorPlay
} from 'lucide-react';
import { Movie } from '../types';
import { REEL_TEMPLATES, ReelTemplate } from '../data';
import { getTrailerUrl } from '../utils';

interface HomeScreenProps {
  movies: Movie[];
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectCollection: (template: ReelTemplate) => void;
  onViewAllWatchlist: () => void;
}

export default function HomeScreen({
  movies,
  onToggleWatched,
  onDelete,
  onSelectCollection,
  onViewAllWatchlist
}: HomeScreenProps) {
  // Filter unwatched movies with progress for "Continue Watching"
  const continueWatching = movies.filter(m => !m.watched && m.progress !== undefined && m.progress > 0);

  // Filter 4 newest unwatched movies for "Latest Saved Movies"
  const latestSaved = movies
    .filter(m => !m.watched)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 4);

  // Animation constants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 }
    }
  };

  return (
    <div className="space-y-16" id="premium-home-screen">
      
      {/* 1. Dynamic Hero Intro Banner - Apple Showcase style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="relative bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-zinc-900/40 border border-zinc-900/80 rounded-[28px] p-8 sm:p-12 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Apple subtle light reflections */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

        <div className="max-w-2xl space-y-6 text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/10 border border-blue-500/15 text-blue-400 rounded-full text-[10px] font-mono font-extrabold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI Curation Station
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-lg">
            Instagram reels to watchlists. <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Instantly.</span>
          </h2>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-md">
            Stop screenshotting screen captions and losing track of recommendations. Paste transcripts to build your beautifully organized private cinematic library.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-widest block">
              ✦ Offline Secured • No API limits • Fully automated
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Continue Watching (Horizontal Track with High-fidelity custom cells) */}
      {continueWatching.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                Continue Watching
              </h3>
            </div>
            <span className="text-[10px] bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full text-zinc-500 font-mono">
              {continueWatching.length} Active {continueWatching.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {continueWatching.map(movie => {
              const searchUrl = getTrailerUrl(movie.title, movie.year);
              return (
                <motion.div
                  key={movie.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                  className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/80 hover:border-zinc-800 rounded-2xl overflow-hidden p-4 flex gap-4 transition-all relative group shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.5)]"
                >
                  {/* Miniature Poster with Play Overlay */}
                  <div className="w-18 h-26 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-900 relative shadow-md">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <a 
                        href={searchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:scale-110 transition-transform flex items-center justify-center border border-white/20"
                        title="Watch Trailer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        {movie.director} • {movie.year}
                      </p>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-2 italic font-sans leading-relaxed">
                        "{movie.whySave}"
                      </p>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1.5 mt-2.5">
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                        <span>{movie.progress}% Completed</span>
                        <button 
                          onClick={() => onToggleWatched(movie.id)}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer font-bold"
                        >
                          Mark Done ✓
                        </button>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-900/60">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 rounded-full" 
                          style={{ width: `${movie.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* 3. Recently Extracted Collections (Visual Bento Cards) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Recently Extracted Collections
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Click to preview raw transcripts</span>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REEL_TEMPLATES.map(tmpl => {
            const platformStyles = {
              instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/15',
              tiktok: 'bg-teal-500/10 text-teal-400 border-teal-500/15',
              youtube: 'bg-red-500/10 text-red-400 border-red-500/15'
            };
            return (
              <motion.div
                key={tmpl.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
                className="bg-zinc-950/40 backdrop-blur-sm border border-zinc-900 hover:border-zinc-800 rounded-[22px] p-6 flex flex-col justify-between transition-all shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)] group relative overflow-hidden"
              >
                {/* Back glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/2 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/5 transition-all duration-300" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl select-none">{tmpl.icon}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 border rounded-full ${platformStyles[tmpl.platform]}`}>
                      {tmpl.platform}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                      {tmpl.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-semibold font-mono uppercase tracking-wider">
                      Discovered via {tmpl.creator}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                    3 Movies Extracted
                  </span>
                  <button
                    onClick={() => onSelectCollection(tmpl)}
                    className="text-xs bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Analyze Transcript</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. Latest Saved Movies (Horizontal Grid with streamlined quick card) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <MonitorPlay className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Latest Saved Movies
            </h3>
          </div>
          <button
            onClick={onViewAllWatchlist}
            className="text-[10px] font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>View Full Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestSaved.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {latestSaved.map(movie => {
              const searchUrl = getTrailerUrl(movie.title, movie.year);
              return (
                <motion.div
                  key={movie.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                  className="bg-zinc-950/40 backdrop-blur-md border border-zinc-900/80 hover:border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[290px] transition-all relative group shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
                >
                  <div className="relative h-34 shrink-0 bg-zinc-900 overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Tiny Platform overlay badge */}
                    <span className="absolute top-2.5 left-2.5 text-[8px] font-mono font-bold bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 border border-zinc-800/60 rounded-full text-zinc-400 uppercase tracking-widest">
                      {movie.socialSource.platform}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors tracking-tight">
                        {movie.title} <span className="text-[10px] font-mono text-zinc-500 font-medium">({movie.year})</span>
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-semibold font-mono uppercase tracking-wider mt-0.5">
                        Directed by {movie.director}
                      </p>
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 font-bold block w-fit mt-2">
                        ✦ {movie.vibe}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-900/60 text-[9px] font-mono">
                      <span className="text-amber-400 font-bold">⭐ {movie.rating}</span>
                      <div className="flex gap-2 font-bold uppercase tracking-wider">
                        <a 
                          href={searchUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-zinc-500 hover:text-white cursor-pointer"
                          title="Watch trailer"
                        >
                          Trailer
                        </a>
                        <button 
                          onClick={() => onToggleWatched(movie.id)}
                          className="text-green-400 hover:text-green-300 cursor-pointer font-bold"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* High-end minimalist empty state for saved movies */
          <div className="bg-zinc-950/40 border border-zinc-900 p-12 rounded-[24px] text-center max-w-md mx-auto space-y-4">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-850 text-zinc-600 rounded-xl flex items-center justify-center mx-auto">
              <Tv className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              No active unwatched saved films. Load a transcript collection above or paste a custom recommendation text to get started!
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
