import React, { useState } from 'react';
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
  Heart
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

  if (!movie) return null;

  // Map social platforms to icons and backgrounds
  const getSocialStyle = (platform: Movie['socialSource']['platform']) => {
    switch (platform) {
      case 'instagram':
        return {
          bg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
          label: 'Instagram Reel',
          icon: <Instagram className="w-4 h-4 text-pink-400" />,
          avatarColor: 'from-pink-500 via-purple-500 to-yellow-500'
        };
      case 'tiktok':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          label: 'TikTok Video',
          icon: <Flame className="w-4 h-4 text-cyan-400" />,
          avatarColor: 'from-black via-zinc-800 to-cyan-500'
        };
      case 'youtube':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          label: 'YouTube Short',
          icon: <Youtube className="w-4 h-4 text-red-400" />,
          avatarColor: 'from-red-600 to-red-400'
        };
      case 'twitter':
        return {
          bg: 'bg-sky-400/10 border-sky-400/20 text-sky-400',
          label: 'Twitter/X',
          icon: <Twitter className="w-4 h-4 text-sky-400" />,
          avatarColor: 'from-sky-500 to-zinc-900'
        };
      case 'whatsapp':
        return {
          bg: 'bg-green-500/10 border-green-500/20 text-green-400',
          label: 'WhatsApp Share',
          icon: <MessageSquare className="w-4 h-4 text-green-400" />,
          avatarColor: 'from-green-600 to-emerald-400'
        };
      default:
        return {
          bg: 'bg-zinc-800 border-zinc-700/50 text-zinc-400',
          label: 'Saved Recommendation',
          icon: <Globe className="w-4 h-4 text-zinc-400" />,
          avatarColor: 'from-zinc-700 to-zinc-500'
        };
    }
  };

  const social = getSocialStyle(movie.socialSource.platform);
  const searchUrl = getTrailerUrl(movie.title, movie.year);

  const handleShare = () => {
    const shareText = `Check out "${movie.title}" (${movie.year}) directed by ${movie.director}! Curated from ${social.label} because: "${movie.whySave}". Stream on: ${movie.streamingServices.join(', ')}.`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" id="movie-detail-modal">
        {/* Backdrop visual blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh] z-10"
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-full backdrop-blur-md z-30 transition-all cursor-pointer"
            title="Close Detail Sheet"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left panel: Large Hero Poster */}
          <div className="relative w-full md:w-[42%] shrink-0 h-64 md:h-auto bg-zinc-900 group">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950/80 hidden md:block" />

            {/* Poster top overlays */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="text-xs font-mono tracking-wide bg-zinc-950/90 backdrop-blur-md text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                ✦ {movie.vibe}
              </span>
              {movie.confidence && (
                <span className="text-xs font-mono tracking-wide bg-emerald-950/90 backdrop-blur-md text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {movie.confidence}% Match
                </span>
              )}
            </div>

            {/* Interactive Progress overlay on Poster bottom */}
            {movie.progress !== undefined && movie.progress > 0 && !movie.watched && (
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-2xl border border-zinc-800/40">
                <div className="flex justify-between items-center mb-1 text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                  <span>Progress bar</span>
                  <span className="text-blue-400">{movie.progress}% Watched</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Done Watching visual badge */}
            {movie.watched && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] z-20">
                <div className="text-sm font-mono uppercase tracking-widest bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 px-5 py-2.5 rounded-full font-bold shadow-xl rotate-[-4deg]">
                  ✓ Finished watching
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Content & Actions (Scrollable) */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 md:max-h-[85vh] no-scrollbar">
            {/* Header Platform discovery info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${social.avatarColor} p-0.5 shadow-md`}>
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-zinc-300">@</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono font-bold uppercase tracking-wider">Discovered Via</p>
                  <p className="text-sm font-bold text-zinc-200">{movie.socialSource.author || social.label}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-zinc-500 font-mono font-bold uppercase tracking-wider">Added to watch list</p>
                <p className="text-sm font-bold text-zinc-300 flex items-center gap-1.5 md:justify-end">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {new Date(movie.addedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Title & Core Metadata */}
            <div className="space-y-2">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white leading-tight">
                    {movie.title}
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Directed by <span className="font-semibold text-zinc-200">{movie.director}</span>
                  </p>
                </div>
                
                {/* Rating badge */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shrink-0 shadow-md">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-mono font-extrabold text-amber-400">{movie.rating} Rating</span>
                </div>
              </div>

              {/* Specs grid */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {/* Year */}
                <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-850 text-zinc-300 px-3 py-1 rounded-xl">
                  {movie.year}
                </span>

                {/* Runtime */}
                {movie.runtime && (
                  <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-850 text-zinc-300 px-3 py-1 rounded-xl flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {movie.runtime}
                  </span>
                )}

                {/* Language */}
                <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-850 text-zinc-300 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-zinc-400" />
                  {movie.language || 'English'}
                </span>
              </div>
            </div>

            {/* Genres Tag block */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span 
                    key={g} 
                    className="text-xs font-sans font-semibold text-blue-400 bg-blue-500/5 border border-blue-500/15 px-3 py-1 rounded-xl"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Synopsis</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            {/* Recommended Because... Section */}
            {movie.whySave && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Recommended Because...</h4>
                <div className="relative bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 text-sm text-zinc-200 leading-relaxed italic">
                  <span className="absolute top-2 left-3 text-4xl text-blue-500/10 font-serif leading-none select-none">“</span>
                  <div className="pl-6 relative z-10">
                    "{movie.whySave}"
                  </div>
                </div>
              </div>
            )}

            {/* Cast section */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Cast & Starring</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {movie.cast.map((actor) => (
                    <div 
                      key={actor} 
                      className="flex items-center gap-2 bg-zinc-900/30 border border-zinc-900 px-3 py-2 rounded-xl text-xs text-zinc-300 font-sans"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Reel Info transcript snippet */}
            <div className="space-y-2 border-t border-zinc-900 pt-5">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                {social.icon}
                <span>Curated Source Transcript</span>
              </h4>
              <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-2xl p-4 space-y-2 text-xs text-zinc-400">
                <p className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest">
                  Creator Comment Highlight:
                </p>
                <p className="italic leading-relaxed">
                  "{movie.socialSource.textSnippet || 'This movie came highly recommended in an elite cinematic round-up.'}"
                </p>
                {movie.socialSource.url && (
                  <a
                    href={movie.socialSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 hover:underline inline-flex"
                  >
                    <span>View original Reel/TikTok post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Streaming Outlets block */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Available Streaming Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {movie.streamingServices.map((srv) => (
                  <span 
                    key={srv} 
                    className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-xl uppercase tracking-wider hover:border-zinc-700 transition-colors"
                  >
                    🎬 {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons row */}
            <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
              {/* Mark Watched toggle */}
              <button
                onClick={() => onToggleWatched(movie.id)}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  movie.watched
                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-850 text-zinc-300 hover:text-white'
                }`}
              >
                <Check className={`w-4 h-4 ${movie.watched ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{movie.watched ? 'Watched ✓' : 'Mark Watched'}</span>
              </button>

              {/* Favorite toggle */}
              <button
                onClick={() => onToggleFavorite(movie.id)}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  movie.favorite
                    ? 'bg-amber-500/10 border-amber-500/35 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-850 text-zinc-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${movie.favorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'}`} />
                <span>{movie.favorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              {/* Trailer youtube search */}
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-blue-500/20 shadow-md shadow-blue-500/5 text-center"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Play Trailer</span>
              </a>

              {/* Share recommendation */}
              <button
                onClick={handleShare}
                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all relative"
              >
                <Share2 className="w-4 h-4 text-zinc-400" />
                <span>Share</span>

                {/* Copied visual notification absolute toast */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-blue-500 text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg uppercase tracking-wider whitespace-nowrap z-40 border border-blue-400/30"
                    >
                      Copied Details!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
