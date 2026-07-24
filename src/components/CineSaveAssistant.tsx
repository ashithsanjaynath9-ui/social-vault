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
  RefreshCw,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Movie } from '../types';
import { IDENTITY_DIRECTIONS } from './BrandIdentity';

interface CineSaveAssistantProps {
  movies: Movie[];
  onMarkWatched: (id: string) => void;
  onSelectMovie: (id: string) => void;
  activeIdentity: string;
  isOpenControlled?: boolean;
  onToggleControlled?: (open: boolean) => void;
}

// 3-Step Flow Types
interface ChoiceOption {
  id: string;
  label: string;
  emoji: string;
}

const EVENING_MOODS: ChoiceOption[] = [
  { id: 'mind_bending', label: 'Mind-bending', emoji: '🧠' },
  { id: 'emotional', label: 'Emotional', emoji: '❤️' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'comfort', label: 'Comfort', emoji: '😌' },
  { id: 'thriller', label: 'Thriller', emoji: '😨' },
  { id: 'surprise', label: 'Surprise Me', emoji: '🎲' }
];

const TIME_AVAILABILITY: ChoiceOption[] = [
  { id: 'under_90', label: 'Under 90 mins', emoji: '⏱' },
  { id: 'feature_length', label: 'Feature Length', emoji: '🍿' },
  { id: 'doesnt_matter', label: 'Doesn\'t Matter', emoji: '🌙' }
];

const WATCH_COMPANIONS: ChoiceOption[] = [
  { id: 'alone', label: 'Alone', emoji: '👤' },
  { id: 'date_night', label: 'Date Night', emoji: '❤️' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' }
];

export default function CineSaveAssistant({ 
  movies, 
  onMarkWatched, 
  onSelectMovie,
  activeIdentity,
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
  
  // Step states: 1, 2, 3 or 'results'
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'results'>(1);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedWith, setSelectedWith] = useState<string>('');

  // Shuffle seed to refresh matching recommendations
  const [shuffleIndex, setShuffleIndex] = useState<number>(0);

  // Filter unwatched movies
  const unwatchedMovies = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    return unwatched.length > 0 ? unwatched : movies;
  }, [movies]);

  // Matching algorithm to rank movies based on user selections
  const matchingMovies = useMemo(() => {
    if (unwatchedMovies.length === 0) return [];

    const scored = unwatchedMovies.map(m => {
      let score = 0;

      // 1. Mood Filter matching
      if (selectedMood) {
        const text = `${m.vibe} ${m.genres.join(' ')} ${m.synopsis}`.toLowerCase();
        if (selectedMood === 'mind_bending') {
          if (text.includes('mind-bending') || text.includes('cosmic') || text.includes('sci-fi') || text.includes('puzzle') || text.includes('mystery') || text.includes('cerebral')) {
            score += 100;
          }
        } else if (selectedMood === 'emotional') {
          if (text.includes('romance') || text.includes('drama') || text.includes('melanchol') || text.includes('sad') || text.includes('emotional') || text.includes('heartfelt')) {
            score += 100;
          }
        } else if (selectedMood === 'funny') {
          if (text.includes('comedy') || text.includes('funny') || text.includes('humor') || text.includes('laugh') || text.includes('satire')) {
            score += 100;
          }
        } else if (selectedMood === 'comfort') {
          if (text.includes('animation') || text.includes('feel-good') || text.includes('warm') || text.includes('cozy') || text.includes('comfort') || text.includes('nostalgia') || text.includes('gentle')) {
            score += 100;
          }
        } else if (selectedMood === 'thriller') {
          if (text.includes('thriller') || text.includes('horror') || text.includes('suspense') || text.includes('adrenaline') || text.includes('action') || text.includes('tension')) {
            score += 100;
          }
        } else if (selectedMood === 'surprise') {
          score += Math.random() * 80; // random weight
        }
      }

      // 2. Time availability matching
      if (selectedTime && m.runtime) {
        const minsMatch = m.runtime.match(/(\d+)\s*min/i);
        if (minsMatch) {
          const mins = parseInt(minsMatch[1], 10);
          if (selectedTime === 'under_90' && mins <= 90) {
            score += 80;
          } else if (selectedTime === 'feature_length' && mins > 90) {
            score += 80;
          } else if (selectedTime === 'doesnt_matter') {
            score += 40;
          }
        }
      } else {
        score += 30; // default points if runtime missing
      }

      // 3. Social setting matching
      if (selectedWith) {
        const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
        if (selectedWith === 'alone') {
          if (text.includes('cerebral') || text.includes('artistic') || text.includes('indie') || text.includes('thriller') || text.includes('dark')) {
            score += 60;
          }
        } else if (selectedWith === 'date_night') {
          if (text.includes('romance') || text.includes('comedy') || text.includes('feel-good') || text.includes('cozy') || text.includes('drama')) {
            score += 60;
          }
        } else if (selectedWith === 'friends') {
          if (text.includes('thriller') || text.includes('comedy') || text.includes('action') || text.includes('sci-fi') || text.includes('adrenaline')) {
            score += 60;
          }
        } else if (selectedWith === 'family') {
          if (text.includes('animation') || text.includes('adventure') || text.includes('comedy') || text.includes('fantasy') || text.includes('gentle')) {
            score += 60;
          }
        }
      }

      // Give slightly higher score to favorites or high confidence picks
      if (m.favorite) score += 15;
      if (m.confidence) score += m.confidence / 10;

      return { movie: m, score };
    });

    // Sort by descending score
    return scored.sort((a, b) => b.score - a.score).map(s => s.movie);
  }, [unwatchedMovies, selectedMood, selectedTime, selectedWith]);

  // Paginated/shuffled exactly 3 recommendations from the matching queue
  const currentRecommendations = useMemo(() => {
    if (matchingMovies.length === 0) return [];

    // Slice matches based on shuffle seed
    const totalMatches = matchingMovies.length;
    const startIndex = (shuffleIndex * 3) % totalMatches;
    
    // Circulate list to ensure we always get 3 movies if plot has enough
    const results: Movie[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (startIndex + i) % totalMatches;
      const candidate = matchingMovies[idx];
      if (candidate && !results.some(r => r.id === candidate.id)) {
        results.push(candidate);
      }
    }

    // Backup duplicates just in case plot is very small (< 3)
    if (results.length < 3 && totalMatches > 0) {
      for (let i = 0; i < totalMatches; i++) {
        const candidate = matchingMovies[i];
        if (candidate && results.length < 3 && !results.some(r => r.id === candidate.id)) {
          results.push(candidate);
        }
      }
    }

    return results;
  }, [matchingMovies, shuffleIndex]);

  // Determine current brand identity configuration
  const brandConfig = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentity) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentity]);

  // Helper text: dynamic explanation generator based on the answers
  const generateExplanation = (movie: Movie) => {
    const moodLabel = EVENING_MOODS.find(o => o.id === selectedMood)?.label || 'perfect';
    const withLabel = WATCH_COMPANIONS.find(o => o.id === selectedWith)?.label || 'your evening';

    if (selectedMood === 'mind_bending') {
      return `Selected because you're craven for a mind-expanding puzzle that makes a splendid companion for ${withLabel}.`;
    }
    if (selectedMood === 'comfort') {
      return `Fits your recipe for a warm, cozy story to rest with while watching ${withLabel}.`;
    }
    if (selectedMood === 'funny') {
      return `Handpicked to spark joy and shared laughter for your ${withLabel} setup.`;
    }
    if (selectedWith === 'date_night') {
      return `Provides the perfect elegant visual pacing and heartfelt tension for an ideal Date Night.`;
    }
    if (selectedTime === 'under_90') {
      return `A compact, high-velocity masterpiece running at a respectful ${movie.runtime || '90 mins'} for ${withLabel}.`;
    }
    return `Plotted directly to your plot ${movie.vibe ? `matching your '${movie.vibe}' style` : ''}, chosen for a perfect film night.`;
  };

  // Progress helper
  const handleSelectOption = (optionId: string) => {
    if (currentStep === 1) {
      setSelectedMood(optionId);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedTime(optionId);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setSelectedWith(optionId);
      setCurrentStep('results');
    }
  };

  const handleReset = () => {
    setSelectedMood('');
    setSelectedTime('');
    setSelectedWith('');
    setCurrentStep(1);
    setShuffleIndex(0);
  };

  const handleShuffle = () => {
    setShuffleIndex(prev => prev + 1);
  };

  return (
    <>
      {/* DETACHED COLLAPSIBLE ASSISTANT DRAWER SHEET */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft dark glass ambient blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Apple Maps / Spotify AI DJ Styled Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-[#0C0B0A] border-t border-zinc-900 rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-sans pb-8 max-h-[94vh] flex flex-col"
              id="cine-assistant-drawer"
            >
              {/* Premium Drag Handle */}
              <div 
                className="w-12 h-1 bg-zinc-800 hover:bg-zinc-700 rounded-full mx-auto my-3 cursor-pointer shrink-0 transition-colors" 
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer Content Area */}
              <div className="overflow-y-auto px-6 sm:px-8 space-y-6 flex-1 min-h-0 no-scrollbar">
                
                {/* Header branding */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#1B2540] border border-[#2D3D6B] text-[#97A5FF] flex items-center justify-center">
                        {brandConfig.logoSvg("w-3.5 h-3.5")}
                      </div>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-[#97A5FF] font-mono">
                        Plot Picks
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 leading-none">
                      {currentStep === 'results' ? 'Your Personal Curated Picks' : 'Ask plot'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step / Form Content area with smooth tab animation */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {/* STEP 1: EVENING TYPE */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 text-left"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">STEP 1 OF 3</span>
                          <h4 className="text-lg sm:text-xl font-display text-zinc-200">
                            What kind of evening is this?
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {EVENING_MOODS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(opt.id)}
                              className="px-4 py-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850/50 hover:border-zinc-800 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-24"
                            >
                              <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">{opt.emoji}</span>
                              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: TIME BUDGET */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">STEP 2 OF 3</span>
                            <h4 className="text-lg sm:text-xl font-display text-zinc-200">
                              How much time do you have?
                            </h4>
                          </div>
                          <button 
                            onClick={() => setCurrentStep(1)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-sans"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {TIME_AVAILABILITY.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(opt.id)}
                              className="px-4 py-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850/50 hover:border-zinc-800 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-24"
                            >
                              <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">{opt.emoji}</span>
                              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: COMPANION */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">STEP 3 OF 3</span>
                            <h4 className="text-lg sm:text-xl font-display text-zinc-200">
                              Who are you watching with?
                            </h4>
                          </div>
                          <button 
                            onClick={() => setCurrentStep(2)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-sans"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {WATCH_COMPANIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(opt.id)}
                              className="px-4 py-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850/50 hover:border-zinc-800 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-24"
                            >
                              <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">{opt.emoji}</span>
                              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* RESULTS: PREMIUM MOVIE RECS */}
                    {currentStep === 'results' && (
                      <motion.div
                        key="results-step"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Results Header Info Bar */}
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="font-semibold text-[#97A5FF] uppercase font-mono">Tuning Profile:</span>
                            <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-850">
                              {EVENING_MOODS.find(o => o.id === selectedMood)?.emoji} {EVENING_MOODS.find(o => o.id === selectedMood)?.label}
                            </span>
                            <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-850">
                              {TIME_AVAILABILITY.find(o => o.id === selectedTime)?.emoji} {TIME_AVAILABILITY.find(o => o.id === selectedTime)?.label}
                            </span>
                            <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-850">
                              {WATCH_COMPANIONS.find(o => o.id === selectedWith)?.emoji} {WATCH_COMPANIONS.find(o => o.id === selectedWith)?.label}
                            </span>
                          </div>
                          <button 
                            onClick={handleReset}
                            className="text-xs text-[#97A5FF] hover:text-white flex items-center gap-1 font-mono hover:underline cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" /> Reset Choices
                          </button>
                        </div>

                        {/* EXACTLY THREE PREMIUM RECS GRID */}
                        {currentRecommendations.length === 0 ? (
                          <div className="py-12 text-center space-y-2">
                            <span className="text-3xl">🍿</span>
                            <h4 className="text-zinc-200 font-display italic text-lg font-light">Your plot is quiet</h4>
                            <p className="text-xs text-zinc-500 max-w-md mx-auto">
                              Try resetting your choices or paste a Reel to start your plot.
                            </p>
                            <button
                              onClick={handleReset}
                              className="mt-2 px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-xs text-zinc-200 rounded-lg border border-zinc-800"
                            >
                              Reset Choices
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                              {currentRecommendations.map((movie, index) => {
                                const explanation = generateExplanation(movie);
                                return (
                                  <motion.div
                                    key={movie.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="relative overflow-hidden rounded-2xl bg-zinc-900/35 border border-zinc-850/60 p-4 flex flex-col text-left group hover:border-zinc-800 hover:bg-zinc-900/60 transition-all duration-300"
                                  >
                                    {/* Aesthetic Ticket Notch Styling */}
                                    <div className="absolute top-1/2 -left-1.5 w-3 h-5 rounded-r-full bg-[#0C0B0A] border border-zinc-900 border-l-transparent z-10" />
                                    <div className="absolute top-1/2 -right-1.5 w-3 h-5 rounded-l-full bg-[#0C0B0A] border border-zinc-900 border-r-transparent z-10" />

                                    {/* Film Poster & Title Block */}
                                    <div className="flex gap-4 items-start flex-1">
                                      {/* Poster Graphic */}
                                      <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-zinc-950 border border-zinc-850 shadow-md">
                                        {movie.posterUrl ? (
                                          <img 
                                            src={movie.posterUrl} 
                                            alt={movie.title}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover transition-all duration-300"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xl font-mono">
                                            🍿
                                          </div>
                                        )}
                                      </div>

                                      {/* Meta details */}
                                      <div className="space-y-1 flex-1 min-w-0">
                                        <span className="text-[9px] font-mono uppercase bg-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850">
                                          {movie.year}
                                        </span>
                                        <h4 className="font-display font-light text-base sm:text-lg text-zinc-100 group-hover:text-white transition-colors truncate mt-1">
                                          {movie.title}
                                        </h4>
                                        {movie.streamingServices && movie.streamingServices.length > 0 && (
                                          <p className="text-[10px] font-semibold text-[#97A5FF] font-sans truncate">
                                            Stream: {movie.streamingServices[0]}
                                          </p>
                                        )}
                                        <p className="text-[10px] text-zinc-400 font-sans leading-none truncate">
                                          Dir: {movie.director}
                                        </p>
                                        {movie.runtime && (
                                          <p className="text-[10px] text-zinc-500 font-sans leading-none truncate">
                                            Length: {movie.runtime}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Bespoke Concise Why-Selected explanation block */}
                                    <div className="mt-4 p-3 rounded-xl bg-zinc-950/40 border border-zinc-900/60 flex-1 flex flex-col justify-between">
                                      <p className="text-xs text-zinc-350 leading-relaxed font-sans italic">
                                        "{explanation}"
                                      </p>
                                      
                                      <div className="mt-2.5 pt-2 border-t border-zinc-900/30 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                                        <span>Vibe: {movie.vibe}</span>
                                        <span className="uppercase text-emerald-500/80 font-semibold">★ {movie.rating || "IMDb 8+"}</span>
                                      </div>
                                    </div>

                                    {/* Tactile Calls to Action */}
                                    <div className="mt-4 grid grid-cols-2 gap-2 shrink-0">
                                      <button
                                        onClick={() => {
                                          onMarkWatched(movie.id);
                                        }}
                                        className="px-3 py-2 bg-[#97A5FF]/10 hover:bg-[#97A5FF]/15 border border-[#97A5FF]/25 text-[#97A5FF] hover:text-[#B1BDFF] rounded-xl text-[11px] font-sans font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Watch Now</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          onSelectMovie(movie.id);
                                        }}
                                        className="px-3 py-2 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-xl text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer border border-zinc-750"
                                      >
                                        <span>Open Card</span>
                                        <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* SHUFFLE / FOOTER CONTROLS */}
                        {matchingMovies.length > 3 && (
                          <div className="pt-3 border-t border-zinc-900 flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={handleShuffle}
                              className="px-5 py-3 rounded-2xl bg-[#1B2540] border border-[#2D3D6B] text-[#F8FAFF] text-xs font-semibold font-sans tracking-wide uppercase flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              <span>🎲 Shuffle Picks</span>
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer disclaimer stamp */}
                <div className="py-2 text-center shrink-0">
                  <p className="text-[10px] text-zinc-600 font-sans max-w-md mx-auto">
                    plot Concierge filters your own saved films. There are no social feeds, no sponsored bias, and no artificial loops. Just the films you trusted yourself to remember.
                  </p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
