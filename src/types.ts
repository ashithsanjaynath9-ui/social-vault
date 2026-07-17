/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SocialSource {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'reddit' | 'whatsapp' | 'manual';
  author?: string;
  url?: string;
  textSnippet?: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  synopsis: string;
  rating: string; // e.g., "8.7 IMDb" or "94% RT"
  genres: string[];
  vibe: string; // e.g., "Mind-bending Mindf**k", "Cozy Nostalgia", "Pure Adrenaline"
  streamingServices: string[]; // e.g., ["Netflix", "Prime Video", "Apple TV", "Max"]
  whySave: string; // Brief visual quote of why this recommendation was highlighted
  socialSource: SocialSource;
  addedAt: string;
  watched: boolean;
  watchedAt?: string;
  posterUrl?: string;
  progress?: number; // 0-100 percent for Continue Watching
  runtime?: string; // e.g., "148 mins" or "1h 52m"
  confidence?: number; // e.g., 95 (percentage)
  language?: string; // e.g., "English", "Korean", "Spanish"
  favorite?: boolean; // favorite status
  cast?: string[]; // e.g., ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
}

export interface ExtractionRequest {
  text: string;
  url?: string;
}

export interface ExtractionResponse {
  success: boolean;
  movies: Array<Omit<Movie, 'id' | 'addedAt' | 'watched' | 'watchedAt'>>;
  error?: string;
}

export interface AppStats {
  totalSaved: number;
  watchedCount: number;
  savedHours: number; // calculated hours of film
  topVibe: string;
}
