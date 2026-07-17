/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SocialSource } from './types';

/**
 * Humanizes relative date strings into clean, user-friendly text (e.g. 'Just now', '2h ago').
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
};

/**
 * Automatically detects the social video sharing platform from recommendation text snippets or links.
 */
export const detectPlatform = (text: string, url: string): SocialSource['platform'] => {
  const combined = (text + ' ' + url).toLowerCase();
  if (combined.includes('instagram.com') || combined.includes('ig.me') || combined.includes('reel')) return 'instagram';
  if (combined.includes('tiktok.com') || combined.includes('vm.tiktok')) return 'tiktok';
  if (combined.includes('youtube.com') || combined.includes('youtu.be') || combined.includes('shorts')) return 'youtube';
  if (combined.includes('twitter.com') || combined.includes('x.com')) return 'twitter';
  if (combined.includes('reddit.com')) return 'reddit';
  if (combined.includes('whatsapp') || combined.includes('wa.me')) return 'whatsapp';
  return 'manual';
};

/**
 * Returns the search link for a movie trailer on YouTube.
 */
export const getTrailerUrl = (title: string, year: number): string => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${title} ${year} official trailer`
  )}`;
};

/**
 * Parses numeric minutes from string descriptors (e.g. "148 mins" -> 148, "2h 10m" -> 130).
 */
export const parseRuntimeMinutes = (runtime?: string): number => {
  if (!runtime) return 120;
  
  // Try matching directly for numbers (e.g. "148 mins" or "148")
  const directDigits = runtime.match(/^(\d+)\s*(min|minute|mins)?s*$/i);
  if (directDigits) {
    return parseInt(directDigits[1], 10);
  }
  
  // Try matching "Xh Ym" or "Xh"
  const hourMatch = runtime.match(/(\d+)\s*h/i);
  const minMatch = runtime.match(/(\d+)\s*m/i);
  
  let total = 0;
  if (hourMatch) {
    total += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    total += parseInt(minMatch[1], 10);
  }
  
  if (total > 0) return total;
  
  // Fallback to searching any digits in the string
  const digitsMatch = runtime.match(/\d+/);
  return digitsMatch ? parseInt(digitsMatch[0], 10) : 120;
};
