/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ArrowRight, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Movie } from '../types';
import HeroFilmStrip from './HeroFilmStrip';

interface HeroProductDemoProps {
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  onImportSubmit?: (text: string) => Promise<void>;
}

export default function HeroProductDemo({ onMoviesAdded, onImportSubmit }: HeroProductDemoProps) {
  const [inputText, setInputText] = useState('');
  const [isExtractingReal, setIsExtractingReal] = useState(false);
  const [realError, setRealError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isExtractingReal) return;

    if (onImportSubmit) {
      setIsExtractingReal(true);
      setRealError(null);
      try {
        await onImportSubmit(inputText);
        setInputText('');
      } catch (err: any) {
        setRealError(err.message || 'Unable to extract film recommendations from link.');
      } finally {
        setIsExtractingReal(false);
      }
    }
  };

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-10 sm:pt-14 md:pt-16 pb-4 flex flex-col items-center select-none">
      
      {/* Soft Ambient Radial Spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-radial from-[#7F72FF]/14 via-[#7F72FF]/02 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* EDITORIAL HEADLINE BLOCK */}
      <div className="relative z-20 text-center mb-9 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-[3.45rem] font-display font-normal tracking-[0.015em] text-[#F5F5F3] leading-[1.08] drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]">
          Every recommendation<br />
          deserves a place.
        </h1>

        <p className="mt-6 text-[#F5F5F3]/70 text-[18px] sm:text-[19px] md:text-[20px] max-w-xl mx-auto font-sans font-normal leading-relaxed drop-shadow-md">
          Save movies from Instagram Reels, TikToks, YouTube, and friends—so they&apos;re waiting when you&apos;re ready to watch.
        </p>
      </div>

      {/* STATIC LUXURY COMMAND CAPTURE BAR (Z-30 so film reel passes elegantly behind it) */}
      <div className="relative z-30 w-full max-w-lg mb-2">
        <form onSubmit={handleManualSubmit} className="w-full">
          <div className="relative flex items-center gap-2 bg-[#111214]/92 border border-[#1A1C20] focus-within:border-[#7F72FF]/80 rounded-2xl p-2 sm:p-2.5 transition-all duration-300 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
            <div className="pl-2.5 text-[#7F72FF] shrink-0">
              <LinkIcon className="w-4 h-4 opacity-80" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste an Instagram Reel, TikTok, YouTube or Letterboxd link..."
              disabled={isExtractingReal}
              className="w-full bg-transparent px-1 py-1.5 text-xs sm:text-sm text-[#F5F5F3] placeholder-[#A7A7A2]/45 focus:outline-none border-0 font-sans tracking-wide"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isExtractingReal}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-sans font-semibold flex items-center justify-center gap-2 shrink-0 transition-all duration-300 ${
                inputText.trim() && !isExtractingReal
                  ? 'bg-[#7F72FF] hover:bg-[#8F83FF] text-white shadow-[0_0_24px_rgba(127,114,255,0.45)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-[#1A1C20] text-[#A7A7A2]/35 cursor-not-allowed'
              }`}
            >
              {isExtractingReal ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <span>Extract</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {realError && (
          <div className="mt-2.5 text-xs text-red-300 bg-red-950/40 border border-red-900/40 p-2.5 rounded-xl text-left backdrop-blur-md">
            {realError}
          </div>
        )}
      </div>

      {/* CONTINUOUS CINEMATIC 35MM FILM REEL (Raised 80-100px so it overlaps & flows behind capture bar) */}
      <div className="relative z-10 w-full -mt-20 sm:-mt-24 md:-mt-28">
        <HeroFilmStrip />
      </div>

    </div>
  );
}
