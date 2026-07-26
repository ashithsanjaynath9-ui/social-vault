/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteItem {
  id: string;
  type: 'quote';
  quote: string;
  movie: string;
  category: 'inspirational' | 'funny';
}

interface BehindTheSceneItem {
  id: string;
  type: 'bts';
  fact: string;
  movie: string;
}

type EggContent = QuoteItem | BehindTheSceneItem;

interface ArtifactDef {
  id: string;
  number: string;
  title: string;
  positionClass: string;
  cardAlignClass: string;
  rotationDeg: number;
  floatDuration: number;
  floatDelay: number;
  svg: React.ReactNode;
}

// Curated collection of iconic film quotes (~80% probability)
const CURATED_QUOTES: QuoteItem[] = [
  // INTERSTELLAR
  {
    id: 'interstellar-1',
    type: 'quote',
    quote: '"We used to look up at the sky and wonder at our place in the stars."',
    movie: '— INTERSTELLAR',
    category: 'inspirational',
  },
  {
    id: 'interstellar-2',
    type: 'quote',
    quote: '"Love is the one thing we\'re capable of perceiving that transcends dimensions of time and space."',
    movie: '— INTERSTELLAR',
    category: 'inspirational',
  },

  // THE PRESTIGE
  {
    id: 'prestige-1',
    type: 'quote',
    quote: '"Are you watching closely?"',
    movie: '— THE PRESTIGE',
    category: 'inspirational',
  },

  // THE DARK KNIGHT
  {
    id: 'dark-knight-1',
    type: 'quote',
    quote: '"Why do we fall, Bruce?\nSo we can learn to pick ourselves up."',
    movie: '— THE DARK KNIGHT',
    category: 'inspirational',
  },
  {
    id: 'dark-knight-2',
    type: 'quote',
    quote: '"It\'s not who I am underneath, but what I do that defines me."',
    movie: '— THE DARK KNIGHT',
    category: 'inspirational',
  },

  // WHIPLASH
  {
    id: 'whiplash-1',
    type: 'quote',
    quote: '"There are no two words in the English language more harmful than \'good job\'."',
    movie: '— WHIPLASH',
    category: 'inspirational',
  },

  // LA LA LAND
  {
    id: 'lalaland-1',
    type: 'quote',
    quote: '"Here\'s to the fools who dream, crazy as they may seem."',
    movie: '— LA LA LAND',
    category: 'inspirational',
  },
  {
    id: 'lalaland-2',
    type: 'quote',
    quote: '"People love what other people are passionate about."',
    movie: '— LA LA LAND',
    category: 'inspirational',
  },

  // SPIRITED AWAY
  {
    id: 'spiritedaway-1',
    type: 'quote',
    quote: '"Once you\'ve met someone you never really forget them. It just takes a while for your memories to return."',
    movie: '— SPIRITED AWAY',
    category: 'inspirational',
  },

  // THE GODFATHER
  {
    id: 'godfather-1',
    type: 'quote',
    quote: '"Great men are not born great, they grow great."',
    movie: '— THE GODFATHER',
    category: 'inspirational',
  },
  {
    id: 'godfather-2',
    type: 'quote',
    quote: '"Leave the gun. Take the cannoli."',
    movie: '— THE GODFATHER',
    category: 'funny',
  },

  // FIGHT CLUB
  {
    id: 'fightclub-1',
    type: 'quote',
    quote: '"It\'s only after we\'ve lost everything that we\'re free to do anything."',
    movie: '— FIGHT CLUB',
    category: 'inspirational',
  },

  // THE GRAND BUDAPEST HOTEL
  {
    id: 'grandbudapest-1',
    type: 'quote',
    quote: '"There are still faint glimmers of civilization left in this barbarous slaughterhouse."',
    movie: '— THE GRAND BUDAPEST HOTEL',
    category: 'inspirational',
  },

  // BLADE RUNNER 2049
  {
    id: 'bladerunner-1',
    type: 'quote',
    quote: '"Dying for the right cause is the most human thing we can do."',
    movie: '— BLADE RUNNER 2049',
    category: 'inspirational',
  },

  // ARRIVAL
  {
    id: 'arrival-1',
    type: 'quote',
    quote: '"Despite knowing the journey and where it leads, I embrace it and welcome every moment."',
    movie: '— ARRIVAL',
    category: 'inspirational',
  },

  // INCEPTION
  {
    id: 'inception-1',
    type: 'quote',
    quote: '"An idea is like a virus. Resilient. Highly contagious."',
    movie: '— INCEPTION',
    category: 'inspirational',
  },
  {
    id: 'inception-2',
    type: 'quote',
    quote: '"You mustn\'t be afraid to dream a little bigger, darling."',
    movie: '— INCEPTION',
    category: 'funny',
  },

  // PARASITE
  {
    id: 'parasite-1',
    type: 'quote',
    quote: '"You know what kind of plan never fails? No plan at all."',
    movie: '— PARASITE',
    category: 'inspirational',
  },

  // GOOD WILL HUNTING
  {
    id: 'goodwillhunting-1',
    type: 'quote',
    quote: '"You\'ll have bad times, but it\'ll always wake you up to the good stuff you weren\'t paying attention to."',
    movie: '— GOOD WILL HUNTING',
    category: 'inspirational',
  },
  {
    id: 'goodwillhunting-2',
    type: 'quote',
    quote: '"How do you like them apples?"',
    movie: '— GOOD WILL HUNTING',
    category: 'funny',
  },

  // DEAD POETS SOCIETY
  {
    id: 'deadpoets-1',
    type: 'quote',
    quote: '"Carpe diem. Seize the day, boys. Make your lives extraordinary."',
    movie: '— DEAD POETS SOCIETY',
    category: 'inspirational',
  },

  // THE SHAWSHANK REDEMPTION
  {
    id: 'shawshank-1',
    type: 'quote',
    quote: '"Hope is a good thing, maybe the best of things, and no good thing ever dies."',
    movie: '— THE SHAWSHANK REDEMPTION',
    category: 'inspirational',
  },
];

// Curated Behind The Scene Facts (~20% probability)
const CURATED_BTS: BehindTheSceneItem[] = [
  {
    id: 'bts-interstellar-1',
    type: 'bts',
    fact: 'The bookshelf in Interstellar was built as a practical set rather than CGI.',
    movie: '— INTERSTELLAR',
  },
  {
    id: 'bts-darkknight-1',
    type: 'bts',
    fact: 'Heath Ledger stayed in character throughout shoot days, even directing IMAX camera operators himself for home video tape scenes.',
    movie: '— THE DARK KNIGHT',
  },
  {
    id: 'bts-inception-1',
    type: 'bts',
    fact: 'The hallway gravity sequence was filmed inside a massive revolving centrifuge tube built inside an airship hangar.',
    movie: '— INCEPTION',
  },
  {
    id: 'bts-prestige-1',
    type: 'bts',
    fact: 'David Bowie was Christopher Nolan\'s only choice for Nikola Tesla; Nolan personally flew to New York to convince him.',
    movie: '— THE PRESTIGE',
  },
  {
    id: 'bts-whiplash-1',
    type: 'bts',
    fact: 'Miles Teller performed all drum parts during his takes, blistering his hands so severely that genuine blood stained the kit.',
    movie: '— WHIPLASH',
  },
  {
    id: 'bts-grandbudapest-1',
    type: 'bts',
    fact: 'Three distinct aspect ratios were used across the film to visually communicate three different historical time periods.',
    movie: '— THE GRAND BUDAPEST HOTEL',
  },
  {
    id: 'bts-spiritedaway-1',
    type: 'bts',
    fact: 'Hayao Miyazaki produced Spirited Away without a finished script, drawing storyboards sequentially as production moved forward.',
    movie: '— SPIRITED AWAY',
  },
  {
    id: 'bts-bladerunner-1',
    type: 'bts',
    fact: 'Roger Deakins spent weeks positioning practical lights for the yellow Las Vegas scenes without relying on digital color manipulation.',
    movie: '— BLADE RUNNER 2049',
  },
];

export default function CinematicEasterEggs() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContents, setActiveContents] = useState<Record<string, EggContent>>({});
  
  // Set of discovered artifact IDs (starts with 2 default discovered)
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(
    () => new Set(['vintage-projector', 'film-reel'])
  );

  // Set of newly unlocked IDs for triggering delicate discovery shimmer
  const [justDiscoveredIds, setJustDiscoveredIds] = useState<Set<string>>(new Set());

  // Ref to track the last displayed item ID across any hover
  const lastContentIdRef = useRef<string | null>(null);

  // Custom calm ease curve [0.22, 1, 0.36, 1]
  const calmEase = [0.22, 1, 0.36, 1];

  // Helper function to safely unlock an artifact
  const unlockArtifact = (id: string) => {
    setDiscoveredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    setJustDiscoveredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Clear the "just discovered" aura after 1.8 seconds
    setTimeout(() => {
      setJustDiscoveredIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1800);
  };

  // 1. Time-based unlocks (Remaining on the homepage)
  useEffect(() => {
    const timer1 = setTimeout(() => {
      unlockArtifact('cinema-ticket');
    }, 5000);

    const timer2 = setTimeout(() => {
      unlockArtifact('oscar-statuette');
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // 2. Scroll-based unlocks
  useEffect(() => {
    let totalScrollDelta = 0;
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastY);
      totalScrollDelta += delta;
      lastY = currentY;

      if (currentY > 25) {
        unlockArtifact('clapperboard');
      }
      if (currentY > 100) {
        unlockArtifact('film-strip');
      }
      if (totalScrollDelta > 120) {
        unlockArtifact('shooting-star');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Mouse Movement tracking (Cumulative cursor travel)
  useEffect(() => {
    let totalDistance = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (lastX !== null && lastY !== null) {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        totalDistance += dist;
      }
      lastX = e.clientX;
      lastY = e.clientY;

      if (totalDistance > 500) {
        unlockArtifact('director-chair');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 4. Poster & Interactive Element Hovering
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isPosterOrCard =
        target.tagName === 'IMG' ||
        target.closest('img') !== null ||
        target.closest('[data-poster]') !== null ||
        target.closest('.group') !== null ||
        target.closest('button') !== null;

      if (isPosterOrCard) {
        unlockArtifact('popcorn-bucket');
        unlockArtifact('movie-camera');
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  const handleMouseEnter = (artifactId: string) => {
    // Direct hover on any undiscovered artifact immediately unlocks it
    unlockArtifact(artifactId);

    // 20% probability for Behind The Scene, 80% probability for Quote
    const isBts = Math.random() < 0.20;

    let pool: EggContent[] = isBts ? CURATED_BTS : CURATED_QUOTES;
    let available = pool.filter((item) => item.id !== lastContentIdRef.current);
    if (available.length === 0) {
      available = pool;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex] || pool[0];

    lastContentIdRef.current = selected.id;
    setActiveContents((prev) => ({ ...prev, [artifactId]: selected }));
    setActiveId(artifactId);
  };

  const handleMouseLeave = () => {
    setActiveId(null);
  };

  // 10 Tiny Monochrome-Purple Cinematic Artifacts (12–18px)
  const artifacts: ArtifactDef[] = [
    {
      id: 'vintage-projector',
      number: '01',
      title: '35mm Arc Lamp Projector',
      positionClass: 'top-[7%] left-[3%]',
      cardAlignClass: 'top-full left-0 mt-2',
      rotationDeg: -3,
      floatDuration: 10,
      floatDelay: 0,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="4" r="2.2" stroke="currentColor" strokeWidth="1" />
          <circle cx="5" cy="4" r="0.8" fill="currentColor" />
          <circle cx="11" cy="4" r="2.2" stroke="currentColor" strokeWidth="1" />
          <circle cx="11" cy="4" r="0.8" fill="currentColor" />
          <rect x="4" y="7" width="8" height="5" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M12 8.5L15 7V12L12 10.5V8.5Z" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M6 12L5 14.5H11L10 12" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'film-reel',
      number: '02',
      title: 'Gold-Master Film Spool',
      positionClass: 'top-[7%] right-[3%]',
      cardAlignClass: 'top-full right-0 mt-2',
      rotationDeg: 4,
      floatDuration: 12,
      floatDelay: 1.5,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
          <circle cx="8" cy="4.2" r="1" fill="currentColor" />
          <circle cx="8" cy="11.8" r="1" fill="currentColor" />
          <circle cx="4.2" cy="8" r="1" fill="currentColor" />
          <circle cx="11.8" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'clapperboard',
      number: '03',
      title: 'Precision Slate',
      positionClass: 'bottom-[4%] left-[3.5%]',
      cardAlignClass: 'bottom-full left-0 mb-2',
      rotationDeg: -4,
      floatDuration: 9,
      floatDelay: 2.8,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6.5" width="12" height="7.5" rx="0.5" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1" />
          <path d="M2 5.5L14 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2" y1="5.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'cinema-ticket',
      number: '04',
      title: 'Midnight Premiere Stub',
      positionClass: 'bottom-[4%] right-[3.5%]',
      cardAlignClass: 'bottom-full right-0 mb-2',
      rotationDeg: 3,
      floatDuration: 14,
      floatDelay: 0.6,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4.5C2.8 4.5 3.5 5.2 3.5 6C3.5 6.8 2.8 7.5 2 7.5V11.5H14V7.5C13.2 7.5 12.5 6.8 12.5 6C12.5 5.2 13.2 4.5 14 4.5V4.5H2Z" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="8" y1="4.5" x2="8" y2="11.5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        </svg>
      ),
    },
    {
      id: 'popcorn-bucket',
      number: '05',
      title: 'Art Deco Concession Vault',
      positionClass: 'top-[52%] left-[2%]',
      cardAlignClass: 'top-1/2 -translate-y-1/2 left-full ml-3',
      rotationDeg: -2,
      floatDuration: 11,
      floatDelay: 3.2,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6.5L5 14H11L12 6.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M3.5 6.5C3.5 5.2 4.5 4.5 5.5 5C6 4.2 7 4 8 4.5C9 4 10 4.2 10.5 5C11.5 4.5 12.5 5.2 12.5 6.5" stroke="currentColor" strokeWidth="1" />
          <line x1="6.5" y1="7" x2="7" y2="13.5" stroke="currentColor" strokeWidth="0.8" />
          <line x1="9.5" y1="7" x2="9" y2="13.5" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      id: 'director-chair',
      number: '06',
      title: "Director's Folding Seat",
      positionClass: 'top-[52%] right-[2%]',
      cardAlignClass: 'top-1/2 -translate-y-1/2 right-full mr-3',
      rotationDeg: 3,
      floatDuration: 13,
      floatDelay: 1.8,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="3" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.2" />
          <line x1="3" y1="3" x2="3" y2="7" stroke="currentColor" strokeWidth="1" />
          <line x1="13" y1="3" x2="13" y2="7" stroke="currentColor" strokeWidth="1" />
          <rect x="2.5" y="7" width="11" height="1.5" rx="0.3" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8" />
          <line x1="3.5" y1="8.5" x2="12.5" y2="14.5" stroke="currentColor" strokeWidth="1" />
          <line x1="12.5" y1="8.5" x2="3.5" y2="14.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'film-strip',
      number: '07',
      title: '70mm IMAX Film Strip',
      positionClass: 'top-[2%] left-[50%] -translate-x-1/2',
      cardAlignClass: 'top-full left-1/2 -translate-x-1/2 mt-2',
      rotationDeg: -3,
      floatDuration: 10.5,
      floatDelay: 2.2,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="2" width="10" height="12" rx="0.5" stroke="currentColor" strokeWidth="1" />
          <rect x="4" y="3.5" width="1" height="1.2" fill="currentColor" />
          <rect x="4" y="7.4" width="1" height="1.2" fill="currentColor" />
          <rect x="4" y="11.3" width="1" height="1.2" fill="currentColor" />
          <rect x="11" y="3.5" width="1" height="1.2" fill="currentColor" />
          <rect x="11" y="7.4" width="1" height="1.2" fill="currentColor" />
          <rect x="11" y="11.3" width="1" height="1.2" fill="currentColor" />
          <line x1="5.5" y1="6" x2="10.5" y2="6" stroke="currentColor" strokeWidth="0.8" />
          <line x1="5.5" y1="10" x2="10.5" y2="10" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      id: 'movie-camera',
      number: '08',
      title: 'Technicolor Studio Camera',
      positionClass: 'top-[22%] left-[2.5%]',
      cardAlignClass: 'top-0 left-full ml-3',
      rotationDeg: 4,
      floatDuration: 12.5,
      floatDelay: 0.4,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="4" r="2.2" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="9" cy="4" r="2.2" stroke="currentColor" strokeWidth="0.9" />
          <rect x="3" y="6" width="8" height="5" rx="0.5" stroke="currentColor" strokeWidth="1" />
          <path d="M11 7.5L14 6V11L11 9.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M7 11V14.5M5 14.5H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'oscar-statuette',
      number: '09',
      title: 'Academy Statuette Silhouette',
      positionClass: 'top-[22%] right-[2.5%]',
      cardAlignClass: 'top-0 right-full mr-3',
      rotationDeg: 2,
      floatDuration: 11.5,
      floatDelay: 2.9,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="3" r="1.2" stroke="currentColor" strokeWidth="1" />
          <path d="M8 4.2V9.5M6.5 5.5H9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8" />
          <path d="M7 9.5L6.5 13M9 9.5L9.5 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="8" cy="13.5" rx="3" ry="1" stroke="currentColor" strokeWidth="0.9" fill="none" />
        </svg>
      ),
    },
    {
      id: 'shooting-star',
      number: '10',
      title: 'Paramount Celestial Spark',
      positionClass: 'bottom-[12%] left-[50%] -translate-x-1/2',
      cardAlignClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      rotationDeg: -4,
      floatDuration: 13.5,
      floatDelay: 1.1,
      svg: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1V15M1 8H15M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
          <path d="M8 3.5C8 6 6 8 3.5 8C6 8 8 10 8 12.5C8 10 10 8 12.5 8C10 8 8 6 8 3.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none overflow-hidden">
      {artifacts.map((item) => {
        const isDiscovered = discoveredIds.has(item.id);
        const isJustDiscovered = justDiscoveredIds.has(item.id);
        const isActive = activeId === item.id;
        const currentContent = activeContents[item.id];

        return (
          <div
            key={item.id}
            className={`absolute ${item.positionClass} pointer-events-auto cursor-pointer group`}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Discovery Pulse Ring when unlocked */}
            <AnimatePresence>
              {isJustDiscovered && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-[#a594fd]/70 bg-[#a594fd]/20 pointer-events-none shadow-[0_0_20px_rgba(165,148,253,0.5)]"
                />
              )}
            </AnimatePresence>

            {/* The Tiny Monochrome-Purple Artifact Icon */}
            <motion.div
              initial={false}
              animate={
                !isDiscovered
                  ? {
                      opacity: 0,
                      scale: 0.8,
                    }
                  : isActive
                  ? {
                      opacity: 1,
                      scale: 1.15,
                      rotate: item.rotationDeg,
                      y: 0,
                    }
                  : {
                      opacity: [0.38, 0.58, 0.42, 0.54, 0.38],
                      scale: 1,
                      y: [0, -2.5, 0, 1.8, 0],
                      rotate: [0, 1.2, -1.5, 0.8, 0],
                    }
              }
              transition={
                !isDiscovered
                  ? { duration: 0.3 }
                  : isActive
                  ? {
                      duration: 0.28,
                      ease: calmEase,
                    }
                  : {
                      duration: item.floatDuration,
                      delay: item.floatDelay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              className={`p-1.5 rounded-lg transition-all duration-300 filter ${
                isDiscovered
                  ? 'text-[#a594fd] hover:text-[#c3b8ff] hover:bg-[#a594fd]/10 hover:shadow-[0_0_16px_rgba(165,148,253,0.35)] hover:backdrop-blur-sm hover:brightness-125'
                  : 'text-transparent hover:text-[#a594fd]/30'
              }`}
            >
              {item.svg}
            </motion.div>

            {/* Floating Glassmorphism Quote/BTS Bubble */}
            <AnimatePresence>
              {isDiscovered && isActive && currentContent && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{
                    duration: 0.28,
                    ease: calmEase,
                  }}
                  className={`absolute ${item.cardAlignClass} z-40 pointer-events-none min-w-[220px] max-w-[280px]`}
                >
                  <div className="p-4 rounded-2xl bg-[#0a0b10]/92 border border-[#a594fd]/30 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(165,148,253,0.18)] backdrop-blur-2xl text-left">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-white/5">
                      <div className="flex items-center gap-1.5 text-[#a594fd]">
                        <span className="p-1 rounded-md bg-[#a594fd]/15 border border-[#a594fd]/20">
                          {item.svg}
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-[#a594fd] uppercase font-bold">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        #{item.number}
                      </span>
                    </div>

                    {/* Content type conditional rendering */}
                    {currentContent.type === 'bts' ? (
                      <div>
                        {/* BTS Label */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[9px] font-mono font-medium tracking-wide mb-2">
                          <span>🎬</span>
                          <span>Behind the Scene</span>
                        </div>
                        {/* BTS Fact Text */}
                        <p className="font-sans text-zinc-200 text-[11.5px] leading-relaxed">
                          {currentContent.fact}
                        </p>
                      </div>
                    ) : (
                      /* Quote Typography */
                      <p className="font-serif italic text-zinc-100 text-[12.5px] leading-relaxed whitespace-pre-line">
                        {currentContent.quote}
                      </p>
                    )}

                    {/* Movie Title (Small Uppercase Sans-Serif) */}
                    <span className="font-sans font-semibold text-[9.5px] tracking-widest text-[#a594fd] uppercase block mt-2.5">
                      {currentContent.movie}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
