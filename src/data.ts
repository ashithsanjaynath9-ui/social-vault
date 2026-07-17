/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from './types';

export interface ReelTemplate {
  id: string;
  title: string;
  creator: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  icon: string;
  text: string;
  description: string;
}

export const REEL_TEMPLATES: ReelTemplate[] = [
  {
    id: 'mind-bending-scifi',
    title: '🧠 Brain-Melting Sci-Fi Reels',
    creator: '@cinema_secrets',
    platform: 'tiktok',
    icon: '🎬',
    description: '3 movies that will keep you questioning reality all night.',
    text: `OMG you guys! If you love mind-bending sci-fi thrillers that will literally break your brain and keep you up questioning reality, you HAVE to watch Coherence (2013) immediately. It starts at a simple dinner party during a comet flyby, and things get absolutely terrifying. It's a low-budget masterpiece. Next up, if you haven't seen Inception yet, what are you even doing? It is streaming on Netflix right now and is a literal work of genius. Finally, Predestination (2014) starring Ethan Hawke—just go in completely blind, trust me on this! Let me know in the comments if you've seen them! #movietok #scifi #mindbending #thriller`
  },
  {
    id: 'cozy-aesthetic-films',
    title: '🌧️ Cozy Rainy Day Aesthetics',
    creator: '@the_filmic_eye',
    platform: 'instagram',
    icon: '✨',
    description: 'Beautiful, quiet comfort movies that feel like a warm hug.',
    text: `Here are 3 aesthetic movies that feel like a warm coffee on a rainy Sunday afternoon. First, "Her" (2013) directed by Spike Jonze—the pastel cinematography, soundtrack, and melancholic love story are pure art. Available on Apple TV and Prime. Second, "Perfect Days" (2023), a beautiful, quiet masterpiece about finding joy in the simple, everyday routines of Tokyo. And third, "Amélie" (2001)—it's whimsical, romantic, and will make you smile for hours. Save this reel for your next cozy movie night! 🍿✨ #cinematography #cozyvibes #comfortmovie #indiefilm`
  },
  {
    id: 'high-tension-horror',
    title: '🔥 High-Tension Modern Horror',
    creator: '@scary_shorts',
    platform: 'youtube',
    icon: '👻',
    description: 'Deeply atmospheric psychological thrillers and folklore.',
    text: `Stop scrolling! These are NOT your average cheap jump-scare horror movies. These are deeply disturbing psychological rides. 
1. Talk to Me (2023) - that hand concept is so original and the sound design is absolutely terrifying. Stream on Prime.
2. The Ritual - a brilliant Scandinavian folklore horror about four friends lost in the woods of Sweden. Streaming on Netflix!
3. Hereditary (2018) - literally the most intense, jaw-dropping family trauma wrapped inside a demonic nightmare. Toni Collette deserved an Oscar. 
Don't watch these alone! Share with a friend who loves scary movies.`
  }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'init-1',
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival amidst a dying Earth.',
    rating: '8.7 IMDb',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    vibe: 'Cosmic Wonder',
    streamingServices: ['Netflix', 'Prime Video', 'Apple TV'],
    whySave: 'Extracted from a viral TikTok about "movies that make you feel tiny in the universe."',
    socialSource: {
      platform: 'tiktok',
      author: '@astroworld',
      textSnippet: 'This soundtrack combined with the black hole visuals is a spiritual experience...'
    },
    addedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    watched: false,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    runtime: '169 mins',
    confidence: 98,
    language: 'English',
    favorite: true,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
  },
  {
    id: 'init-2',
    title: 'Dune: Part Two',
    year: 2024,
    director: 'Denis Villeneuve',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    rating: '8.9 IMDb',
    genres: ['Sci-Fi', 'Adventure'],
    vibe: 'Gargantuan Cinema',
    streamingServices: ['Max', 'Apple TV', 'Prime Video'],
    whySave: 'Extracted from a beautiful cinema aesthetic reel highlighting Villeneuve\'s worldbuilding.',
    socialSource: {
      platform: 'instagram',
      author: '@cinematica_official',
      textSnippet: 'The sound design and Hans Zimmer score on IMAX was just mind-blowing...'
    },
    addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    watched: false,
    progress: 65, // 65% Watched
    posterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80',
    runtime: '166 mins',
    confidence: 96,
    language: 'English',
    favorite: false,
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh']
  },
  {
    id: 'init-3',
    title: 'Whiplash',
    year: 2014,
    director: 'Damien Chazelle',
    synopsis: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an abusive instructor.',
    rating: '8.5 IMDb',
    genres: ['Drama', 'Music'],
    vibe: 'Pure Adrenaline',
    streamingServices: ['Netflix', 'Prime Video'],
    whySave: 'Saved from a YouTube Short discussing Damien Chazelle\'s flawless editing style.',
    socialSource: {
      platform: 'youtube',
      author: '@frame_by_frame',
      textSnippet: 'The tension in the final drum solo scene makes it one of the absolute best film endings ever.'
    },
    addedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    watched: false,
    progress: 25, // 25% Watched
    posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
    runtime: '106 mins',
    confidence: 92,
    language: 'English',
    favorite: true,
    cast: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser', 'Melissa Benoist']
  },
  {
    id: 'init-4',
    title: 'Her',
    year: 2013,
    director: 'Spike Jonze',
    synopsis: 'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
    rating: '8.0 IMDb',
    genres: ['Sci-Fi', 'Romance', 'Drama'],
    vibe: 'Cozy Nostalgia',
    streamingServices: ['Apple TV', 'Prime Video'],
    whySave: 'Highlighted as a "comfort movie that is actually a masterpiece" on a Twitter thread.',
    socialSource: {
      platform: 'instagram',
      author: '@the_filmic_eye',
      textSnippet: 'The cinematography uses pastel tones to build a beautiful, melancholic future environment.'
    },
    addedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    watched: false,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    runtime: '126 mins',
    confidence: 95,
    language: 'English',
    favorite: false,
    cast: ['Joaquin Phoenix', 'Scarlett Johansson', 'Amy Adams', 'Rooney Mara']
  },
  {
    id: 'init-5',
    title: 'Parasite',
    year: 2019,
    director: 'Bong Joon Ho',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    rating: '96% RT',
    genres: ['Thriller', 'Drama', 'Comedy'],
    vibe: 'Sharp Social Satire',
    streamingServices: ['Max', 'Apple TV', 'Prime Video'],
    whySave: 'Highlighted in an Instagram carousel of "10 movies that are literal perfection from start to finish."',
    socialSource: {
      platform: 'instagram',
      author: '@filmpalette',
      textSnippet: 'The genre shift in the middle of this movie is one of the greatest moments in cinema history.'
    },
    addedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    watched: true,
    watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    runtime: '132 mins',
    confidence: 99,
    language: 'Korean',
    favorite: true,
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik', 'Park So-dam']
  },
  {
    id: 'init-6',
    title: 'Spirited Away',
    year: 2001,
    director: 'Hayao Miyazaki',
    synopsis: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    rating: '8.6 IMDb',
    genres: ['Animation', 'Adventure', 'Fantasy'],
    vibe: 'Cozy Nostalgia',
    streamingServices: ['Max', 'Netflix'],
    whySave: 'Saved from a beautiful YouTube video essay exploring Studio Ghibli\'s magical realism.',
    socialSource: {
      platform: 'youtube',
      author: '@ghibli_essays',
      textSnippet: 'Every single frame of this movie feels handcrafted and brimming with life.'
    },
    addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    watched: false,
    progress: 80,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    runtime: '125 mins',
    confidence: 94,
    language: 'Japanese',
    favorite: false,
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naito']
  },
  {
    id: 'init-7',
    title: 'Pans Labyrinth',
    year: 2006,
    director: 'Guillermo del Toro',
    synopsis: 'In the Falangist Spain of 1944, the young stepdaughter of a sadistic army officer escapes into a eerie but captivating fantasy world.',
    rating: '8.2 IMDb',
    genres: ['Fantasy', 'Drama', 'War'],
    vibe: 'Dark Fairy Tale',
    streamingServices: ['Apple TV', 'Prime Video'],
    whySave: 'Extracted from an Instagram post on "top 5 gothic fantasy masterpieces ever made."',
    socialSource: {
      platform: 'instagram',
      author: '@gothic_cinema',
      textSnippet: 'The creature designs are outstanding, especially the Pale Man scene.'
    },
    addedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
    watched: false,
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80',
    runtime: '118 mins',
    confidence: 90,
    language: 'Spanish',
    favorite: false,
    cast: ['Ivana Baquero', 'Sergi López', 'Maribel Verdú', 'Doug Jones']
  }
];
