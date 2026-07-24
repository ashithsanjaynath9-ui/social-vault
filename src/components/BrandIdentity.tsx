/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Clipboard, Tag, Award, Heart, Check, Compass, Eye } from 'lucide-react';

export type IdentityId = 'bookmark' | 'stub' | 'monogram' | 'shelf';

export interface IdentityDirection {
  id: IdentityId;
  name: string;
  conceptTitle: string;
  metaphor: string;
  description: string;
  typography: string;
  vibeText: string;
  logoSvg: (className?: string) => React.ReactNode;
  wordmark: (className?: string) => React.ReactNode;
}

export const IDENTITY_DIRECTIONS: IdentityDirection[] = [
  {
    id: 'bookmark',
    name: 'plot',
    conceptTitle: 'The Bookmarked Slip',
    metaphor: 'Marking a precious page to return to later.',
    description: 'A poetic, timeless concept inspired by physical ribbon bookmarks. It treats cinema not as ephemeral streams, but as chapters of a life well-lived. Saving is a quiet pause, a bookmark placed until you are ready.',
    typography: 'Newsreader Elegant Serif + Instrument Sans',
    vibeText: 'Quiet • Editorial • Warm • Introspective',
    logoSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 10C12 10 18 12 24 15C30 12 36 10 42 10V38C36 38 30 40 24 43C18 40 12 38 6 38V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30" />
        <path d="M20 12V34L24 31L28 34V12H20Z" fill="#8B80F9" stroke="#8B80F9" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M24 6V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
      </svg>
    ),
    wordmark: (className = "text-xl") => (
      <div className={`flex items-baseline select-none ${className}`}>
        <span className="font-display font-medium text-[#F2ECE3] tracking-tight lowercase">plot</span>
      </div>
    )
  },
  {
    id: 'stub',
    name: 'plot',
    conceptTitle: 'The Archive Ticket Stub',
    metaphor: 'A physical token of a screening tonight.',
    description: 'An elegant vintage movie ticket, stripped of any flashy neon or commercial noise. Beautifully proportioned with perforated edges and a punched star. It elevates movie recommendations into actual personal invites and physical, collected milestones.',
    typography: 'Instrument Sans Semibold + Spaced Monospace',
    vibeText: 'Nostalgic • Tactile • Human • Curated',
    logoSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 12H40C40 12 40 16 38 18C36 20 36 24 38 26C40 28 40 32 40 32H8C8 32 8 28 10 26C12 24 12 20 10 18C8 16 8 12 8 12Z" stroke="#8B80F9" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 17L25.8 21.2L30.2 21.5L26.8 24.4L27.9 28.8L24 26.4L20.1 28.8L21.2 24.4L17.8 21.5L22.2 21.2L24 17Z" fill="currentColor" className="text-zinc-400" />
        <line x1="14" y1="12" x2="14" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="opacity-40" />
        <line x1="34" y1="12" x2="34" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="opacity-40" />
      </svg>
    ),
    wordmark: (className = "text-xl") => (
      <div className={`flex items-baseline select-none font-sans ${className}`}>
        <span className="font-semibold text-[#8B80F9] tracking-tight lowercase">plot</span>
      </div>
    )
  },
  {
    id: 'monogram',
    name: 'plot',
    conceptTitle: 'The Curator’s Monogram',
    metaphor: 'A personal plot seal of ownership.',
    description: 'An intertwined geometric seal of ownership. Taking inspiration from classical ex-libris bookplates and personal stamps, this direction communicates pride of ownership. It is an enduring stamp that declares: “This is part of my personal plot.”',
    typography: 'Aesthetic Serifs + Fine Letterspacing',
    vibeText: 'Classic • Artisanal • Personal • Permanent',
    logoSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
        <circle cx="24" cy="24" r="16" stroke="#8B80F9" strokeWidth="1" className="opacity-20" />
        <path d="M28 17C26 15.5 21 15.5 19.5 18C18 20.5 18 27.5 19.5 30C21 32.5 26 32.5 28 31" stroke="#8B80F9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M21 19.5C23.5 18 26.5 19.5 25.5 22.5C24.5 25.5 19.5 24.5 21 28C22.5 31.5 26.5 30 27 28.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    wordmark: (className = "text-xl") => (
      <div className={`flex items-baseline select-none ${className}`}>
        <span className="font-display tracking-[0.15em] font-light text-[#8B80F9] lowercase">plot</span>
      </div>
    )
  },
  {
    id: 'shelf',
    name: 'plot',
    conceptTitle: 'The Physical Book Shelf',
    metaphor: 'Books standing together, lived-in and real.',
    description: 'A quiet, cozy visual motif of physical movie boxes or volumes resting on a warm, personal shelf. It evokes the feeling of scanning your personal collection on a lazy rainy afternoon, finding comfort in physical presence and tactile arrangements.',
    typography: 'Soft Humanist Sans + Warm Understatement',
    vibeText: 'Grounded • Cozy • Organized • Structured',
    logoSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <line x1="8" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-60" />
        <rect x="12" y="16" width="6" height="18" rx="1" fill="#8B80F9" stroke="#8B80F9" strokeWidth="1" />
        <rect x="20" y="12" width="5.5" height="22" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-zinc-450" />
        <g transform="translate(26,13) rotate(14)">
          <rect x="0" y="0" width="5.5" height="21" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-zinc-600" />
        </g>
      </svg>
    ),
    wordmark: (className = "text-xl") => (
      <div className={`flex items-baseline select-none font-sans ${className}`}>
        <span className="font-normal text-[#F2ECE3] tracking-tight lowercase">plot</span>
      </div>
    )
  }
];

interface IdentityShowcaseProps {
  activeId: IdentityId;
  onChangeIdentity: (id: IdentityId) => void;
}

export function IdentityShowcase({ activeId, onChangeIdentity }: IdentityShowcaseProps) {
  return (
    <div className="space-y-8" id="identity-showcase-panel">
      <div className="space-y-2">
        <h3 className="text-base font-sans tracking-wide text-zinc-200 font-medium">
          Visual Identity Explorer
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
          Choose a timeless design direction that resonates with you. This updates the logos, wordmarks, and metaphors throughout plot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {IDENTITY_DIRECTIONS.map((dir) => {
          const isActive = dir.id === activeId;
          return (
            <div
              key={dir.id}
              onClick={() => onChangeIdentity(dir.id)}
              className={`p-6 rounded-2xl cursor-pointer text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[210px] border ${
                isActive
                  ? 'bg-zinc-900/35 border-[#7C8CFF]/50 shadow-[0_4px_24px_rgba(124,140,255,0.06)]'
                  : 'bg-zinc-900/10 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20'
              }`}
            >
              {/* Active stamp */}
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-sans text-[#7C8CFF] bg-[#7C8CFF]/10 border border-[#7C8CFF]/20 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Stamped</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Logo and Wordmark demo */}
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl transition-all duration-300 bg-zinc-950 border ${
                    isActive ? 'border-[#7C8CFF]/40 text-[#7C8CFF]' : 'border-zinc-850 text-zinc-500'
                  }`}>
                    {dir.logoSvg("w-9 h-9")}
                  </div>
                  <div>
                    <span className="text-xs font-sans text-zinc-500 block leading-none">
                      {dir.name}
                    </span>
                    <div className="mt-1.5">{dir.wordmark("text-lg")}</div>
                  </div>
                </div>

                {/* Conceptual metadata */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-100">
                    {dir.conceptTitle}
                  </p>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed line-clamp-3">
                    {dir.description}
                  </p>
                </div>
              </div>

              {/* Footer specs */}
              <div className="mt-5 pt-3.5 border-t border-zinc-950/45 flex items-center justify-between text-xs">
                <span className="text-zinc-500 italic truncate max-w-[170px]" title={dir.metaphor}>
                  “{dir.metaphor}”
                </span>
                <span className="text-zinc-400 font-sans tracking-wide shrink-0">
                  {dir.vibeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete visual type scale for plot */}
      <div className="mt-8 pt-6 border-t border-zinc-900/60 space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-sans tracking-wide text-zinc-200 font-medium">
            Timeless Type Scale
          </h4>
          <p className="text-xs text-zinc-400 font-normal leading-relaxed">
            The typography should disappear, putting your movie posters at the center of attention. Our balanced type system is tuned for ultimate warm legibility and reading comfort.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline border-b border-zinc-900/40 pb-4">
            <div className="md:col-span-3 text-xs text-zinc-500 font-sans tracking-wide uppercase">
              Display Italic
            </div>
            <div className="md:col-span-9 space-y-1">
              <span className="font-display font-light italic text-2xl sm:text-3xl text-zinc-100 block">
                The grand design of cinema
              </span>
              <p className="text-xs text-zinc-400">
                Newsreader Light Italic. Elegant, editorial, storytelling headlines. Used for screen titles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline border-b border-zinc-900/40 pb-4">
            <div className="md:col-span-3 text-xs text-zinc-500 font-sans tracking-wide uppercase">
              Editorial Serif
            </div>
            <div className="md:col-span-9 space-y-1">
              <span className="font-display font-normal text-xl sm:text-2xl text-zinc-200 block">
                Archived film entries & memory logs
              </span>
              <p className="text-xs text-zinc-400">
                Newsreader Regular. Deeply classic, physical bookplate weight. Used for subtitles and modal titles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline border-b border-zinc-900/40 pb-4">
            <div className="md:col-span-3 text-xs text-zinc-500 font-sans tracking-wide uppercase">
              Comfort Body
            </div>
            <div className="md:col-span-9 space-y-1">
              <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
                “This feels like my own warm, custom wooden shelf. It does not look like an automated database or high-tech spreadsheet. Each bookmark holds a small story of why I want to watch this film.”
              </p>
              <p className="text-xs text-zinc-500 pt-1">
                Instrument Sans 14px/16px. Optimal reading line height and spacing. Used for transcripts, notes, and synopsis text.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <div className="md:col-span-3 text-xs text-zinc-500 font-sans tracking-wide uppercase">
              Muted Label
            </div>
            <div className="md:col-span-9 space-y-1">
              <span className="font-sans text-xs text-zinc-400 tracking-wide block">
                Friends Recommended • Late Night • Saved from Instagram
              </span>
              <p className="text-xs text-zinc-500">
                Instrument Sans 12px with wide tracking. Completely replaces loud uppercase codes or tech labels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
