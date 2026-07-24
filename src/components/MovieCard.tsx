import React from 'react';
import { motion } from 'motion/react';
import { Movie } from '../types';
import { Film, Instagram, Video, Youtube, MessageCircle, Mic, Bookmark, Check } from 'lucide-react';
import { getMoviePalette } from '../utils/moviePalette';

interface MovieCardProps {
  key?: React.Key;
  movie: Movie;
  onClick: () => void;
  isCompleted?: boolean;
  onHoverStart?: (movie: Movie) => void;
  onHoverEnd?: () => void;
}

export default function MovieCard({ 
  movie, 
  onClick, 
  isCompleted = false,
  onHoverStart,
  onHoverEnd
}: MovieCardProps) {
  const palette = getMoviePalette(movie);

  // Source formatting - Appears ONLY on hover
  const getSourceDetails = () => {
    const platform = movie.socialSource?.platform;
    const author = movie.socialSource?.author;
    const why = movie.whySave;

    if (platform === 'instagram') {
      return { label: author ? `@${author.replace('@', '')}` : 'Instagram Reel', icon: Instagram };
    }
    if (platform === 'tiktok') {
      return { label: author ? `@${author.replace('@', '')}` : 'TikTok', icon: Video };
    }
    if (platform === 'youtube') {
      return { label: author ? author : 'YouTube', icon: Youtube };
    }
    if (platform === 'whatsapp') {
      return { label: author ? `Via ${author}` : 'Friend Rec', icon: MessageCircle };
    }
    
    if (why) {
      const whyLower = why.toLowerCase();
      if (whyLower.includes('instagram') || whyLower.includes('reel')) {
        return { label: 'Instagram Reel', icon: Instagram };
      }
      if (whyLower.includes('tiktok')) {
        return { label: 'TikTok', icon: Video };
      }
      if (whyLower.includes('youtube')) {
        return { label: 'YouTube', icon: Youtube };
      }
      if (whyLower.includes('friend') || whyLower.includes('chat') || whyLower.includes('alex') || whyLower.includes('sarah')) {
        return { label: 'Friend Rec', icon: MessageCircle };
      }
      if (whyLower.includes('podcast')) {
        return { label: 'Podcast', icon: Mic };
      }
      return { label: 'Plotted Rec', icon: Bookmark };
    }

    return { label: 'Plotted Rec', icon: Bookmark };
  };

  const source = getSourceDetails();
  const SourceIcon = source.icon;

  const streamingText = movie.streamingServices && movie.streamingServices.length > 0
    ? movie.streamingServices.slice(0, 2).join(' • ')
    : null;

  const isWatchedOrCompleted = isCompleted || movie.watched;

  return (
    <motion.div
      onMouseEnter={() => onHoverStart?.(movie)}
      onMouseLeave={() => onHoverEnd?.()}
      whileHover={{ y: -14, scale: 1.18 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={onClick}
      className="group relative flex flex-col cursor-pointer text-left select-none w-full hover:z-50 transition-all duration-300"
    >
      {/* Quiet Collectible Poster Container */}
      <div 
        style={{
          ['--glow-color' as any]: palette.glowColor,
          ['--color-1' as any]: palette.color1,
        }}
        className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition-all duration-300 group-hover:border-[var(--color-1)]/70 group-hover:ring-[var(--color-1)]/40 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.95),_0_0_35px_var(--glow-color)]"
      >
        
        {/* Subtle Spine Edge Highlight */}
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 via-white/10 to-transparent z-20 pointer-events-none" />
        
        {/* Glossy Diagonal Reflection Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

        {/* Subtle Completed/Watched Badge Indicator */}
        {isWatchedOrCompleted && (
          <div className="absolute top-2 left-2 z-30 pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0B0D12]/90 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-[10px] font-sans font-medium shadow-sm">
              <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
              <span>Watched</span>
            </div>
          </div>
        )}

        {/* Source Badge (ONLY Appears on Hover) */}
        <div className="absolute top-2 right-2 z-30 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0D12]/90 border border-white/20 backdrop-blur-md">
            <SourceIcon className="w-3 h-3 text-[var(--color-1)]" />
            <span className="text-[10px] font-sans font-medium text-zinc-200 tracking-tight max-w-[110px] truncate">
              {source.label}
            </span>
          </div>
        </div>

        {/* Poster Image - Always vibrant, colorful and un-faded */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-[1.04] opacity-95 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600 p-4 text-center">
            <Film className="w-7 h-7 mb-2 text-zinc-700 group-hover:text-[var(--color-1)] transition-colors" />
            <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{movie.title}</span>
          </div>
        )}
      </div>

      {/* Minimal Hierarchy Below Poster */}
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <h4 className="text-xs sm:text-[13px] font-sans font-medium text-zinc-200 truncate group-hover:text-white transition-colors" title={movie.title}>
          {movie.title}
        </h4>
        
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-zinc-500 font-normal truncate">
          <span className="font-mono text-zinc-400 shrink-0">{movie.year}</span>
          {streamingText && (
            <>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-400 font-sans truncate" title={streamingText}>
                {streamingText}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
