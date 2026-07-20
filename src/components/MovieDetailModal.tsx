/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  Calendar, 
  Star, 
  Share2, 
  ExternalLink, 
  Clock, 
  Languages, 
  User, 
  Heart,
  Tv,
  Eye,
  Globe
} from 'lucide-react';
import { Movie } from '../types';
import { getRelativeTime } from '../utils';

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

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${movie.title} ${movie.year} streaming showtimes where to watch`
  )}`;

  const handleShare = () => {
    const shareText = `"${movie.title}" (${movie.year}) directed by ${movie.director}. Saved from ${movie.socialSource.author || 'social reels'} because: "${movie.whySave || movie.socialSource.textSnippet || 'high recommendation'}". Stream on: ${movie.streamingServices.join(', ')}.`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      id="movie-detail-modal"
    >
      
      {/* Click backdrop to close */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Card - Styled like a clean Apple Notes detail pane */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 text-left font-sans text-zinc-100"
      >
        {/* Header Close Trigger */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans text-zinc-500 uppercase tracking-wider">Archive Entry</span>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(24, 24, 27, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
            title="Close Note"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh]">
          
          {/* Main Title, Director, and Year */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className={`text-3xl font-display font-light italic text-white tracking-tight ${movie.watched ? 'line-through text-zinc-500' : ''}`}>
                {movie.title}
              </h2>
              <span className="text-sm font-sans text-zinc-500 font-medium">({movie.year})</span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-600" />
              <span>Directed by <span className="text-zinc-200 font-medium">{movie.director}</span></span>
            </p>
          </div>

          {/* Quick specs pill row */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#B39CD0] bg-[#B39CD0]/5 border border-[#B39CD0]/10 px-2.5 py-1 rounded">
              ✦ {movie.vibe}
            </span>
            {movie.runtime && (
              <span className="text-[10px] font-sans font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{movie.runtime}</span>
              </span>
            )}
            <span className="text-[10px] font-sans font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded flex items-center gap-1">
              <Languages className="w-3 h-3 text-zinc-500" />
              <span>{movie.language || 'English'}</span>
            </span>
            <span className="text-[10px] font-sans font-bold text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>⭐ {movie.rating}</span>
            </span>
          </div>

          {/* Genres row */}
          <div className="flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <span key={genre} className="text-[9px] font-sans font-medium text-zinc-500 bg-zinc-900/30 border border-zinc-900 px-2 py-0.5 rounded">
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Synopsis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{movie.synopsis}</p>
          </div>

          {/* Discovered / saved reason */}
          {movie.whySave && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Why You Saved This</h4>
              <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-xl text-xs text-zinc-300 italic leading-relaxed">
                "{movie.whySave}"
              </div>
            </div>
          )}

          {/* Original source transcript stub */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Source Recommendation Snippet</h4>
            <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-sans">
                <span>Saved from @{movie.socialSource.author || 'creator'} via {movie.socialSource.platform}</span>
                <span>{getRelativeTime(movie.addedAt)}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                "{movie.socialSource.textSnippet || 'No original caption captured. Extracted directly.'}"
              </p>
              {movie.socialSource.url && (
                <a
                  href={movie.socialSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#B39CD0] hover:text-purple-300 transition-colors"
                >
                  <span>Link to source</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Streaming service match */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Available Channels</h4>
            <div className="flex flex-wrap gap-1.5">
              {movie.streamingServices.map((srv) => (
                <span 
                  key={srv} 
                  className="text-xs font-sans font-bold text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg uppercase flex items-center gap-1.5"
                >
                  <Tv className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{srv}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action controls footer */}
        <div className="bg-zinc-900/40 border-t border-zinc-900 px-5 py-4 flex flex-col sm:flex-row gap-2">
          
          {/* Main Action: Link out to actually watch the movie on stream platform/Google search */}
          <motion.a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 text-center shadow-lg shadow-blue-900/10 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
            <span>Search Where to Watch</span>
          </motion.a>

          {/* Mark watched checkbox */}
          <motion.button
            onClick={() => onToggleWatched(movie.id)}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className={`py-2.5 px-4 rounded-xl border font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer ${
              movie.watched
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {movie.watched ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Watched ✓</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Mark Watched</span>
              </>
            )}
          </motion.button>

        </div>

      </motion.div>
    </motion.div>
  );
}
