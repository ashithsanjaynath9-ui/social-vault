/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Sparkles, Film, Bookmark, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

// Premium Apple/Linear/Arc cubic-bezier easings
const EXPENSIVE_EASE = [0.16, 1, 0.3, 1];
const SOFT_EASE = [0.25, 1, 0.5, 1];

// Background tiny floating dust particles with slow continuous drift
function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 60;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.35 + 0.08,
      speedX: (Math.random() - 0.5) * 0.08,
      speedY: -Math.abs((Math.random() * 0.09) + 0.02), // Slow upward drift
      pulseSpeed: Math.random() * 0.008 + 0.002,
      baseAlpha: Math.random() * 0.3 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(Date.now() * 0.0005) * 0.04;
        p.y += p.speedY;
        p.alpha = p.baseAlpha + Math.sin(Date.now() * p.pulseSpeed) * 0.12;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;

        const currentAlpha = Math.max(0.04, Math.min(0.5, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 220, 255, ${currentAlpha})`;
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = 'rgba(142, 123, 255, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-1000"
    />
  );
}

// Subtle moving ambient light rays
function MovingLightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <motion.div
        animate={{
          rotate: [0, 10, -6, 0],
          opacity: [0.12, 0.22, 0.12],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-1/2 left-1/4 w-[600px] h-[1000px] bg-gradient-to-b from-indigo-500/20 via-[#8E7BFF]/10 to-transparent blur-[120px] origin-top transform -rotate-12"
      />
      <motion.div
        animate={{
          rotate: [-6, 6, -10, -6],
          opacity: [0.08, 0.18, 0.08],
          scale: [1.05, 0.96, 1.05],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-1/2 right-1/4 w-[500px] h-[900px] bg-gradient-to-b from-cyan-500/15 via-purple-500/10 to-transparent blur-[140px] origin-top transform rotate-12"
      />
    </div>
  );
}

// SCREEN 2 AUTOMATED DEMO ANIMATION
function ReelToCollectionAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      if (!isMounted) return;
      setStep(0);
      timeouts.push(setTimeout(() => isMounted && setStep(1), 900));   // 1. Slide into input
      timeouts.push(setTimeout(() => isMounted && setStep(2), 1800));  // 2. Plot button glows
      timeouts.push(setTimeout(() => isMounted && setStep(3), 2600));  // 3. Extraction animation
      timeouts.push(setTimeout(() => isMounted && setStep(4), 3600));  // 4. Movie poster appears
      timeouts.push(setTimeout(() => isMounted && setStep(5), 4500));  // 5. Slides into Your Plot
      timeouts.push(setTimeout(() => isMounted && setStep(6), 5300));  // 6. Toast appears
      timeouts.push(setTimeout(() => isMounted && runSequence(), 7600)); // Restart sequence
    };

    runSequence();

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-[320px] sm:w-[380px] h-[220px] sm:h-[240px] flex flex-col items-center justify-center mb-2 select-none">
      <div className="relative w-full h-full rounded-2xl bg-[#090A10]/80 border border-white/10 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-purple-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full space-y-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EXPENSIVE_EASE }}
                className="mx-auto w-fit flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-500/30 backdrop-blur-md shadow-lg"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px] font-sans font-medium text-pink-200 tracking-tight">
                  instagram.com/reel/C8_blade_runner
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-between w-full h-10 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-sans transition-all duration-500">
            <div className="flex items-center space-x-2 truncate pr-2">
              <Film className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span className={`truncate transition-colors duration-500 ${step >= 1 ? 'text-indigo-200' : 'text-zinc-500'}`}>
                {step === 0 && 'Paste Reel or video link...'}
                {step >= 1 && 'https://instagram.com/reel/C8_blade_runner'}
              </span>
            </div>

            <motion.div
              animate={{
                scale: step === 2 ? 1.03 : 1,
                boxShadow: step === 2 
                  ? '0 0 24px rgba(142,123,255,0.7), 0 0 12px rgba(142,123,255,0.4)' 
                  : '0 0 0px transparent',
              }}
              transition={{ duration: 0.6, ease: EXPENSIVE_EASE }}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all duration-500 ${
                step >= 2
                  ? 'bg-gradient-to-r from-[#8E7BFF] to-[#6E56FF] text-white'
                  : 'bg-white/10 text-zinc-400'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Plot</span>
            </motion.div>
          </div>

          <AnimatePresence>
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EXPENSIVE_EASE }}
                className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.85, ease: SOFT_EASE }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_12px_#00F0FF]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 w-full flex-1 flex items-center justify-center my-1">
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: EXPENSIVE_EASE }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-[11px] font-sans text-indigo-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>Extracting title & details...</span>
            </motion.div>
          )}

          <AnimatePresence>
            {(step === 4 || step === 5) && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={
                  step === 5
                    ? { opacity: 0.85, y: 22, scale: 0.76 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.6, ease: EXPENSIVE_EASE }}
                className="relative flex items-center space-x-3 p-2 rounded-xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-xl w-60"
              >
                <div className="w-10 h-14 rounded-lg bg-indigo-900/40 overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop"
                    alt="Blade Runner 2049"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 text-left space-y-0.5">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono text-[#8E7BFF]">8.0 ★</span>
                    <span className="text-[9px] font-sans text-zinc-500">• 2017</span>
                  </div>
                  <h4 className="text-xs font-serif font-medium text-white truncate">
                    Blade Runner 2049
                  </h4>
                  <p className="text-[10px] font-sans text-zinc-400 truncate">
                    Saved from Instagram
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EXPENSIVE_EASE }}
              className="absolute bottom-0 inset-x-2 h-10 rounded-xl bg-gradient-to-t from-indigo-950/80 to-transparent border-t border-indigo-500/20 flex items-center justify-between px-3"
            >
              <div className="flex items-center space-x-1.5 text-[10px] font-serif italic text-indigo-300">
                <Bookmark className="w-3 h-3 text-[#8E7BFF]" />
                <span>Your Plot Collection</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">1 saved</span>
            </motion.div>
          )}

          <AnimatePresence>
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.5, ease: EXPENSIVE_EASE }}
                className="absolute z-30 bottom-3 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0B0D14] border border-[#8E7BFF]/50 shadow-[0_10px_30px_rgba(142,123,255,0.3)]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8E7BFF]" />
                <span className="text-[11px] font-sans font-medium text-zinc-100">
                  Added to your plot
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// SCREEN 3 AUTOMATED DEMO ANIMATION
function MovieShelfDemoAnimation() {
  const [activeMovieIndex, setActiveMovieIndex] = useState<number | null>(null);

  const DEMO_MOVIES = [
    {
      title: 'Blade Runner 2049',
      year: '2017',
      rating: '8.0',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop',
      color1: '#00F0FF',
      color2: '#8E7BFF',
      glow: 'rgba(0, 240, 255, 0.75)',
      baseY: 0,
    },
    {
      title: 'Interstellar',
      year: '2014',
      rating: '8.7',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop',
      color1: '#38BDF8',
      color2: '#818CF8',
      glow: 'rgba(56, 189, 248, 0.75)',
      baseY: -3,
    },
    {
      title: 'Dune: Part Two',
      year: '2024',
      rating: '8.6',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop',
      color1: '#F59E0B',
      color2: '#EA580C',
      glow: 'rgba(245, 158, 11, 0.75)',
      baseY: 2,
    },
    {
      title: 'Spirited Away',
      year: '2001',
      rating: '8.6',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
      color1: '#F43F5E',
      color2: '#FB923C',
      glow: 'rgba(244, 63, 94, 0.75)',
      baseY: -1,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const runLoop = () => {
      if (!isMounted) return;
      setActiveMovieIndex(null);

      timeouts.push(setTimeout(() => isMounted && setActiveMovieIndex(0), 1000));
      timeouts.push(setTimeout(() => isMounted && setActiveMovieIndex(1), 3800));
      timeouts.push(setTimeout(() => isMounted && runLoop(), 6600));
    };

    runLoop();

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const activeMovie = activeMovieIndex !== null ? DEMO_MOVIES[activeMovieIndex] : null;

  return (
    <div className="relative w-[340px] sm:w-[420px] h-[220px] sm:h-[240px] flex flex-col items-center justify-center mb-2 select-none">
      <AnimatePresence mode="wait">
        {activeMovie && (
          <motion.div
            key={activeMovie.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.75, ease: EXPENSIVE_EASE }}
            className="pointer-events-none absolute -inset-8 z-0 blur-[60px] opacity-65"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeMovie.color1} 0%, ${activeMovie.color2} 55%, transparent 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full h-full rounded-2xl bg-[#090A10]/85 border border-white/10 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-sans text-zinc-400 border-b border-white/5 pb-2">
          <div className="flex items-center space-x-1.5 font-serif italic text-white/90">
            <Bookmark className="w-3.5 h-3.5 text-[#8E7BFF]" />
            <span>Your Plot Collection</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">4 saved</span>
        </div>

        {/* Multi-layered smooth parallax cards glide */}
        <div className="relative flex items-center justify-center space-x-3 sm:space-x-5 my-auto py-2">
          {DEMO_MOVIES.map((movie, idx) => {
            const isHovered = activeMovieIndex === idx;
            const hasHoveredOther = activeMovieIndex !== null && !isHovered;

            const targetY = isHovered
              ? -12
              : hasHoveredOther
              ? movie.baseY + 3
              : movie.baseY;

            return (
              <motion.div
                key={movie.title}
                animate={{
                  y: targetY,
                  scale: isHovered ? 1.12 : hasHoveredOther ? 0.96 : 1,
                  opacity: hasHoveredOther ? 0.65 : 1,
                  zIndex: isHovered ? 30 : 10 - idx,
                }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.04,
                  ease: EXPENSIVE_EASE,
                }}
                className="relative cursor-pointer group"
              >
                <div
                  className={`relative w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border transition-all duration-500 ${
                    isHovered
                      ? 'border-white/80 shadow-[0_18px_36px_rgba(0,0,0,0.95)]'
                      : 'border-white/10'
                  }`}
                  style={{
                    boxShadow: isHovered
                      ? `0 20px 40px rgba(0,0,0,0.95), 0 0 24px ${movie.glow}`
                      : undefined,
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EXPENSIVE_EASE }}
                      className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono text-amber-300"
                    >
                      ★ {movie.rating}
                    </motion.div>
                  )}
                </div>

                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EXPENSIVE_EASE }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-serif italic text-white drop-shadow-md bg-black/70 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md"
                  >
                    {movie.title}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-40 mt-1" />
      </div>
    </div>
  );
}

// SCREEN 4 AUTOMATED DEMO ANIMATION (PLOT PICKS)
function PlotPicksDemoAnimation() {
  const [visibleCards, setVisibleCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const PICKS = [
    {
      title: 'Arrival',
      tag: 'Mind-bending',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=250&auto=format&fit=crop',
      depthY: 12,
    },
    {
      title: 'La La Land',
      tag: 'Bittersweet',
      poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=250&auto=format&fit=crop',
      depthY: 18,
    },
    {
      title: 'Grand Budapest',
      tag: 'Charming',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=250&auto=format&fit=crop',
      depthY: 14,
    },
  ];

  return (
    <div className="relative w-[340px] sm:w-[420px] h-[220px] sm:h-[240px] flex flex-col items-center justify-between mb-2 select-none">
      <div className="relative z-10 w-full h-full rounded-2xl bg-[#090A10]/85 border border-white/10 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
        
        {/* Soft Ambient Halo behind glowing orb */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-b from-[#00F0FF]/15 via-[#8E7BFF]/15 to-transparent blur-2xl pointer-events-none" />

        {/* Small Glowing Orb + Question */}
        <div className="flex flex-col items-center space-y-2 mt-1">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              boxShadow: [
                '0 0 15px rgba(0,240,255,0.6)',
                '0 0 28px rgba(142,123,255,0.8)',
                '0 0 15px rgba(0,240,255,0.6)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#8E7BFF] to-[#FF7BCA]"
          />
          <span className="text-xs font-serif italic text-indigo-100 tracking-wide drop-shadow-sm">
            "What are you in the mood for tonight?"
          </span>
        </div>

        {/* Three Movie Cards gliding gracefully with staggered depth */}
        <div className="grid grid-cols-3 gap-2.5 my-auto pt-1">
          {PICKS.map((pick, idx) => (
            <motion.div
              key={pick.title}
              initial={{ opacity: 0, y: pick.depthY, scale: 0.95 }}
              animate={
                visibleCards
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: pick.depthY, scale: 0.95 }
              }
              transition={{
                duration: 0.65,
                delay: idx * 0.15,
                ease: EXPENSIVE_EASE,
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center p-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-colors duration-300 group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-white/10 mb-1.5 shadow-md">
                <img
                  src={pick.poster}
                  alt={pick.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <h5 className="text-[11px] font-serif font-medium text-white text-center truncate w-full">
                {pick.title}
              </h5>
              <span className="text-[9px] font-sans text-indigo-300/80 text-center truncate w-full">
                {pick.tag}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar indicator */}
        <div className="flex items-center justify-between text-[10px] font-sans text-zinc-500 border-t border-white/5 pt-1.5">
          <div className="flex items-center space-x-1.5 font-serif italic text-indigo-300">
            <Sparkles className="w-3 h-3 text-[#8E7BFF]" />
            <span>Plot Picks</span>
          </div>
          <span className="text-[10px] text-zinc-400">Curated for your evening</span>
        </div>
      </div>
    </div>
  );
}

// 4 Story Screens Definition
interface ScreenDefinition {
  isFirstScreen?: boolean;
  isLastScreen?: boolean;
  headline: string;
  subheadline1?: string;
  subheadline2?: string;
  body?: string;
  ctaText: string;
  glowColor: string;
  visual?: React.ReactNode;
}

const STORY_SCREENS: ScreenDefinition[] = [
  {
    isFirstScreen: true,
    headline: 'Every recommendation has a story.',
    subheadline1: 'Most movie recommendations disappear forever.',
    subheadline2: "Today, you'll save your first one.",
    ctaText: 'Begin',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(120, 100, 255, 0.2) 0%, rgba(15, 12, 35, 0.05) 60%, transparent 85%)',
  },
  {
    headline: 'Watch recommendations become a collection.',
    subheadline1: 'Paste once.',
    subheadline2: "We'll remember it forever.",
    ctaText: 'Continue',
    glowColor: 'radial-gradient(circle at 50% 45%, rgba(142, 123, 255, 0.25) 0%, rgba(40, 15, 80, 0.1) 60%, transparent 85%)',
    visual: <ReelToCollectionAnimation />,
  },
  {
    headline: 'Every recommendation stays exactly where you left it.',
    subheadline1: 'Your personal movie collection, beautifully organized.',
    ctaText: 'Continue',
    glowColor: 'radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.22) 0%, rgba(142, 123, 255, 0.15) 50%, transparent 85%)',
    visual: <MovieShelfDemoAnimation />,
  },
  {
    isLastScreen: true,
    headline: 'Not sure what to watch?',
    subheadline1: "We'll always have something worth watching.",
    ctaText: 'Start Plotting',
    glowColor: 'radial-gradient(circle at 50% 45%, rgba(142, 123, 255, 0.3) 0%, rgba(0, 240, 255, 0.18) 60%, transparent 85%)',
    visual: <PlotPicksDemoAnimation />,
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Trigger smooth exit animation before invoking parent onComplete callback
  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Keyboard accessibility navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExiting) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentStep < STORY_SCREENS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          triggerExit();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isExiting]);

  const screen = STORY_SCREENS[currentStep];

  const handleNext = () => {
    if (isExiting) return;
    if (currentStep < STORY_SCREENS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      triggerExit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={
        isExiting
          ? { opacity: 0, scale: 0.95, filter: 'blur(10px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.6, ease: EXPENSIVE_EASE }}
      className="fixed inset-0 z-50 bg-[#030305]/95 text-zinc-100 flex flex-col justify-between p-6 sm:p-12 md:p-16 overflow-hidden select-none backdrop-blur-2xl"
    >
      {/* Canvas Dust Particles */}
      <DustParticles />

      {/* Moving Ambient Light Rays */}
      <MovingLightRays />

      {/* Dynamic Background Radial Glow - Slowly shifting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: SOFT_EASE }}
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: screen.glowColor }}
        />
      </AnimatePresence>

      {/* TOP HEADER: Minimal Brand & Skip Button */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center space-x-2">
          <span className="font-serif italic text-xl text-white/90 tracking-wide">plot</span>
          <span className="w-1 h-1 rounded-full bg-[#8E7BFF] shadow-[0_0_8px_#8E7BFF]" />
        </div>

        <button
          onClick={triggerExit}
          disabled={isExiting}
          className="text-[11px] font-sans tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors duration-300 px-3 py-1.5 rounded-full hover:bg-white/5 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* CENTERED MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-2xl mx-auto my-auto py-8 text-center flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`screen-${currentStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPENSIVE_EASE }}
            className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
          >
            {/* Visual if present (screens 2-4) */}
            {screen.visual && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: EXPENSIVE_EASE }}
              >
                {screen.visual}
              </motion.div>
            )}

            {/* Headline fading upward */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EXPENSIVE_EASE }}
              className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.15] text-zinc-100 max-w-xl font-normal drop-shadow-sm"
            >
              {screen.headline}
            </motion.h1>

            {/* Subheadline fading upward */}
            {screen.subheadline1 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: EXPENSIVE_EASE }}
                className="space-y-1.5 text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-md font-light"
              >
                <p>{screen.subheadline1}</p>
                {screen.subheadline2 && (
                  <p className="text-zinc-300 font-normal">{screen.subheadline2}</p>
                )}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: EXPENSIVE_EASE }}
                className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-md font-light"
              >
                {screen.body}
              </motion.p>
            )}

            {/* Prominent Action Button softly illuminating */}
            {(screen.isFirstScreen || screen.isLastScreen) && (
              <motion.button
                onClick={handleNext}
                disabled={isExiting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.26, ease: EXPENSIVE_EASE }}
                whileHover={{
                  scale: 1.015,
                  boxShadow: '0 0 30px rgba(255,255,255,0.35), 0 0 15px rgba(142,123,255,0.4)',
                }}
                whileTap={{ scale: 0.985 }}
                className="mt-4 px-8 py-3.5 rounded-full bg-white text-black font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-400 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-[#F3F0FF] cursor-pointer"
              >
                {screen.ctaText}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION FOOTER */}
      <footer className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        {/* Back Action */}
        <div className="w-28 text-left">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={isExiting}
              className="text-[11px] font-sans tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors duration-300 px-3 py-1.5 rounded-full hover:bg-white/5 cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Progress Indicators: Tiny Glowing Pulsing Dots */}
        <div className="flex items-center justify-center space-x-3">
          {STORY_SCREENS.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => setCurrentStep(idx)}
              disabled={isExiting}
              aria-label={`Go to screen ${idx + 1}`}
              className="group p-1.5 focus:outline-none cursor-pointer"
            >
              <motion.div
                animate={
                  idx === currentStep
                    ? {
                        scale: [1, 1.12, 1],
                        opacity: [0.9, 1, 0.9],
                        boxShadow: [
                          '0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(142,123,255,0.6)',
                          '0 0 14px rgba(255,255,255,0.95), 0 0 24px rgba(142,123,255,0.85)',
                          '0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(142,123,255,0.6)',
                        ],
                      }
                    : {
                        scale: [1, 1.05, 1],
                        opacity: [0.35, 0.5, 0.35],
                      }
                }
                transition={{
                  duration: idx === currentStep ? 2.5 : 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`transition-all duration-500 rounded-full ${
                  idx === currentStep
                    ? 'w-7 h-1.5 bg-gradient-to-r from-white via-indigo-100 to-white'
                    : 'w-1.5 h-1.5 bg-white/40 group-hover:bg-white/80 group-hover:scale-125'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Continue / Start Plotting Action softly illuminating */}
        <div className="w-28 text-right flex justify-end">
          {!screen.isFirstScreen && (
            <motion.button
              onClick={handleNext}
              disabled={isExiting}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 20px rgba(255,255,255,0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              className="text-[11px] font-sans tracking-[0.2em] uppercase font-medium text-white hover:text-indigo-100 transition-all duration-300 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md shadow-lg cursor-pointer"
            >
              {screen.ctaText}
            </motion.button>
          )}
        </div>
      </footer>
    </motion.div>
  );
}
