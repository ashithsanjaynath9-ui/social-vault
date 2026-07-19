/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Link2, 
  ArrowRight, 
  Check, 
  Trash2
} from 'lucide-react';
import { Movie } from '../types';
import { REEL_TEMPLATES, ReelTemplate } from '../data';

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
  const [pastedText, setPastedText] = useState('');

  // Get the 5 most recently saved movies
  const recentlySaved = movies.slice(0, 5);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    // Detect if it is a URL or general text
    const isUrl = pastedText.trim().startsWith('http://') || pastedText.trim().startsWith('https://');

    // Create a custom template to pass to the extractor modal
    const customTemplate: ReelTemplate = {
      id: 'custom-paste',
      title: 'Pasted Link',
      creator: '@you',
      platform: isUrl ? 'instagram' : 'instagram', // default platform to trigger extraction
      icon: '🔗',
      text: pastedText,
      description: 'Pasted Link/Text'
    };

    onSelectCollection(customTemplate);
    setPastedText('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-12 px-4 font-sans text-zinc-100" id="apple-notes-lobby">
      
      {/* 1. Calm Hero Section */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          The inbox for your movies.
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
          Paste any social link or recommendation text to save and structure it instantly.
        </p>
      </div>

      {/* 2. Direct Paste Input & Import Block */}
      <form onSubmit={handleImport} className="space-y-4">
        <div className="bg-zinc-900 rounded-2xl p-2 transition-all">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste Instagram Reel link, TikTok, YouTube link, or recommendation transcript..."
            rows={3}
            className="w-full bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none border-0"
          />
          <div className="flex items-center justify-end pt-2 px-2">
            <button
              type="submit"
              disabled={!pastedText.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                pastedText.trim()
                  ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>Import</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Share from Instagram / Quick Presets */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Share from social feeds
          </p>
          <div className="flex flex-wrap gap-2">
            {REEL_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onSelectCollection(tmpl)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{tmpl.title.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* 4. Recently Saved - Apple Notes style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">
            Recently Saved
          </h3>
          {movies.length > 0 && (
            <button
              onClick={onViewAllWatchlist}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            >
              View Watchlist ({movies.length})
            </button>
          )}
        </div>

        {recentlySaved.length > 0 ? (
          <div className="divide-y divide-zinc-900 bg-zinc-950/40 rounded-2xl overflow-hidden">
            {recentlySaved.map((movie) => (
              <div
                key={movie.id}
                className="group flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                onClick={() => onSelectMovie?.(movie.id)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-14 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-zinc-300 transition-colors">
                        {movie.title}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        ({movie.year})
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      Directed by {movie.director} • <span className="font-mono text-[10px]">{movie.vibe}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-900 text-zinc-600 font-mono text-xs">
            No saved movies yet. Paste a link above to begin.
          </div>
        )}
      </div>

    </div>
  );
}
