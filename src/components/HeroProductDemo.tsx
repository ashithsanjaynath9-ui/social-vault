/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Link as LinkIcon, 
  Loader2, 
  Sparkles, 
  MoreHorizontal, 
  Shield,
  Bookmark 
} from 'lucide-react';
import { Movie } from '../types';

interface HeroProductDemoProps {
  onMoviesAdded?: (newMovies: Omit<Movie, 'id' | 'addedAt' | 'watched'>[]) => void;
  onImportSubmit?: (text: string) => Promise<void>;
  onSelectMovie?: (id: string) => void;
}

interface DemoMovieCard {
  id: string;
  title: string;
  displayTitle: string;
  posterUrl: string;
  backupPosterUrl: string;
}

// 12 DISTINCT LEGENDARY POPULAR MOVIES MATCHING REFERENCE DESIGN
const CAROUSEL_MOVIES: DemoMovieCard[] = [
  {
    id: 'demo-1',
    title: 'Blade Runner 2049',
    displayTitle: 'BLADE RUNNER 2049',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-2',
    title: 'The Dark Knight',
    displayTitle: 'THE DARK KNIGHT',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-3',
    title: 'Interstellar',
    displayTitle: 'INTERSTELLAR',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-4',
    title: 'The Prestige',
    displayTitle: 'THE PRESTIGE',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-5',
    title: 'The Matrix',
    displayTitle: 'THE MATRIX',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-6',
    title: 'Spirited Away',
    displayTitle: 'SPIRITED AWAY',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-7',
    title: 'Dune: Part Two',
    displayTitle: 'DUNE: PART TWO',
    posterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-8',
    title: 'The Grand Budapest Hotel',
    displayTitle: 'THE GRAND BUDAPEST',
    posterUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-9',
    title: 'La La Land',
    displayTitle: 'LA LA LAND',
    posterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-10',
    title: 'The Godfather',
    displayTitle: 'THE GODFATHER',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-11',
    title: 'Oppenheimer',
    displayTitle: 'OPPENHEIMER',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-12',
    title: 'Parasite',
    displayTitle: 'PARASITE',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backupPosterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  }
];

// Quadrupled array for infinitely seamless, gapless looping
const REEL_MOVIES = [
  ...CAROUSEL_MOVIES, 
  ...CAROUSEL_MOVIES, 
  ...CAROUSEL_MOVIES, 
  ...CAROUSEL_MOVIES
];

export default function HeroProductDemo({ onImportSubmit, onSelectMovie }: HeroProductDemoProps) {
  const [inputText, setInputText] = useState('');
  const [isExtractingReal, setIsExtractingReal] = useState(false);
  const [realError, setRealError] = useState<string | null>(null);

  // Smooth continuous rolling film reel state
  const [scrollPos, setScrollPos] = useState(0);
  const [containerCenter, setContainerCenter] = useState(600);

  const scrollPosRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sizing parameters
  const CARD_WIDTH = 180; // px
  const CARD_GAP = 16; // px
  const ITEM_FULL_WIDTH = CARD_WIDTH + CARD_GAP; // 196px
  const SINGLE_SET_WIDTH = CAROUSEL_MOVIES.length * ITEM_FULL_WIDTH; // 12 * 196 = 2352px

  // Track container width for precise center detection
  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        setContainerCenter(containerRef.current.offsetWidth / 2);
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // Silky smooth RequestAnimationFrame hardware-accelerated movement loop
  useEffect(() => {
    let lastTime = performance.now();
    // 35-45 seconds per complete visible set cycle (~40s)
    const SPEED_PX_PER_SEC = SINGLE_SET_WIDTH / 40; 

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      const pixelsToMove = (delta / 1000) * SPEED_PX_PER_SEC; 
      let nextPos = scrollPosRef.current + pixelsToMove;

      // Reset seamlessly when one full set of 12 items has passed
      if (nextPos >= SINGLE_SET_WIDTH) {
        nextPos = nextPos % SINGLE_SET_WIDTH;
      }

      scrollPosRef.current = nextPos;
      setScrollPos(nextPos);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [SINGLE_SET_WIDTH]);

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
        setRealError(err.message || 'Unable to plot film recommendations from link.');
      } finally {
        setIsExtractingReal(false);
      }
    }
  };

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-4 pt-4 sm:pt-8 pb-10 flex flex-col items-center select-none overflow-hidden">
      
      {/* 1. FLOATING 3D TILTED BACKGROUND MOVIE POSTERS (Left & Right Depth) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Tilted Poster 1: Interstellar */}
        <div 
          className="absolute top-[8%] -left-[20px] sm:-left-[30px] w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-35 blur-[0.5px]"
          style={{ transform: 'rotate(-16deg) scale(0.85) translateY(-10px)' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" 
            alt="Interstellar"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <span className="font-serif italic text-sm text-white/90 tracking-widest uppercase">INTERSTELLAR</span>
          </div>
        </div>

        {/* Left Tilted Poster 2: Blade Runner 2049 */}
        <div 
          className="absolute top-[42%] -left-[30px] sm:-left-[45px] w-44 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-30 blur-[0.5px]"
          style={{ transform: 'rotate(-10deg) scale(0.88)' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" 
            alt="Blade Runner 2049"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
        </div>

        {/* Right Tilted Poster 1: The Godfather */}
        <div 
          className="absolute top-[8%] -right-[20px] sm:-right-[30px] w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-35 blur-[0.5px]"
          style={{ transform: 'rotate(14deg) scale(0.85) translateY(-10px)' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80" 
            alt="The Godfather"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <span className="font-serif italic text-sm text-white/90 tracking-widest uppercase">THE GODFATHER</span>
          </div>
        </div>

        {/* Right Tilted Poster 2: Spirited Away */}
        <div 
          className="absolute top-[32%] -right-[30px] sm:-right-[45px] w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-40 blur-[0.5px]"
          style={{ transform: 'rotate(16deg) scale(0.9)' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80" 
            alt="Spirited Away"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
          <div className="absolute inset-x-0 top-3 px-4">
            <span className="font-serif italic text-sm text-white/90 tracking-widest uppercase">SPIRITED AWAY</span>
          </div>
        </div>
      </div>

      {/* 2. FAINT PROJECTOR PURPLE BLOOM GLOW */}
      <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] h-[300px] bg-radial from-[#8E7BFF]/15 via-[#8E7BFF]/03 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* 3. HERO CENTER CONTENT BLOCK */}
      <div className="relative z-20 text-center flex flex-col items-center max-w-3xl mx-auto pt-2 sm:pt-4">
        
        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0F17]/90 border border-[#2B2748] text-[#A89CFF] text-[11px] font-sans font-medium uppercase tracking-widest shadow-inner mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#A89CFF]" />
          <span>YOUR MOVIES, YOUR SPACE</span>
        </div>

        {/* Main Serif Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] font-serif italic font-normal tracking-tight text-[#F5F5F7] leading-[1.08] drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
          Every recommendation<br />
          <span className="text-[#8E7BFF] drop-shadow-[0_0_35px_rgba(142,123,255,0.45)]">
            deserves a place.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-[#9D9DA8] text-sm sm:text-base md:text-lg max-w-lg mx-auto font-sans font-normal leading-relaxed">
          Save movies from Instagram Reels, TikToks, YouTube,<br className="hidden sm:inline" />
          and friends—so they&apos;re waiting when you&apos;re ready to watch.
        </p>

        {/* Extraction Capture Bar */}
        <form onSubmit={handleManualSubmit} className="w-full max-w-xl mt-7">
          <div className="relative flex items-center gap-2 sm:gap-3 bg-[#0B0C11]/90 border border-[#252338] focus-within:border-[#8E7BFF] rounded-2xl p-2 sm:p-2.5 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl">
            <div className="pl-3 text-[#8E7BFF] shrink-0">
              <LinkIcon className="w-4 h-4" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste an Instagram Reel, TikTok, YouTube or Letterboxd link"
              disabled={isExtractingReal}
              className="w-full bg-transparent px-1 py-1.5 text-xs sm:text-sm text-[#F5F5F7] placeholder-[#5C5B6E] focus:outline-none border-0 font-sans tracking-wide"
            />

            <button
              type="submit"
              disabled={isExtractingReal}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shrink-0 transition-all duration-300 ${
                inputText.trim() && !isExtractingReal
                  ? 'bg-[#6E54FF] hover:bg-[#7D64FF] text-white shadow-[0_0_24px_rgba(110,84,255,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-[#6E54FF] hover:bg-[#7D64FF] text-white shadow-[0_0_20px_rgba(110,84,255,0.4)] cursor-pointer'
              }`}
            >
              {isExtractingReal ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <span>Extract</span>
                  <ArrowRight className="w-4 h-4" />
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

        {/* or share from divider */}
        <div className="flex items-center justify-center gap-4 w-full max-w-xs mt-6 mb-4 text-xs font-sans text-[#5A596B]">
          <div className="h-[1px] flex-1 bg-[#1C1B28]" />
          <span>or share from</span>
          <div className="h-[1px] flex-1 bg-[#1C1B28]" />
        </div>

        {/* Social Share Platform Circle Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
          {/* Instagram Circle */}
          <div className="w-10 h-10 rounded-full bg-[#111019] border border-[#252338] flex items-center justify-center text-white hover:border-[#8E7BFF]/50 transition-all cursor-pointer shadow-md">
            <svg className="w-4 h-4 text-pink-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>

          <span className="w-1 h-1 rounded-full bg-[#3B3852]" />

          {/* TikTok Circle */}
          <div className="w-10 h-10 rounded-full bg-[#111019] border border-[#252338] flex items-center justify-center text-white hover:border-[#8E7BFF]/50 transition-all cursor-pointer shadow-md">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-5.11 6.2 6.34 6.34 0 0 0 10.82 4.48c1.65-1.65 2.63-3.9 2.63-6.42V8.92a8.28 8.28 0 0 0 4.77 1.52V7a4.84 4.84 0 0 1-3-.31z"/>
            </svg>
          </div>

          <span className="w-1 h-1 rounded-full bg-[#3B3852]" />

          {/* YouTube Circle */}
          <div className="w-10 h-10 rounded-full bg-[#111019] border border-[#252338] flex items-center justify-center text-white hover:border-[#8E7BFF]/50 transition-all cursor-pointer shadow-md">
            <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          <span className="w-1 h-1 rounded-full bg-[#3B3852]" />

          {/* More Circle */}
          <div className="w-10 h-10 rounded-full bg-[#111019] border border-[#252338] flex items-center justify-center text-[#7A798C] hover:text-white hover:border-[#8E7BFF]/50 transition-all cursor-pointer shadow-md">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Works across all your favorite apps */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[#7A798C] font-sans italic relative z-30">
          <Shield className="w-3.5 h-3.5 text-[#8E7BFF]" />
          <span>Works across all your favorite apps</span>
        </div>

      </div>

      {/* 4. CINEMATIC ROLLING FILM REEL (Translucent Continuous Curved 35mm Projector Strip Ambient Background) */}
      <div 
        className="relative z-10 w-full -mt-14 sm:-mt-18 select-none pointer-events-none opacity-35 mix-blend-screen"
      >
        {/* Perspective Wrapper for Curved 3D Film Strip */}
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden py-3 sm:py-4 bg-transparent"
          style={{ perspective: '1200px' }}
        >
          {/* Left Vignette Edge Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-40" />
          
          {/* Right Vignette Edge Fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent z-40" />

          {/* Atmospheric Ambient Backlight behind Center of Reel */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 bg-[#8E7BFF]/10 blur-2xl rounded-full z-0" />

          {/* Continuous Infinite Rolling Motion Track */}
          <div 
            className="flex items-center gap-3 py-2 will-change-transform"
            style={{
              transform: `translate3d(-${scrollPos}px, 0, 0)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {REEL_MOVIES.map((movie, idx) => {
              // Calculate card position relative to visible container center
              const cardLeftX = idx * ITEM_FULL_WIDTH - scrollPos;
              const cardCenterX = cardLeftX + CARD_WIDTH / 2;
              const distToCenter = Math.abs(cardCenterX - containerCenter);
              
              // Organic curved arc calculation
              const normDist = Math.min(1, distToCenter / Math.max(containerCenter, 400));
              const arcY = Math.pow(normDist, 2) * 10;

              return (
                <div
                  key={`${movie.id}-${idx}`}
                  style={{
                    transform: `translateY(${arcY}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative w-28 sm:w-36 flex-shrink-0 rounded-xl overflow-hidden bg-[#0D0E17]/60 border border-white/10 shadow-md z-10 opacity-70"
                >
                  {/* 35mm Sprocket Perforations Top Header Bar */}
                  <div className="w-full bg-[#07080E]/80 py-0.5 px-1.5 border-b border-white/10 flex justify-between items-center z-20">
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                  </div>

                  {/* Poster Image Area */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== movie.backupPosterUrl) {
                          target.src = movie.backupPosterUrl;
                        }
                      }}
                      className="w-full h-full object-cover filter brightness-90 contrast-105 opacity-80"
                    />

                    {/* Poster Bottom Title Overlay */}
                    <div className="absolute inset-x-0 bottom-0 pt-6 pb-1.5 px-2 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end justify-center text-center">
                      <span className="font-sans font-semibold text-[9px] sm:text-[10px] tracking-wider uppercase drop-shadow-md text-zinc-300 truncate">
                        {movie.displayTitle}
                      </span>
                    </div>
                  </div>

                  {/* 35mm Sprocket Perforations Bottom Footer Bar */}
                  <div className="w-full bg-[#07080E]/80 py-0.5 px-1.5 border-t border-white/10 flex justify-between items-center z-20">
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                    <div className="w-2 h-1 rounded-[1px] bg-[#161826] border border-white/10" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
