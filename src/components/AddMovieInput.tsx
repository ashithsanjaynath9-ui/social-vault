/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Link2, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  RefreshCw, 
  X, 
  Film, 
  Trash, 
  Instagram, 
  Youtube, 
  Edit3, 
  Save, 
  Music, 
  FileText, 
  CheckCircle2, 
  Tv, 
  Calendar, 
  User, 
  Tag, 
  Search,
  ArrowRight,
  Clock,
  Gauge,
  SlidersHorizontal,
  BookmarkCheck,
  FolderHeart,
  ChevronRight,
  Database,
  Tv2
} from 'lucide-react';
import { REEL_TEMPLATES, ReelTemplate } from '../data';
import { Movie, SocialSource } from '../types';
import { detectPlatform, getTrailerUrl } from '../utils';

interface AddMovieInputProps {
  onMoviesAdded: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  prefilledTemplate?: ReelTemplate | null;
  onClearPrefill?: () => void;
  onCloseDrawer?: () => void;
}

export default function AddMovieInput({ 
  onMoviesAdded, 
  prefilledTemplate = null, 
  onClearPrefill, 
  onCloseDrawer 
}: AddMovieInputProps) {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Platform tab state (can be clicked or auto-detected)
  const [activeTab, setActiveTab] = useState<'instagram' | 'youtube' | 'tiktok' | 'manual'>('manual');

  // Preview stage state
  const [previewMovies, setPreviewMovies] = useState<Omit<Movie, 'id' | 'addedAt' | 'watched'>[] | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Multi-select and search state
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});
  const [previewSearch, setPreviewSearch] = useState('');

  // View mode for results: 'magical-shelves' or 'detailed-list'
  const [viewMode, setViewMode] = useState<'magical-shelves' | 'detailed-list'>('magical-shelves');
  const [isCommitting, setIsCommitting] = useState(false);

  // Interactive step-by-step cinematic scanning stages
  const [scanStage, setScanStage] = useState(0);

  // Inline editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editYear, setEditYear] = useState(2024);
  const [editDirector, setEditDirector] = useState('');
  const [editSynopsis, setEditSynopsis] = useState('');
  const [editVibe, setEditVibe] = useState('');
  const [editRating, setEditRating] = useState('');
  const [editGenres, setEditGenres] = useState('');
  const [editStreaming, setEditStreaming] = useState('');
  const [editRuntime, setEditRuntime] = useState('');
  const [editConfidence, setEditConfidence] = useState<number>(100);

  // Automatically select all extracted movies by default when preview list changes
  useEffect(() => {
    if (previewMovies) {
      const initialSelected: Record<number, boolean> = {};
      previewMovies.forEach((_, index) => {
        initialSelected[index] = true;
      });
      setSelectedIndices(initialSelected);
      setPreviewSearch('');
      setViewMode('magical-shelves'); // Reset to magic shelves on new extract
    } else {
      setSelectedIndices({});
    }
  }, [previewMovies]);

  // Sync tab with user typing
  useEffect(() => {
    if (inputText || inputUrl) {
      const detected = detectPlatform(inputText, inputUrl);
      const tab = (detected === 'instagram' || detected === 'youtube' || detected === 'tiktok') ? detected : 'manual';
      setActiveTab(tab);
    }
  }, [inputText, inputUrl]);

  // Sequential loading stage sequence for the magical scanning experience
  useEffect(() => {
    let timer1: any;
    let timer2: any;
    let timer3: any;
    if (isExtracting) {
      setScanStage(0);
      timer1 = setTimeout(() => {
        setScanStage(1);
      }, 1200);
      timer2 = setTimeout(() => {
        setScanStage(2);
      }, 2400);
      timer3 = setTimeout(() => {
        setScanStage(3);
      }, 3600);
    } else {
      setScanStage(0);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isExtracting]);

  // Prefill hook
  useEffect(() => {
    if (prefilledTemplate) {
      setInputText(prefilledTemplate.text);
      setInputUrl(`https://www.${prefilledTemplate.platform}.com/reel/${prefilledTemplate.id}`);
      setSelectedTemplate(prefilledTemplate.id);
      setActiveTab(prefilledTemplate.platform);
      setError(null);
    }
  }, [prefilledTemplate]);

  const handleApplyTemplate = (template: ReelTemplate) => {
    setInputText(template.text);
    setInputUrl(`https://www.${template.platform}.com/reel/${template.id}`);
    setSelectedTemplate(template.id);
    setActiveTab(template.platform);
    setError(null);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please paste movie description, recommendation text, or select one of the pre-loaded reel transcripts below.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setPreviewMovies(null);
    setEditingIndex(null);

    // Keep active scanning for at least 4.8 seconds to allow the cinematic animation to breathe
    const startTimestamp = Date.now();

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          url: inputUrl || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract movie recommendations.');
      }

      if (!data.movies || data.movies.length === 0) {
        throw new Error("We couldn't detect any specific movie titles or recommendations in that text. Try pasting a transcript that includes movie titles!");
      }

      // Wait a tiny bit more if needed to finish the scan story beautifully
      const elapsedTime = Date.now() - startTimestamp;
      const minAnimationDuration = 4800; // 4.8s
      if (elapsedTime < minAnimationDuration) {
        await new Promise(resolve => setTimeout(resolve, minAnimationDuration - elapsedTime));
      }

      // Add social platform and info if missing or needs override
      const platform = detectPlatform(inputText, inputUrl);
      const decorated = data.movies.map((m: any) => ({
        ...m,
        socialSource: {
          platform,
          url: inputUrl || undefined,
          author: m.socialSource?.author || (selectedTemplate ? REEL_TEMPLATES.find(t => t.id === selectedTemplate)?.creator : undefined) || 'Social Creator',
          textSnippet: m.socialSource?.textSnippet || inputText.substring(0, 100) + '...'
        }
      }));

      // Set state
      setPreviewMovies(decorated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while communicating with Gemini AI.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveSelected = () => {
    if (previewMovies && previewMovies.length > 0) {
      const selected = previewMovies.filter((_, index) => selectedIndices[index]);
      if (selected.length === 0) {
        setError('Please select at least one movie to save, or click "Save All".');
        return;
      }
      setIsCommitting(true);
      setTimeout(() => {
        onMoviesAdded(selected);
        setIsCommitting(false);
        resetExtractor();
      }, 1100);
    }
  };

  const handleSaveAll = () => {
    if (previewMovies && previewMovies.length > 0) {
      setIsCommitting(true);
      setTimeout(() => {
        onMoviesAdded(previewMovies);
        setIsCommitting(false);
        resetExtractor();
      }, 1100);
    }
  };

  const resetExtractor = () => {
    setInputText('');
    setInputUrl('');
    setPreviewMovies(null);
    setEditingIndex(null);
    setSelectedTemplate(null);
    onClearPrefill?.();
    onCloseDrawer?.();
  };

  const handleToggleSelect = (index: number) => {
    setSelectedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleToggleSelectAll = () => {
    if (!previewMovies) return;
    const allSelected = previewMovies.every((_, index) => selectedIndices[index]);
    const nextSelected: Record<number, boolean> = {};
    previewMovies.forEach((_, index) => {
      nextSelected[index] = !allSelected;
    });
    setSelectedIndices(nextSelected);
  };

  const handleRemoveFromPreview = (index: number) => {
    if (previewMovies) {
      const updated = previewMovies.filter((_, i) => i !== index);
      setPreviewMovies(updated.length > 0 ? updated : null);
      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
    }
  };

  // Editing controls
  const handleStartEdit = (index: number) => {
    if (!previewMovies) return;
    const movie = previewMovies[index];
    setEditingIndex(index);
    setEditTitle(movie.title);
    setEditYear(movie.year);
    setEditDirector(movie.director);
    setEditSynopsis(movie.synopsis);
    setEditVibe(movie.vibe);
    setEditRating(movie.rating);
    setEditGenres(movie.genres.join(', '));
    setEditStreaming(movie.streamingServices.join(', '));
    setEditRuntime(movie.runtime || '120 mins');
    setEditConfidence(movie.confidence || 95);
  };

  const handleSaveEdit = (index: number) => {
    if (!previewMovies) return;
    const updated = [...previewMovies];
    updated[index] = {
      ...updated[index],
      title: editTitle,
      year: Number(editYear),
      director: editDirector,
      synopsis: editSynopsis,
      vibe: editVibe,
      rating: editRating,
      genres: editGenres.split(',').map(g => g.trim()).filter(Boolean),
      streamingServices: editStreaming.split(',').map(s => s.trim()).filter(Boolean),
      runtime: editRuntime,
      confidence: Number(editConfidence) || 95,
    };
    setPreviewMovies(updated);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  // Group movies by vibe or genre for the shelf organization
  const shelfCollections = useMemo<Record<string, Omit<Movie, 'id' | 'addedAt' | 'watched'>[]>>(() => {
    if (!previewMovies) return {};
    const groups: Record<string, Omit<Movie, 'id' | 'addedAt' | 'watched'>[]> = {};
    
    previewMovies.forEach(movie => {
      // Prioritize movie vibe, fallback to first genre, fallback to 'Uncategorized'
      const key = movie.vibe || (movie.genres && movie.genres[0]) || 'Cinema Favorites';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(movie);
    });
    
    return groups;
  }, [previewMovies]);

  return (
    <div className="w-full max-w-4xl mx-auto" id="movie-extractor-component">
      <AnimatePresence mode="wait">
        
        {/* Stage 1: Scanning & Lookup Overlay (No Traditional Spinners) */}
        {isExtracting ? (
          <motion.div
            key="extraction-loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-12 relative overflow-hidden"
          >
            {/* Ambient theatrical backlighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-zinc-800/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-zinc-900/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Glowing moving laser scanline */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-500 to-transparent top-0 animate-scanline pointer-events-none opacity-45" />

            <div className="flex flex-col items-center justify-center space-y-8 pt-4">
              {/* Pulsing film aperture / lens visual */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-zinc-800 animate-ping opacity-30" />
                <div className="absolute inset-2 rounded-full border-2 border-zinc-900 flex items-center justify-center bg-zinc-950 shadow-inner">
                  <Film className="w-8 h-8 text-zinc-400 animate-pulse" />
                </div>
                
                {/* Scanning orbiters */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t-2 border-zinc-500"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-b-2 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-white tracking-wide uppercase font-mono">
                  Processing Recommendations
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans leading-relaxed">
                  Parsing details, looking up metadata, and organizing clean inbox entries...
                </p>
              </div>
            </div>

            {/* Real-time Narrative Milestones */}
            <div className="max-w-md mx-auto bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4 text-left font-mono">
              
              {/* Step 1: Scanning movie titles... */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {scanStage > 0 ? (
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-400" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-850 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping" />
                    </div>
                  )}
                  <span className={`text-xs ${scanStage >= 0 ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>
                    Scanning movie titles...
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${scanStage > 0 ? 'text-zinc-400' : 'text-zinc-500 animate-pulse'}`}>
                  {scanStage > 0 ? 'SUCCESS' : 'SCANNING'}
                </span>
              </div>

              {/* Step 2: Finding posters... */}
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                <div className="flex items-center gap-3">
                  {scanStage > 1 ? (
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-400" />
                    </div>
                  ) : scanStage === 1 ? (
                    <div className="w-5 h-5 rounded-full border border-zinc-850 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-850" />
                  )}
                  <span className={`text-xs ${scanStage >= 1 ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>
                    Finding posters...
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${scanStage > 1 ? 'text-zinc-400' : scanStage === 1 ? 'text-zinc-500 animate-pulse' : 'text-zinc-700'}`}>
                  {scanStage > 1 ? 'FOUND' : scanStage === 1 ? 'CRAWLING' : 'PENDING'}
                </span>
              </div>

              {/* Step 3: Checking streaming platforms... */}
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                <div className="flex items-center gap-3">
                  {scanStage > 2 ? (
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-400" />
                    </div>
                  ) : scanStage === 2 ? (
                    <div className="w-5 h-5 rounded-full border border-zinc-850 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-850" />
                  )}
                  <span className={`text-xs ${scanStage >= 2 ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>
                    Checking streaming platforms...
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${scanStage > 2 ? 'text-zinc-400' : scanStage === 2 ? 'text-zinc-500 animate-pulse' : 'text-zinc-700'}`}>
                  {scanStage > 2 ? 'VERIFIED' : scanStage === 2 ? 'QUERIED' : 'PENDING'}
                </span>
              </div>

              {/* Step 4: Organizing your inbox... */}
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                <div className="flex items-center gap-3">
                  {scanStage === 3 ? (
                    <div className="w-5 h-5 rounded-full border border-zinc-850 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-850" />
                  )}
                  <span className={`text-xs ${scanStage >= 3 ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>
                    Organizing your inbox...
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${scanStage === 3 ? 'text-zinc-400 animate-pulse' : 'text-zinc-700'}`}>
                  {scanStage === 3 ? 'SAVING' : 'PENDING'}
                </span>
              </div>

            </div>

            {/* Seamless gradient progress loader bar */}
            <div className="w-full max-w-md mx-auto h-1.5 bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-500"
                initial={{ width: '0%' }}
                animate={{ 
                  width: scanStage === 0 ? '25%' : scanStage === 1 ? '50%' : scanStage === 2 ? '75%' : '98%' 
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : !previewMovies ? (
          
          /* Stage 2: Input & Share Options Form (Initial state) */
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
             {/* Ambient visual backlights */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-800/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <Film className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-extrabold text-white tracking-tight leading-none">
                    Capture Recommendation
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 font-mono font-medium">
                    Convert social media recommendations into clean inbox entries
                  </p>
                </div>
              </div>

              {onCloseDrawer && (
                <button
                  type="button"
                  onClick={onCloseDrawer}
                  className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Capture"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Platform Segmented Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900/40 border border-zinc-900 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('instagram')}
                className={`py-2.5 px-1 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'instagram' 
                    ? 'bg-zinc-900 text-pink-400 border border-zinc-800 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('youtube')}
                className={`py-2.5 px-1 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'youtube' 
                    ? 'bg-zinc-900 text-red-400 border border-zinc-800 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tiktok')}
                className={`py-2.5 px-1 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'tiktok' 
                    ? 'bg-zinc-900 text-cyan-400 border border-zinc-800 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`py-2.5 px-1 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'manual' 
                    ? 'bg-zinc-900 text-blue-400 border border-zinc-800 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manual Paste</span>
              </button>
            </div>

            {/* Informational Platform Banner */}
            <div className="text-zinc-500 text-xs text-left mb-5">
              {activeTab === 'instagram' && <span>Paste Instagram Reel caption transcript or share URL</span>}
              {activeTab === 'youtube' && <span>Works with YouTube video descriptions or Shorts transcripts</span>}
              {activeTab === 'tiktok' && <span>Paste TikTok comments, hashtags, captions, or short links</span>}
              {activeTab === 'manual' && <span>Paste recommendation list or chat transcripts directly</span>}
            </div>

            <form onSubmit={handleExtract} className="space-y-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (selectedTemplate) setSelectedTemplate(null);
                  }}
                  placeholder={
                    activeTab === 'instagram' 
                      ? "Paste Instagram text description (e.g. 'Must watch sci-fi movie that will bend your mind on Netflix called Coherence!')" 
                      : activeTab === 'youtube'
                      ? "Paste YouTube Shorts description or transcript with movie recommendations..."
                      : activeTab === 'tiktok'
                      ? "Paste TikTok content caption containing movie recommendations..."
                      : "Paste recommendation text, a list of movies, notes, or chat transcript..."
                  }
                  rows={4}
                  className="w-full bg-zinc-900/20 hover:bg-zinc-900/40 focus:bg-zinc-900/80 border border-zinc-900 focus:border-zinc-700 rounded-2xl px-5 py-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Optional Link bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link2 className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder={`${
                      activeTab === 'instagram' 
                        ? 'Instagram Reel Link' 
                        : activeTab === 'youtube'
                        ? 'YouTube Shorts Link'
                        : activeTab === 'tiktok'
                        ? 'TikTok Video URL'
                        : 'Social Curation Reference Link'
                    } (Optional)`}
                    className="block w-full bg-zinc-900/20 hover:bg-zinc-900/40 focus:bg-zinc-900/80 border border-zinc-900 focus:border-zinc-700 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-widest uppercase px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/15 cursor-pointer border border-blue-400/10"
                >
                  <Film className="w-4 h-4 text-white" />
                  <span>Capture Movies</span>
                </motion.button>
              </div>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 leading-relaxed font-sans">{error}</p>
              </motion.div>
            )}

            {/* Quick Demo Section (Bento Design Templates) */}
            <div className="mt-8 pt-6 border-t border-zinc-900">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center justify-between w-full text-left py-1 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-500">
                  Sample Transcripts
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTemplates ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {(showTemplates || !inputText) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {REEL_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplate === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            onClick={() => handleApplyTemplate(tmpl)}
                            className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/10 border-blue-500/40 shadow-md shadow-blue-500/5'
                                : 'bg-zinc-900/20 hover:bg-zinc-900/60 border-zinc-900/80 hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{tmpl.icon}</span>
                              <span className="text-[9px] font-mono font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                                {tmpl.platform} • {tmpl.creator}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1 mb-1 font-sans">
                              {tmpl.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                              {tmpl.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          
          /* Stage 3: Premium Extraction Results and Magical Shelf/Grid Presentation */
          <motion.div
            key="preview-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-8"
          >
            {/* Theatrical visual elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="absolute top-0 right-0 p-4 z-10">
              <button
                onClick={() => setPreviewMovies(null)}
                className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Discard Curation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Title and Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                    {previewMovies.length} Movies Captured
                    <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                      Ready to Save
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">
                    Parsed and organized with streaming services, metadata, and curation descriptions.
                  </p>
                </div>
              </div>

              {/* View Switcher: Shelves vs Detailed */}
              <div className="flex items-center gap-2 bg-zinc-900/60 p-1 border border-zinc-900 rounded-xl w-fit">
                <button
                  onClick={() => setViewMode('magical-shelves')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    viewMode === 'magical-shelves' 
                      ? 'bg-zinc-950 text-blue-400 border border-zinc-800' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  🎭 Shelves View
                </button>
                <button
                  onClick={() => setViewMode('detailed-list')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    viewMode === 'detailed-list' 
                      ? 'bg-zinc-950 text-blue-400 border border-zinc-800' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  📝 Detailed List
                </button>
              </div>
            </div>

            {/* INTERACTIVE EXPERIENCE A: THE MAGICAL SHELVES COLLECTION (SMILE PRODUCER) */}
            <AnimatePresence mode="wait">
              {viewMode === 'magical-shelves' ? (
                <motion.div
                  key="magical-shelves-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-12 py-4"
                >
                  {(Object.entries(shelfCollections) as [string, Omit<Movie, 'id' | 'addedAt' | 'watched'>[]][]).map(([category, list], shelfIdx) => (
                    <div key={category} className="space-y-4">
                      {/* Category Shelf Header */}
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                          {category}
                        </h3>
                        <span className="text-[10px] text-zinc-600 font-mono">({list.length} item{list.length > 1 ? 's' : ''})</span>
                      </div>

                      {/* The physical cinematic shelf container */}
                      <div className="relative pt-6 pb-2 px-6 bg-gradient-to-b from-zinc-950/20 to-zinc-950/80 border border-zinc-900 rounded-3xl overflow-hidden shadow-inner">
                        
                        {/* Posters grid standing on the shelf */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                          {list.map((movie, movieIdx) => (
                            <motion.div
                              key={movie.title}
                              initial={{ opacity: 0, y: -60, rotate: -3 }}
                              animate={{ opacity: 1, y: 0, rotate: 0 }}
                              transition={{ 
                                delay: (shelfIdx * 0.2) + (movieIdx * 0.15),
                                type: "spring",
                                stiffness: 90,
                                damping: 14
                              }}
                              className="group relative flex flex-col items-center justify-end"
                            >
                              {/* Glowing background reflect under the card */}
                              <div className="absolute -bottom-4 w-12 h-6 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                              {/* Poster Wrapper */}
                              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-xl group-hover:scale-[1.03] transition-all duration-300">
                                <img 
                                  src={movie.posterUrl} 
                                  alt={movie.title} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                                
                                {/* Stream logo tag */}
                                {movie.streamingServices && movie.streamingServices.length > 0 && (
                                  <span className="absolute bottom-2 left-2 text-[8px] font-mono font-bold bg-zinc-950/90 border border-zinc-850 px-2 py-0.5 rounded text-blue-400 uppercase">
                                    {movie.streamingServices[0]}
                                  </span>
                                )}

                                {/* Rating stamp */}
                                <span className="absolute top-2 right-2 text-[8px] font-mono font-bold bg-black/80 px-1.5 py-0.2 rounded text-amber-400">
                                  ★ {movie.rating}
                                </span>
                              </div>

                              {/* Simple floating label */}
                              <div className="w-full text-center mt-2.5 space-y-0.5 px-1 pb-1">
                                <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-white truncate">
                                  {movie.title}
                                </h4>
                                <p className="text-[9px] text-zinc-500 font-mono font-semibold uppercase leading-none">
                                  {movie.year}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Physical Wood/Metallic Shelf Base Line */}
                        <div className="mt-2 h-2.5 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-zinc-700/60 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                
                /* INTERACTIVE EXPERIENCE B: DETAILED LIST & MANUAL FIELD ADJUSTMENT BOARD */
                <motion.div
                  key="detailed-list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Search and control subheader */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={previewSearch}
                        onChange={(e) => setPreviewSearch(e.target.value)}
                        placeholder="Search title, genre, synopsis, or vibe..."
                        className="w-full bg-zinc-900/40 border border-zinc-900 focus:border-zinc-850 text-xs text-white rounded-xl pl-9 pr-8 py-2.5 outline-none transition-all"
                      />
                      {previewSearch && (
                        <button
                          onClick={() => setPreviewSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-850 rounded text-zinc-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl px-4 py-2">
                      <div className="text-xs font-mono text-zinc-400">
                        Selected:{' '}
                        <span className="text-emerald-400 font-bold">
                          {previewMovies.filter((_, idx) => selectedIndices[idx]).length}
                        </span>{' '}
                        of{' '}
                        <span className="text-white font-bold">{previewMovies.length}</span>
                      </div>

                      <button
                        onClick={handleToggleSelectAll}
                        className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800"
                      >
                        {previewMovies.every((_, idx) => selectedIndices[idx]) ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {/* List of cards */}
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {previewMovies.map((movie, index) => {
                      const isEditing = editingIndex === index;
                      const isSelected = !!selectedIndices[index];
                      
                      if (previewSearch.trim()) {
                        const query = previewSearch.toLowerCase();
                        const matchesTitle = movie.title.toLowerCase().includes(query);
                        const matchesSynopsis = movie.synopsis.toLowerCase().includes(query);
                        const matchesVibe = movie.vibe.toLowerCase().includes(query);
                        if (!matchesTitle && !matchesSynopsis && !matchesVibe) return null;
                      }

                      const confidenceVal = movie.confidence || 95;
                      const confidenceColor = confidenceVal >= 92 
                        ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                        : 'text-amber-400 bg-amber-500/5 border-amber-500/10';

                      return (
                        <div
                          key={index}
                          className={`border rounded-2xl p-4 md:p-5 transition-all relative ${
                            isEditing 
                              ? 'border-blue-500 bg-zinc-900' 
                              : isSelected
                              ? 'border-zinc-800 bg-zinc-900/30'
                              : 'border-zinc-900 bg-zinc-950/40 opacity-40 hover:opacity-100'
                          }`}
                        >
                          {isEditing ? (
                            /* Editing Block */
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Movie Title</label>
                                  <input 
                                    type="text" 
                                    value={editTitle} 
                                    onChange={(e) => setEditTitle(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Year</label>
                                  <input 
                                    type="number" 
                                    value={editYear} 
                                    onChange={(e) => setEditYear(Number(e.target.value))} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Director</label>
                                  <input 
                                    type="text" 
                                    value={editDirector} 
                                    onChange={(e) => setEditDirector(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase">Synopsis</label>
                                <textarea 
                                  value={editSynopsis} 
                                  onChange={(e) => setEditSynopsis(e.target.value)} 
                                  rows={2}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white resize-none" 
                                />
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Vibe</label>
                                  <input 
                                    type="text" 
                                    value={editVibe} 
                                    onChange={(e) => setEditVibe(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Rating</label>
                                  <input 
                                    type="text" 
                                    value={editRating} 
                                    onChange={(e) => setEditRating(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Genres</label>
                                  <input 
                                    type="text" 
                                    value={editGenres} 
                                    onChange={(e) => setEditGenres(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Streaming</label>
                                  <input 
                                    type="text" 
                                    value={editStreaming} 
                                    onChange={(e) => setEditStreaming(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" 
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button 
                                  onClick={handleCancelEdit} 
                                  className="px-3 py-1.5 rounded bg-zinc-850 hover:bg-zinc-800 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleSaveEdit(index)} 
                                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold uppercase tracking-wider text-white"
                                >
                                  Save Change
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Standard Card Display */
                            <div className="flex gap-4">
                              <div className="flex items-start pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelect(index)}
                                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                                      : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-zinc-850 bg-zinc-900 shadow-md">
                                <img src={movie.posterUrl} alt={movie.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </div>

                              <div className="flex-1 space-y-2 text-left">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="text-sm font-bold text-white font-sans">{movie.title}</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                      Directed by {movie.director} • {movie.year}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleStartEdit(index)}
                                      className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                      title="Edit Movie details"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveFromPreview(index)}
                                      className="p-1.5 hover:bg-zinc-900 rounded-lg text-rose-500 hover:text-rose-400 transition-colors"
                                      title="Remove from selection"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {movie.synopsis}
                                </p>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/15 px-2 py-0.5 rounded uppercase">
                                    {movie.vibe}
                                  </span>
                                  {movie.genres.slice(0, 2).map(g => (
                                    <span key={g} className="text-[9px] font-sans bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400 font-medium">
                                      {g}
                                    </span>
                                  ))}
                                  <span className="text-[9px] font-mono text-amber-400 bg-amber-500/5 px-2 py-0.5 border border-amber-500/15 rounded font-bold">
                                    ⭐ {movie.rating}
                                  </span>
                                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${confidenceColor}`}>
                                    {confidenceVal}% Match
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-900">
              <div className="text-left w-full md:w-auto space-y-0.5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                  Extracted Social Source
                </p>
                <p className="text-xs text-zinc-300 font-medium truncate max-w-[280px]">
                  {previewMovies[0]?.socialSource?.author || '@creator'} on {previewMovies[0]?.socialSource?.platform.toUpperCase() || 'Platform'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewMovies(null)}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Discard Curation
                </button>

                <button
                  type="button"
                  onClick={handleSaveSelected}
                  disabled={previewMovies.filter((_, idx) => selectedIndices[idx]).length === 0}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-mono font-bold tracking-widest uppercase px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 cursor-pointer border border-blue-400/10 hover:scale-[1.01]"
                >
                  <BookmarkCheck className="w-4 h-4 text-white" />
                  <span>Save to Inbox ({previewMovies.filter((_, idx) => selectedIndices[idx]).length})</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 1.2s Flight Vaulting Animation Overlay (Delight Moment 1) */}
      <AnimatePresence>
        {isCommitting && previewMovies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6"
          >
            <div className="text-center space-y-6 relative">
              {/* Dynamic Saving Indicator */}
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-zinc-700 animate-spin-slow" />
                <BookmarkCheck className="w-6 h-6 text-zinc-400 animate-pulse" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-display font-bold tracking-widest text-white uppercase leading-none">Saving Movies...</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Adding social reels directly to your library</p>
              </div>

              {/* Poster thumbnails sailing upwards */}
              <div className="flex gap-4 items-center justify-center pt-4 overflow-hidden h-36">
                {previewMovies.slice(0, 4).map((movie, idx) => (
                  <motion.div
                    key={movie.title + idx}
                    initial={{ y: 120, scale: 0.7, opacity: 0, rotate: idx % 2 === 0 ? -10 : 10 }}
                    animate={{ 
                      y: [120, 0, -200], 
                      scale: [0.7, 1.05, 0.25], 
                      opacity: [0, 1, 0],
                      rotate: idx % 2 === 0 ? [ -10, 0, 15 ] : [ 10, 0, -15 ]
                    }}
                    transition={{
                      duration: 1.1,
                      times: [0, 0.35, 1],
                      ease: "easeInOut",
                      delay: idx * 0.1
                    }}
                    className="w-14 h-20 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl relative shrink-0 bg-zinc-900"
                  >
                    <img src={movie.posterUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
