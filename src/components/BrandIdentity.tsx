/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Clipboard, Tag, Award, Heart, Check, Compass, Eye } from 'lucide-react';
import { PlotIcon, PlotWordmark, PlotLogoDesignSystem } from './PlotLogo';

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
    conceptTitle: 'Official Plot Identity',
    metaphor: 'The single source of truth for plot.',
    description: 'The official brand identity combining a stylized film-strip P mark with clean lowercase tracking. Crafted for quiet cinematic curation.',
    typography: 'System Modern Sans + Spaced Tracked Lowercase',
    vibeText: 'Official • Cinematic • Modern • Curated',
    logoSvg: (className = "w-12 h-12") => (
      <PlotIcon className={className} />
    ),
    wordmark: (className = "text-xl") => (
      <PlotWordmark className={className} size="md" />
    )
  },
  {
    id: 'stub',
    name: 'plot',
    conceptTitle: 'Official Plot Identity',
    metaphor: 'The single source of truth for plot.',
    description: 'The official brand identity combining a stylized film-strip P mark with clean lowercase tracking. Crafted for quiet cinematic curation.',
    typography: 'System Modern Sans + Spaced Tracked Lowercase',
    vibeText: 'Official • Cinematic • Modern • Curated',
    logoSvg: (className = "w-12 h-12") => (
      <PlotIcon className={className} />
    ),
    wordmark: (className = "text-xl") => (
      <PlotWordmark className={className} size="md" />
    )
  },
  {
    id: 'monogram',
    name: 'plot',
    conceptTitle: 'Official Plot Identity',
    metaphor: 'The single source of truth for plot.',
    description: 'The official brand identity combining a stylized film-strip P mark with clean lowercase tracking. Crafted for quiet cinematic curation.',
    typography: 'System Modern Sans + Spaced Tracked Lowercase',
    vibeText: 'Official • Cinematic • Modern • Curated',
    logoSvg: (className = "w-12 h-12") => (
      <PlotIcon className={className} />
    ),
    wordmark: (className = "text-xl") => (
      <PlotWordmark className={className} size="md" />
    )
  },
  {
    id: 'shelf',
    name: 'plot',
    conceptTitle: 'Official Plot Identity',
    metaphor: 'The single source of truth for plot.',
    description: 'The official brand identity combining a stylized film-strip P mark with clean lowercase tracking. Crafted for quiet cinematic curation.',
    typography: 'System Modern Sans + Spaced Tracked Lowercase',
    vibeText: 'Official • Cinematic • Modern • Curated',
    logoSvg: (className = "w-12 h-12") => (
      <PlotIcon className={className} />
    ),
    wordmark: (className = "text-xl") => (
      <PlotWordmark className={className} size="md" />
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

      {/* Brand Design System Showcase */}
      <div className="mt-10">
        <PlotLogoDesignSystem />
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
