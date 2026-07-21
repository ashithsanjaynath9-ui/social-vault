/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Check, 
  Compass, 
  Heart, 
  Clock, 
  UserCheck, 
  Gift, 
  Shuffle, 
  ArrowUpRight,
  Search
} from 'lucide-react';
import { Movie } from '../types';
import { IDENTITY_DIRECTIONS } from './BrandIdentity';

interface CineSaveAssistantProps {
  movies: Movie[];
  onMarkWatched: (id: string) => void;
  onSelectMovie: (id: string) => void;
  activeIdentity: string;
}

// Curated Mood Categories
interface Category {
  id: string;
  title: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  autofillText: string;
  filter: (m: Movie) => boolean;
  poeticSubtitle: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'mind_bending',
    title: 'Mind-bending',
    shortLabel: 'Mind-bending',
    icon: Compass,
    autofillText: 'Recommend something mind-bending',
    filter: (m) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('mind-bending') || text.includes('cosmic') || text.includes('sci-fi') || text.includes('thriller') || text.includes('mystery') || text.includes('cerebral') || text.includes('psych');
    },
    poeticSubtitle: "Intricate puzzles and deep cosmic realities."
  },
  {
    id: 'hidden_gems',
    title: 'Hidden Gems',
    shortLabel: 'Hidden Gems',
    icon: Gift,
    autofillText: 'Give me a hidden gem from my library',
    filter: (m) => {
      const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
      return text.includes('indie') || text.includes('artistic') || text.includes('foreign') || text.includes('cult') || text.includes('mysterious') || text.includes('gentle') || text.includes('underrated');
    },
    poeticSubtitle: "Underrated masterworks rescued from the algorithmic feed."
  },
  {
    id: 'under_90',
    title: 'Under 90 Minutes',
    shortLabel: 'Under 90 Min',
    icon: Clock,
    autofillText: 'A movie under 90 minutes',
    filter: (m) => {
      if (!m.runtime) return true;
      const minsMatch = m.runtime.match(/(\d+)\s*min/i);
      if (minsMatch) return parseInt(minsMatch[1], 10) <= 90;
      return true;
    },
    poeticSubtitle: "Compact, punchy tales that respect your clock."
  },
  {
    id: 'friends_recommended',
    title: 'Friends Recommended',
    shortLabel: 'Friends Recs',
    icon: UserCheck,
    autofillText: 'What should I watch with friends?',
    filter: (m) => {
      const text = `${m.socialSource?.author || ''} ${m.socialSource?.platform || ''}`.toLowerCase();
      return text.length > 0 || !!m.socialSource?.textSnippet;
    },
    poeticSubtitle: "Warm stories with the physical warmth of human review."
  },
  {
    id: 'surprise_me',
    title: 'Surprise Me',
    shortLabel: 'Surprise Me',
    icon: Shuffle,
    autofillText: 'Surprise me with something from my shelf',
    filter: () => true,
    poeticSubtitle: "Leave the selection to chance and trust your archives."
  },
  {
    id: 'comfort_movies',
    title: 'Comfort Movies',
    shortLabel: 'Comfort',
    icon: Heart,
    autofillText: 'Recommend a cozy comfort movie',
    filter: (m) => {
      const text = `${m.genres.join(' ')} ${m.vibe}`.toLowerCase();
      return text.includes('comedy') || text.includes('romance') || text.includes('animation') || text.includes('cozy') || text.includes('warm') || text.includes('feel-good') || text.includes('nostalgia') || text.includes('gentle');
    },
    poeticSubtitle: "Familiar rhythms and stories that feel like home."
  }
];

export default function CineSaveAssistant({ 
  movies, 
  onMarkWatched, 
  onSelectMovie,
  activeIdentity 
}: CineSaveAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('surprise_me');
  const [prompt, setPrompt] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper: calculate time saved relative
  const getRelativeTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'recently';
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 30) return `${diffDays} days ago`;
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return '1 month ago';
      return `${diffMonths} months ago`;
    } catch (e) {
      return 'some time ago';
    }
  };

  // Filter unwatched movies
  const unwatchedMovies = useMemo(() => {
    const unwatched = movies.filter(m => !m.watched);
    return unwatched.length > 0 ? unwatched : movies;
  }, [movies]);

  // Find active category based on ID
  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === activeCategoryId) || CATEGORIES[4];
  }, [activeCategoryId]);

  // Scored / Filtered movies for the search prompt or selected category
  const recommendedMovies = useMemo(() => {
    const query = prompt.trim().toLowerCase();

    if (query) {
      // Calculate a smart relevance score for each movie in the library
      const scored = unwatchedMovies.map(m => {
        let score = 0;
        const titleMatch = m.title.toLowerCase().includes(query);
        const dirMatch = m.director.toLowerCase().includes(query);
        const vibeMatch = m.vibe.toLowerCase().includes(query);
        const genreMatch = m.genres.some(g => query.includes(g.toLowerCase()) || g.toLowerCase().includes(query));
        
        if (titleMatch) score += 120;
        if (dirMatch) score += 80;
        if (genreMatch) score += 60;
        if (vibeMatch) score += 50;

        // Semantic mapping:
        // 1. Mind-bending / Sci-fi / Mystery
        if (query.includes('mind') || query.includes('bend') || query.includes('sci') || query.includes('cosmic') || query.includes('puzzle') || query.includes('interstellar') || query.includes('cerebral')) {
          const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
          if (text.includes('mind-bending') || text.includes('cosmic') || text.includes('sci-fi') || text.includes('thriller') || text.includes('cerebral')) {
            score += 40;
          }
        }

        // 2. Hidden Gems / Indie / Overlooked
        if (query.includes('gem') || query.includes('hidden') || query.includes('overlook') || query.includes('underrated') || query.includes('indie')) {
          const text = `${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
          if (text.includes('indie') || text.includes('artistic') || text.includes('foreign') || text.includes('cult') || text.includes('underrated')) {
            score += 40;
          }
        }

        // 3. Short / under 90 mins / under 2 hours
        if (query.includes('90') || query.includes('short') || query.includes('hour') || query.includes('min') || query.includes('time')) {
          const minsMatch = m.runtime ? m.runtime.match(/(\d+)\s*min/i) : null;
          if (minsMatch) {
            const mins = parseInt(minsMatch[1], 10);
            if (query.includes('90') && mins <= 90) score += 60;
            else if ((query.includes('2 hour') || query.includes('120') || query.includes('hour')) && mins <= 120) score += 60;
            else if (mins <= 100) score += 30;
          }
        }

        // 4. Social / Friends / Peer
        if (query.includes('friend') || query.includes('recommend') || query.includes('who') || query.includes('someone') || query.includes('social') || query.includes('author')) {
          const text = `${m.socialSource?.author || ''} ${m.socialSource?.platform || ''}`.toLowerCase();
          if (text.length > 0 || m.socialSource?.textSnippet) {
            score += 50;
          }
        }

        // 5. Comfort / Cozy / Warm / Emotional
        if (query.includes('comfort') || query.includes('cozy') || query.includes('warm') || query.includes('feel') || query.includes('emotional') || query.includes('love') || query.includes('nostalg')) {
          const text = `${m.genres.join(' ')} ${m.vibe}`.toLowerCase();
          if (text.includes('comedy') || text.includes('romance') || text.includes('animation') || text.includes('cozy') || text.includes('warm') || text.includes('feel-good') || text.includes('gentle') || text.includes('nostalgia')) {
            score += 45;
          }
        }

        // 6. Surprise / Random
        if (query.includes('surprise') || query.includes('random') || query.includes('shelf') || query.includes('any')) {
          score += Math.random() * 30;
        }

        return { movie: m, score };
      });

      // Filter to positive scores, or fallback to substring matching
      let matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.movie);
      
      if (matched.length === 0) {
        matched = unwatchedMovies.filter(m => {
          const text = `${m.title} ${m.director} ${m.vibe} ${m.genres.join(' ')}`.toLowerCase();
          return query.split(' ').some(word => word.length > 2 && text.includes(word));
        });
      }

      if (matched.length === 0) {
        matched = unwatchedMovies;
      }

      return matched.slice(0, 3);
    } else {
      // Prompt is empty, fall back to the selected Category filter
      let filteredCats = unwatchedMovies.filter(activeCategory.filter);
      if (activeCategoryId === 'surprise_me') {
        filteredCats = [...unwatchedMovies].sort(() => 0.5 - Math.random());
      }
      if (filteredCats.length === 0) {
        filteredCats = unwatchedMovies;
      }
      return filteredCats.slice(0, 3);
    }
  }, [unwatchedMovies, activeCategory, activeCategoryId, prompt]);

  // Intelligent Context-Aware Match Reason Generator
  const getDynamicReason = (movie: Movie) => {
    const query = prompt.trim().toLowerCase();
    
    if (!query) {
      // Category fallback defaults
      if (activeCategoryId === 'mind_bending') return `Fits your request for a mind-expanding, cerebral narrative with deep '${movie.vibe}' atmosphere.`;
      if (activeCategoryId === 'hidden_gems') return `Selected as an overlooked indie gem waiting to be rediscovered from your personal archive.`;
      if (activeCategoryId === 'under_90') return `A concise and highly rewarding cinematic journey respecting your time tonight (${movie.runtime}).`;
      if (activeCategoryId === 'friends_recommended') return movie.socialSource?.author 
        ? `Saved directly from the personal recommendation shared with you by ${movie.socialSource.author}.`
        : `A trusted personal recommendation resting on your cozy watchlist.`;
      if (activeCategoryId === 'comfort_movies') return `A beautiful, comforting, and nostalgic story chosen to soothe your evening.`;
      return `Saved ${getRelativeTimeAgo(movie.addedAt)} matching your '${movie.vibe}' personal curation profile.`;
    }

    // Dynamic prompt-based matched reasons
    if (movie.title.toLowerCase().includes(query)) {
      return `Because you explicitly asked for this film by title in your archive.`;
    }
    if (movie.director.toLowerCase().includes(query)) {
      return `Curated directly from your saved films directed by the brilliant ${movie.director}.`;
    }

    if (query.includes('mind') || query.includes('bend') || query.includes('sci') || query.includes('cosmic') || query.includes('puzzle') || query.includes('interstellar') || query.includes('cerebral')) {
      return `Fits your request for an emotional, mind-bending sci-fi to escape into tonight.`;
    }
    if (query.includes('gem') || query.includes('hidden') || query.includes('overlook') || query.includes('underrated') || query.includes('indie')) {
      return `Fits your request for a hidden gem: saved ${getRelativeTimeAgo(movie.addedAt)} with a signature '${movie.vibe}' indie aesthetic.`;
    }
    if (query.includes('90') || query.includes('short') || query.includes('hour') || query.includes('min') || query.includes('time')) {
      return `An elegant solution to your time-saving mood, running at a concise ${movie.runtime}.`;
    }
    if (query.includes('friend') || query.includes('recommend') || query.includes('who') || query.includes('someone') || query.includes('social')) {
      if (movie.socialSource?.author) {
        return `Matches your inquiry for shared recommendations: highly praised by ${movie.socialSource.author}.`;
      }
      return `Fits your interest in social recommendations and highly rated collaborative pieces.`;
    }
    if (query.includes('comfort') || query.includes('cozy') || query.includes('warm') || query.includes('feel') || query.includes('emotional') || query.includes('love') || query.includes('nostalg')) {
      return `Because you saved this ${getRelativeTimeAgo(movie.addedAt)} and loved its cozy, warm emotional beat.`;
    }
    if (query.includes('surprise') || query.includes('random')) {
      return `Pulled at random ex libris from your wooden shelf to cure your decision fatigue.`;
    }

    // Match on genre
    const matchedGenre = movie.genres.find(g => query.includes(g.toLowerCase()));
    if (matchedGenre) {
      return `A perfect matching candidate from your library's beautiful ${matchedGenre} catalog.`;
    }

    return `Fits your request for "${prompt}" with its beautiful '${movie.vibe}' style, saved ${getRelativeTimeAgo(movie.addedAt)}.`;
  };

  // Determine current brand identity configuration
  const brandConfig = useMemo(() => {
    return IDENTITY_DIRECTIONS.find(d => d.id === activeIdentity) || IDENTITY_DIRECTIONS[0];
  }, [activeIdentity]);

  // Handle Enter/Submit inside the intent form (Trigger tactile loading flicker)
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  // Tapping a category chip autofills the search bar and sets category state
  const handleCategoryClick = (category: Category) => {
    setPrompt(category.autofillText);
    setActiveCategoryId(category.id);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <>
      {/* FLOATING ACTION ASSISTANT BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-40">
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 25 }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              onClick={() => {
                setIsOpen(true);
                // Autofocus intent bar when opened
                setTimeout(() => inputRef.current?.focus(), 250);
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                backgroundColor: '#243155',
                borderColor: 'rgba(124,140,255,0.32)'
              }}
              whileTap={{ 
                scale: 0.95,
                backgroundColor: '#2D3D6B'
              }}
              style={{
                backgroundColor: '#1B2540',
                border: '1px solid rgba(124,140,255,0.18)',
                color: '#F8FAFF',
                boxShadow: '0 10px 30px rgba(10,15,30,0.45)',
              }}
              className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full select-none cursor-pointer group transition-colors duration-200"
              id="cine-assistant-trigger"
            >
              <div className="relative">
                <Sparkles className="w-4 h-4 text-[#97A5FF] group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97A5FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#97A5FF]"></span>
                </span>
              </div>
              <span className="text-xs font-sans font-semibold tracking-wide uppercase text-[#F8FAFF]">
                Decide Tonight
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* EXPANDABLE BOTTOM DRAWER AND OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Spotify AI DJ / Apple Spotlight interactive bottom sheet drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-[#0C0B0A] border-t border-zinc-900 rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-sans pb-8 max-h-[94vh] flex flex-col"
              id="cine-assistant-drawer"
            >
              {/* Drag handle handle */}
              <div 
                className="w-12 h-1 bg-zinc-800 hover:bg-zinc-700 rounded-full mx-auto my-3 cursor-pointer shrink-0 transition-colors" 
                onClick={() => setIsOpen(false)}
              />

              {/* Scrollable Drawer Content */}
              <div className="overflow-y-auto px-6 sm:px-8 space-y-5 flex-1 min-h-0 no-scrollbar">
                
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 text-[#7C8CFF] flex items-center justify-center">
                        {brandConfig.logoSvg("w-3.5 h-3.5")}
                      </div>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-500 font-mono">
                        {brandConfig.name} Decider Assistant
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-light italic text-zinc-100 leading-tight">
                      What are you in the mood for?
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* PREMIUM INTENT SEARCH BAR (Apple Spotlight / Spotify DJ Intent Bar) */}
                <form onSubmit={handleSubmitPrompt} className="relative block shrink-0">
                  <div className="relative flex items-center rounded-2xl bg-zinc-900/90 border border-zinc-800/80 px-4 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] focus-within:border-[#7C8CFF]/50 focus-within:ring-2 focus-within:ring-[#7C8CFF]/20 focus-within:shadow-[0_0_25px_rgba(124,140,255,0.15)] transition-all duration-300">
                    <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask your library anything... (e.g. 'Something emotional', 'Short sci-fi')"
                      className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none pr-8 font-sans font-normal"
                    />
                    {prompt && (
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt('');
                          setActiveCategoryId('surprise_me');
                          inputRef.current?.focus();
                        }}
                        className="absolute right-10 p-1 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="absolute right-4 flex items-center gap-1.5 pointer-events-none select-none">
                      <Sparkles className="w-4 h-4 text-[#7C8CFF]/80 animate-pulse" />
                    </div>
                  </div>
                </form>

                {/* Recommendation chips (Category Pills) - autofill search on tap */}
                <div className="overflow-x-auto -mx-6 px-6 no-scrollbar shrink-0">
                  <div className="flex gap-2 pb-1.5">
                    {CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = activeCategoryId === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium font-sans flex items-center gap-2 shrink-0 border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-100 border-zinc-50 text-zinc-950 shadow-md font-semibold'
                              : 'bg-zinc-900/40 border-zinc-850/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#7C8CFF]' : 'text-zinc-500'}`} />
                          <span>{category.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtitle describing current selection state */}
                <div className="text-left py-0.5 border-b border-zinc-900/50 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>
                    {prompt ? (
                      <span className="text-zinc-400">
                        Intelligent Match: <span className="text-[#7C8CFF] font-medium font-mono">"{prompt}"</span>
                      </span>
                    ) : (
                      <span className="uppercase tracking-wide">
                        CURATED TUNING: <span className="text-[#7C8CFF] font-medium">{activeCategory.title}</span>
                      </span>
                    )}
                  </span>
                  <span className="italic">
                    {prompt ? 'Filtered library records' : activeCategory.poeticSubtitle}
                  </span>
                </div>

                {/* VISUAL DECISION CARDS GRID (With micro-loading flicker & fluid animation) */}
                <div className="relative min-h-[280px]">
                  {isRefreshing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C0B0A]/80 z-20 space-y-2">
                      <Sparkles className="w-7 h-7 text-[#7C8CFF] animate-spin" />
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Reshuffling Curation...</span>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                    <AnimatePresence mode="popLayout">
                      {recommendedMovies.map((movie, index) => {
                        const reason = getDynamicReason(movie);
                        return (
                          <motion.div
                            key={`${activeCategoryId}-${movie.id}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative overflow-hidden rounded-2xl bg-zinc-900/35 border border-zinc-850/60 p-4 flex flex-col text-left group hover:border-zinc-800 hover:bg-zinc-900/60 transition-all duration-300"
                          >
                            {/* Aesthetic Ticket notches */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-5 rounded-r-full bg-[#0C0B0A] border border-zinc-900 border-l-transparent z-10" />
                            <div className="absolute top-1/2 -right-1.5 w-3 h-5 rounded-l-full bg-[#0C0B0A] border border-zinc-900 border-r-transparent z-10" />

                            {/* Movie Poster & Title Block */}
                            <div className="flex gap-4 items-start flex-1">
                              {/* Poster Image */}
                              <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-xl overflow-hidden shrink-0 bg-zinc-950 border border-zinc-850 shadow-md">
                                {movie.posterUrl ? (
                                  <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300 scale-100 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xl">
                                    🍿
                                  </div>
                                )}
                              </div>

                              {/* Info Block */}
                              <div className="space-y-1 flex-1 min-w-0 text-left">
                                <span className="text-[9px] font-mono uppercase bg-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850">
                                  {movie.year}
                                </span>
                                <h4 className="font-display font-light text-base sm:text-lg text-zinc-100 group-hover:text-white transition-colors truncate mt-1">
                                  {movie.title}
                                </h4>
                                {movie.streamingServices && movie.streamingServices.length > 0 && (
                                  <p className="text-xs font-semibold text-[#7C8CFF] font-sans truncate">
                                    {movie.streamingServices[0]}
                                  </p>
                                )}
                                <p className="text-[10px] text-zinc-400 font-sans leading-none truncate">
                                  Dir: {movie.director}
                                </p>
                                <p className="text-[10px] text-zinc-500 font-sans leading-none truncate">
                                  Runtime: {movie.runtime || "N/A"}
                                </p>
                              </div>
                            </div>

                            {/* Intelligent Why Recommended Note */}
                            <div className="mt-4 p-3 rounded-xl bg-zinc-950/55 border border-zinc-900/80 flex-1 flex flex-col justify-between">
                              <p className="text-xs text-zinc-350 leading-relaxed font-sans italic">
                                "{reason}"
                              </p>
                              
                              <div className="mt-2.5 pt-2 border-t border-zinc-900/30 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                                <span>Vibe: {movie.vibe}</span>
                                <span className="uppercase text-emerald-500/80 font-semibold">★ {movie.rating || "IMDb 8+"}</span>
                              </div>
                            </div>

                            {/* TACTILE CTAs */}
                            <div className="mt-4 grid grid-cols-2 gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  onMarkWatched(movie.id);
                                }}
                                className="px-3 py-2 bg-[#7C8CFF]/10 hover:bg-[#7C8CFF]/15 border border-[#7C8CFF]/25 text-[#7C8CFF] hover:text-[#9AA8FF] rounded-xl text-[11px] font-sans font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                </div>

                {/* Footer curation stamp */}
                <div className="py-2 text-center shrink-0">
                  <p className="text-[10px] text-zinc-600 font-sans max-w-md mx-auto">
                    CineSave Assistant filters your own saved films. There are no social feeds, no sponsored bias, and no artificial loops. Just the films you trusted yourself to remember.
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
