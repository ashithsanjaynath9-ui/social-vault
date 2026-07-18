/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  Tv, 
  Flame, 
  Instagram, 
  Youtube, 
  Clock, 
  Compass, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Heart,
  ChevronRight,
  MonitorPlay,
  TrendingUp,
  Inbox,
  Tv2,
  Plus,
  Loader2
} from 'lucide-react';
import { Movie } from '../types';
import { REEL_TEMPLATES, ReelTemplate } from '../data';
import { getTrailerUrl } from '../utils';

interface HomeScreenProps {
  movies: Movie[];
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectCollection: (template: ReelTemplate) => void;
  onViewAllWatchlist: () => void;
  onSelectMovie?: (id: string) => void;
  onOpenExtractor?: () => void;
  onAddMovie?: (movie: Omit<Movie, 'id' | 'addedAt' | 'watched'>) => void;
}

export default function HomeScreen({
  movies,
  onToggleWatched,
  onDelete,
  onSelectCollection,
  onViewAllWatchlist,
  onSelectMovie,
  onOpenExtractor,
  onAddMovie
}: HomeScreenProps) {
  // Personalized Recommendation State
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [addingRecId, setAddingRecId] = useState<string | null>(null);

  const savedTitlesString = useMemo(() => {
    return movies.map(m => m.title).join(',');
  }, [movies]);

  useEffect(() => {
    let isMounted = true;
    async function loadRecommendations() {
      setLoadingRecs(true);
      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ savedMovies: movies })
        });
        const data = await response.json();
        if (isMounted && data.success && data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error("Failed to fetch custom recommendations:", err);
      } finally {
        if (isMounted) setLoadingRecs(false);
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [savedTitlesString]);

  const handleOneTapAdd = async (rec: any) => {
    if (!onAddMovie) return;
    setAddingRecId(rec.title);
    
    // Simulate premium micro-animation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onAddMovie({
      title: rec.title,
      year: rec.year,
      director: rec.director,
      synopsis: rec.synopsis,
      rating: rec.rating,
      genres: rec.genres,
      vibe: rec.vibe,
      streamingServices: rec.streamingServices,
      whySave: `Recommended pairing for saved movies: ${rec.savedReferenceTitles.join(', ')}`,
      posterUrl: rec.posterUrl,
      socialSource: {
        platform: 'manual',
        author: 'SYSTEM AFFINITY',
        textSnippet: rec.reason
      }
    });
    setAddingRecId(null);
  };

  const isAlreadySaved = (title: string) => {
    return movies.some(m => m.title.toLowerCase() === title.toLowerCase());
  };

  const renderExplanation = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-zinc-100 font-bold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px] inline-block mx-0.5 font-mono">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };
  // Count unwatched movies
  const unwatchedMovies = useMemo(() => movies.filter(m => !m.watched), [movies]);
  const unwatchedCount = unwatchedMovies.length;
  
  // Calculate weekends (assuming watching 2 movies per weekend)
  const weekendsCount = Math.max(1, Math.ceil(unwatchedCount / 2));

  // Today's Pick algorithm - Select a premium unwatched movie dynamically
  const todayPick = useMemo(() => {
    if (unwatchedCount === 0) return null;
    
    // Prioritize favorites
    const favorites = unwatchedMovies.filter(m => m.favorite);
    if (favorites.length > 0) {
      return favorites[0];
    }
    
    // Sort by rating or most recent
    const sorted = [...unwatchedMovies].sort((a, b) => {
      const rateA = parseFloat(a.rating) || 0;
      const rateB = parseFloat(b.rating) || 0;
      if (rateB !== rateA) return rateB - rateA;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
    
    return sorted[0];
  }, [unwatchedMovies, unwatchedCount]);

  // Filter 4 newest unwatched movies for "Recently Imported"
  const recentlyImported = useMemo(() => {
    return [...unwatchedMovies]
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 4);
  }, [unwatchedMovies]);

  // Filter movies with progress for "Continue Watching"
  const continueWatching = useMemo(() => {
    return movies.filter(m => !m.watched && m.progress !== undefined && m.progress > 0);
  }, [movies]);

  // "Trending in Your Library" - High rated or premium items
  const trendingMovies = useMemo(() => {
    return [...unwatchedMovies]
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      })
      .slice(0, 4);
  }, [unwatchedMovies]);

  // "Recently Recommended" - items with a strong curation note
  const recentlyRecommended = useMemo(() => {
    return [...unwatchedMovies]
      .filter(m => m.whySave && m.whySave.length > 10)
      .slice(0, 3);
  }, [unwatchedMovies]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="space-y-20 pb-16" id="private-cinema-lobby">
      
      {/* 1. Dramatic Evolving Headline - Huge typography, massive whitespace */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-3 pt-6 text-left"
      >
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
          ✦ PRIVATE CINEMA LOBBY
        </span>
        {unwatchedCount > 0 ? (
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
              You’ve saved enough cinema <br />
              for <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">{weekendsCount} weekend{weekendsCount > 1 ? 's' : ''}</span>.
            </h1>
            
            {/* Dynamic Curation Milestones & Movie Night Math (Delight Moment 1) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1.5 border-t border-zinc-900/60 w-fit">
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/15 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-amber-500/15 transition-all">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{unwatchedCount >= 25 ? 'Master Curator' : unwatchedCount >= 10 ? 'Senior Critic' : 'Cinephile'} Level</span>
              </span>
              <span className="text-zinc-700 text-xs hidden sm:inline">•</span>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight leading-relaxed">
                Holds <span className="text-white font-bold">{unwatchedCount * 2} hours</span> of curated masterclass cinematography, enough to fuel <span className="text-blue-400 font-bold">{Math.max(1, Math.round(unwatchedCount * 0.7))} movie nights</span>.
              </p>
            </div>
          </div>
        ) : (
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
            Share your <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-400 bg-clip-text text-transparent">first movie reel</span>.
          </h1>
        )}
      </motion.div>

      {/* 2. Hero Section: Today's Pick - Large cinematic poster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full"
      >
        {todayPick ? (
          <div className="relative rounded-[32px] overflow-hidden border border-zinc-900 bg-zinc-950/60 shadow-[0_32px_80px_rgba(0,0,0,0.8)] group">
            {/* Blurry cinematic background reflection */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl scale-125" 
              style={{ backgroundImage: `url(${todayPick.posterUrl})` }}
            />
            {/* Dark elegant ambient gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/75 md:to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent z-10" />

            <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-14 items-center">
              
              {/* Left: Cinematic Poster */}
              <div className="md:col-span-4 flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelectMovie?.(todayPick.id)}
                  className="w-60 md:w-full max-w-xs aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-zinc-800/80 relative cursor-pointer group"
                >
                  <img 
                    src={todayPick.posterUrl} 
                    alt={todayPick.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <Play className="w-5 h-5 fill-current text-white ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Dynamic Information */}
              <div className="md:col-span-8 space-y-6 text-left">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/15 text-purple-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    WHAT SHOULD I WATCH TONIGHT?
                  </span>
                  
                  {todayPick.streamingServices && todayPick.streamingServices.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-full text-[10px] font-mono font-bold">
                      Available on {todayPick.streamingServices[0]}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
                    {todayPick.title}
                  </h2>
                  <p className="text-zinc-500 text-sm font-mono font-medium uppercase tracking-wider">
                    Directed by {todayPick.director} • {todayPick.year} • {todayPick.runtime || '120 min'}
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/10 uppercase tracking-widest">
                    ✦ {todayPick.vibe}
                  </span>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl font-sans italic">
                    "{todayPick.whySave}"
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-2 max-w-xl leading-relaxed">
                    {todayPick.synopsis}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onSelectMovie?.(todayPick.id)}
                    className="px-8 py-4 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <Play className="w-4 h-4 fill-current text-black" />
                    <span>Watch Tonight</span>
                  </button>
                  
                  <a
                    href={getTrailerUrl(todayPick.title, todayPick.year)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Trailer</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Empty State invitation - Beautifully styled */
          <div className="relative rounded-[32px] overflow-hidden border border-dashed border-zinc-800 bg-zinc-950/20 p-12 md:p-20 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-inner">
              <Tv2 className="w-7 h-7 text-zinc-500 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Your cinematic screen is dark.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-mono max-w-md mx-auto">
                No saved films in your pipeline. Import raw transcripts from Instagram reels or TikTok to extract structured lists instantly.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenExtractor}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-xl shadow-blue-500/15 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Share Your First Movie Reel</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* 3. Continue Watching Segment (Horizontal layout with glossy sliders) */}
      {continueWatching.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-900/60">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Continue Watching
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueWatching.map(movie => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie?.(movie.id)}
                className="bg-zinc-950/40 border border-zinc-900/80 hover:border-zinc-800 rounded-2xl p-4 flex gap-4 transition-all relative group cursor-pointer shadow-lg hover:shadow-2xl"
              >
                <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-850 relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {movie.director} • {movie.year}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                      <span>{movie.progress}% complete</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Recently Imported Segment - Poster Centric Grid */}
      {recentlyImported.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <MonitorPlay className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                Recently Imported
              </h3>
            </div>
            
            <button
              onClick={onViewAllWatchlist}
              className="text-[10px] font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>View Full Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {recentlyImported.map(movie => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onSelectMovie?.(movie.id)}
                className="bg-zinc-950/40 border border-zinc-900/80 hover:border-zinc-800 rounded-[20px] overflow-hidden flex flex-col h-[340px] transition-all relative group cursor-pointer shadow-lg"
              >
                {/* Visual Cover Poster */}
                <div className="relative flex-1 bg-zinc-900 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                  
                  {/* Platform overlay tag */}
                  <span className="absolute top-3 left-3 text-[8px] font-mono font-bold bg-zinc-950/80 backdrop-blur-md px-2.5 py-0.5 border border-zinc-800/60 rounded-full text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                    {movie.socialSource.platform === 'instagram' && <Instagram className="w-2.5 h-2.5 text-pink-500" />}
                    {movie.socialSource.platform === 'youtube' && <Youtube className="w-2.5 h-2.5 text-red-500" />}
                    <span>{movie.socialSource.platform}</span>
                  </span>

                  {/* Rating stamp */}
                  <span className="absolute top-3 right-3 text-[9px] font-mono font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-800/40 text-amber-400">
                    ★ {movie.rating}
                  </span>
                </div>

                {/* Movie card text */}
                <div className="p-4 shrink-0 bg-zinc-950/60 space-y-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors tracking-tight">
                      {movie.title}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-mono truncate">
                      {movie.director} • {movie.year}
                    </p>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850/60 font-semibold block w-fit">
                    {movie.vibe}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 5. Collections (Curated Reel Templates for quick analyzing) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Curated Collections
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Select a platform transcript to ingest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REEL_TEMPLATES.map(tmpl => {
            const platformStyles = {
              instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/15',
              tiktok: 'bg-teal-500/10 text-teal-400 border-teal-500/15',
              youtube: 'bg-red-500/10 text-red-400 border-red-500/15'
            };
            return (
              <div
                key={tmpl.id}
                className="bg-zinc-950/40 border border-zinc-900 rounded-[22px] p-6 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl select-none">{tmpl.icon}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 border rounded-full ${platformStyles[tmpl.platform]}`}>
                      {tmpl.platform}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                      {tmpl.title}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                      Shared by {tmpl.creator}
                    </p>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                    3 films structured
                  </span>
                  <button
                    onClick={() => onSelectCollection(tmpl)}
                    className="text-[10px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Extract</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Trending in Your Library Segment */}
      {trendingMovies.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-900/60">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Trending in Your Library
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingMovies.map(movie => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie?.(movie.id)}
                className="bg-zinc-950/40 border border-zinc-900/80 hover:border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[280px] transition-all relative group cursor-pointer shadow-lg"
              >
                <div className="relative h-40 shrink-0 bg-zinc-900 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                </div>
                
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">
                      {movie.title}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                      ★ {movie.rating} • {movie.year}
                    </p>
                  </div>
                  <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/15 font-bold w-fit truncate block max-w-full">
                    {movie.vibe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Redesigned Premium Recommendation Experience - Cinematic Affinities */}
      <section className="space-y-8" id="cinematic-affinities-lobby">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                Cinematic Affinities & Pairings
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Calculated based on film matches & direct links in your watchlist
              </p>
            </div>
          </div>
          {loadingRecs && (
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Analyzing cinema graph...</span>
            </div>
          )}
        </div>

        {loadingRecs && recommendations.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-zinc-950/20 border border-zinc-900/50 rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Compiling tailored recommendations...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const saved = isAlreadySaved(rec.title);
              const adding = addingRecId === rec.title;

              return (
                <motion.div
                  key={`${rec.title}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(24,24,24,0.92)] p-6 flex flex-col md:flex-row gap-6 hover:bg-[#202020] hover:shadow-[0px_18px_40px_rgba(0,0,0,0.35)] transition-all hover:scale-[1.005] group"
                >
                  {/* Absolute backdrop glow */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/8 transition-colors" />

                  {/* Movie Poster with layered stats */}
                  <div className="relative w-full md:w-44 h-64 rounded-2xl overflow-hidden shrink-0 bg-zinc-900/60 shadow-lg group-hover:shadow-xl transition-all border border-zinc-850 self-center">
                    <img
                      src={rec.posterUrl}
                      alt={rec.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Floating Match badges */}
                    <div className="absolute top-3 left-3 right-3 flex flex-col gap-1.5">
                      <div className="bg-purple-500/90 backdrop-blur-md text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit shadow-md">
                        {rec.matchPercentage}% Match
                      </div>
                      <div className="bg-zinc-900/90 backdrop-blur-md text-zinc-300 font-mono text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit border border-zinc-800">
                        {rec.confidence}% Confidence
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[9px] font-mono font-bold bg-zinc-900/90 text-zinc-300 px-2.5 py-1 rounded border border-zinc-800 backdrop-blur-sm block w-fit truncate">
                        ★ {rec.rating}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Upper Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-medium">
                            {rec.director} • <span className="font-mono text-zinc-500">{rec.year}</span>
                          </p>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2.5 py-1 rounded-full">
                          {rec.vibe}
                        </span>
                      </div>

                      {/* Editorial LINK (The "Why") */}
                      <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-4 space-y-2">
                        <span className="text-[8px] font-mono text-purple-400 font-bold uppercase tracking-widest block">
                          The Pathway Link
                        </span>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed italic">
                          {renderExplanation(rec.reason)}
                        </p>
                      </div>

                      {/* Synopsis */}
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                        {rec.synopsis}
                      </p>
                    </div>

                    {/* Bottom controls: Streaming and One-tap Add */}
                    <div className="pt-4 border-t border-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Streaming services */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mr-1.5">Available on:</span>
                        {rec.streamingServices.map((service: string) => (
                          <span
                            key={service}
                            className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* One-tap Add Action */}
                      <button
                        onClick={() => !saved && !adding && handleOneTapAdd(rec)}
                        disabled={saved || adding}
                        className={`text-xs font-bold font-mono px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 border ${
                          saved
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                            : adding
                            ? 'bg-indigo-900/50 border-indigo-800 text-indigo-300'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 hover:shadow-indigo-500/10'
                        }`}
                      >
                        {adding ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Adding to Watchlist...</span>
                          </>
                        ) : saved ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-zinc-500" />
                            <span>In Watchlist</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Watchlist</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
