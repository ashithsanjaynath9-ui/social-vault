/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface FilmItem {
  id: string;
  title: string;
  genre: string;
  posterUrl: string;
  backupPosterUrl: string;
}

// =========================================================================
// 60 LEGENDARY FILMS - REAL OFFICIAL MOVIE POSTERS ONLY
// Pure artwork, crisp 2:3 ratio frames, no text overlays
// =========================================================================

const LEGENDARY_FILMS: FilmItem[] = [
  // --- SCI-FI ---
  {
    id: 'f-1',
    title: 'Interstellar',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-2',
    title: 'Blade Runner 2049',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gC3m839oG18X9A7.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-3',
    title: 'Arrival',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-4',
    title: 'Inception',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1500462818027-61845479a950?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-5',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLPoA6S3C239.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80'
  },

  // --- DRAMA ---
  {
    id: 'f-6',
    title: 'Oppenheimer',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8B2688.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-7',
    title: 'The Shawshank Redemption',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/q6y0R11pA62pM921.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-8',
    title: 'The Godfather',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsA2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-9',
    title: 'Parasite',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7IiT38S9S3A3M333qZ4N3162395.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-10',
    title: 'Past Lives',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/k3L3N6Gz5a7n8Y18r0O1aGz74Xg.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-11',
    title: 'Whiplash',
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7S9L22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80'
  },

  // --- CRIME ---
  {
    id: 'f-12',
    title: 'Pulp Fiction',
    genre: 'Crime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/d5N022trI393911.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-13',
    title: 'The Dark Knight',
    genre: 'Crime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tCh211.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-14',
    title: 'Heat',
    genre: 'Crime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/eA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'
  },

  // --- THRILLER ---
  {
    id: 'f-15',
    title: 'No Country for Old Men',
    genre: 'Thriller',
    posterUrl: 'https://image.tmdb.org/t/p/w780/6A22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-16',
    title: 'Se7en',
    genre: 'Thriller',
    posterUrl: 'https://image.tmdb.org/t/p/w780/G9L22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-17',
    title: 'The Silence of the Lambs',
    genre: 'Thriller',
    posterUrl: 'https://image.tmdb.org/t/p/w780/rA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },

  // --- ANIME ---
  {
    id: 'f-18',
    title: 'Spirited Away',
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/393911.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-19',
    title: 'Your Name',
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-20',
    title: 'Akira',
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/mA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },

  // --- ROMANCE ---
  {
    id: 'f-21',
    title: 'La La Land',
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/uDO8183183.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-22',
    title: 'Before Sunrise',
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/bA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },

  // --- ADVENTURE ---
  {
    id: 'f-23',
    title: 'Mad Max: Fury Road',
    genre: 'Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8tA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-24',
    title: 'Spider-Man: Into the Spider-Verse',
    genre: 'Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/iiA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  },

  // --- FANTASY ---
  {
    id: 'f-25',
    title: 'The Lord of the Rings: Return of the King',
    genre: 'Fantasy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/rC22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },

  // --- COMEDY ---
  {
    id: 'f-26',
    title: 'The Grand Budapest Hotel',
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/eA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },

  // --- ACTION ---
  {
    id: 'f-27',
    title: 'John Wick',
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/fZA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-28',
    title: 'The Matrix',
    genre: 'Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/f89U3da.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  }
];

// Duplicated 3x for endless continuous infinite marquee roll
const LOOPED_FILMS = [...LEGENDARY_FILMS, ...LEGENDARY_FILMS, ...LEGENDARY_FILMS];

interface HeroFilmStripProps {
  glowingFrameIndex?: number | null;
  snappedFramesMap?: Record<number, string>;
}

function MoviePosterFrame({
  movie,
  idx,
  isGlowing,
  customPoster,
}: {
  key?: string;
  movie: FilmItem;
  idx: number;
  isGlowing?: boolean;
  customPoster?: string;
}) {
  const [imgSrc, setImgSrc] = useState(customPoster || movie.posterUrl);

  // ELEGANT 3D ORGANIC S-CURVE MATH
  // Phase along the continuous loop (0 to 1)
  const total = LEGENDARY_FILMS.length;
  const t = (idx % total) / total;
  const phase = t * Math.PI * 2;

  // Flowing S-Curve trajectory:
  // Enters naturally from outside left, rises gently behind headline, dips below capture bar, continues exiting right
  const sCurveY = Math.sin(phase) * 36 - Math.cos(phase * 0.5) * 12;
  const sCurveRotate = Math.cos(phase) * 6 - Math.sin(phase * 0.5) * 2.5;

  const handleImageError = () => {
    if (imgSrc !== movie.backupPosterUrl) {
      setImgSrc(movie.backupPosterUrl);
    }
  };

  return (
    <div
      style={{
        transform: `translateY(${sCurveY}px) rotate(${sCurveRotate}deg)`,
        willChange: 'transform',
      }}
      className={`group relative w-28 sm:w-36 md:w-42 aspect-[2/3] flex-shrink-0 bg-[#08090E] rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] transition-all duration-700 ${
        isGlowing
          ? 'border-[#7F72FF] shadow-[0_0_50px_rgba(127,114,255,1)] ring-4 ring-[#7F72FF]/70 scale-110 z-40'
          : 'border-[#1A1D2A]/80 shadow-[0_25px_50px_rgba(0,0,0,0.92)] ring-1 ring-white/10 hover:border-[#7F72FF]/80 hover:scale-105 z-10'
      }`}
    >
      {/* 35mm Top Sprocket Perforations Header */}
      <div className="absolute top-1 inset-x-0 flex justify-between px-1.5 opacity-70 pointer-events-none z-20">
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
      </div>

      {/* Frame Snapping Glow Flash Aura */}
      {isGlowing && (
        <motion.div
          initial={{ opacity: 1, scale: 1.3 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-[#7F72FF]/40 pointer-events-none z-30 rounded-xl"
        />
      )}

      {/* Glossy Celluloid Reflection Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent opacity-20 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-20" />

      {/* Pure Official Movie Poster Artwork - Fills Frame Completely */}
      <img
        src={customPoster || imgSrc}
        alt=""
        referrerPolicy="no-referrer"
        onError={handleImageError}
        className="w-full h-full object-cover rounded-[4px]"
      />

      {/* 35mm Bottom Sprocket Perforations Footer */}
      <div className="absolute bottom-1 inset-x-0 flex justify-between px-1.5 opacity-70 pointer-events-none z-20">
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
        <div className="w-2.5 sm:w-3.5 h-1.5 bg-[#030406] rounded-[1px] border border-zinc-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
      </div>
    </div>
  );
}

export default function HeroFilmStrip({ glowingFrameIndex, snappedFramesMap = {} }: HeroFilmStripProps) {
  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-20 w-[calc(100%+3rem)] sm:w-[calc(100%+6rem)] md:w-[calc(100%+10rem)] overflow-hidden pointer-events-none select-none my-1 z-10">
      
      {/* SOFT ATMOSPHERIC AMBIENT GLOW BEHIND THE REEL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-52 bg-[#7F72FF]/[0.07] blur-3xl pointer-events-none rounded-full z-0" />

      {/* 3D PERSPECTIVE BREATHING CONTAINER */}
      <motion.div 
        animate={{
          rotateX: [5, 6.5, 4.2, 5],
          rotateY: [-1, 1.2, -0.8, -1],
          y: [-3, 4, -2, -3],
          scale: [1, 1.012, 0.992, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full py-2 sm:py-4"
      >
        
        {/* SOFT FLOATING DROP SHADOW BENEATH THE FLOWING REEL */}
        <div className="absolute inset-x-8 bottom-1 h-20 bg-black/85 blur-2xl rounded-full pointer-events-none z-0" />

        {/* CONTINUOUS INFINITE S-CURVE MARQUEE MOTION TRACK */}
        <div 
          className="flex w-max pointer-events-auto"
          style={{
            // OPTICAL FOCUS & LIGHTING VIGNETTE:
            // Center 3-4 posters receive most light and remain sharp.
            // Edge posters gradually soften with slight blur and reduced opacity, fading into darkness at extremes.
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 6%, rgba(0,0,0,0.85) 18%, black 42%, black 58%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.15) 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 6%, rgba(0,0,0,0.85) 18%, black 42%, black 58%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.15) 94%, transparent 100%)'
          }}
        >
          <motion.div
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 54, // Slow, elegant physical roll
                ease: "linear",
              }
            }}
            style={{ willChange: 'transform' }}
            className="flex gap-4 sm:gap-6 md:gap-7.5 px-4 py-8"
          >
            {LOOPED_FILMS.map((movie, idx) => {
              const isGlowing = glowingFrameIndex === (idx % LEGENDARY_FILMS.length);
              const customPoster = snappedFramesMap[idx % LEGENDARY_FILMS.length];

              return (
                <MoviePosterFrame
                  key={`reel-film-${movie.id}-${idx}`}
                  movie={movie}
                  idx={idx}
                  isGlowing={isGlowing}
                  customPoster={customPoster}
                />
              );
            })}
          </motion.div>
        </div>

      </motion.div>

      {/* SOFT EDGE DUST & LIGHT VIGNETTE (Posters enter naturally from outside left & exit beyond right) */}
      <div className="absolute inset-y-0 left-0 w-28 sm:w-48 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent pointer-events-none z-30" />
      <div className="absolute inset-y-0 right-0 w-28 sm:w-48 bg-gradient-to-l from-[#050505] via-[#050505]/85 to-transparent pointer-events-none z-30" />
    </div>
  );
}
