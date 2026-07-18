/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Film, 
  Check, 
  Calendar, 
  Star, 
  Play, 
  Share2, 
  ExternalLink, 
  MessageSquare, 
  Flame, 
  Globe, 
  Youtube, 
  Instagram, 
  Twitter, 
  Clock, 
  Tag, 
  Languages, 
  User, 
  Sparkles,
  Heart,
  Volume2,
  Tv,
  Eye,
  Bookmark
} from 'lucide-react';
import { Movie } from '../types';
import { getTrailerUrl } from '../utils';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onToggleWatched: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function MovieDetailModal({ 
  movie, 
  onClose, 
  onToggleWatched, 
  onToggleFavorite 
}: MovieDetailModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Parallax / 3D tilt state for the poster
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!movie) return null;

  // Track mouse position over the poster card for interactive parallax/glare
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!posterRef.current) return;
    const card = posterRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to 0.5)
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    // Calculate rotation angles (max 15 degrees)
    setRotateX(-normalizedY * 15);
    setRotateY(normalizedX * 15);

    // Calculate glare coordinate percentages
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Vibe customized ambient light and styling
  const getVibeAtmosphere = (vibeStr: string) => {
    const v = vibeStr.toLowerCase();
    if (v.includes('mind') || v.includes('cosmic') || v.includes('reality') || v.includes('philosoph')) {
      return {
        glow: 'from-violet-600/30 via-indigo-500/20 to-fuchsia-600/10',
        badge: 'border-violet-500/30 text-violet-400 bg-violet-950/60',
        accent: 'text-violet-400',
        laserColor: 'rgba(168, 85, 247, 0.4)',
        glowClassName: 'bg-gradient-to-tr from-purple-900/40 via-violet-800/30 to-fuchsia-900/20'
      };
    }
    if (v.includes('adrenaline') || v.includes('action') || v.includes('neon') || v.includes('thrill')) {
      return {
        glow: 'from-cyan-500/30 via-teal-500/20 to-blue-600/10',
        badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/60',
        accent: 'text-cyan-400',
        laserColor: 'rgba(6, 182, 212, 0.4)',
        glowClassName: 'bg-gradient-to-tr from-cyan-900/40 via-teal-800/30 to-blue-900/20'
      };
    }
    if (v.includes('cozy') || v.includes('comfort') || v.includes('nostalgia') || v.includes('warm')) {
      return {
        glow: 'from-amber-600/30 via-orange-500/20 to-yellow-600/10',
        badge: 'border-amber-500/30 text-amber-400 bg-amber-950/60',
        accent: 'text-amber-400',
        laserColor: 'rgba(245, 158, 11, 0.4)',
        glowClassName: 'bg-gradient-to-tr from-amber-900/40 via-orange-800/30 to-yellow-950/20'
      };
    }
    if (v.includes('dark') || v.includes('horror') || v.includes('tension') || v.includes('crimson')) {
      return {
        glow: 'from-rose-800/30 via-red-950/20 to-zinc-900/30',
        badge: 'border-rose-500/30 text-rose-400 bg-rose-950/60',
        accent: 'text-rose-400',
        laserColor: 'rgba(244, 63, 94, 0.4)',
        glowClassName: 'bg-gradient-to-tr from-rose-950/50 via-red-900/30 to-zinc-950/30'
      };
    }
    // Default classy gold/slate
    return {
      glow: 'from-blue-600/20 via-zinc-800/20 to-indigo-600/10',
      badge: 'border-blue-500/20 text-blue-400 bg-zinc-950/80',
      accent: 'text-blue-400',
      laserColor: 'rgba(59, 130, 246, 0.3)',
      glowClassName: 'bg-gradient-to-tr from-blue-950/40 via-zinc-900/30 to-indigo-950/20'
    };
  };

  const vibeTheme = getVibeAtmosphere(movie.vibe);

  // Map social platforms to refined custom visual assets
  const getSocialStyle = (platform: Movie['socialSource']['platform']) => {
    switch (platform) {
      case 'instagram':
        return {
          bg: 'bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500',
          textColor: 'text-pink-400',
          bgGlass: 'bg-pink-500/5 border-pink-500/20',
          label: 'Instagram Reel',
          icon: <Instagram className="w-4 h-4" />
        };
      case 'tiktok':
        return {
          bg: 'bg-gradient-to-r from-zinc-950 via-teal-500 to-cyan-500',
          textColor: 'text-cyan-400',
          bgGlass: 'bg-cyan-500/5 border-cyan-500/20',
          label: 'TikTok Video',
          icon: <Flame className="w-4 h-4" />
        };
      case 'youtube':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-400',
          textColor: 'text-red-400',
          bgGlass: 'bg-red-500/5 border-red-500/20',
          label: 'YouTube Short',
          icon: <Youtube className="w-4 h-4" />
        };
      case 'twitter':
        return {
          bg: 'bg-sky-500',
          textColor: 'text-sky-400',
          bgGlass: 'bg-sky-500/5 border-sky-500/20',
          label: 'Twitter/X Post',
          icon: <Twitter className="w-4 h-4" />
        };
      case 'whatsapp':
        return {
          bg: 'bg-green-500',
          textColor: 'text-green-400',
          bgGlass: 'bg-green-500/5 border-green-500/20',
          label: 'WhatsApp Share',
          icon: <MessageSquare className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-zinc-700',
          textColor: 'text-zinc-400',
          bgGlass: 'bg-zinc-800/10 border-zinc-700/20',
          label: 'Saved Direct',
          icon: <Globe className="w-4 h-4" />
        };
    }
  };

  const social = getSocialStyle(movie.socialSource.platform);
  const searchUrl = getTrailerUrl(movie.title, movie.year);

  const handleShare = () => {
    const shareText = `Check out "${movie.title}" (${movie.year}) directed by ${movie.director}! Curated from ${social.label} because: "${movie.whySave}". Stream on: ${movie.streamingServices.join(', ')}.`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10 overflow-y-auto" 
      id="movie-detail-modal"
    >
      {/* Cinema Back-drop visual blur */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl cursor-pointer z-0"
      />

      {/* Ambient Subtle Glow - behind the content */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full blur-[160px] pointer-events-none opacity-30 mix-blend-screen z-0 bg-gradient-to-tr ${vibeTheme.glow}`} />

      {/* Modal Main Container: Physical Collectible Vault Card */}
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.94, y: 30 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.94, y: 30 }
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 170 }}
          className="relative w-full max-w-6xl bg-zinc-950/75 border border-zinc-800/60 rounded-[32px] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col lg:flex-row h-auto max-h-[92vh] lg:max-h-[85vh] z-10"
        >
          {/* Glass Overlay Glow Filter */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none z-10" />

          {/* Close button - Top Right Floating */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-3 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-white rounded-full backdrop-blur-md z-40 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Close Detail Vault"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN: Large Cinematic Poster with 3D Parallax & Ambient Light */}
          <div 
            className="relative w-full lg:w-[42%] shrink-0 h-[380px] sm:h-[480px] lg:h-auto bg-zinc-950 flex items-center justify-center p-6 md:p-8 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-900"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient colorful backdrop lights projecting onto the plate */}
            <div className={`absolute inset-0 filter blur-3xl opacity-25 scale-110 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-20'} ${vibeTheme.glowClassName}`} />

            {/* Collectible Frame with Parallax Tilt */}
            <motion.div
              ref={posterRef}
              style={{
                transformStyle: 'preserve-3d',
                rotateX: rotateX,
                rotateY: rotateY,
                boxShadow: isHovered 
                  ? '0 30px 60px -15px rgba(0,0,0,0.9), 0 0 40px 2px ' + vibeTheme.laserColor
                  : '0 15px 35px -10px rgba(0,0,0,0.8)'
              }}
              animate={{
                scale: isHovered ? 1.03 : 1
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative w-full max-w-[320px] lg:max-w-full aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between group cursor-grab select-none shadow-2xl"
            >
              {/* Giant Full-Bleed Poster Image */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Physical film strip decoration on margin overlays */}
              <div className="absolute left-2 top-0 bottom-0 w-2.5 flex flex-col justify-around pointer-events-none opacity-40 z-20">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-black rounded-sm border border-white/10" />
                ))}
              </div>
              <div className="absolute right-2 top-0 bottom-0 w-2.5 flex flex-col justify-around pointer-events-none opacity-40 z-20">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-black rounded-sm border border-white/10" />
                ))}
              </div>

              {/* Interactive glare reflection layer */}
              <div 
                className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 45%, transparent 65%)`,
                  mixBlendMode: 'overlay'
                }}
              />

              {/* Gradient Dark Wash (at bottom of poster card) */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

              {/* Top Row: Metallic Badge / Serial Overlay */}
              <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
                {/* Gold/Silver holographic style certification stamp */}
                <div className="flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-[9px] font-mono tracking-widest text-zinc-300 px-2.5 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-slow" />
                  <span>VAULT FILE // NO.{movie.id.slice(0,6).toUpperCase()}</span>
                </div>
                
                {/* Confidence percentage match badge */}
                {movie.confidence && (
                  <div className="bg-amber-500/10 border border-amber-500/35 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{movie.confidence}% MATCH</span>
                  </div>
                )}
              </div>

              {/* Watched Library Banner Overlay */}
              {movie.watched && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-20">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: -4, opacity: 1 }}
                    className="text-[11px] font-mono uppercase tracking-widest bg-emerald-500/25 border border-emerald-500/60 text-emerald-400 px-4 py-2 rounded-xl font-bold shadow-2xl filter backdrop-blur-md"
                  >
                    ✓ COMPLETED WATCH
                  </motion.div>
                </div>
              )}

              {/* Poster Card Bottom details (Title, Director, Year & Vibe label) */}
              <div className="relative z-20 p-5 pl-7 pr-7 text-left space-y-1.5 pointer-events-none">
                <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border ${vibeTheme.badge}`}>
                  ✦ {movie.vibe}
                </span>
                
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-tight filter drop-shadow-md">
                  {movie.title}
                </h2>
                
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>{movie.director}</span>
                  <span className="text-zinc-600">•</span>
                  <span>{movie.year}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Luxurious, Scrollable Info with Glass Overlays */}
          <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[50vh] lg:max-h-[85vh] space-y-8 no-scrollbar text-left z-20">
            
            {/* Header: Discovered From + Added At details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                {/* Platform Creator Avatar */}
                <div className={`p-[1px] rounded-full bg-zinc-800 border border-zinc-700/50 shadow-md`}>
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full bg-zinc-950 text-white ${social.textColor}`}>
                    {social.icon}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest leading-none">DISCOVERED VIA</p>
                  <p className="text-sm font-bold text-zinc-200 mt-1">{movie.socialSource.author || social.label}</p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest leading-none">ACQUIRED ON</p>
                <p className="text-xs font-semibold text-zinc-400 mt-1 flex items-center gap-1.5 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                  {new Date(movie.addedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Core Specs: Ribbon banner with premium stats */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-wrap gap-y-3 justify-between items-center text-xs text-zinc-400">
              {/* Year */}
              <div className="flex items-center gap-2 px-3">
                <Film className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">RELEASED</p>
                  <p className="font-mono font-bold text-zinc-200 mt-0.5">{movie.year}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-zinc-900" />

              {/* Runtime */}
              {movie.runtime && (
                <div className="flex items-center gap-2 px-3">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <div>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">RUNTIME</p>
                    <p className="font-mono font-bold text-zinc-200 mt-0.5">{movie.runtime}</p>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-zinc-900" />

              {/* Language */}
              <div className="flex items-center gap-2 px-3">
                <Languages className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">LANGUAGE</p>
                  <p className="font-mono font-bold text-zinc-200 mt-0.5">{movie.language || 'English'}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-zinc-900" />

              {/* Rating Stamp */}
              <div className="flex items-center gap-2 px-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <div>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">RATING</p>
                  <p className="font-mono font-extrabold text-amber-400 mt-0.5">{movie.rating}</p>
                </div>
              </div>
            </div>

            {/* Synopsis & Genres */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span 
                    key={g} 
                    className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/5 border border-blue-500/15 px-3 py-1 rounded-md uppercase tracking-wider"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {movie.synopsis}
              </p>
            </div>

            {/* REASON SAVED SECTION: Editorial Spotlight Quote */}
            {movie.whySave && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  // REASON FOR CURATION
                </h4>
                <div className="relative bg-gradient-to-r from-zinc-900/60 to-zinc-950/20 border border-zinc-900 rounded-2xl p-5 text-sm text-zinc-200 leading-relaxed">
                  {/* Glowing vertical side accent line */}
                  <div className={`absolute top-0 bottom-0 left-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${social.bg}`} />
                  
                  <span className="absolute top-2 right-4 text-6xl text-zinc-800/30 font-serif leading-none select-none pointer-events-none">”</span>
                  <div className="relative z-10 pl-2">
                    <p className="font-sans font-medium text-zinc-200 leading-relaxed italic">
                      "{movie.whySave}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ORIGINAL REEL TRANSCRIPT: Cinematic Curation Ticket Stub (Delight Moment 4) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  // CINEMATIC CURATION TICKET STUB
                </h4>
                <span className="text-[9px] font-mono text-zinc-600 font-bold">STUB // REF-REEL-2026</span>
              </div>

              {/* Physical Analog Ticket Stub Layout */}
              <div className="relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-inner group/ticket">
                {/* Semicircle Punch Hole Cutouts (Left & Right) */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-zinc-950 border-r border-zinc-900 -translate-y-1/2 z-20 pointer-events-none" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-zinc-950 border-l border-zinc-900 -translate-y-1/2 z-20 pointer-events-none" />

                {/* Vertical Dotted Tear Line (Hidden on mobile, showing on md+) */}
                <div className="hidden md:block absolute left-[196px] top-4 bottom-4 w-[1px] border-l border-dashed border-zinc-850 z-20 pointer-events-none" />

                {/* Ambient glow reflection sweeping across ticket */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
                  <div className="absolute -inset-y-12 -left-1/2 w-24 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-[25deg] transform translate-x-[-100%] group-hover/ticket:translate-x-[400%] transition-transform duration-[1.5s] ease-out" />
                </div>

                {/* Left Ticket Stub Section: Interactive Mock Preview */}
                <div className="relative shrink-0 w-[160px] h-[95px] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg group/reel z-10">
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter brightness-[0.25] blur-[1.5px]"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                  />
                  
                  <div className="absolute bottom-2.5 left-2.5 flex items-end gap-0.5 h-3 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md pointer-events-none">
                    <span className="text-[7px] font-mono text-zinc-400 font-bold uppercase tracking-wider mr-1">AUDIO</span>
                    <div className="w-0.5 h-2 bg-blue-400 animate-[pulse-slow_0.8s_infinite]" />
                    <div className="w-0.5 h-1.5 bg-blue-400 animate-[pulse-slow_1s_infinite]" />
                    <div className="w-0.5 h-2.5 bg-blue-400 animate-[pulse-slow_0.7s_infinite]" />
                  </div>

                  <span className={`absolute top-2 left-2 p-1 rounded-full text-white ${social.bg} scale-75 shadow-md`}>
                    {social.icon}
                  </span>

                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer group-hover/reel:scale-110 transition-transform duration-300">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Right Ticket Main Body Section */}
                <div className="flex-1 text-left space-y-2.5 pl-0 md:pl-6 z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded uppercase ${social.bgGlass} ${social.textColor} border border-white/[0.03]`}>
                      {social.label}
                    </span>
                    <span className="text-xs font-extrabold text-zinc-200">@{movie.socialSource.author || 'cinema_explorer'}</span>
                    <span className="text-[10px] text-zinc-500 font-mono italic font-medium">// Verified Extract</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-300 font-sans italic border-l-2 border-zinc-800 pl-3 py-0.5">
                    "{movie.socialSource.textSnippet || 'OMG this film is a cinematic visual masterpiece. The direction is unparalleled!'}"
                  </p>

                  {movie.socialSource.url && (
                    <a
                      href={movie.socialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors cursor-pointer hover:underline"
                    >
                      <span>Verify Source Reel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Streaming Outlets Block with Match Celebration (Delight Moment 5) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  // AVAILABLE CHANNELS TO STREAM
                </h4>
                
                {/* Dynamic Stream Match golden shimmer badge */}
                {movie.streamingServices && movie.streamingServices.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/25 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-purple-400 shadow-[0_0_15px_rgba(159,107,255,0.08)] tracking-wider uppercase"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                    <span>In-Theater Match</span>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.streamingServices.map((srv) => (
                  <span 
                    key={srv} 
                    className="text-xs font-mono font-bold text-zinc-200 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl uppercase tracking-wider flex items-center gap-2"
                  >
                    <Tv className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Film Credit Directory: Cast & Director board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  // FILM DIRECTION
                </h4>
                <div className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl">
                  <User className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-xs font-semibold text-zinc-300">{movie.director}</span>
                </div>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    // KEY CAST MEMBERS
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.map((actor) => (
                      <span 
                        key={actor} 
                        className="text-xs font-sans text-zinc-400 bg-zinc-900/20 border border-zinc-900 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
                      >
                        <User className="w-3 h-3 text-zinc-600" />
                        <span>{actor}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Progressive Playback Slider if progress exists */}
            {movie.progress !== undefined && movie.progress > 0 && !movie.watched && (
              <div className="space-y-2 p-4 bg-blue-950/5 border border-blue-500/10 rounded-2xl">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                  <span>RESUME PLAYBACK</span>
                  <span>{movie.progress}% PROGRESS</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              </div>
            )}

            {/* ACTION CENTER - Massive Interactive premium controls */}
            <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row gap-3 relative z-30">
              
              {/* PRIMARY ACTION CTA: "Watch Now" (YouTube Trailer trigger) */}
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-900/10 hover:shadow-blue-500/10 active:scale-98 group cursor-pointer text-center"
              >
                <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Watch Now (Trailer)</span>
              </a>

              {/* SECONDARY ACTION CTA: "Mark Watched Library" */}
              <button
                onClick={() => onToggleWatched(movie.id)}
                className={`py-4 px-6 rounded-2xl border font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                  movie.watched
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                {movie.watched ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
                    <span>Watched ✓</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <span>Mark Watched</span>
                  </>
                )}
              </button>

              {/* TERTIARY ACTION CTA: Favorite Heart Toggle */}
              <button
                onClick={() => onToggleFavorite(movie.id)}
                className={`py-4 px-4 rounded-2xl border flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                  movie.favorite
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                    : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                title={movie.favorite ? 'Remove Favorite' : 'Save as Favorite'}
              >
                <Heart className={`w-4 h-4 ${movie.favorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'}`} />
                <span className="sm:hidden lg:inline text-xs font-bold uppercase tracking-widest">
                  {movie.favorite ? 'FAVORITED' : 'FAVORITE'}
                </span>
              </button>

              {/* QUATERNARY ACTION CTA: Share Recommendation */}
              <button
                onClick={handleShare}
                className="py-4 px-4 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all relative active:scale-98"
                title="Share Collectible Card"
              >
                <Share2 className="w-4 h-4 text-zinc-400" />
                <span className="sm:hidden lg:inline">SHARE</span>

                {/* Absolute toast on copied action */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-blue-500 text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg uppercase tracking-wider whitespace-nowrap z-50 border border-blue-400/30"
                    >
                      Copied details!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
  );
}
