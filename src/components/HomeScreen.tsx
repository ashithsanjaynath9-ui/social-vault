/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { Movie } from '../types';
import { REEL_TEMPLATES, ReelTemplate } from '../data';
import { detectPlatform } from '../utils';

interface HomeScreenProps {
  movies: Movie[];
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onViewAllWatchlist: () => void;
  onSelectMovie?: (id: string) => void;
  onAddMovie?: (movie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => void;
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
}

export default function HomeScreen({
  movies,
  onToggleWatched,
  onDelete,
  onViewAllWatchlist,
  onSelectMovie,
  onAddMovie,
  onMoviesAdded
}: HomeScreenProps) {
  const [pastedText, setPastedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewMovies, setPreviewMovies] = useState<Omit<Movie, 'id' | 'addedAt' | 'watched'>[] | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusInput = () => {
    textareaRef.current?.focus();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setIsExtracting(true);
    setError(null);
    setPreviewMovies(null);
    setSuccessMessage(null);

    try {
      const isUrl = pastedText.trim().startsWith('http://') || pastedText.trim().startsWith('https://');
      const platform = detectPlatform(pastedText, '');

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: pastedText,
          url: isUrl ? pastedText : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse movie recommendations.');
      }

      if (!data.movies || data.movies.length === 0) {
        throw new Error("We couldn't find any movie recommendations in that text. Try pasting a transcript or description containing movie titles.");
      }

      const decorated = data.movies.map((m: any) => ({
        ...m,
        socialSource: {
          platform,
          url: isUrl ? pastedText : undefined,
          author: m.socialSource?.author || 'Recommendation',
          textSnippet: pastedText.substring(0, 100) + '...'
        }
      }));

      const initialSelected: Record<number, boolean> = {};
      decorated.forEach((_, idx) => {
        initialSelected[idx] = true;
      });
      setSelectedIndices(initialSelected);
      setPreviewMovies(decorated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while identifying movies.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyTemplate = async (template: ReelTemplate) => {
    setPastedText(template.text);
    setError(null);
    setSuccessMessage(null);
    setPreviewMovies(null);
    setIsExtracting(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: template.text,
          url: `https://www.${template.platform}.com/reel/${template.id}`
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to find movie recommendations.');
      }

      const platform = template.platform;
      const decorated = data.movies.map((m: any) => ({
        ...m,
        socialSource: {
          platform,
          url: `https://www.${template.platform}.com/reel/${template.id}`,
          author: template.creator,
          textSnippet: template.text.substring(0, 100) + '...'
        }
      }));

      const initialSelected: Record<number, boolean> = {};
      decorated.forEach((_, idx) => {
        initialSelected[idx] = true;
      });
      setSelectedIndices(initialSelected);
      setPreviewMovies(decorated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while identifying movies.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggleSelect = (idx: number) => {
    setSelectedIndices(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSave = () => {
    if (!previewMovies) return;
    const selected = previewMovies.filter((_, idx) => selectedIndices[idx]);
    if (selected.length === 0) {
      setError('Please select at least one movie to save.');
      return;
    }

    if (onMoviesAdded) {
      onMoviesAdded(selected);
    }

    // Reset flow beautifully
    setPastedText('');
    setPreviewMovies(null);
    setSelectedIndices({});
    setSuccessMessage('Saved to your Library.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 px-4 font-sans text-zinc-100" id="apple-notes-lobby">
      
      {/* Calm, Premium Hero Section */}
      <div className="text-center space-y-3 py-6 select-none max-w-lg mx-auto">
        <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500">
          Movie Discovery & Capture
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-light italic tracking-tight text-zinc-100">
          We always forget the movies people recommend.
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto font-normal leading-relaxed">
          A quiet, private database to collect and remember recommendation notes from friends, threads, and feeds.
        </p>
      </div>

      {/* Main Interactive Workstation */}
      <div className="space-y-6">
        <div className="space-y-2">
          <form onSubmit={handleImport} className="space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-850/80 focus-within:border-zinc-800/80 rounded-2xl p-3 transition-all duration-300 shadow-xl backdrop-blur-sm">
              <textarea
                ref={textareaRef}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the raw, messy list of movie recommendations you've been saving..."
                rows={4}
                disabled={isExtracting}
                className="w-full bg-transparent px-3 py-2 text-sm text-zinc-200 placeholder-zinc-550 focus:outline-none resize-none border-0 leading-relaxed font-sans"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 px-1 border-t border-zinc-900/80 gap-3">
                <div className="text-[11px] text-zinc-500 font-normal px-1 leading-relaxed text-left">
                  Extracts titles, streaming details, and posters instantly.
                </div>
                <motion.button
                  type="submit"
                  disabled={!pastedText.trim() || isExtracting}
                  whileHover={pastedText.trim() && !isExtracting ? { scale: 1.02, backgroundColor: "#E4E4E7" } : {}}
                  whileTap={pastedText.trim() && !isExtracting ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    pastedText.trim() && !isExtracting
                      ? 'bg-zinc-100 text-zinc-950 cursor-pointer shadow-md'
                      : 'bg-zinc-850/50 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <span>Transform into Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </form>
        </div>
 
        {/* Quick Instant Experiences / Samples */}
        {!isExtracting && !previewMovies && (
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-[11px] font-sans text-zinc-500 font-normal">
              Or load a sample recommendation note:
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {REEL_TEMPLATES.map((tmpl) => (
                <motion.button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(24, 24, 27, 0.8)", borderColor: "rgba(63, 63, 70, 0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-3 py-2 rounded-xl bg-zinc-900/30 border border-zinc-850 text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors duration-200"
                >
                  <span>{tmpl.title.split(' ').slice(1).join(' ')}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Error Indicator */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="bg-red-950/20 border border-red-900/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-400"
            >
              <Check className="w-4 h-4 shrink-0" />
              <p>{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elegant Non-Technical Processing State */}
        {isExtracting && (
          <div className="py-20 flex flex-col items-center justify-center space-y-8 max-w-sm mx-auto">
            <div className="relative w-20 h-28 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(124,140,255,0.1)]">
              {/* Beautiful subtle scanning light ray representing transformation */}
              <motion.div
                animate={{
                  y: [-56, 56, -56],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-x-0 h-1 bg-[#7C8CFF]/40 blur-[2px]"
              />
              <div className="w-10 h-16 rounded-lg bg-zinc-950 border border-zinc-850 opacity-40 flex flex-col justify-between p-1">
                <div className="w-full h-1 bg-zinc-900 rounded" />
                <div className="w-2/3 h-1 bg-zinc-900 rounded" />
              </div>
            </div>
            <div className="space-y-2 text-center select-none">
              <p className="text-sm text-zinc-100 font-display font-light italic tracking-wide animate-pulse">
                Transforming raw recommendations...
              </p>
              <p className="text-xs text-zinc-500 font-sans max-w-[280px] leading-relaxed">
                Unfolding titles, directors, and beautiful posters into curated cinema cards.
              </p>
            </div>
          </div>
        )}

        {/* Beautiful Movie Cards Results */}
        {previewMovies && (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1
                }
              }
            }}
            className="space-y-8"
          >
            {/* Transforming magical moment headline */}
            <div className="text-center space-y-2.5 py-2 border-b border-zinc-900 pb-6">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-2.5 py-1 bg-[#7C8CFF]/10 text-[#7C8CFF] border border-[#7C8CFF]/20 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider"
              >
                Transformation Complete
              </motion.span>
              <h2 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 tracking-tight leading-tight">
                We found {previewMovies.length} {previewMovies.length === 1 ? 'movie' : 'movies'}
              </h2>
              <p className="text-zinc-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                Review and save these extracted movie cards directly into your personal shelves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewMovies.map((movie, idx) => {
                const isSelected = selectedIndices[idx] !== false;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 24, scale: 0.95, rotate: -0.5 },
                      show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 100, damping: 18 } }
                    }}
                    whileHover={{ y: -3, scale: 1.015, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleToggleSelect(idx)}
                    className={`group relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-zinc-900/50 border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
                        : 'bg-zinc-950/10 border-zinc-900/40 opacity-40 hover:opacity-60'
                    }`}
                  >
                    {/* Poster */}
                    <div className="relative w-24 h-34 rounded-xl bg-zinc-950 overflow-hidden shrink-0 border border-zinc-850 shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-2xl">
                          🍿
                        </div>
                      )}
                      
                      {/* Interactive Selection Checkbox Overlay on the Poster */}
                      <div className="absolute top-2 right-2 z-20">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-zinc-100 border-zinc-100 text-zinc-950 scale-100' 
                            : 'bg-zinc-950/80 border-zinc-800 text-transparent scale-95 group-hover:border-zinc-700'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* Museum-Grade Label Pane answering ONLY: What movie? Where can I watch? Why saved? */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1.5 space-y-2.5">
                      {/* What movie? */}
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-baseline gap-x-1.5">
                          <h4 className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors tracking-tight truncate">
                            {movie.title}
                          </h4>
                          <span className="text-[11px] text-zinc-500 font-sans">
                            ({movie.year})
                          </span>
                        </div>
                      </div>

                      {/* Where can I watch? */}
                      <div className="text-xs text-zinc-400 font-sans font-normal truncate">
                        {movie.streamingServices && movie.streamingServices.length > 0 
                          ? `Stream on: ${movie.streamingServices.slice(0, 2).join(', ')}`
                          : 'Find channels'}
                      </div>

                      {/* Why did I save it? */}
                      {movie.whySave && (
                        <p className="text-xs text-zinc-550 italic font-sans leading-relaxed border-l border-zinc-800 pl-2.5 line-clamp-2" title={movie.whySave}>
                          "{movie.whySave}"
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Large centered Save All button */}
            <div className="pt-6 flex flex-col items-center gap-4 border-t border-zinc-900">
              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{ scale: 1.015, backgroundColor: "#FFFFFF" }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="w-full sm:w-auto px-12 py-4 bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-sans font-medium rounded-xl transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Save All to My Library</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => {
                  setPreviewMovies(null);
                  setSelectedIndices({});
                }}
                whileHover={{ scale: 1.02, color: "#E4E4E7" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="px-4 py-2 text-xs font-sans text-zinc-550 hover:text-zinc-300 transition-all cursor-pointer underline decoration-zinc-800 hover:decoration-zinc-500 underline-offset-4"
              >
                Clear and start over
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
