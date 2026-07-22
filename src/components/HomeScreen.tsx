/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  AlertCircle,
  Link as LinkIcon,
  FileText,
  Film,
  X
} from 'lucide-react';
import { Movie } from '../types';
import { detectPlatform } from '../utils';
import CinemaAtmosphere from './CinemaAtmosphere';
import HeroProductDemo from './HeroProductDemo';

interface HomeScreenProps {
  movies?: Movie[];
  onToggleWatched?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAllWatchlist?: () => void;
  onSelectMovie?: (id: string) => void;
  onAddMovie?: (movie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => void;
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  onOpenAssistant?: () => void;
}

export default function HomeScreen({
  onMoviesAdded
}: HomeScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isTextMode, setIsTextMode] = useState(false); // Default flow is link-first
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewMovies, setPreviewMovies] = useState<Omit<Movie, 'id' | 'addedAt' | 'watched'>[] | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImportWithText = async (textToExtract: string) => {
    if (!textToExtract.trim()) return;

    setIsExtracting(true);
    setError(null);
    setPreviewMovies(null);
    setSuccessMessage(null);

    try {
      const isUrl = textToExtract.trim().startsWith('http://') || textToExtract.trim().startsWith('https://');
      const platform = detectPlatform(textToExtract, '');

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToExtract,
          url: isUrl ? textToExtract : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse movie recommendations.');
      }

      if (!data.movies || data.movies.length === 0) {
        throw new Error("We couldn't find any movie recommendations in that link.");
      }

      const decorated = data.movies.map((m: any) => ({
        ...m,
        socialSource: {
          platform,
          url: isUrl ? textToExtract : undefined,
          author: m.socialSource?.author || 'Recommendation',
          textSnippet: textToExtract.substring(0, 100) + '...'
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
      throw err;
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

    setInputText('');
    setPreviewMovies(null);
    setSelectedIndices({});
    setSuccessMessage('Saved to your Library.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full h-[calc(100vh-8.5rem)] min-h-[500px] max-h-[820px] relative flex flex-col justify-between items-center text-center overflow-hidden rounded-3xl bg-[#050505] border border-white/5 select-none p-4 sm:p-6 shadow-2xl">
      
      {/* Multi-layered Cinema Environmental Atmosphere */}
      <CinemaAtmosphere />

      {/* Center Main Product Demonstration Hero Area */}
      <HeroProductDemo 
        onMoviesAdded={onMoviesAdded} 
        onImportSubmit={handleImportWithText} 
      />

      {/* Global Error Feedback */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full mx-auto bg-red-950/80 border border-red-900/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-red-300 text-left backdrop-blur-xl shadow-2xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p className="flex-1">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Success Feedback */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full mx-auto bg-emerald-950/80 border border-emerald-900/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-300 backdrop-blur-xl shadow-2xl"
          >
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <p className="flex-1 text-left">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty bottom spacer for balance */}
      <div className="relative z-20 pb-2 pointer-events-none" />

      {/* =========================================================
          EXTRACTION PROCESSING & RESULTS OVERLAY MODAL
          Appears over the single screen when extracting or showing results
         ========================================================= */}
      
      {/* Loading Overlay */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-[#111214] border border-[#1A1C20] rounded-3xl p-8 max-w-sm w-full flex flex-col items-center justify-center space-y-6 shadow-2xl text-center">
            <div className="relative w-16 h-24 rounded-2xl bg-[#1A1C20] border border-[#7F72FF]/30 overflow-hidden flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{ y: [-48, 48, -48] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-1 bg-[#7F72FF] blur-[2px]"
              />
              <Film className="w-6 h-6 text-[#7F72FF]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-[#F5F5F3] font-display font-light italic tracking-wide animate-pulse">
                Extracting movie recommendations...
              </p>
              <p className="text-xs text-[#A7A7A2] font-sans">
                Unfolding titles, directors, and posters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Movies Result Modal */}
      {previewMovies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111214] border border-[#1A1C20] rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-5 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1C20]">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-[#7F72FF]/10 text-[#7F72FF] border border-[#7F72FF]/20 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider">
                  Extracted Results
                </span>
                <h3 className="text-lg font-display font-light italic text-[#F5F5F3] mt-1">
                  Found {previewMovies.length} {previewMovies.length === 1 ? 'movie' : 'movies'}
                </h3>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setPreviewMovies(null);
                  setSelectedIndices({});
                }}
                className="p-1.5 rounded-full bg-[#1A1C20] text-[#A7A7A2] hover:text-[#F5F5F3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 max-h-[50vh]">
              {previewMovies.map((movie, idx) => {
                const isSelected = selectedIndices[idx] !== false;
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSelect(idx)}
                    className={`group relative flex gap-4 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-[#1A1C20] border-[#7F72FF]/40 shadow-md' 
                        : 'bg-[#070708]/60 border-[#1A1C20] opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div className="relative w-16 h-22 rounded-xl bg-[#070708] overflow-hidden shrink-0 border border-[#1A1C20]">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A7A7A2] text-lg">
                          🍿
                        </div>
                      )}
                      
                      <div className="absolute top-1.5 right-1.5 z-20">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-[#7F72FF] border-[#7F72FF] text-white' 
                            : 'bg-[#070708]/80 border-[#1A1C20] text-transparent'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#F5F5F3] truncate">
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-[#A7A7A2] font-mono">
                          {movie.year} • {movie.genre || 'Cinema'}
                        </p>
                      </div>

                      <p className="text-[11px] text-[#A7A7A2] line-clamp-2 italic">
                        "{movie.whySave || 'Saved recommendation'}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#1A1C20] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPreviewMovies(null);
                  setSelectedIndices({});
                }}
                className="px-4 py-2 text-xs font-sans text-[#A7A7A2] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-sans font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Save to Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
