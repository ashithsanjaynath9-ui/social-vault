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
  activeIdentity?: string;
  userEmail?: string;
}

export default function MovieDetailModal({ 
  movie, 
  onClose, 
  onToggleWatched, 
  onToggleFavorite,
  activeIdentity = 'bookmark',
  userEmail = 'cinephile@cinesave.com'
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

  const renderTactileIdentityCard = () => {
    const emailPrefix = userEmail.split('@')[0];
    const dateStr = new Date(movie.addedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    // Create a deterministic registry/serial number based on movie title length and year
    const yearNum = Number(movie.year) || 1990;
    const serialNum = (movie.title.length * 17 + yearNum) % 10000;

    switch (activeIdentity) {
      case 'bookmark':
        return (
          <div className="relative overflow-hidden bg-[#FDFBF7] text-[#3C3A36] rounded-2xl p-5 border border-[#EBE7DF] shadow-md font-sans space-y-4">
            {/* Top blue silk loop ribbon graphic */}
            <div className="absolute top-0 right-8 w-4 h-8 bg-[#7C8CFF] rounded-b-md shadow-sm z-10" />
            <div className="flex justify-between items-start border-b border-[#EBE7DF] pb-2.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B867A] font-mono">Le Signet Registry</span>
              <span className="text-[10px] font-mono text-[#8B867A]">No. CS-0{serialNum}</span>
            </div>
            <div className="space-y-2 text-left">
              <h5 className="font-display font-light italic text-lg text-[#1A1917] leading-tight">
                “Marking a chapter of your story.”
              </h5>
              <p className="text-xs text-[#5C574F] leading-relaxed">
                Saved under your personal library ribbon on <span className="font-medium text-[#1A1917]">{dateStr}</span>. This film is held safe for you until a quiet, reflective evening. No ads, no commercial rush.
              </p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#8B867A] pt-1.5 border-t border-dashed border-[#EBE7DF]">
              <span>CineSave Personal Collection</span>
              <span className="italic">ex libris {emailPrefix}</span>
            </div>
          </div>
        );

      case 'stub':
        return (
          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg select-none font-sans space-y-4">
            {/* Ticket semi-circular notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 z-10" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 z-10" />
            
            <div className="flex justify-between items-center border-b border-dashed border-zinc-800 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7C8CFF] animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400 font-mono">L’Entrée ticket</span>
              </div>
              <span className="text-[10px] font-mono text-[#7C8CFF] bg-[#7C8CFF]/10 px-2 py-0.5 rounded border border-[#7C8CFF]/20">ADMIT ONE</span>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-8 space-y-1.5 text-left">
                <h5 className="font-display font-light italic text-base text-zinc-200">
                  Private Cinema Invitation
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your ticket to a beautiful tonight. Reclaimed from social streams on <span className="text-zinc-300 font-medium">{dateStr}</span>.
                </p>
              </div>
              <div className="col-span-4 border-l border-zinc-800 pl-4 space-y-1 text-center font-mono">
                <p className="text-[9px] text-zinc-500 uppercase">Row / Seat</p>
                <p className="text-xs font-semibold text-zinc-200">A / 12</p>
                <p className="text-[8px] text-zinc-500 mt-1">NO. CST-{serialNum}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-3 border-t border-zinc-850">
              <span>Curator: <span className="font-mono text-zinc-400">{emailPrefix}</span></span>
              <span className="tracking-wide uppercase text-[9px] text-zinc-500">★ PRIVATE SCREENING</span>
            </div>
          </div>
        );

      case 'monogram':
        return (
          <div className="relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-lg font-sans space-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C8CFF]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-4">
              {/* Elegant seal monogram stamp */}
              <div className="w-12 h-12 rounded-full border border-[#7C8CFF]/30 flex items-center justify-center shrink-0 bg-[#7C8CFF]/5 shadow-inner">
                <div className="w-9 h-9 rounded-full border border-dashed border-[#7C8CFF]/20 flex items-center justify-center text-xs font-serif font-semibold text-[#7C8CFF] tracking-wider">
                  C • S
                </div>
              </div>

              <div className="space-y-1 text-left flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-widest font-semibold text-zinc-500 block">Ex Libris Certificate</span>
                <h5 className="font-display font-light italic text-base text-zinc-200">
                  The Curator's Stamp
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Certified as a permanent entry of <span className="text-zinc-300">{emailPrefix}</span>'s personal film library. Registered on <span className="text-zinc-400">{dateStr}</span>.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-3 border-t border-zinc-900/60">
              <span className="font-mono text-[9px]">REGISTRY NO. CS-{serialNum}</span>
              <span className="text-[#7C8CFF] bg-[#7C8CFF]/5 border border-[#7C8CFF]/10 px-2 py-0.5 rounded text-[9px] uppercase font-medium">Verified Curator Seal</span>
            </div>
          </div>
        );

      case 'shelf':
      default:
        return (
          <div className="relative overflow-hidden bg-zinc-900/35 border border-zinc-850 rounded-2xl p-5 shadow-lg font-sans space-y-4">
            {/* Visual indicator of wood spine line */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#7C8CFF]/60 to-transparent" />
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 font-sans">L’Étagère Catalogue</span>
              <span className="text-[10px] font-mono text-zinc-500">Slot #{serialNum % 100}</span>
            </div>

            <div className="space-y-1.5 text-left">
              <h5 className="font-display font-light italic text-base text-zinc-200">
                Cozy Collection Index
              </h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Resting safely on your physical wooden shelf under the category <span className="text-[#7C8CFF] font-medium">“{movie.vibe}”</span>. Placed with care on <span className="text-zinc-300 font-medium">{dateStr}</span>.
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2.5 border-t border-zinc-900/40">
              <span>Section: <span className="text-zinc-400">A</span></span>
              <span>Curated by: <span className="font-mono text-zinc-400">{emailPrefix}</span></span>
            </div>
          </div>
        );
    }
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
            <span className="text-xs font-sans text-zinc-500 font-normal">Archive entry</span>
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
              <span className="text-sm font-sans text-zinc-500 font-normal">({movie.year})</span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-600" />
              <span>Directed by <span className="text-zinc-200 font-normal">{movie.director}</span></span>
            </p>
          </div>

          {/* Quick specs pill row */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-sans font-medium text-[#7C8CFF] bg-[#7C8CFF]/5 border border-[#7C8CFF]/10 px-2.5 py-1 rounded">
              ✦ {movie.vibe}
            </span>
            {movie.runtime && (
              <span className="text-xs font-sans font-normal text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{movie.runtime}</span>
              </span>
            )}
            <span className="text-xs font-sans font-normal text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-zinc-500" />
              <span>{movie.language || 'English'}</span>
            </span>
            <span className="text-xs font-sans font-normal text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>⭐ {movie.rating}</span>
            </span>
          </div>

          {/* Genres row */}
          <div className="flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <span key={genre} className="text-xs font-sans font-normal text-zinc-500 bg-zinc-900/30 border border-zinc-900 px-2.5 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-sans font-medium text-zinc-500">Synopsis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{movie.synopsis}</p>
          </div>

          {/* Discovered / saved reason */}
          {movie.whySave && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-medium text-zinc-500">Why you saved this</h4>
              <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-xl text-xs text-zinc-300 italic leading-relaxed">
                "{movie.whySave}"
              </div>
            </div>
          )}

          {/* Handcrafted tactile catalog card reflecting the selected identity */}
          <div className="space-y-1.5 pt-1.5">
            <h4 className="text-xs font-sans font-medium text-zinc-500">CineSave Authenticity Seal</h4>
            {renderTactileIdentityCard()}
          </div>

          {/* Original source transcript stub */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-sans font-medium text-zinc-500">Source recommendation snippet</h4>
            <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
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
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#7C8CFF] hover:text-blue-300 transition-colors"
                >
                  <span>Link to source</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Streaming service match */}
          <div className="space-y-2">
            <h4 className="text-xs font-sans font-medium text-zinc-500">Available channels</h4>
            <div className="flex flex-wrap gap-1.5">
              {movie.streamingServices.map((srv) => (
                <span 
                  key={srv} 
                  className="text-xs font-sans font-normal text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
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
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 text-center shadow-lg shadow-blue-900/10 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
            <span>Search where to watch</span>
          </motion.a>

          {/* Mark watched checkbox */}
          <motion.button
            onClick={() => onToggleWatched(movie.id)}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
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
                <span>Mark watched</span>
              </>
            )}
          </motion.button>

        </div>

      </motion.div>
    </motion.div>
  );
}
