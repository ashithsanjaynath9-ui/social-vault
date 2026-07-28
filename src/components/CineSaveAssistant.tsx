/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowUpRight,
  Search,
  ArrowRight,
  RotateCcw,
  Film
} from 'lucide-react';
import { Movie } from '../types';
import { PlotIcon } from './PlotLogo';

interface CineSaveAssistantProps {
  movies: Movie[];
  onMarkWatched: (id: string) => void;
  onSelectMovie: (id: string) => void;
  activeIdentity?: string;
  isOpenControlled?: boolean;
  onToggleControlled?: (open: boolean) => void;
}

interface SuggestedPrompt {
  id: string;
  label: string;
  keywords: string[];
  aiNote: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'mind_bending',
    label: 'Recommend something mind-bending.',
    keywords: ['sci-fi', 'mind-bending', 'puzzle', 'cerebral', 'mystery', 'psychological', 'cosmic', 'thriller'],
    aiNote: 'Here are the most intellectually stimulating, mind-bending films from your saved plot archive:'
  },
  {
    id: 'cry',
    label: 'I want to cry.',
    keywords: ['drama', 'romance', 'emotional', 'melancholic', 'heartfelt', 'sad', 'touching', 'tragic'],
    aiNote: 'Deep, emotionally resonant stories plotted in your archive for a cathartic evening:'
  },
  {
    id: 'friends',
    label: 'Movie night with friends.',
    keywords: ['comedy', 'thriller', 'action', 'fun', 'adrenaline', 'sci-fi', 'horror', 'fast'],
    aiNote: 'High-energy, crowd-pleasing films perfect for a group movie night:'
  },
  {
    id: 'hidden_gems',
    label: 'Hidden gems.',
    keywords: ['indie', 'cult', 'hidden', 'masterpiece', 'underrated', 'artistic', 'quirky'],
    aiNote: 'Overlooked masterpieces and quiet gems waiting in your personal archive:'
  }
];

export default function CineSaveAssistant({ 
  movies, 
  onMarkWatched, 
  onSelectMovie,
  isOpenControlled,
  onToggleControlled
}: CineSaveAssistantProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;
  
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (onToggleControlled) {
      onToggleControlled(val);
    }
  };

  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Unwatched movies prioritize
  const unwatchedMovies = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    return unwatched.length > 0 ? unwatched : movies;
  }, [movies]);

  // Compute matched movies based on active prompt or custom search query
  const matchedMovies = useMemo(() => {
    if (!activePromptId && !searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    const activePrompt = SUGGESTED_PROMPTS.find(p => p.id === activePromptId);

    return unwatchedMovies.map(movie => {
      let score = 0;
      const fullText = `${movie.title} ${movie.director} ${movie.genres.join(' ')} ${movie.vibe} ${movie.synopsis}`.toLowerCase();

      // Check text search query
      if (query) {
        const terms = query.split(/\s+/);
        terms.forEach(term => {
          if (fullText.includes(term)) score += 30;
        });
      }

      // Check prompt keywords
      if (activePrompt) {
        activePrompt.keywords.forEach(kw => {
          if (fullText.includes(kw)) score += 40;
        });
      }

      if (movie.favorite) score += 10;

      return { movie, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.movie)
    .slice(0, 3);
  }, [unwatchedMovies, activePromptId, searchQuery]);

  // Handle selecting a suggested prompt
  const handleSelectPrompt = (prompt: SuggestedPrompt) => {
    if (activePromptId === prompt.id) {
      setActivePromptId(null);
    } else {
      setActivePromptId(prompt.id);
      setSearchQuery('');
    }
  };

  const handleReset = () => {
    setActivePromptId(null);
    setSearchQuery('');
  };

  const currentPromptObj = SUGGESTED_PROMPTS.find(p => p.id === activePromptId);

  return (
    <>
      {/* 1. FLOATING AI ASSISTANT BUTTON (Bottom Right, 60px, Purple Glow, Glass Background, Plot Icon Only) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-[60px] h-[60px] rounded-full bg-[#0D111D]/85 backdrop-blur-xl border border-[#7C8CFF]/50 shadow-[0_0_30px_rgba(124,140,255,0.45)] flex items-center justify-center cursor-pointer transition-all duration-300 group"
            aria-label="Ask Plot AI Assistant"
            title="Ask Plot"
          >
            <PlotIcon className="w-6 h-6 text-[#7C8CFF] group-hover:text-white transition-colors" showBg={false} animate="breathe" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. EXPANDABLE CONVERSATIONAL BOTTOM SHEET */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-[#0A0D18] border-t border-white/15 rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-sans max-h-[88vh] flex flex-col"
            >
              {/* Drag Handle */}
              <div 
                className="w-12 h-1 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-3 cursor-pointer shrink-0 transition-colors" 
                onClick={() => setIsOpen(false)}
              />

              {/* Sheet Container */}
              <div className="overflow-y-auto px-5 sm:px-8 pb-8 space-y-6 flex-1 min-h-0 no-scrollbar">
                
                {/* Header */}
                <div className="flex items-start justify-between pt-1">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <PlotIcon className="w-5 h-5 text-[#7C8CFF]" showBg={false} />
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
                        Ask Plot
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A8B3CF]">
                      What are you in the mood for tonight?
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                    aria-label="Close assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search / Input Field */}
                <div className="relative flex items-center bg-[#121626] border border-white/15 focus-within:border-[#7C8CFF] rounded-2xl px-4 py-3 transition-all shadow-inner">
                  <Search className="w-4 h-4 text-[#7C8CFF] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value) setActivePromptId(null);
                    }}
                    placeholder="Search or ask Plot AI..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#F8FAFF] placeholder-[#5A6582] focus:outline-none border-0"
                  />
                  {(searchQuery || activePromptId) && (
                    <button 
                      onClick={handleReset}
                      className="text-[#5A6582] hover:text-white text-xs p-1 cursor-pointer transition-colors"
                      title="Clear"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggested Prompts Grid */}
                <div className="space-y-2 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A6582] font-semibold">
                    Suggested Prompts
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUGGESTED_PROMPTS.map((prompt) => {
                      const isSelected = activePromptId === prompt.id;
                      return (
                        <motion.button
                          key={prompt.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectPrompt(prompt)}
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium text-left transition-all cursor-pointer flex items-center justify-between border ${
                            isSelected
                              ? 'bg-[#7C8CFF]/20 border-[#7C8CFF] text-white shadow-md shadow-[#7C8CFF]/15'
                              : 'bg-[#121626]/70 hover:bg-[#121626] border-white/10 hover:border-white/20 text-[#A8B3CF] hover:text-white'
                          }`}
                        >
                          <span className="line-clamp-1">"{prompt.label}"</span>
                          <Sparkles className={`w-3.5 h-3.5 shrink-0 ml-2 ${isSelected ? 'text-[#7C8CFF]' : 'text-[#5A6582]'}`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Conversational Results Section */}
                <div className="space-y-4 pt-2 text-left border-t border-white/10">
                  {/* Active prompt or search query message */}
                  {(activePromptId || searchQuery.trim()) ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-[#121626] border border-[#7C8CFF]/30 text-xs sm:text-sm text-[#D8E0FF] leading-relaxed flex items-start gap-2.5">
                        <PlotIcon className="w-4 h-4 text-[#7C8CFF] shrink-0 mt-0.5" showBg={false} />
                        <p>
                          {currentPromptObj 
                            ? currentPromptObj.aiNote 
                            : `Searching your saved plot archive for "${searchQuery.trim()}":`}
                        </p>
                      </div>

                      {matchedMovies.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                          <Film className="w-8 h-8 text-[#5A6582] mx-auto" />
                          <p className="text-xs text-[#A8B3CF]">No exact matches in your saved plot archive.</p>
                          <button
                            onClick={handleReset}
                            className="text-xs text-[#7C8CFF] hover:underline cursor-pointer"
                          >
                            Clear filters and view suggestions
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {matchedMovies.map((movie) => (
                            <div
                              key={movie.id}
                              className="p-3.5 rounded-2xl bg-[#121626]/80 border border-white/10 hover:border-[#7C8CFF]/40 transition-all flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-16 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-white/10">
                                  {movie.posterUrl ? (
                                    <img
                                      src={movie.posterUrl}
                                      alt={movie.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">
                                      🍿
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#7C8CFF] transition-colors">
                                    {movie.title}
                                  </h4>
                                  <p className="text-[11px] text-[#A8B3CF] truncate">
                                    {movie.year} • {movie.director}
                                  </p>
                                  {movie.vibe && (
                                    <p className="text-[10px] text-[#7C8CFF] truncate font-mono mt-0.5">
                                      Vibe: {movie.vibe}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => onMarkWatched(movie.id)}
                                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-all"
                                  title="Mark Watched"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    onSelectMovie(movie.id);
                                    setIsOpen(false);
                                  }}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#F8FAFF] border border-white/10 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
                                  title="View Details"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-[#5A6582] text-center py-2 italic font-serif">
                      Tap a prompt above or type a vibe to explore recommendations from your saved movies.
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
