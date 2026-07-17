/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. Extract feature will fail until the key is provided in Settings > Secrets.");
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Map query parameters or text to movie posters using Unsplash keywords to keep UI premium and visual
function getPosterForMovie(title: string, genres: string[]): string {
  const genre = genres && genres.length > 0 ? genres[0].toLowerCase() : 'movie';
  const query = encodeURIComponent(`${title} movie poster aesthetic`);
  return `https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80`; // fallback
}

// Express API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Primary extraction endpoint
app.post('/api/extract', async (req, res) => {
  try {
    const { text, url } = req.body;

    if (!text || typeof text !== 'string') {
       res.status(400).json({ success: false, error: 'Text content is required for extraction.' });
       return;
    }

    const ai = getAiClient();

    const systemInstruction = `You are an elite, highly knowledgeable film recommendation extractor and analyst.
Your job is to read user-submitted text (which could be transcripts from Instagram Reels, TikToks, YouTube Shorts, tweets, direct comments, or video descriptions) and extract EVERY recommended movie.

For each movie found, generate:
1. The exact Title.
2. Release Year (an integer). If unknown, estimate or research it.
3. Director (string).
4. A highly punchy, descriptive Synopsis (max 2 sentences, elegant and intriguing).
5. A realistic rating (e.g., "8.2 IMDb" or "91% RT").
6. Up to 3 Genres (e.g. ["Sci-Fi", "Mystery", "Thriller"]).
7. A distinctive modern Vibe tag (max 3 words, e.g., "Cosmic Mindf**k", "Cozy Nostalgia", "Pure Adrenaline", "Gothic Romance", "Dystopian Dread").
8. The standard Streaming Services where it is widely available (at least 1, up to 4, e.g., ["Netflix", "Prime Video", "Apple TV", "Max", "Hulu", "Disney+"]).
9. "whySave" - A custom, stylish, single-sentence summary of why this movie was highlighted in the social post (e.g., "Highlighted by the creator as the absolute peak of modern atmospheric sci-fi").
10. "socialSource" - The platform, author/creator handle if mentioned, and a relevant text snippet.
11. "runtime" - The estimated or actual movie duration (e.g., "115 mins" or "1h 55m").
12. "confidence" - An integer between 70 and 100 representing your extraction/metadata match confidence based on details present in the text snippet.

Provide your output strictly in JSON format matching the schema provided. No explanations, no markdown wrappers.`;

    const prompt = `Analyze this user recommendation text:
"""
${text}
"""
${url ? `Social URL: ${url}` : ''}

Extract all movies and match the schema structure. Ensure high quality streaming information.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            movies: {
              type: Type.ARRAY,
              description: 'The list of movies successfully extracted from the social post/text.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.INTEGER },
                  director: { type: Type.STRING },
                  synopsis: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  genres: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  vibe: { type: Type.STRING },
                  streamingServices: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  whySave: { type: Type.STRING },
                  socialSource: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING, description: 'Must be one of: instagram, tiktok, youtube, twitter, reddit, whatsapp, manual' },
                      author: { type: Type.STRING },
                      url: { type: Type.STRING },
                      textSnippet: { type: Type.STRING }
                    },
                    required: ['platform']
                  },
                  runtime: { type: Type.STRING, description: 'Approximate or exact duration, e.g., "112 mins" or "1h 52m"' },
                  confidence: { type: Type.INTEGER, description: 'Match confidence between 70 and 100' }
                },
                required: [
                  'title', 'year', 'director', 'synopsis', 'rating', 'genres',
                  'vibe', 'streamingServices', 'whySave', 'socialSource', 'runtime', 'confidence'
                ]
              }
            }
          },
          required: ['movies']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini model did not return any text.');
    }

    const data = JSON.parse(resultText);

    // Decorate movies with high-quality Unsplash posters based on title/genre to ensure beautiful aesthetics
    const posters: Record<string, string> = {
      'interstellar': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      'inception': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'dune': 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80',
      'parasite': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      'whiplash': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
      'blade runner 2049': 'https://images.unsplash.com/photo-1515462277126-270d878326e5?auto=format&fit=crop&w=600&q=80',
      'the dark knight': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
      'pulp fiction': 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
      'mad max': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'coherence': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80',
      'talk to me': 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=600&q=80',
      'everything everywhere all at once': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      'her': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
      'the matrix': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    };

    const decoratedMovies = (data.movies || []).map((m: any) => {
      const lowerTitle = m.title.toLowerCase();
      let matchedPoster = '';
      
      // Check partial matches for popular films to assign cinematic photos
      for (const [key, value] of Object.entries(posters)) {
        if (lowerTitle.includes(key)) {
          matchedPoster = value;
          break;
        }
      }

      // If no match, assign high quality abstract cinema/themed images
      if (!matchedPoster) {
        const genreKeywords: Record<string, string> = {
          'sci-fi': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', // galaxy
          'horror': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80', // dark misty forest
          'thriller': 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=600&q=80', // neon alleyway
          'comedy': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80', // neon face mask
          'drama': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', // movie theater interior
          'action': 'https://images.unsplash.com/photo-1515462277126-270d878326e5?auto=format&fit=crop&w=600&q=80', // cyber glow
          'romance': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80', // warm hands
          'documentary': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80', // retro camera
        };

        const primaryGenre = m.genres?.[0]?.toLowerCase() || '';
        matchedPoster = genreKeywords[primaryGenre] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'; // fallback theater
      }

      // Add a small randomized parameter to Unsplash to break caching/repetition if needed, or keep it clean
      return {
        ...m,
        posterUrl: matchedPoster
      };
    });

    res.json({ success: true, movies: decoratedMovies });
  } catch (error: any) {
    console.error('Extraction error:', error);
    res.status(500).json({ success: false, error: error.message || 'An error occurred during movie extraction.' });
  }
});

// Setup Vite Dev Server / Static Hosting based on Environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CineSave Server] Running on http://0.0.0.0:${PORT} [NODE_ENV=${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
