/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
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
  SlidersHorizontal
} from 'lucide-react';
import { Movie, AppStats } from '../types';

interface WatchlistDashboardProps {
  movies: Movie[];
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
}

export default function WatchlistDashboard({
  movies,
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
  onClearFilters
}: WatchlistDashboardProps) {
  // Extract unique elements dynamically from all movies for fully accurate filters
  const uniqueVibes = Array.from(new Set(movies.map(m => m.vibe))).filter(Boolean).sort();
  const uniqueGenres = Array.from(new Set(movies.flatMap(m => m.genres))).filter(Boolean).sort();
  const uniqueLanguages = Array.from(new Set(movies.map(m => m.language || 'English'))).filter(Boolean).sort();
  const uniqueStreams = Array.from(new Set(movies.flatMap(m => m.streamingServices))).filter(Boolean).sort();

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedVibe !== 'All' || 
    selectedStream !== 'All' || 
    selectedGenre !== 'All' || 
    selectedLanguage !== 'All' || 
    selectedRuntime !== 'All' ||
    sortBy !== 'recent-added';

  // Stats Card data
  const statsList = [
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
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="watchlist-dashboard">
      {/* 1. Statistics Cards Bento Row with pristine subtle glow & light border reflections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {statsList.map((stat, idx) => (
          <div 
            key={idx}
            className={`bg-zinc-950/40 backdrop-blur-sm border border-zinc-900/80 rounded-2xl p-4.5 flex items-center gap-4 relative overflow-hidden group transition-all duration-300 hover:border-zinc-800 ${stat.borderColor} ${stat.isFullOnMobile ? 'col-span-2 md:col-span-1' : ''}`}
          >
            {/* Soft backdrop radial light gradient */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent to-transparent pointer-events-none transition-all duration-500 ${stat.bgGlow}`} />
            
            <div className={`p-2.5 rounded-xl border shrink-0 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none">
                {stat.label}
              </p>
              <p className="text-lg font-display font-bold text-white mt-1.5 leading-none truncate flex items-baseline gap-1">
                <span>{stat.value}</span>
                {stat.unit && <span className="text-[10px] text-zinc-500 font-sans font-medium">{stat.unit}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Controls Center: Segmented Tabs, Advanced Filters & Apple-Style Sorting */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-2xl">
        {/* Abstract light aura decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />

        {/* Top Row: Segmented Tab bar & Dynamic search container */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-5 justify-between relative z-10">
          {/* Segmented control tab switcher - Apple premium styling */}
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-900/60 self-start w-full sm:w-auto">
            <button
              onClick={() => onChangeTab('unwatched')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentTab === 'unwatched'
                  ? 'bg-zinc-800/90 text-white shadow-lg shadow-black/40 border border-zinc-700/30'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Watch Next ({stats.totalSaved})</span>
            </button>
            <button
              onClick={() => onChangeTab('watched')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentTab === 'watched'
                  ? 'bg-zinc-800/90 text-white shadow-lg shadow-black/40 border border-zinc-700/30'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Watched ({stats.watchedCount})</span>
            </button>
            <button
              onClick={() => onChangeTab('all')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentTab === 'all'
                  ? 'bg-zinc-800/90 text-white shadow-lg shadow-black/40 border border-zinc-700/30'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>All ({movies.length})</span>
            </button>
          </div>

          {/* Premium Spotify-style Search bar */}
          <div className="relative w-full xl:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search title, director, vibe, or genres..."
              className="block w-full bg-zinc-900/40 hover:bg-zinc-900/80 focus:bg-zinc-900/60 border border-zinc-900/80 focus:border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all focus:ring-1 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearch('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Sliders & Filter Options */}
        <div className="pt-5 border-t border-zinc-900/60 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center relative z-10">
          
          {/* Filter Labels Header */}
          <div className="lg:col-span-2 flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>Refine Library:</span>
          </div>

          {/* Quick Dropdown Selectors */}
          <div className="lg:col-span-7 flex flex-wrap gap-2.5 items-center">
            
            {/* 1. Genre filter dropdown */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-3 py-1.5 transition-colors">
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

            {/* 2. Language filter dropdown */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-3 py-1.5 transition-colors">
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

            {/* 3. Streaming Outlet filter dropdown */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-3 py-1.5 transition-colors">
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

            {/* 4. Runtime filter dropdown */}
            <div className="flex items-center bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-900 rounded-xl px-3 py-1.5 transition-colors">
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
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl border border-rose-500/10 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Sorting controls right-aligned */}
          <div className="lg:col-span-3 flex items-center lg:justify-end gap-2.5 border-t lg:border-t-0 border-zinc-900/60 pt-4 lg:pt-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-850 text-xs font-bold text-white rounded-xl px-3 py-2 outline-none cursor-pointer transition-all hover:bg-zinc-850"
            >
              <option value="recent-added">🕒 Recently Added</option>
              <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              <option value="ai-recommendation">✨ AI Match Rating</option>
              <option value="recent-available">📅 Release Date</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}
