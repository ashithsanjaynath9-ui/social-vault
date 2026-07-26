/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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

// Curated collection of iconic film quotes & behind-the-scenes facts
const CURATED_QUOTES: QuoteItem[] = [
  // User Requested Classics
  {
    id: 'starwars-1',
    type: 'quote',
    quote: '"May the Force be with you."',
    movie: '— STAR WARS',
    category: 'inspirational',
  },
  {
    id: 'dark-knight-2',
    type: 'quote',
    quote: '"Why so serious?"',
    movie: '— THE DARK KNIGHT',
    category: 'funny',
  },
  {
    id: 'godfather-2',
    type: 'quote',
    quote: '"I\'m gonna make him an offer he can\'t refuse."',
    movie: '— THE GODFATHER',
    category: 'inspirational',
  },
  {
    id: 'ferris-1',
    type: 'quote',
    quote: '"Life moves pretty fast. If you don\'t stop and look around once in a while, you could miss it."',
    movie: '— FERRIS BUELLER\'S DAY OFF',
    category: 'inspirational',
  },
  {
    id: 'whiplash-2',
    type: 'quote',
    quote: '"Not quite my tempo."',
    movie: '— WHIPLASH',
    category: 'funny',
  },
  {
    id: 'prestige-1',
    type: 'quote',
    quote: '"Are you watching closely?"',
    movie: '— THE PRESTIGE',
    category: 'inspirational',
  },
  {
    id: 'interstellar-2',
    type: 'quote',
    quote: '"Love is the one thing that transcends dimensions of time and space."',
    movie: '— INTERSTELLAR',
    category: 'inspirational',
  },
  {
    id: 'casablanca-1',
    type: 'quote',
    quote: '"Here\'s looking at you, kid."',
    movie: '— CASABLANCA',
    category: 'inspirational',
  },
  {
    id: 'terminator-1',
    type: 'quote',
    quote: '"I\'ll be back."',
    movie: '— THE TERMINATOR',
    category: 'funny',
  },
  {
    id: 'terminator-2',
    type: 'quote',
    quote: '"Hasta la vista, baby."',
    movie: '— TERMINATOR 2: JUDGMENT DAY',
    category: 'funny',
  },
  {
    id: 'sixthsense-1',
    type: 'quote',
    quote: '"I see dead people."',
    movie: '— THE SIXTH SENSE',
    category: 'inspirational',
  },
  {
    id: 'lotr-1',
    type: 'quote',
    quote: '"My precious."',
    movie: '— THE LORD OF THE RINGS',
    category: 'funny',
  },

  // Additional Cinema Masterpieces
  {
    id: 'interstellar-1',
    type: 'quote',
    quote: '"We used to look up at the sky and wonder at our place in the stars."',
    movie: '— INTERSTELLAR',
    category: 'inspirational',
  },
  {
    id: 'dark-knight-1',
    type: 'quote',
    quote: '"Why do we fall, Bruce?\nSo we can learn to pick ourselves up."',
    movie: '— THE DARK KNIGHT',
    category: 'inspirational',
  },
  {
    id: 'lalaland-1',
    type: 'quote',
    quote: '"Here\'s to the fools who dream, crazy as they may seem."',
    movie: '— LA LA LAND',
    category: 'inspirational',
  },
  {
    id: 'whiplash-1',
    type: 'quote',
    quote: '"There are no two words in the English language more harmful than \'good job\'."',
    movie: '— WHIPLASH',
    category: 'inspirational',
  },
  {
    id: 'spiritedaway-1',
    type: 'quote',
    quote: '"Once you\'ve met someone you never really forget them. It just takes a while for your memories to return."',
    movie: '— SPIRITED AWAY',
    category: 'inspirational',
  },
  {
    id: 'godfather-1',
    type: 'quote',
    quote: '"Great men are not born great, they grow great."',
    movie: '— THE GODFATHER',
    category: 'inspirational',
  },
  {
    id: 'inception-1',
    type: 'quote',
    quote: '"You mustn\'t be afraid to dream a little bigger, darling."',
    movie: '— INCEPTION',
    category: 'funny',
  },
  {
    id: 'goodwillhunting-1',
    type: 'quote',
    quote: '"You\'ll have bad times, but it\'ll always wake you up to the good stuff you weren\'t paying attention to."',
    movie: '— GOOD WILL HUNTING',
    category: 'inspirational',
  },
  {
    id: 'deadpoets-1',
    type: 'quote',
    quote: '"Carpe diem. Seize the day, boys. Make your lives extraordinary."',
    movie: '— DEAD POETS SOCIETY',
    category: 'inspirational',
  },
  {
    id: 'shawshank-1',
    type: 'quote',
    quote: '"Hope is a good thing, maybe the best of things, and no good thing ever dies."',
    movie: '— THE SHAWSHANK REDEMPTION',
    category: 'inspirational',
  },
  {
    id: 'fightclub-1',
    type: 'quote',
    quote: '"It\'s only after we\'ve lost everything that we\'re free to do anything."',
    movie: '— FIGHT CLUB',
    category: 'inspirational',
  },
  {
    id: 'grandbudapest-1',
    type: 'quote',
    quote: '"There are still faint glimmers of civilization left in this barbarous slaughterhouse."',
    movie: '— THE GRAND BUDAPEST HOTEL',
    category: 'inspirational',
  },
  {
    id: 'bladerunner-1',
    type: 'quote',
    quote: '"Dying for the right cause is the most human thing we can do."',
    movie: '— BLADE RUNNER 2049',
    category: 'inspirational',
  },
  {
    id: 'arrival-1',
    type: 'quote',
    quote: '"Despite knowing the journey and where it leads, I embrace it and welcome every moment."',
    movie: '— ARRIVAL',
    category: 'inspirational',
  },
  {
    id: 'inception-2',
    type: 'quote',
    quote: '"An idea is like a virus. Resilient. Highly contagious."',
    movie: '— INCEPTION',
    category: 'inspirational',
  },
  {
    id: 'parasite-1',
    type: 'quote',
    quote: '"You know what kind of plan never fails? No plan at all."',
    movie: '— PARASITE',
    category: 'inspirational',
  },
  {
    id: 'backtothefuture-1',
    type: 'quote',
    quote: '"Roads? Where we\'re going, we don\'t need roads."',
    movie: '— BACK TO THE FUTURE',
    category: 'funny',
  },
  {
    id: 'apollo13-1',
    type: 'quote',
    quote: '"Houston, we have a problem."',
    movie: '— APOLLO 13',
    category: 'inspirational',
  },
  {
    id: 'toystory-1',
    type: 'quote',
    quote: '"To infinity and beyond!"',
    movie: '— TOY STORY',
    category: 'inspirational',
  },
  {
    id: 'wizardofoz-1',
    type: 'quote',
    quote: '"There\'s no place like home."',
    movie: '— THE WIZARD OF OZ',
    category: 'inspirational',
  },
  {
    id: 'godfather2-1',
    type: 'quote',
    quote: '"Keep your friends close, but your enemies closer."',
    movie: '— THE GODFATHER PART II',
    category: 'inspirational',
  },
  {
    id: 'jerrymaguire-1',
    type: 'quote',
    quote: '"Show me the money!"',
    movie: '— JERRY MAGUIRE',
    category: 'funny',
  },
  {
    id: 'findingnemo-1',
    type: 'quote',
    quote: '"Just keep swimming."',
    movie: '— FINDING NEMO',
    category: 'inspirational',
  },
];

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
];

export default function CinematicEasterEggs() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeContent, setActiveContent] = useState<EggContent>(CURATED_QUOTES[0]);
  const lastIdRef = useRef<string | null>(null);

  // Custom calm ease curve [0.22, 1, 0.36, 1]
  const calmEase = [0.22, 1, 0.36, 1];

  const handleMouseEnter = () => {
    // 20% chance for BTS, 80% chance for Quote
    const isBts = Math.random() < 0.2;
    const pool: EggContent[] = isBts ? CURATED_BTS : CURATED_QUOTES;
    const available = pool.filter((item) => item.id !== lastIdRef.current);
    const selected = available[Math.floor(Math.random() * available.length)] || pool[0];

    lastIdRef.current = selected.id;
    setActiveContent(selected);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="absolute top-[2.2rem] right-[2rem] z-30 pointer-events-auto select-none">
      <div
        className="relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Single Subtle Cinematic Icon (🎞️) - Size 15px, 50% opacity resting state */}
        <motion.div
          animate={
            isHovered
              ? { opacity: 1, scale: 1.15, rotate: -3 }
              : {
                  opacity: [0.45, 0.55, 0.45],
                  scale: 1,
                  y: [0, -1.5, 0],
                }
          }
          transition={
            isHovered
              ? { duration: 0.28, ease: calmEase }
              : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }
          className="p-1 rounded-md text-[15px] opacity-50 hover:opacity-100 text-[#a594fd] hover:text-[#c3b8ff] hover:bg-[#a594fd]/10 hover:shadow-[0_0_16px_rgba(165,148,253,0.35)] transition-all duration-300 filter leading-none flex items-center justify-center"
          title=""
        >
          🎞️
        </motion.div>

        {/* Floating Glassmorphism Quote / BTS Bubble */}
        <AnimatePresence>
          {isHovered && activeContent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-1/2 -translate-y-1/2 right-full mr-3.5 z-40 pointer-events-none w-[270px]"
            >
              <div className="p-4 rounded-2xl bg-[#0a0b12]/90 border border-[#a594fd]/30 shadow-[0_16px_40px_rgba(0,0,0,0.75),0_0_20px_rgba(165,148,253,0.15)] backdrop-blur-2xl text-left">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-[#a594fd]">
                    <span className="text-[11px] leading-none">🎞️</span>
                    <span className="text-[9px] font-mono tracking-widest text-[#a594fd] uppercase font-bold">
                      Cinematic Reel
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">#01</span>
                </div>

                {/* Content type conditional rendering */}
                {activeContent.type === 'bts' ? (
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[9px] font-mono font-medium tracking-wide mb-2">
                      <span>🎬</span>
                      <span>Behind the Scene</span>
                    </div>
                    <p className="font-sans text-zinc-200 text-[11.5px] leading-relaxed">
                      {activeContent.fact}
                    </p>
                  </div>
                ) : (
                  <p className="font-serif italic text-zinc-100 text-[12.5px] leading-relaxed whitespace-pre-line">
                    {activeContent.quote}
                  </p>
                )}

                {/* Movie Title */}
                <span className="font-sans font-semibold text-[9.5px] tracking-widest text-[#a594fd] uppercase block mt-2.5">
                  {activeContent.movie}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
