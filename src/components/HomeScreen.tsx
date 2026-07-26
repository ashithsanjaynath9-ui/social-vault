/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  AlertCircle,
  Film,
  X,
  Tv,
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { Movie } from '../types';
import { detectPlatform } from '../utils';
import CinemaAtmosphere from './CinemaAtmosphere';
import HeroProductDemo from './HeroProductDemo';
import CinematicEasterEggs from './CinematicEasterEggs';

interface HomeScreenProps {
  movies?: Movie[];
  onToggleWatched?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAllWatchlist?: () => void;
  onSelectMovie?: (id: string) => void;
  onAddMovie?: (movie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => void;
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  onOpenAssistant?: () => void;
  autoFocusInput?: boolean;
}

// Curated collection of famous movie quotes for extraction loading state
interface ExtractionQuote {
  emoji: string;
  quote: string;
  movie?: string;
}

const EXTRACTION_QUOTES: ExtractionQuote[] = [
  { emoji: '🎬', quote: '"Roads? Where we\'re going, we don\'t need roads."', movie: 'Back to the Future' },
  { emoji: '🍿', quote: '"Just keep watching..."', movie: 'Cinema Paradiso' },
  { emoji: '🎞️', quote: '"The show must go on."', movie: 'Bohemian Rhapsody' },
  { emoji: '🎥', quote: '"Every great story begins somewhere."', movie: 'The Prestige' },
  { emoji: '⚡', quote: '"May the Force be with you."', movie: 'Star Wars' },
  { emoji: '🤡', quote: '"Why so serious?"', movie: 'The Dark Knight' },
  { emoji: '🌹', quote: '"Here\'s looking at you, kid."', movie: 'Casablanca' },
  { emoji: '🥁', quote: '"Not quite my tempo."', movie: 'Whiplash' },
  { emoji: '🚀', quote: '"Love is the one thing that transcends time and space."', movie: 'Interstellar' },
  { emoji: '🕶️', quote: '"I\'ll be back."', movie: 'The Terminator' },
  { emoji: '💫', quote: '"Carpe diem. Seize the day, boys."', movie: 'Dead Poets Society' },
  { emoji: '🪄', quote: '"Are you watching closely?"', movie: 'The Prestige' },
  { emoji: '🏎️', quote: '"Life moves pretty fast. If you don\'t stop and look around once in a while, you could miss it."', movie: 'Ferris Bueller\'s Day Off' },
  { emoji: '🎩', quote: '"I\'m gonna make him an offer he can\'t refuse."', movie: 'The Godfather' },
];

export default function HomeScreen({
  onMoviesAdded,
  autoFocusInput
}: HomeScreenProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<ExtractionQuote>(EXTRACTION_QUOTES[0]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewMovies, setPreviewMovies] = useState<Omit<Movie, 'id' | 'addedAt' | 'watched'>[] | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Automatically rotate quotes during extraction loading
  useEffect(() => {
    if (!isExtracting) return;
    const interval = setInterval(() => {
      setCurrentQuote((prevQuote) => {
        let nextIndex = Math.floor(Math.random() * EXTRACTION_QUOTES.length);
        while (EXTRACTION_QUOTES[nextIndex].quote === prevQuote.quote && EXTRACTION_QUOTES.length > 1) {
          nextIndex = Math.floor(Math.random() * EXTRACTION_QUOTES.length);
        }
        return EXTRACTION_QUOTES[nextIndex];
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isExtracting]);

  const handleImportWithText = async (textToExtract: string) => {
    if (!textToExtract.trim()) return;

    // Pick a random quote each time extraction begins
    const randomQuote = EXTRACTION_QUOTES[Math.floor(Math.random() * EXTRACTION_QUOTES.length)];
    setCurrentQuote(randomQuote);

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
      decorated.forEach((_: any, idx: number) => {
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
      setError('Please select at least one movie to plot.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      if (onMoviesAdded) {
        onMoviesAdded(selected);
      }
      setPreviewMovies(null);
      setSelectedIndices({});
      setIsSaving(false);
      setSuccessMessage(`${selected.length} ${selected.length === 1 ? 'film' : 'films'} added to your plot.`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    }, 700);
  };

  return (
    <div className="w-full min-h-[760px] relative flex flex-col justify-between items-center text-center overflow-hidden rounded-3xl bg-[#050505] border border-white/5 select-none p-2 sm:p-6 shadow-2xl">
      
      {/* Multi-layered Cinema Environmental Atmosphere */}
      <CinemaAtmosphere />

      {/* Hidden Cinematic Easter Eggs Interaction Layer */}
      <CinematicEasterEggs />

      {/* Center Main Product Demonstration Hero Area */}
      <HeroProductDemo 
        onMoviesAdded={onMoviesAdded} 
        onImportSubmit={handleImportWithText}
        autoFocusInput={autoFocusInput}
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
      <AnimatePresence>
        {isExtracting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#111214] border border-[#1A1C20] rounded-3xl p-8 max-w-sm w-full flex flex-col items-center justify-center space-y-5 shadow-2xl text-center"
            >
              {/* Scanner animation keeping the film reel scanner */}
              <div className="relative w-16 h-24 rounded-2xl bg-[#1A1C20] border border-[#7F72FF]/30 overflow-hidden flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ y: [-48, 48, -48] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1 bg-[#7F72FF] blur-[2px]"
                />
                <Film className="w-6 h-6 text-[#7F72FF]" />
              </div>

              {/* Random Famous Movie Dialogue & Emoji */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuote.quote}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 pt-1"
                >
                  <div className="text-3xl leading-none select-none">
                    {currentQuote.emoji}
                  </div>
                  <p className="text-sm font-serif italic text-[#F5F5F3] leading-relaxed px-2">
                    {currentQuote.quote}
                  </p>
                  {currentQuote.movie && (
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#a594fd]">
                      — {currentQuote.movie}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Movies Result Modal */}
      {previewMovies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111214] border border-[#1A1C20] rounded-3xl p-5 sm:p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4 text-left overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1C20]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#7F72FF]/10 border border-[#7F72FF]/30 flex items-center justify-center text-[#7F72FF]">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display font-light italic text-[#F5F5F3]">
                    Plotted {previewMovies.length} {previewMovies.length === 1 ? 'Film' : 'Films'}
                  </h3>
                  <p className="text-[11px] text-[#A7A7A2] font-sans">
                    Extracted from your shared recommendation
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setPreviewMovies(null);
                  setSelectedIndices({});
                }}
                className="p-1.5 rounded-full bg-[#1A1C20] text-[#A7A7A2] hover:text-[#F5F5F3] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 max-h-[52vh]">
              {previewMovies.map((movie, idx) => {
                const isSelected = selectedIndices[idx] !== false;
                const genreList = movie.genres && movie.genres.length > 0 ? movie.genres : [];
                const streamingList = movie.streamingServices && movie.streamingServices.length > 0 ? movie.streamingServices : ['Streaming'];

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSelect(idx)}
                    className={`group relative flex gap-4 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-[#1A1C20] border-[#7F72FF]/50 shadow-lg' 
                        : 'bg-[#070708]/60 border-[#1A1C20] opacity-50 hover:opacity-80'
                    }`}
                  >
                    {/* Movie Poster */}
                    <div className="relative w-20 h-28 rounded-xl bg-[#070708] overflow-hidden shrink-0 border border-white/10 shadow-md">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A7A7A2] text-xl">
                          🍿
                        </div>
                      )}
                      
                      {/* Checkbox badge */}
                      <div className="absolute top-1.5 right-1.5 z-20">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-[#7F72FF] border-[#7F72FF] text-white shadow-md' 
                            : 'bg-[#070708]/80 border-[#1A1C20] text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* Movie Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#F5F5F3] leading-tight truncate">
                            {movie.title}
                          </h4>
                          {movie.year && (
                            <span className="text-[10px] font-mono font-medium text-[#7F72FF] bg-[#7F72FF]/10 px-1.5 py-0.5 rounded border border-[#7F72FF]/20 shrink-0">
                              {movie.year}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#A7A7A2] mt-0.5 truncate">
                          {movie.director ? `Dir. ${movie.director}` : ''} {movie.rating ? `• ${movie.rating}` : ''}
                        </p>
                      </div>

                      {/* Genre & Streaming Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {genreList.slice(0, 2).map((g, gIdx) => (
                          <span key={gIdx} className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                            {g}
                          </span>
                        ))}

                        {streamingList.slice(0, 3).map((stream, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#7F72FF]/10 border border-[#7F72FF]/25 text-[#a594fd] flex items-center gap-1">
                            <Tv className="w-2.5 h-2.5" />
                            {stream}
                          </span>
                        ))}
                      </div>

                      {/* Why Save Quote / Recommendation highlight */}
                      <p className="text-[11px] text-[#A7A7A2] line-clamp-1 italic font-serif pt-0.5">
                        "{movie.whySave || 'Plotted film recommendation'}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#1A1C20] flex items-center justify-between">
              <span className="text-[11px] text-[#A7A7A2] font-sans">
                {Object.values(selectedIndices).filter(Boolean).length} selected
              </span>

              <div className="flex items-center gap-3">
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
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-[#7F72FF] hover:bg-[#6E60FF] text-white text-xs font-sans font-semibold rounded-xl transition-all shadow-lg shadow-[#7F72FF]/25 flex items-center gap-2 cursor-pointer disabled:opacity-80"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                      <span>Plotted!</span>
                    </>
                  ) : (
                    <>
                      <span>Plot to Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
