/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Square,
  CheckSquare,
  SlidersHorizontal
} from 'lucide-react';
import { REEL_TEMPLATES, ReelTemplate } from '../data';
import { Movie, SocialSource } from '../types';
import { detectPlatform } from '../utils';

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
  const [loadingStage, setLoadingStage] = useState<0 | 1 | 2>(0);
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

  // Sync loading stage sequence
  useEffect(() => {
    let timer1: any;
    let timer2: any;
    if (isExtracting) {
      setLoadingStage(0);
      timer1 = setTimeout(() => {
        setLoadingStage(1);
      }, 1500);
      timer2 = setTimeout(() => {
        setLoadingStage(2);
      }, 3200);
    } else {
      setLoadingStage(0);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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

  const handleSavePreview = () => {
    handleSaveAll();
  };

  const handleSaveSelected = () => {
    if (previewMovies && previewMovies.length > 0) {
      const selected = previewMovies.filter((_, index) => selectedIndices[index]);
      if (selected.length === 0) {
        setError('Please select at least one movie to save, or click "Save All".');
        return;
      }
      onMoviesAdded(selected);
      // Reset input state
      setInputText('');
      setInputUrl('');
      setPreviewMovies(null);
      setEditingIndex(null);
      setSelectedTemplate(null);
      onClearPrefill?.();
      onCloseDrawer?.();
    }
  };

  const handleSaveAll = () => {
    if (previewMovies && previewMovies.length > 0) {
      onMoviesAdded(previewMovies);
      // Reset input state
      setInputText('');
      setInputUrl('');
      setPreviewMovies(null);
      setEditingIndex(null);
      setSelectedTemplate(null);
      onClearPrefill?.();
      onCloseDrawer?.();
    }
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

  return (
    <div className="w-full max-w-3xl mx-auto" id="movie-extractor-component">
      <AnimatePresence mode="wait">
        
        {/* Stage 1: Active Extracting Loading Overlay */}
        {isExtracting ? (
          <motion.div
            key="extraction-loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center space-y-8 relative overflow-hidden"
          >
            {/* Immersive cinematic glowing lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center justify-center space-y-6 pt-6">
              {/* Spinning orbital radar */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-500"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-b border-r border-purple-500/50"
                />
                <Film className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-display font-medium text-white tracking-wide">
                  Gemini Deep Extraction
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Parsing transcription, validating metadata against high-quality streaming platforms.
                </p>
              </div>
            </div>

            {/* Steps feedback with custom tick marks */}
            <div className="max-w-md mx-auto bg-zinc-900/50 border border-zinc-900 rounded-xl p-5 space-y-4 text-left font-mono">
              
              {/* Step 1: Extracting movie titles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {loadingStage > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
                  )}
                  <span className={`text-xs ${loadingStage >= 0 ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>
                    Extracting movie titles...
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {loadingStage > 0 ? 'COMPLETED' : 'PROCESSING'}
                </span>
              </div>

              {/* Step 2: Finding streaming platforms */}
              <div className="flex items-center justify-between border-t border-zinc-950/40 pt-3">
                <div className="flex items-center gap-3">
                  {loadingStage > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : loadingStage === 1 ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                  )}
                  <span className={`text-xs ${loadingStage >= 1 ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}>
                    Finding streaming platforms...
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {loadingStage > 1 ? 'COMPLETED' : loadingStage === 1 ? 'PROCESSING' : 'PENDING'}
                </span>
              </div>

              {/* Step 3: Organizing your collection */}
              <div className="flex items-center justify-between border-t border-zinc-950/40 pt-3">
                <div className="flex items-center gap-3">
                  {loadingStage === 2 ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                  )}
                  <span className={`text-xs ${loadingStage >= 2 ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}>
                    Organizing your collection...
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {loadingStage === 2 ? 'PACKING' : 'PENDING'}
                </span>
              </div>
            </div>

            {/* Glowing cinematic progress bar */}
            <div className="w-full max-w-md mx-auto h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ 
                  width: loadingStage === 0 ? '33%' : loadingStage === 1 ? '66%' : '95%' 
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : !previewMovies ? (
          
          /* Stage 2: Main Input & Share Options form */
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-medium text-white tracking-tight">
                    Instant Movie Extractor
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Paste recommendation texts or links to instantly extract curation intelligence
                  </p>
                </div>
              </div>

              {onCloseDrawer && (
                <button
                  type="button"
                  onClick={onCloseDrawer}
                  className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Extractor"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Apple-quality premium segmented tab bar for social platforms */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900/60 border border-zinc-850 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('instagram')}
                className={`py-2 px-1 rounded-lg text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'instagram' 
                    ? 'bg-zinc-800 text-pink-400 border border-zinc-700 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('youtube')}
                className={`py-2 px-1 rounded-lg text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'youtube' 
                    ? 'bg-zinc-800 text-red-400 border border-zinc-700 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tiktok')}
                className={`py-2 px-1 rounded-lg text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'tiktok' 
                    ? 'bg-zinc-800 text-cyan-400 border border-zinc-700 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`py-2 px-1 rounded-lg text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'manual' 
                    ? 'bg-zinc-800 text-blue-400 border border-zinc-700 shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manual Paste</span>
              </button>
            </div>

            {/* Informative Platform Banner */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 flex items-center gap-2">
                {activeTab === 'instagram' && <>🍿 Paste Instagram Reels transcripts, captions or share links</>}
                {activeTab === 'youtube' && <>📺 Works with YouTube videos, Shorts transcripts, and recommendation posts</>}
                {activeTab === 'tiktok' && <>🎵 Paste TikTok comments, tags, captions, or short links</>}
                {activeTab === 'manual' && <>📝 Paste raw text, WhatsApp recommendations, or simple movie logs</>}
              </span>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                {activeTab === 'manual' ? 'PASTE STATION' : `${activeTab} integrated`}
              </span>
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
                      ? "Paste Instagram text description (e.g. 'Must watch movie that will blow your mind on Netflix called Coherence!')" 
                      : activeTab === 'youtube'
                      ? "Paste YouTube Shorts description or transcript with movie recommendations..."
                      : activeTab === 'tiktok'
                      ? "Paste TikTok content caption containing movie recommendations..."
                      : "Paste recommendation text, a list, notes, or chat transcript..."
                  }
                  rows={4}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-900/80 focus:bg-zinc-900 border border-zinc-800 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-none font-sans leading-relaxed focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Optional Link bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder={`${
                      activeTab === 'instagram' 
                        ? 'Instagram Reel / Post URL' 
                        : activeTab === 'youtube'
                        ? 'YouTube Shorts / Video URL'
                        : activeTab === 'tiktok'
                        ? 'TikTok URL'
                        : 'Social Curation Reference URL'
                    } (Optional)`}
                    className="block w-full bg-zinc-900/50 hover:bg-zinc-900/80 focus:bg-zinc-900 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Extract Movies</span>
                </motion.button>
              </div>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 leading-normal">{error}</p>
              </motion.div>
            )}

            {/* Quick Demo Section (Bento Design) */}
            <div className="mt-6 pt-5 border-t border-zinc-900">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center justify-between w-full text-left py-1 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                  ⚡ Try Pre-loaded Reel Transcripts (Fast demo)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTemplates ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {(showTemplates || !inputText) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {REEL_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplate === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            onClick={() => handleApplyTemplate(tmpl)}
                            className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/10 border-blue-500/50 shadow-md shadow-blue-500/5'
                                : 'bg-zinc-900/30 hover:bg-zinc-900/70 border-zinc-900 hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-lg">{tmpl.icon}</span>
                              <span className="text-[10px] font-mono font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                                {tmpl.platform} • {tmpl.creator}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1 mb-1">
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
          
          /* Stage 3: Premium Extraction Results and Approval Screen */
          <motion.div
            key="preview-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Immersive backing atmosphere glow */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute top-0 right-0 p-4 z-10">
              <button
                onClick={() => setPreviewMovies(null)}
                className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Discard extraction"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title Header with counters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-medium text-white tracking-tight flex items-center gap-2">
                    Extracted Recommendations
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-medium">
                      {previewMovies.length} Found
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Review, search, multi-select, and edit movie details before saving to your watchlist.
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-header controls (Search & Multi-select helper) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 items-center">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Search title, genre, synopsis, or vibe..."
                  className="w-full bg-zinc-900/60 hover:bg-zinc-900/90 focus:bg-zinc-900 border border-zinc-850 focus:border-zinc-700 text-xs text-white rounded-xl pl-9 pr-8 py-2.5 outline-none transition-all"
                />
                {previewSearch && (
                  <button
                    onClick={() => setPreviewSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Selection Summary and Toggle All */}
              <div className="flex items-center justify-between md:justify-end gap-4 bg-zinc-900/30 border border-zinc-900 rounded-xl px-4 py-2">
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
                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors bg-zinc-900 hover:bg-zinc-850 px-3 py-1.5 rounded-lg border border-zinc-800 cursor-pointer"
                >
                  {previewMovies.every((_, idx) => selectedIndices[idx]) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* List of previewed movies with custom robust cards */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 mb-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {previewMovies.map((movie, index) => {
                  const isEditing = editingIndex === index;
                  const isSelected = !!selectedIndices[index];
                  
                  // Filter based on search query
                  if (previewSearch.trim()) {
                    const query = previewSearch.toLowerCase();
                    const matchesTitle = movie.title.toLowerCase().includes(query);
                    const matchesSynopsis = movie.synopsis.toLowerCase().includes(query);
                    const matchesVibe = movie.vibe.toLowerCase().includes(query);
                    const matchesDirector = movie.director.toLowerCase().includes(query);
                    const matchesGenre = movie.genres.some(g => g.toLowerCase().includes(query));
                    if (!matchesTitle && !matchesSynopsis && !matchesVibe && !matchesDirector && !matchesGenre) {
                      return null;
                    }
                  }

                  const confidenceVal = movie.confidence || 95;
                  const confidenceColor = confidenceVal >= 92 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : confidenceVal >= 80 
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  return (
                    <motion.div
                      layout
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.98 },
                        show: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: { type: 'spring', stiffness: 100, damping: 15 } 
                        }
                      }}
                      className={`border rounded-2xl p-4 md:p-5 transition-all relative overflow-hidden ${
                        isEditing 
                          ? 'border-blue-500/50 bg-zinc-900/90 shadow-xl ring-1 ring-blue-500/20' 
                          : isSelected
                          ? 'border-emerald-500/30 bg-zinc-900/50 shadow-md shadow-emerald-950/10 hover:border-emerald-500/50'
                          : 'border-zinc-900/80 bg-zinc-900/20 hover:border-zinc-800 hover:bg-zinc-900/40 opacity-60 hover:opacity-90'
                      }`}
                    >
                      {isEditing ? (
                        /* Premium Full Inline Form Editor */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                              <Edit3 className="w-3.5 h-3.5 animate-pulse" />
                              <span>Edit Cinema Curation Metadata</span>
                            </h4>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                CANCEL
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(index)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/10"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>SAVE CHANGES</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Movie Title</label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-sans font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Release Year</label>
                              <input
                                type="number"
                                value={editYear}
                                onChange={(e) => setEditYear(Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Director</label>
                              <input
                                type="text"
                                value={editDirector}
                                onChange={(e) => setEditDirector(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Runtime</label>
                              <input
                                type="text"
                                value={editRuntime}
                                onChange={(e) => setEditRuntime(e.target.value)}
                                placeholder="e.g. 112 mins"
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Confidence (0-100)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editConfidence}
                                onChange={(e) => setEditConfidence(Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Vibe Tag</label>
                              <input
                                type="text"
                                value={editVibe}
                                onChange={(e) => setEditVibe(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Rating Score</label>
                              <input
                                type="text"
                                value={editRating}
                                onChange={(e) => setEditRating(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Plot Synopsis</label>
                            <textarea
                              value={editSynopsis}
                              onChange={(e) => setEditSynopsis(e.target.value)}
                              rows={2}
                              className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none focus:ring-1 focus:ring-blue-500/20 transition-all leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Genres (comma separated)</label>
                              <input
                                type="text"
                                value={editGenres}
                                onChange={(e) => setEditGenres(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">Streaming Outlets (comma separated)</label>
                              <input
                                type="text"
                                value={editStreaming}
                                onChange={(e) => setEditStreaming(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* High-Fidelity Interactive Movie Card */
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                          {/* Left Column: Multi-select Switcher & Movie Poster */}
                          <div className="flex items-center sm:items-start gap-3 w-full sm:w-auto shrink-0">
                            {/* Checkbox button */}
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(index)}
                              className="p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                              title={isSelected ? 'Deselect movie' : 'Select movie'}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5.5 h-5.5 text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Square className="w-5.5 h-5.5 text-zinc-600 hover:text-zinc-400" />
                              )}
                            </button>

                            {/* Poster container with hover dynamic zoom */}
                            <div 
                              onClick={() => handleToggleSelect(index)}
                              className="w-16 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md relative group/poster cursor-pointer shrink-0"
                            >
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/poster:scale-110"
                              />
                              {/* Soft checkbox highlight overlay */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400/35 rounded-xl pointer-events-none" />
                              )}
                            </div>
                          </div>

                          {/* Right Column: Complete movie details */}
                          <div className="flex-1 min-w-0 space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div onClick={() => handleToggleSelect(index)} className="cursor-pointer">
                                <h3 className="text-base font-bold text-white tracking-wide truncate flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                                  {movie.title}
                                  <span className="text-xs font-mono font-medium text-zinc-500">
                                    ({movie.year})
                                  </span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-medium font-sans">
                                  Directed by <span className="text-zinc-300">{movie.director}</span>
                                </p>
                              </div>

                              {/* Interactive controls */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleStartEdit(index)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 rounded-lg transition-all cursor-pointer"
                                  title="Edit movie info"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveFromPreview(index)}
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                                  title="Remove from extraction list"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Synopsis / recommendation highlight */}
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal line-clamp-2">
                              {movie.synopsis}
                            </p>

                            {/* Grid Metadata row: Genre, Vibe, Rating, Runtime, Confidence */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {/* Vibe tag */}
                              <span className="text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {movie.vibe}
                              </span>

                              {/* Genre pills */}
                              {movie.genres.map((g) => (
                                <span 
                                  key={g} 
                                  className="text-[10px] font-sans font-medium bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-850"
                                >
                                  {g}
                                </span>
                              ))}

                              {/* Rating */}
                              <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/15 flex items-center gap-1">
                                ⭐ {movie.rating}
                              </span>

                              {/* Runtime display with Clock */}
                              {movie.runtime && (
                                <span className="text-[10px] font-mono font-medium text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-md border border-purple-500/15 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {movie.runtime}
                                </span>
                              )}

                              {/* Confidence Score display with Indicator Gauge */}
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${confidenceColor}`}>
                                <Gauge className="w-3 h-3" />
                                <span>{confidenceVal}% Match</span>
                              </span>
                            </div>

                            {/* OTT Badge Services row */}
                            {movie.streamingServices && movie.streamingServices.length > 0 && (
                              <div className="pt-1.5 flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                                  Streams On:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {movie.streamingServices.map((srv) => (
                                    <span 
                                      key={srv} 
                                      className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors px-2 py-0.5 rounded-md font-mono text-[9px] font-semibold uppercase tracking-wider"
                                    >
                                      {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Highlighted reason */}
                            {movie.whySave && (
                              <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-xl px-3 py-2 text-[11px] text-zinc-400 italic flex items-start gap-1.5 leading-relaxed">
                                <span className="text-blue-400 font-bold font-serif">“</span>
                                <span>{movie.whySave}</span>
                                <span className="text-blue-400 font-bold font-serif">”</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Premium CTA Bottom Actions Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 border-t border-zinc-900">
              <div className="text-left w-full md:w-auto">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                  Extracted Social Source
                </p>
                <p className="text-xs text-zinc-300 font-medium truncate max-w-[280px]">
                  {previewMovies[0]?.socialSource?.author || '@creator'} on {previewMovies[0]?.socialSource?.platform.toUpperCase() || 'Platform'}
                </p>
              </div>

              {/* Save Selected and Save All actions */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewMovies(null)}
                  className="flex-1 sm:flex-none border border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Discard All
                </button>

                <button
                  type="button"
                  onClick={handleSaveSelected}
                  className="flex-1 sm:flex-none bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>
                    Save Selected ({previewMovies.filter((_, idx) => selectedIndices[idx]).length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/15 cursor-pointer hover:shadow-blue-500/25"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Save All ({previewMovies.length})</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
