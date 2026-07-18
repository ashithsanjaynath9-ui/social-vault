/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  CheckSquare, 
  Clock, 
  Compass, 
  Search, 
  X, 
  Tag, 
  Globe, 
  Hourglass, 
  ArrowUpDown, 
  SlidersHorizontal,
  Play,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Heart,
  Instagram,
  Youtube,
  Twitter,
  MessageSquare,
  Share2,
  Flame,
  Star
} from 'lucide-react';
import { Movie, AppStats } from '../types';
import { getRelativeTime, getTrailerUrl, parseRuntimeMinutes } from '../utils';

// Helper for categorizing source platforms
const getSocialStyle = (platform: Movie['socialSource']['platform']) => {
  switch (platform) {
    case 'instagram':
      return {
        bg: 'bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500',
        textColor: 'text-pink-400',
        label: 'Instagram Reel',
        icon: <Instagram className="w-3.5 h-3.5" />
      };
    case 'tiktok':
      return {
        bg: 'bg-gradient-to-r from-zinc-950 via-teal-500 to-cyan-500',
        textColor: 'text-cyan-400',
        label: 'TikTok Video',
        icon: <Flame className="w-3.5 h-3.5" />
      };
    case 'youtube':
      return {
        bg: 'bg-gradient-to-r from-red-600 to-red-400',
        textColor: 'text-red-400',
        label: 'YouTube Short',
        icon: <Youtube className="w-3.5 h-3.5" />
      };
    case 'twitter':
      return {
        bg: 'bg-sky-500',
        textColor: 'text-sky-400',
        label: 'Twitter/X',
        icon: <Twitter className="w-3.5 h-3.5" />
      };
    case 'whatsapp':
      return {
        bg: 'bg-green-500',
        textColor: 'text-green-400',
        label: 'WhatsApp',
        icon: <MessageSquare className="w-3.5 h-3.5" />
      };
    default:
      return {
        bg: 'bg-zinc-700',
        textColor: 'text-zinc-400',
        label: 'Saved Direct',
        icon: <Globe className="w-3.5 h-3.5" />
      };
  }
};

// Props interface for independent MoviePosterCard
interface MoviePosterCardProps {
  key?: string | number | null;
  movie: Movie;
  onSelectMovie: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

// Independent MoviePosterCard component
function MoviePosterCard({ movie, onSelectMovie, onDelete, onToggleWatched }: MoviePosterCardProps) {
  const social = getSocialStyle(movie.socialSource.platform);
  const searchUrl = getTrailerUrl(movie.title, movie.year);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelectMovie(movie.id)}
      className="group relative rounded-[24px] overflow-hidden bg-[rgba(24,24,24,0.92)] border border-[rgba(255,255,255,0.05)] transition-all duration-300 flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] aspect-[2/3] cursor-pointer hover:bg-[#202020] hover:shadow-[0px_18px_40px_rgba(0,0,0,0.35)]"
    >
      {/* Huge dominated movie poster */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
      />

      {/* Ambient Dark Gradient Wash (Default view) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-0 transition-opacity duration-300" />
      
      {/* Subtle Bottom Title (Default view) */}
      <div className="absolute bottom-5 left-5 right-5 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-mono font-bold tracking-wider bg-zinc-950/80 backdrop-blur-md text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-full uppercase">
            ✦ {movie.vibe}
          </span>
        </div>
        <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
          {movie.title}
        </h3>
        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
          {movie.director} • {movie.year}
        </p>
      </div>

      {/* Floating Top Vibe Rating Stamps (Default View) */}
      <div className="absolute top-4 left-4 flex gap-1.5 z-10 group-hover:opacity-0 transition-opacity">
        {movie.favorite && (
          <span className="text-[9px] font-mono tracking-wide bg-amber-950/90 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            Fav
          </span>
        )}
        <span className="text-[9px] font-mono tracking-wide bg-zinc-950/90 border border-zinc-800/50 text-amber-400 px-2 py-0.5 rounded-full font-bold shadow-md">
          ⭐ {movie.rating}
        </span>
      </div>

      {/* MUBI & Spotify Style Reveal Panel on Hover */}
      <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 select-none z-20">
        
        {/* Top section: Title, saved source, streaming platform */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            {/* Saved From Badge with Source Color */}
            <div className="flex items-center gap-1.5">
              <span className={`p-1.5 rounded-full text-white ${social.bg} shadow-md`}>
                {social.icon}
              </span>
              <div className="leading-none">
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Saved From</p>
                <p className="text-[10px] font-sans font-bold text-zinc-300 mt-0.5 leading-none max-w-[120px] truncate">
                  {movie.socialSource.author || social.label}
                </p>
              </div>
            </div>

            {/* Saved Date */}
            <div className="text-right">
              <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Saved Date</p>
              <p className="text-[10px] font-mono font-bold text-zinc-300 mt-0.5 leading-none">
                {getRelativeTime(movie.addedAt)}
              </p>
            </div>
          </div>

          {/* Movie Header details */}
          <div>
            <h4 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight tracking-tight flex items-baseline gap-1.5">
              <span>{movie.title}</span>
              <span className="text-xs font-mono font-bold text-zinc-500">({movie.year})</span>
            </h4>
            <p className="text-[10px] text-zinc-400 mt-0.5 font-medium leading-tight">
              Directed by <span className="font-bold text-zinc-200">{movie.director}</span>
            </p>
          </div>

          {/* Streaming services */}
          <div className="space-y-1">
            <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Streaming Platform</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {movie.streamingServices.map((srv) => (
                <span
                  key={srv}
                  className="text-[9px] font-mono font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section: Original Reel Thumbnail Mockup */}
        <div className="relative flex justify-center py-1">
          <div className="relative w-[180px] h-[100px] sm:w-[220px] sm:h-[120px] md:w-[250px] md:h-[140px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl flex items-center justify-between p-3.5 group/reel">
            {/* Blurred background scene representing the video playing */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter brightness-[0.25] blur-[3px] scale-110"
              style={{ backgroundImage: `url(${movie.posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Floating Platform Symbol on top corner */}
            <span className={`absolute top-2 left-2 p-1 rounded-full text-white ${social.bg} scale-75 shadow-lg`}>
              {social.icon}
            </span>

            {/* Centered glowing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PlayCircle className="w-10 h-10 text-white/50 group-hover/reel:text-white/90 group-hover/reel:scale-105 transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </div>

            {/* Transcript Text Snippet / Reel Caption inside the video frame */}
            <div className="relative z-10 flex-1 pr-6 flex flex-col justify-end h-full text-left">
              <div className="space-y-1 max-w-[150px]">
                <p className="text-[8px] font-mono font-bold text-blue-400 tracking-wider">
                  @{movie.socialSource.author || 'reel_extract'}
                </p>
                <p className="text-[9px] leading-tight text-zinc-200 font-sans italic font-medium line-clamp-3 leading-relaxed">
                  "{movie.socialSource.textSnippet || `OMG this ${movie.genres[0] || 'movie'} is a masterpiece. The cinematography is insane!`}"
                </p>
              </div>
            </div>

            {/* Floating mini vertical interaction buttons like Instagram */}
            <div className="relative z-10 flex flex-col items-center gap-2 text-white/70">
              <div className="flex flex-col items-center">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span className="text-[7px] font-mono font-bold mt-0.5">2.4K</span>
              </div>
              <div className="flex flex-col items-center">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
                <span className="text-[7px] font-mono font-bold mt-0.5">84</span>
              </div>
              <Share2 className="w-3.5 h-3.5 text-zinc-300 scale-90" />
            </div>
          </div>
        </div>

        {/* Bottom section: Interactive actions */}
        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between relative z-30">
          {/* Quick Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(movie.id);
            }}
            className="p-2.5 bg-zinc-900/60 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-xl border border-zinc-850 transition-all cursor-pointer shadow-md"
            title="Delete from Watchlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Play Trailer Link */}
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              title="Search trailer on YouTube"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest hidden sm:inline">Trailer</span>
            </a>

            {/* Mark Done/Watched */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie.id);
              }}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer font-mono font-bold text-[9px] uppercase tracking-widest ${
                movie.watched
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-850 text-zinc-400 hover:text-white'
              }`}
              title={movie.watched ? "Mark as Unwatched" : "Mark as Done"}
            >
              <Check className={`w-3.5 h-3.5 ${movie.watched ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{movie.watched ? 'Watched' : 'Done'}</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Props interface for independent CollectionShelf
interface CollectionShelfProps {
  key?: string | number | null;
  shelf: { id: string; title: string; subtitle: string; movies: Movie[] };
  onSelectMovie: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

// Independent CollectionShelf component
function CollectionShelf({ shelf, onSelectMovie, onDelete, onToggleWatched }: CollectionShelfProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 text-left relative group/shelf py-2" id={`shelf-${shelf.id}`}>
      {/* Title and subtitle */}
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
            // {shelf.subtitle}
          </p>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            {shelf.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-zinc-600 font-semibold mr-2">
            {shelf.movies.length} film{shelf.movies.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Scrolling container wrapper with smooth scrollbar and controls */}
      <div className="relative">
        {/* Scroll Left Trigger */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-all z-30 shadow-2xl hover:bg-zinc-900 cursor-pointer hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrolling film row */}
        <div 
          ref={rowRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-3 px-2"
        >
          {shelf.movies.map((movie) => (
            <MoviePosterCard 
              key={movie.id} 
              movie={movie} 
              onSelectMovie={onSelectMovie}
              onDelete={onDelete}
              onToggleWatched={onToggleWatched}
            />
          ))}
        </div>

        {/* Scroll Right Trigger */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-all z-30 shadow-2xl hover:bg-zinc-900 cursor-pointer hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// Main WatchlistDashboard Component
interface WatchlistDashboardProps {
  movies: Movie[];
  filteredMovies: Movie[];
  stats: AppStats;
  currentTab: 'unwatched' | 'watched' | 'all';
  onChangeTab: (tab: 'unwatched' | 'watched' | 'all') => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  selectedVibe: string;
  onChangeVibe: (vibe: string) => void;
  selectedStream: string;
  onChangeStream: (stream: string) => void;
  selectedGenre: string;
  onChangeGenre: (genre: string) => void;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  selectedRuntime: string;
  onChangeRuntime: (runtime: string) => void;
  sortBy: 'recent-added' | 'alphabetical' | 'ai-recommendation' | 'recent-available';
  onChangeSortBy: (sort: 'recent-added' | 'alphabetical' | 'ai-recommendation' | 'recent-available') => void;
  onClearFilters: () => void;
  onToggleWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectMovie: (id: string) => void;
}

export default function WatchlistDashboard({
  movies,
  filteredMovies,
  stats,
  currentTab,
  onChangeTab,
  searchQuery,
  onChangeSearch,
  selectedVibe,
  onChangeVibe,
  selectedStream,
  onChangeStream,
  selectedGenre,
  onChangeGenre,
  selectedLanguage,
  onChangeLanguage,
  selectedRuntime,
  onChangeRuntime,
  sortBy,
  onChangeSortBy,
  onClearFilters,
  onToggleWatched,
  onDelete,
  onSelectMovie
}: WatchlistDashboardProps) {

  // Extract unique elements dynamically from all movies for accurate filters
  const uniqueVibes = useMemo(() => Array.from(new Set(movies.map(m => m.vibe))).filter(Boolean).sort(), [movies]);
  const uniqueGenres = useMemo(() => Array.from(new Set(movies.flatMap(m => m.genres))).filter(Boolean).sort(), [movies]);
  const uniqueLanguages = useMemo(() => Array.from(new Set(movies.map(m => m.language || 'English'))).filter(Boolean).sort(), [movies]);
  const uniqueStreams = useMemo(() => Array.from(new Set(movies.flatMap(m => m.streamingServices))).filter(Boolean).sort(), [movies]);

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedVibe !== 'All' || 
    selectedStream !== 'All' || 
    selectedGenre !== 'All' || 
    selectedLanguage !== 'All' || 
    selectedRuntime !== 'All' ||
    sortBy !== 'recent-added';

  // Curation helper functions for shelves
  const isSavedFromFriends = (m: Movie) => {
    const platform = m.socialSource.platform;
    const author = m.socialSource.author?.toLowerCase() || '';
    return (
      platform === 'whatsapp' ||
      platform === 'manual' ||
      platform === 'reddit' ||
      author.includes('friend') ||
      author.includes('group') ||
      author.includes('buddy') ||
      author.includes('chat') ||
      author.includes('cousin') ||
      author.includes('family') ||
      author.includes('essay') || 
      author.includes('frame')
    );
  };

  const isLateNight = (m: Movie) => {
    const genres = m.genres.map(g => g.toLowerCase());
    const vibe = m.vibe.toLowerCase();
    return (
      genres.includes('thriller') ||
      genres.includes('horror') ||
      genres.includes('mystery') ||
      vibe.includes('adrenaline') ||
      vibe.includes('dark') ||
      vibe.includes('night') ||
      vibe.includes('terror') ||
      vibe.includes('tension')
    );
  };

  const isMindBending = (m: Movie) => {
    const vibe = m.vibe.toLowerCase();
    const genres = m.genres.map(g => g.toLowerCase());
    return (
      vibe.includes('mind') ||
      vibe.includes('bending') ||
      vibe.includes('cosmic') ||
      vibe.includes('reality') ||
      vibe.includes('philosophy') ||
      genres.includes('sci-fi') ||
      genres.includes('fantasy') ||
      genres.includes('mystery')
    );
  };

  const isWeekendMovie = (m: Movie) => {
    const runtimeMinutes = parseRuntimeMinutes(m.runtime);
    const ratingVal = parseFloat(m.rating) || 0;
    return (
      runtimeMinutes >= 120 ||
      ratingVal >= 8.4 ||
      m.favorite === true
    );
  };

  // Create collections based on filteredMovies to respect Watch Next vs Watched tabs dynamically!
  const collections = useMemo(() => {
    const unwatchedOrCurrent = filteredMovies;

    // 1. Recently Saved (Sorted by addedAt descending)
    const recentlySaved = [...unwatchedOrCurrent].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );

    // 2. Saved from Instagram
    const fromInstagram = unwatchedOrCurrent.filter(m => m.socialSource.platform === 'instagram');

    // 3. Saved from Friends
    const fromFriends = unwatchedOrCurrent.filter(isSavedFromFriends);

    // 4. Late Night
    const lateNight = unwatchedOrCurrent.filter(isLateNight);

    // 5. Mind Bending
    const mindBending = unwatchedOrCurrent.filter(isMindBending);

    // 6. Weekend Movies
    const weekendMovies = unwatchedOrCurrent.filter(isWeekendMovie);

    // 7. Dynamic Mood Shelf (using dominant vibe or selected vibe)
    const moodShelfName = stats.topVibe || 'Cinematic Aesthetics';
    const moodMovies = unwatchedOrCurrent.filter(m => m.vibe === moodShelfName || m.vibe.toLowerCase().includes('comfort') || m.vibe.toLowerCase().includes('cozy'));

    return [
      { id: 'recent', title: 'Recently Saved', subtitle: 'ADDED TO YOUR CINEMATIC VAULT', movies: recentlySaved },
      { id: 'instagram', title: 'Saved from Instagram', subtitle: 'DISCOVERED ON YOUR REELS FEED', movies: fromInstagram },
      { id: 'friends', title: 'Saved from Friends', subtitle: 'CURATED BY COUSINS & GC INBOXES', movies: fromFriends },
      { id: 'latenight', title: 'Late Night', subtitle: 'INTENSE THRILLERS & ATMOSPHERIC TENSION', movies: lateNight },
      { id: 'mindbending', title: 'Mind Bending', subtitle: 'REALITY SHATTERING NARRATIVES', movies: mindBending },
      { id: 'weekend', title: 'Weekend Movies', subtitle: 'EPICS, SAVED FAVORITES & BLOCKBUSTERS', movies: weekendMovies },
      { id: 'mood', title: `Mood: ${moodShelfName}`, subtitle: 'TAILORED TO YOUR DOMINANT TASTE', movies: moodMovies }
    ].filter(shelf => shelf.movies.length > 0); // Hide empty shelves gracefully
  }, [filteredMovies, stats.topVibe]);

  return (
    <div className="space-y-10 animate-fade-in" id="watchlist-dashboard">
      
      {/* 1. Statistics Cards Bento Row (Spotify stats vibe) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Watch Next',
            value: stats.totalSaved,
            unit: 'films',
            icon: <Film className="w-4 h-4 text-blue-400" />,
            bgGlow: 'group-hover:bg-blue-500/5',
            borderColor: 'group-hover:border-blue-500/20',
            iconBg: 'bg-blue-500/10 border-blue-500/10'
          },
          {
            label: 'Watched Library',
            value: stats.watchedCount,
            unit: 'done',
            icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
            bgGlow: 'group-hover:bg-emerald-500/5',
            borderColor: 'group-hover:border-emerald-500/20',
            iconBg: 'bg-emerald-500/10 border-emerald-500/10'
          },
          {
            label: 'Curation Size',
            value: `~${stats.savedHours}`,
            unit: 'hours',
            icon: <Clock className="w-4 h-4 text-purple-400" />,
            bgGlow: 'group-hover:bg-purple-500/5',
            borderColor: 'group-hover:border-purple-500/20',
            iconBg: 'bg-purple-500/10 border-purple-500/10'
          },
          {
            label: 'Dominant Vibe',
            value: stats.topVibe || 'Mixed Vibes',
            unit: '',
            icon: <Compass className="w-4 h-4 text-amber-400" />,
            bgGlow: 'group-hover:bg-amber-500/5',
            borderColor: 'group-hover:border-amber-500/20',
            iconBg: 'bg-amber-500/10 border-amber-500/10',
            isFullOnMobile: true
          }
        ].map((stat, idx) => (
          <div 
            key={idx}
            className={`bg-zinc-950/40 backdrop-blur-sm border border-zinc-900/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden group transition-all duration-300 hover:border-zinc-800 ${stat.borderColor} ${stat.isFullOnMobile ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent to-transparent pointer-events-none transition-all duration-500 ${stat.bgGlow}`} />
            
            <div className={`p-2 rounded-xl border shrink-0 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none">
                {stat.label}
              </p>
              <p className="text-base font-display font-bold text-white mt-1.5 leading-none truncate flex items-baseline gap-1">
                <span>{stat.value}</span>
                {stat.unit && <span className="text-[10px] text-zinc-500 font-sans font-medium">{stat.unit}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Control Center: Segmented Tabs & Filters (Spotify/MUBI premium layout) */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-3xl p-5 space-y-5 relative overflow-hidden shadow-2xl">
        {/* Top Row: Segmented Tab bar & Search bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between relative z-10">
          
          {/* Segmented control tab switcher */}
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-900/60 self-start w-full sm:w-auto relative">
            {(['unwatched', 'watched', 'all'] as const).map((tab) => {
              const isActive = currentTab === tab;
              const label = tab === 'unwatched' 
                ? `Watch Next (${stats.totalSaved})` 
                : tab === 'watched' 
                  ? `Watched (${stats.watchedCount})` 
                  : `All (${movies.length})`;
              const icon = tab === 'unwatched' 
                ? <Film className="w-3.5 h-3.5" /> 
                : tab === 'watched' 
                  ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> 
                  : <Compass className="w-3.5 h-3.5 text-blue-400" />;

              return (
                <button
                  key={tab}
                  onClick={() => onChangeTab(tab)}
                  className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 z-10 flex-1 sm:flex-none ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dashboardActiveTabIndicator"
                      className="absolute inset-0 bg-zinc-850 rounded-xl border border-zinc-700/30 shadow-lg shadow-black/40 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Premium Search bar */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search title, director, vibe, or genres..."
              className="block w-full bg-zinc-900/40 hover:bg-zinc-900/80 focus:bg-zinc-900/60 border border-zinc-900/80 focus:border-zinc-850 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearch('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Refine dropdown selectors */}
        <div className="pt-4 border-t border-zinc-900/60 grid grid-cols-1 xl:grid-cols-12 gap-3 items-center relative z-10">
          {/* Refine Library Header */}
          <div className="xl:col-span-2 flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono text-left">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine Panel:</span>
          </div>

          {/* Selector lists */}
          <div className="xl:col-span-7 flex flex-wrap gap-2 items-center">
            
            {/* 1. Genre */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-2.5 py-1.5 transition-colors">
              <Tag className="w-3.5 h-3.5 text-zinc-500 mr-2" />
              <select
                value={selectedGenre}
                onChange={(e) => onChangeGenre(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
              >
                <option value="All">All Genres</option>
                {uniqueGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* 2. Language */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-2.5 py-1.5 transition-colors">
              <Globe className="w-3.5 h-3.5 text-zinc-500 mr-2" />
              <select
                value={selectedLanguage}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
              >
                <option value="All">All Languages</option>
                {uniqueLanguages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* 3. Streaming Outlet */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-2.5 py-1.5 transition-colors">
              <Compass className="w-3.5 h-3.5 text-zinc-500 mr-2" />
              <select
                value={selectedStream}
                onChange={(e) => onChangeStream(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
              >
                <option value="All">All Outlets</option>
                {uniqueStreams.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 4. Runtime */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-2.5 py-1.5 transition-colors">
              <Hourglass className="w-3.5 h-3.5 text-zinc-500 mr-2" />
              <select
                value={selectedRuntime}
                onChange={(e) => onChangeRuntime(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
              >
                <option value="All">All Runtimes</option>
                <option value="under-90">Short film (&lt; 90m)</option>
                <option value="90-120">Standard (90m - 120m)</option>
                <option value="over-120">Epic (&gt; 120m)</option>
              </select>
            </div>

            {/* Clear filters trigger */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl border border-rose-500/10 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sorting controls right-aligned */}
          <div className="xl:col-span-3 flex items-center xl:justify-end gap-2 border-t xl:border-t-0 border-zinc-900/60 pt-3 xl:pt-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-xs font-bold text-white rounded-xl px-2.5 py-2 outline-none cursor-pointer transition-all hover:bg-zinc-850"
            >
              <option value="recent-added">🕒 Recently Added</option>
              <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              <option value="ai-recommendation">✨ AI Match Rating</option>
              <option value="recent-available">📅 Release Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Core Presentation Area: Curated Collections vs Search Grid */}
      <div className="space-y-16 pt-2">
        <AnimatePresence mode="wait">
          {hasActiveFilters ? (
            /* refined search results state: Renders a stunning grid of dominates movie posters */
            <motion.div
              key="refined-search-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header and counter */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900 text-left">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">// FILTERED REFINEMENTS</p>
                  <h3 className="text-xl font-display font-extrabold text-white">
                    Showing {filteredMovies.length} matching films
                  </h3>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {filteredMovies.length > 0 ? (
                /* Beautifully spaced Grid with huge posters dominating */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 justify-items-center">
                  {filteredMovies.map((movie) => (
                    <MoviePosterCard 
                      key={movie.id} 
                      movie={movie} 
                      onSelectMovie={onSelectMovie}
                      onDelete={onDelete}
                      onToggleWatched={onToggleWatched}
                    />
                  ))}
                </div>
              ) : (
                /* Elegant Empty State */
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl border border-zinc-850 flex items-center justify-center mx-auto">
                    <Film className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No Refined Matches</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      We couldn't find any saved films that match your search query or filter categories. Try broadening your selection.
                    </p>
                  </div>
                  <button
                    onClick={onClearFilters}
                    className="text-xs bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Reset Filter Panel
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* collections view: horizontal scrolling shelves of majestic, huge posters */
            <motion.div
              key="spotify-mubi-collections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-14"
            >
              {collections.map((shelf) => (
                <CollectionShelf 
                  key={shelf.id} 
                  shelf={shelf} 
                  onSelectMovie={onSelectMovie}
                  onDelete={onDelete}
                  onToggleWatched={onToggleWatched}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
