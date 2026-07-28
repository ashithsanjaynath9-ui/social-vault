/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Clipboard,
  ShieldCheck
} from 'lucide-react';
import { Movie } from '../types';
import { PlotIcon } from './PlotLogo';

interface HeroProductDemoProps {
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  onImportSubmit?: (text: string) => Promise<void>;
  onSelectMovie?: (id: string) => void;
  autoFocusInput?: boolean;
}

export default function HeroProductDemo({ onImportSubmit, autoFocusInput }: HeroProductDemoProps) {
  const [inputText, setInputText] = useState('');
  const [isExtractingReal, setIsExtractingReal] = useState(false);
  const [realError, setRealError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocusInput) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [autoFocusInput]);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(text);
        }
      } else {
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isExtractingReal) return;

    if (onImportSubmit) {
      setIsExtractingReal(true);
      setRealError(null);
      try {
        await onImportSubmit(inputText);
        setInputText('');
      } catch (err: any) {
        setRealError(err.message || 'Unable to plot film recommendations from link.');
      } finally {
        setIsExtractingReal(false);
      }
    }
  };

  return (
    <div className="relative z-20 w-full max-w-xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center justify-center text-center select-none font-sans">
      
      {/* 1. Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2 max-w-lg mx-auto"
      >
        <h1 className="text-3xl sm:text-5xl font-display font-light italic text-[#F8FAFF] tracking-tight leading-[1.1]">
          Every recommendation<br />
          <span className="not-italic font-normal text-[#7C8CFF]">deserves a place.</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-[#A8B3CF] font-normal leading-relaxed max-w-md mx-auto pt-0.5">
          Save recommendations from anywhere before you forget them.
        </p>
      </motion.div>

      {/* 2. Extraction Form */}
      <motion.form 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleSubmit} 
        className="w-full mt-5 sm:mt-6 space-y-3.5"
      >
        {/* Large Visually Clean Multiline Input */}
        <div className="relative bg-[#0D111D] border border-white/15 focus-within:border-[#7C8CFF] rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-2xl shadow-[#7C8CFF]/10 backdrop-blur-xl group text-left">
          <textarea
            ref={inputRef}
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Paste your Instagram Reel,\nTikTok,\nYouTube,\nor Letterboxd link.`}
            disabled={isExtractingReal}
            className="w-full bg-transparent text-sm sm:text-base text-[#F8FAFF] placeholder-[#5A6582] focus:outline-none border-0 font-sans leading-relaxed tracking-wide resize-none"
          />
        </div>

        {/* Two Large Side-by-Side Equal Weight Buttons (Min height 52px, 16px gap) */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {/* Button 1: Paste */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handlePasteClipboard}
            disabled={isExtractingReal}
            className="w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-[#161B2E] hover:bg-[#1E253E] border border-[#7C8CFF]/35 hover:border-[#7C8CFF]/60 text-[#F8FAFF] text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C8CFF]" />
            <span>Paste</span>
          </motion.button>

          {/* Button 2: Extract */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isExtractingReal || !inputText.trim()}
            className={`w-full min-h-[52px] px-5 py-3.5 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
              inputText.trim() && !isExtractingReal
                ? 'bg-[#7C8CFF] hover:bg-[#94A2FF] text-[#0A0F1E] shadow-[#7C8CFF]/30'
                : 'bg-[#7C8CFF]/80 hover:bg-[#7C8CFF] text-[#0A0F1E]'
            }`}
          >
            {isExtractingReal ? (
              <>
                <PlotIcon className="w-5 h-5 text-[#0A0F1E]" showBg={false} animate="breathe" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <span>Extract</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Real Extraction Error Banner */}
        {realError && (
          <div className="mt-3 text-xs text-red-300 bg-red-950/60 border border-red-800/60 p-3 rounded-xl text-left backdrop-blur-md">
            {realError}
          </div>
        )}
      </motion.form>

      {/* 3. Small Supporting Content */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-[#5A6582] font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7C8CFF]" />
          <span>Auto-extracts movie details, posters, and streaming availability.</span>
        </div>
      </motion.div>

    </div>
  );
}

