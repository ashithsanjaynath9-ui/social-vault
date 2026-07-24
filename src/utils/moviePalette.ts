/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from '../types';

export interface MoviePalette {
  color1: string; // Primary vivid highlight
  color2: string; // Complementary accent
  color3: string; // Deep atmospheric dark base
  glowColor: string; // Glowing border shadow color
}

/**
 * Extracts/computes a rich, cinematic multi-stop color palette for any film
 * to dynamically colorize hover glows and background ambient gradients.
 */
export function getMoviePalette(movie: Partial<Movie> & { title: string }): MoviePalette {
  const titleLower = movie.title.toLowerCase();
  const vibeLower = (movie.vibe || '').toLowerCase();
  const genres = (movie.genres || []).map(g => g.toLowerCase());

  // 1. Explicit Mappings for Icon / Masterpiece Titles
  if (titleLower.includes('blade runner')) {
    return {
      color1: '#8E7BFF', // Vivid Violet
      color2: '#00F0FF', // Electric Cyan
      color3: '#3B1C70', // Deep Magenta
      glowColor: 'rgba(142, 123, 255, 0.75)'
    };
  }
  if (titleLower.includes('interstellar')) {
    return {
      color1: '#38BDF8', // Ice Blue
      color2: '#0284C7', // Slate Cyan
      color3: '#0F172A', // Midnight Space
      glowColor: 'rgba(56, 189, 248, 0.75)'
    };
  }
  if (titleLower.includes('dark knight') || titleLower.includes('batman')) {
    return {
      color1: '#EF4444', // Fiery Crimson
      color2: '#F59E0B', // Flame Amber
      color3: '#450A0A', // Dark Charcoal Crimson
      glowColor: 'rgba(239, 68, 68, 0.75)'
    };
  }
  if (titleLower.includes('inception')) {
    return {
      color1: '#14B8A6', // Emerald Teal
      color2: '#0284C7', // Steel Sapphire
      color3: '#0F172A', // Deep Navy
      glowColor: 'rgba(20, 184, 166, 0.75)'
    };
  }
  if (titleLower.includes('spirited away') || titleLower.includes('ghibli') || titleLower.includes('totoro')) {
    return {
      color1: '#F43F5E', // Warm Crimson
      color2: '#F97316', // Sunset Amber
      color3: '#881337', // Deep Wine
      glowColor: 'rgba(244, 63, 94, 0.75)'
    };
  }
  if (titleLower.includes('prestige')) {
    return {
      color1: '#A855F7', // Mystic Purple
      color2: '#6366F1', // Indigo Sapphire
      color3: '#1E1B4B', // Velvet Midnight
      glowColor: 'rgba(168, 85, 247, 0.75)'
    };
  }
  if (titleLower.includes('dune') || titleLower.includes('mad max') || titleLower.includes('oppenheimer')) {
    return {
      color1: '#F59E0B', // Desert Amber
      color2: '#EA580C', // Spice Orange
      color3: '#451A03', // Warm Earth
      glowColor: 'rgba(245, 158, 11, 0.75)'
    };
  }
  if (titleLower.includes('matrix') || titleLower.includes('alien')) {
    return {
      color1: '#10B981', // Matrix Neon Green
      color2: '#06B6D4', // Deep Cyber Teal
      color3: '#022C22', // Obsidian Emerald
      glowColor: 'rgba(16, 185, 129, 0.75)'
    };
  }

  // 2. Genre & Vibe Heuristics
  if (genres.includes('horror') || vibeLower.includes('eerie') || vibeLower.includes('chilling')) {
    return {
      color1: '#E11D48',
      color2: '#991B1B',
      color3: '#18181B',
      glowColor: 'rgba(225, 29, 72, 0.75)'
    };
  }
  if (genres.includes('romance') || vibeLower.includes('romantic') || vibeLower.includes('love')) {
    return {
      color1: '#EC4899',
      color2: '#A855F7',
      color3: '#831843',
      glowColor: 'rgba(236, 72, 153, 0.75)'
    };
  }
  if (genres.includes('sci-fi') || vibeLower.includes('cosmic') || vibeLower.includes('mind-bending')) {
    return {
      color1: '#00F0FF',
      color2: '#8E7BFF',
      color3: '#0B0E1B',
      glowColor: 'rgba(0, 240, 255, 0.75)'
    };
  }
  if (genres.includes('action') || genres.includes('adventure') || vibeLower.includes('adrenaline')) {
    return {
      color1: '#F59E0B',
      color2: '#EF4444',
      color3: '#1C1917',
      glowColor: 'rgba(245, 158, 11, 0.75)'
    };
  }
  if (genres.includes('animation') || genres.includes('anime')) {
    return {
      color1: '#10B981',
      color2: '#3B82F6',
      color3: '#064E3B',
      glowColor: 'rgba(16, 185, 129, 0.75)'
    };
  }

  // 3. Deterministic Hashed Color Selection for Any Other Film
  let hash = 0;
  const seed = movie.title + (movie.id || '') + (movie.year || '');
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const PALETTES: MoviePalette[] = [
    { color1: '#8E7BFF', color2: '#00F0FF', color3: '#1E1B4B', glowColor: 'rgba(142, 123, 255, 0.75)' },
    { color1: '#38BDF8', color2: '#818CF8', color3: '#0F172A', glowColor: 'rgba(56, 189, 248, 0.75)' },
    { color1: '#F43F5E', color2: '#FB923C', color3: '#4C0519', glowColor: 'rgba(244, 63, 94, 0.75)' },
    { color1: '#10B981', color2: '#06B6D4', color3: '#022C22', glowColor: 'rgba(16, 185, 129, 0.75)' },
    { color1: '#F59E0B', color2: '#EF4444', color3: '#451A03', glowColor: 'rgba(245, 158, 11, 0.75)' },
    { color1: '#A855F7', color2: '#EC4899', color3: '#3B0764', glowColor: 'rgba(168, 85, 247, 0.75)' },
    { color1: '#06B6D4', color2: '#3B82F6', color3: '#0F172A', glowColor: 'rgba(6, 182, 212, 0.75)' },
  ];

  return PALETTES[Math.abs(hash) % PALETTES.length];
}
