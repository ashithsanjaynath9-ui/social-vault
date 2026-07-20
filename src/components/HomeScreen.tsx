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
      <div className="text-center space-y-5 py-4 select-none">
        {/* Minimal Tactile Index Card Visual */}
        <div className="relative mx-auto w-12 h-8 border border-zinc-800 rounded bg-zinc-950 flex items-center justify-center overflow-hidden opacity-40">
          <div className="absolute top-1 left-1 right-1 h-[1px] bg-zinc-900" />
          <div className="w-6 h-3 border border-zinc-900 rounded bg-zinc-950 flex flex-col gap-0.5 p-0.5">
            <div className="w-3 h-[1px] bg-zinc-800" />
            <div className="w-4 h-[1px] bg-zinc-800" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-light italic tracking-tight text-zinc-100">
            We always forget the movies people recommend.
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto font-normal leading-relaxed">
            CineSave is a simple, quiet space to store recommendations from friends, podcasts, and social feeds.
          </p>
        </div>
      </div>

      {/* Main Interactive Workstation */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            A line of dialogue, a link, or a friend's text...
          </p>
          
          <form onSubmit={handleImport} className="space-y-3">
            <div className="bg-zinc-900/60 border border-zinc-850 focus-within:border-zinc-800 rounded-2xl p-2 transition-all">
              <textarea
                ref={textareaRef}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste Instagram Reel link, TikTok, YouTube link, or recommendation transcript..."
                rows={3}
                disabled={isExtracting}
                className="w-full bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none border-0"
              />
              <div className="flex items-center justify-between pt-1 px-1">
                <div className="text-[10px] text-zinc-500 font-normal px-2">
                  Works with links, chat snippets, or full transcripts
                </div>
                <motion.button
                  type="submit"
                  disabled={!pastedText.trim() || isExtracting}
                  whileHover={pastedText.trim() && !isExtracting ? { scale: 1.02, backgroundColor: "#B39CD0" } : {}}
                  whileTap={pastedText.trim() && !isExtracting ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                    pastedText.trim() && !isExtracting
                      ? 'bg-blue-600 text-white cursor-pointer'
                      : 'bg-zinc-850 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <span>Remember this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </form>
        </div>
 
        {/* Quick Instant Experiences / Samples */}
        {!isExtracting && !previewMovies && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Try a sample
            </p>
            <div className="flex flex-wrap gap-2">
              {REEL_TEMPLATES.map((tmpl) => (
                <motion.button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(24, 24, 27, 0.8)", borderColor: "rgba(39, 39, 42, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900/40 border border-zinc-850 text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer"
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

        {/* Elegant Processing State */}
        {isExtracting && (
          <div className="py-16 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-16 h-24 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
              <motion.div
                animate={{
                  y: [-48, 48, -48],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-x-0 h-0.5 bg-[#B39CD0]/30 blur-[1px]"
              />
              <div className="w-8 h-12 rounded bg-zinc-950 border border-zinc-850 opacity-40" />
            </div>
            <div className="space-y-1.5 text-center select-none">
              <p className="text-xs text-zinc-400 font-sans tracking-wide animate-pulse">
                Listening to the recommendation...
              </p>
              <p className="text-[10px] text-zinc-600 font-sans">
                Writing it down in your archive...
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
                  staggerChildren: 0.12
                }
              }
            }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-850/60">
              <h3 className="text-xs font-semibold font-mono uppercase tracking-widest text-zinc-500">
                We found {previewMovies.length} {previewMovies.length === 1 ? 'movie' : 'movies'}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Ready to save</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {previewMovies.map((movie, idx) => {
                const isSelected = selectedIndices[idx] !== false;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                    }}
                    whileHover={{ y: -2, scale: 1.008 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 220, damping: 25 }}
                    onClick={() => handleToggleSelect(idx)}
                    className={`group relative flex items-start justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60' 
                        : 'bg-zinc-950/10 border-zinc-900/40 hover:bg-zinc-950/20 opacity-40'
                    }`}
                  >
                    <div className="flex gap-4 min-w-0">
                      <div className="relative w-14 h-20 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-850 transition-transform group-hover:scale-[1.02]">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                            🍿
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h4 className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors">
                            {movie.title}
                          </h4>
                          <span className="text-xs text-zinc-500 font-mono">
                            {movie.year}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-normal">
                          Directed by {movie.director}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-850/60">
                            {movie.vibe}
                          </span>
                          {movie.streamingServices && movie.streamingServices.slice(0, 2).map((service, sIdx) => (
                            <span key={sIdx} className="text-[9px] font-mono bg-zinc-900/40 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-850/40">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1.5 pr-0.5 shrink-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950 scale-100' 
                          : 'border-zinc-800 text-transparent scale-95 group-hover:border-zinc-700'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <motion.button
                type="button"
                onClick={() => {
                  setPreviewMovies(null);
                  setSelectedIndices({});
                }}
                whileHover={{ scale: 1.02, color: "#FAF6F0" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="px-4 py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
              >
                Clear and start over
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Save to Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
