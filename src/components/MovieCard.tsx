/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { 
  Check, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Instagram, 
  Youtube, 
  Twitter, 
  Globe, 
  MessageSquare, 
  Flame, 
  Play, 
  Languages, 
  Clock, 
  Sparkles,
  PlayCircle,
  Star
} from 'lucide-react';
import { Movie } from '../types';
import { getRelativeTime, getTrailerUrl } from '../utils';

interface MovieCardProps {
  movie: Movie;
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (movie: Movie) => void;
}

export default function MovieCard({ movie, onToggleWatched, onDelete, onSelect }: MovieCardProps) {
  // 3D Tilt motion state
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Map social platforms to specific tailwind styles and glowing accents
  const getSocialStyle = (platform: Movie['socialSource']['platform']) => {
    switch (platform) {
      case 'instagram':
        return {
          bg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
          hoverGlow: 'group-hover:shadow-pink-500/5',
          label: 'Instagram Reel',
          icon: <Instagram className="w-3.5 h-3.5 text-pink-400" />,
          avatarColor: 'from-pink-500 via-purple-500 to-yellow-500'
        };
      case 'tiktok':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          hoverGlow: 'group-hover:shadow-cyan-500/5',
          label: 'TikTok Video',
          icon: <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />,
          avatarColor: 'from-black via-zinc-800 to-cyan-500'
        };
      case 'youtube':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          hoverGlow: 'group-hover:shadow-red-500/5',
          label: 'YouTube Short',
          icon: <Youtube className="w-3.5 h-3.5 text-red-400" />,
          avatarColor: 'from-red-600 to-red-400'
        };
      case 'twitter':
        return {
          bg: 'bg-sky-400/10 border-sky-400/20 text-sky-400',
          hoverGlow: 'group-hover:shadow-sky-400/5',
          label: 'Twitter/X',
          icon: <Twitter className="w-3.5 h-3.5 text-sky-400" />,
          avatarColor: 'from-sky-500 to-zinc-900'
        };
      case 'whatsapp':
        return {
          bg: 'bg-green-500/10 border-green-500/20 text-green-400',
          hoverGlow: 'group-hover:shadow-green-500/5',
          label: 'WhatsApp Share',
          icon: <MessageSquare className="w-3.5 h-3.5 text-green-400" />,
          avatarColor: 'from-green-600 to-emerald-400'
        };
      default:
        return {
          bg: 'bg-zinc-800 border-zinc-700/50 text-zinc-400',
          hoverGlow: 'group-hover:shadow-zinc-700/5',
          label: 'Saved',
          icon: <Globe className="w-3.5 h-3.5 text-zinc-400" />,
          avatarColor: 'from-zinc-700 to-zinc-500'
        };
    }
  };

  const social = getSocialStyle(movie.socialSource.platform);
  const searchUrl = getTrailerUrl(movie.title, movie.year);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      whileHover={{ y: -8, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      whileTap={{ scale: 0.985 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(movie)}
      className={`group relative bg-[rgba(24,24,24,0.92)] border border-[rgba(255,255,255,0.05)] rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col h-[520px] cursor-pointer hover:bg-[#202020] hover:shadow-[0px_18px_40px_rgba(0,0,0,0.35)] ${
        movie.watched 
          ? 'opacity-50 hover:opacity-80' 
          : ''
      }`}
    >
      {/* 3D Glass shine-sweep on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <div className="absolute -inset-y-12 -left-1/2 w-12 bg-white/10 blur-[16px] rotate-[30deg] transform translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-[1.2s] ease-out" />
      </div>

      {/* Holographic light reflection overlay guided by mouse */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-gradient-to-tr from-white via-transparent to-white z-20"
        style={{
          background: useTransform(
            [x, y],
            ([currX, currY]) => `radial-gradient(circle at ${(currX as number) * 100}% ${(currY as number) * 100}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)`
          )
        }}
      />

      {/* 1. Large Poster Section (Pinterest-meets-Spotify Cover style) */}
      <div className="relative h-64 shrink-0 overflow-hidden bg-zinc-900 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Dark Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-100" />

        {/* Top-left Badges: Vibe and Rating */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          <span className="text-[10px] font-mono tracking-wide bg-zinc-950/80 backdrop-blur-md text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
            ✦ {movie.vibe}
          </span>
          {movie.favorite && (
            <span className="text-[10px] font-mono tracking-wide bg-amber-950/95 backdrop-blur-md text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              Fav
            </span>
          )}
          {movie.confidence && (
            <span className="text-[10px] font-mono tracking-wide bg-emerald-950/90 backdrop-blur-md text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              {movie.confidence}% Match
            </span>
          )}
        </div>

        {/* Top-right Actions overlay */}
        <div className="absolute top-3.5 right-3.5 flex gap-1.5 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-y-[-4px] sm:group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(movie.id);
            }}
            className="p-2 bg-zinc-950/90 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl border border-zinc-800 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Delete from Watchlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Watch trailer overlay hover micro-interaction */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[1px]">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-transform duration-300 transform scale-90 group-hover:scale-100 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-widest border border-blue-400/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Trailer</span>
          </a>
        </div>

        {/* Dynamic Continue Watching Progress Bar */}
        {movie.progress !== undefined && movie.progress > 0 && !movie.watched && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-8">
            <div className="flex justify-between items-center mb-1 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              <span>Continue watching</span>
              <span className="text-blue-400">{movie.progress}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div 
                className="bg-blue-500 h-full rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all" 
                style={{ width: `${movie.progress}%` }} 
              />
            </div>
          </div>
        )}

        {/* Watched complete visual overlay */}
        {movie.watched && (
          <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: -6 }}
              className="text-xs font-mono uppercase tracking-widest bg-emerald-500/10 border-2 border-emerald-500/35 text-emerald-400 px-4 py-1.5 rounded-full font-bold shadow-lg shadow-emerald-500/10"
            >
              ✓ Done Watching
            </motion.div>
          </div>
        )}
      </div>

      {/* 2. Card Content details (Beautiful structured typography) */}
      <div className="p-4.5 flex-1 flex flex-col justify-between">
        
        <div className="space-y-3.5">
          {/* Platform Curation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${social.avatarColor} p-0.5 shadow-sm`}>
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-mono font-bold text-zinc-300">@</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[120px] font-sans">
                {movie.socialSource.author || social.label}
              </span>
            </div>

            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 font-semibold">
              <Calendar className="w-3 h-3 text-zinc-600" />
              {getRelativeTime(movie.addedAt)}
            </span>
          </div>

          {/* Film Title, Year & Director */}
          <div>
            <h3 className={`text-base font-display font-extrabold tracking-tight text-white flex items-center flex-wrap gap-1.5 ${movie.watched ? 'line-through text-zinc-500' : ''}`}>
              <span>{movie.title}</span>
              <span className="text-xs font-mono font-bold text-zinc-500">({movie.year})</span>
            </h3>
            <p className="text-[11px] text-zinc-400 truncate mt-1">
              Directed by <span className="font-semibold text-zinc-300">{movie.director}</span>
            </p>
          </div>

          {/* Speech bubbles style extracted reason */}
          {movie.whySave && (
            <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl px-3 py-2 text-[11px] text-zinc-300 leading-relaxed italic relative">
              <div className="absolute top-0 left-4 w-2.5 h-2.5 bg-zinc-900/40 border-l border-t border-zinc-900/80 transform rotate-45 -translate-y-[6px]" />
              <span className="text-zinc-400">"{movie.whySave}"</span>
            </div>
          )}

          {/* Synopsis */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>

          {/* Quick Specifications: Language, Runtime, Genres */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {/* Language */}
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <Languages className="w-2.5 h-2.5" />
              {movie.language || 'English'}
            </span>

            {/* Runtime */}
            {movie.runtime && (
              <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-zinc-500" />
                {movie.runtime}
              </span>
            )}

            {/* First two genres */}
            {movie.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[9px] font-sans font-medium text-zinc-500 bg-zinc-900/30 border border-zinc-900 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Rating & Interactive Watch/Done Checkbox */}
        <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between">
          {/* IMDb/RT score */}
          <span className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/15 flex items-center gap-1 shadow-sm">
            ⭐ {movie.rating}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Quick Trailer Button */}
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-1"
              title="Search trailer on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Trailer</span>
            </a>

            {/* Check Complete Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie.id);
              }}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 cursor-pointer font-mono font-bold text-[10px] uppercase tracking-wider ${
                movie.watched
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-850 text-zinc-400 hover:text-white'
              }`}
              title={movie.watched ? "Mark as Unwatched" : "Mark as Done Watching"}
            >
              <Check className={`w-3.5 h-3.5 ${movie.watched ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{movie.watched ? 'Watched' : 'Done'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Streaming providers lower bar with hover animation */}
      <div className="bg-zinc-900/30 px-4 py-2 border-t border-zinc-900/80 flex items-center gap-2 overflow-x-auto shrink-0 select-none">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-extrabold shrink-0">Streaming:</span>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {movie.streamingServices.map((srv) => (
            <span
              key={srv}
              className="text-[9px] font-mono font-bold text-zinc-300 bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 rounded uppercase tracking-wider hover:border-zinc-700 transition-colors shrink-0"
            >
              {srv}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
