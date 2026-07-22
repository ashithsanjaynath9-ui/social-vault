/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Instagram, Youtube, MessageCircle, Mic, FileText, Share2 } from 'lucide-react';

export default function CinemaAtmosphere() {
  // Generate 18 deterministic floating cinema dust particles illuminated in projector light
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      // Seeded-like spread across stage
      const left = ((i * 17 + 13) % 85) + 7; // 7% to 92%
      const top = ((i * 23 + 19) % 75) + 10; // 10% to 85%
      const size = 1 + (i % 3) * 0.6; // 1px to 2.2px
      const duration = 32 + (i % 5) * 6; // 32s to 56s
      const delay = (i % 7) * 2;
      const xOffset = (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 5);
      const yOffset = -25 - (i % 4) * 10;

      return {
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        size,
        duration,
        delay,
        xOffset,
        yOffset,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* LAYER 1: Dark Premium Cinema Environment (Auditorium Architectural Shadows & Deep Base) */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Auditorium Ceiling & Wall Shadows */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/85 via-[#08080E]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black/75 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-black/75 to-transparent pointer-events-none" />

      {/* LAYER 2: Soft Midnight Indigo & Top-Center Projector Atmosphere */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 25%, rgba(127, 114, 255, 0.09) 0%, rgba(20, 22, 36, 0.45) 45%, rgba(5, 5, 5, 0) 85%)'
        }}
      />

      {/* LAYER 3: Soft Upper-Center Projector Spotlight (Gentle falloff pulling attention to headline & capture bar, no visible beams) */}
      <motion.div
        animate={{
          opacity: [0.06, 0.09, 0.06],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(160, 150, 255, 0.75) 0%, rgba(127, 114, 255, 0.18) 45%, transparent 75%)'
        }}
      />

      {/* LAYER 4: Soft Subdued Ambient Glow Behind Film Reel */}
      <motion.div
        animate={{
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[350px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(127, 114, 255, 0.3) 0%, rgba(90, 80, 200, 0.08) 50%, transparent 80%)'
        }}
      />

      {/* PROJECTOR LIGHT BEAM: Soft volumetric beam originating from upper-left */}
      <motion.div
        animate={{
          opacity: [0.02, 0.038, 0.02],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[25%] -left-[15%] w-[85%] h-[120%] pointer-events-none blur-[60px]"
        style={{
          background: 'conic-gradient(from 125deg at 0% 0%, rgba(255, 255, 255, 0.12) 0deg, rgba(127, 114, 255, 0.08) 25deg, transparent 55deg)',
          transformOrigin: 'top left'
        }}
      />

      {/* VISUAL STORYTELLING: Abstract Floating Memory Fragments (3-5% Opacity, Drifting Softly) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        
        {/* Fragment 1: Instagram Reel snippet (Upper Left) */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            x: [0, 8, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] left-[6%] w-36 p-2 rounded-xl bg-zinc-900/30 border border-white/[0.05] shadow-2xl backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500">
            <Instagram className="w-2.5 h-2.5 text-zinc-500" />
            <span className="text-[9px] font-mono tracking-tight text-zinc-600">@movie.recs</span>
          </div>
          <div className="w-full h-10 bg-zinc-800/20 rounded-md mb-1" />
          <div className="w-3/4 h-1 bg-zinc-700/20 rounded" />
        </motion.div>

        {/* Fragment 2: YouTube Recommendation (Upper Right) */}
        <motion.div
          animate={{
            y: [0, 10, 0],
            x: [0, -6, 0],
            opacity: [0.03, 0.055, 0.03],
          }}
          transition={{ duration: 48, delay: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[22%] right-[7%] w-40 p-2 rounded-xl bg-zinc-900/30 border border-white/[0.05] shadow-2xl backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500">
            <Youtube className="w-2.5 h-2.5 text-zinc-500" />
            <span className="text-[9px] font-mono tracking-tight text-zinc-600">Must Watch Sci-Fi</span>
          </div>
          <div className="w-full h-12 bg-zinc-800/20 rounded-md" />
        </motion.div>

        {/* Fragment 3: WhatsApp Recommendation Bubble (Mid Left) */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.025, 0.045, 0.025],
          }}
          transition={{ duration: 52, delay: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[52%] left-[4%] w-44 p-2.5 rounded-2xl bg-zinc-900/30 border border-white/[0.05] backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-1.5 mb-1 text-zinc-500">
            <MessageCircle className="w-2.5 h-2.5 text-zinc-500" />
            <span className="text-[9px] font-mono tracking-tight text-zinc-600">Alex</span>
          </div>
          <p className="text-[9.5px] text-zinc-600 font-sans leading-tight italic">
            "Watch Interstellar tonight!"
          </p>
        </motion.div>

        {/* Fragment 4: Podcast Episode Silhouette (Mid Right) */}
        <motion.div
          animate={{
            y: [0, 14, 0],
            x: [0, -8, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 46, delay: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[54%] right-[5%] w-36 p-2 rounded-xl bg-zinc-900/30 border border-white/[0.05] backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500">
            <Mic className="w-2.5 h-2.5 text-zinc-500" />
            <span className="text-[9px] font-mono tracking-tight text-zinc-600">Film Club Ep. 142</span>
          </div>
          <div className="w-full h-1 bg-zinc-700/20 rounded mb-1" />
          <div className="w-1/2 h-1 bg-zinc-700/20 rounded" />
        </motion.div>

        {/* Fragment 5: Notes App Snippet (Lower Left) */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 6, 0],
            opacity: [0.025, 0.045, 0.025],
          }}
          transition={{ duration: 50, delay: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[72%] left-[8%] w-32 p-2 rounded-lg bg-zinc-900/20 border border-white/[0.04]"
        >
          <div className="flex items-center gap-1 mb-1 text-zinc-600">
            <FileText className="w-2.5 h-2.5" />
            <span className="text-[8.5px] font-mono text-zinc-600">Notes</span>
          </div>
          <div className="w-full h-1 bg-zinc-700/20 rounded mb-1" />
          <div className="w-2/3 h-1 bg-zinc-700/20 rounded" />
        </motion.div>

        {/* Fragment 6: Reddit Thread Snippet (Lower Right) */}
        <motion.div
          animate={{
            y: [0, 12, 0],
            x: [0, -6, 0],
            opacity: [0.025, 0.045, 0.025],
          }}
          transition={{ duration: 55, delay: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[74%] right-[8%] w-36 p-2 rounded-lg bg-zinc-900/20 border border-white/[0.04]"
        >
          <div className="flex items-center gap-1 mb-1 text-zinc-600">
            <Share2 className="w-2.5 h-2.5" />
            <span className="text-[8.5px] font-mono text-zinc-600">r/MovieSuggestions</span>
          </div>
          <div className="w-3/4 h-1 bg-zinc-700/20 rounded" />
        </motion.div>

      </div>

      {/* FLOATING DUST PARTICLES: Tiny illuminated particles drifting slowly in projector light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.01, y: 0, x: 0 }}
            animate={{
              opacity: [0.01, 0.042, 0.01],
              y: [0, p.yOffset, 0],
              x: [0, p.xOffset, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: '#E2E8F0',
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
              filter: 'blur(0.4px)'
            }}
          />
        ))}
      </div>

      {/* CINEMATIC FILM GRAIN: Fine SVG procedural noise layer */}
      <svg className="hidden">
        <filter id="cinema-atmosphere-grain">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.85" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <motion.div
        animate={{
          x: [0, 1.2, -1, 0.8, 0],
          y: [0, -0.8, 1, -0.5, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -inset-[5%] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          filter: 'url(#cinema-atmosphere-grain)',
          background: 'rgba(255, 255, 255, 0.1)'
        }}
      />

      {/* LIGHT FALLOFF & CINEMATIC VIGNETTE: Smooth darkening of all 4 edges */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(5, 5, 5, 0.5) 70%, rgba(5, 5, 5, 0.92) 100%)'
        }}
      />

      {/* Outer Feathered Edge Curtains (Blending into outer space) */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />
    </div>
  );
}
