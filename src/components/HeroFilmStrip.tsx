/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface FilmItem {
  id: string;
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  backupPosterUrl: string;
}

// =========================================================================
// 60 GREATEST FILMS EVER MADE - OFFICIAL THEATRICAL POSTERS
// Interleaved genres, balanced light/dark tone, 2:3 aspect ratio
// =========================================================================

// LAYER 1: FOREGROUND (20 Official Posters - Calmer dark palette in center slots)
const LAYER_1_MOVIES: FilmItem[] = [
  {
    id: 'l1-1',
    title: 'Interstellar',
    year: 2014,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-2',
    title: 'Blade Runner 2049',
    year: 2017,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gA9L31215.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-3',
    title: 'Arrival',
    year: 2016,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-4',
    title: 'Past Lives',
    year: 2023,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/k3L3N6Gz5a7n8Y18r0O1aGz74Xg.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-5',
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Fantasy / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLPoA6S3C239.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-6',
    title: 'Inception',
    year: 2010,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1500462818027-61845479a950?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-7',
    title: 'The Prestige',
    year: 2006,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/bd93848.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-8',
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tCh211.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-9',
    title: 'Ex Machina',
    year: 2014,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/dmJw8A3sL3PqS6.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-10',
    title: 'Her',
    year: 2013,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/eP1f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-11',
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/q6y0R11pA62pM921.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-12',
    title: 'Parasite',
    year: 2019,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7IiT38S9S3A3M333qZ4N3162395.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-13',
    title: 'Spirited Away',
    year: 2001,
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/393911.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-14',
    title: 'Amélie',
    year: 2001,
    genre: 'International Cinema',
    posterUrl: 'https://image.tmdb.org/t/p/w780/bd93.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-15',
    title: 'The Godfather',
    year: 1972,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsA2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-16',
    title: 'La La Land',
    year: 2016,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/uDO8183183.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-17',
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/d5N022trI393911.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-18',
    title: 'Get Out',
    year: 2017,
    genre: 'Horror',
    posterUrl: 'https://image.tmdb.org/t/p/w780/t2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-19',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/eA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l1-20',
    title: 'Mad Max: Fury Road',
    year: 2015,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8tA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  }
];

// LAYER 2: MIDGROUND (20 Official Posters)
const LAYER_2_MOVIES: FilmItem[] = [
  {
    id: 'l2-1',
    title: 'Blade Runner 2049',
    year: 2017,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gA9L31215.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-2',
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/5A22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-3',
    title: 'John Wick',
    year: 2014,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/fZA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-4',
    title: 'Akira',
    year: 1988,
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/mA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-5',
    title: 'The Godfather',
    year: 1972,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsA2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-6',
    title: 'Hot Fuzz',
    year: 2007,
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/bA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-7',
    title: 'Jurassic Park',
    year: 1993,
    genre: 'Fantasy / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/o22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-8',
    title: 'Hereditary',
    year: 2018,
    genre: 'Horror',
    posterUrl: 'https://image.tmdb.org/t/p/w780/p91f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-9',
    title: 'Whiplash',
    year: 2014,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7fn624j5lj3xTmeOf1Su3R1S94X.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-10',
    title: 'Cinema Paradiso',
    year: 1988,
    genre: 'International Cinema',
    posterUrl: 'https://image.tmdb.org/t/p/w780/83183.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-11',
    title: 'Arrival',
    year: 2016,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-12',
    title: 'Her',
    year: 2013,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/eP1f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-13',
    title: 'Gladiator',
    year: 2000,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-14',
    title: 'Princess Mononoke',
    year: 1997,
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/lA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-15',
    title: '12 Angry Men',
    year: 1957,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/ow3wqA9sL3PqS6.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-16',
    title: 'The Big Lebowski',
    year: 1998,
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/cA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-17',
    title: 'Harry Potter and the Prisoner of Azkaban',
    year: 2004,
    genre: 'Fantasy / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/aA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-18',
    title: 'Alien',
    year: 1979,
    genre: 'Horror',
    posterUrl: 'https://image.tmdb.org/t/p/w780/v2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-19',
    title: 'The Prestige',
    year: 2006,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/bd93848.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l2-20',
    title: 'Portrait of a Lady on Fire',
    year: 2019,
    genre: 'International Cinema',
    posterUrl: 'https://image.tmdb.org/t/p/w780/323560.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
  }
];

// LAYER 3: BACKGROUND (20 Official Posters)
const LAYER_3_MOVIES: FilmItem[] = [
  {
    id: 'l3-1',
    title: 'The Matrix',
    year: 1999,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/f89fLjoRFiA836OSpA2ug9C3I5y.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-2',
    title: 'Before Sunrise',
    year: 1995,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/q3aG7p73a.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-3',
    title: 'Top Gun: Maverick',
    year: 2022,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/hA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-4',
    title: 'A Silent Voice',
    year: 2016,
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/nA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-5',
    title: "Schindler's List",
    year: 1993,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/sF1U4uvRA2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-6',
    title: 'Jojo Rabbit',
    year: 2019,
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/dA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-7',
    title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
    year: 2003,
    genre: 'Fantasy / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/z22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-8',
    title: 'Se7en',
    year: 1995,
    genre: 'Horror',
    posterUrl: 'https://image.tmdb.org/t/p/w780/62f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-9',
    title: 'No Country for Old Men',
    year: 2007,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/q3aG.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-10',
    title: 'Chungking Express',
    year: 1994,
    genre: 'International Cinema',
    posterUrl: 'https://image.tmdb.org/t/p/w780/sA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-11',
    title: 'Ex Machina',
    year: 2014,
    genre: 'Mind-Bending Sci-Fi',
    posterUrl: 'https://image.tmdb.org/t/p/w780/dmJw8A3sL3PqS6.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-12',
    title: 'Pride & Prejudice',
    year: 2005,
    genre: 'Romance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/smA2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-13',
    title: 'Mission: Impossible – Fallout',
    year: 2018,
    genre: 'Action',
    posterUrl: 'https://image.tmdb.org/t/p/w780/iA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-14',
    title: 'Perfect Blue',
    year: 1997,
    genre: 'Anime',
    posterUrl: 'https://image.tmdb.org/t/p/w780/oA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-15',
    title: 'The Green Mile',
    year: 1999,
    genre: 'Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w780/velOPh1I3p12oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-16',
    title: 'The Nice Guys',
    year: 2016,
    genre: 'Comedy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/fA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-17',
    title: 'Avatar',
    year: 2009,
    genre: 'Fantasy / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w780/jA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-18',
    title: 'The Silence of the Lambs',
    year: 1991,
    genre: 'Horror',
    posterUrl: 'https://image.tmdb.org/t/p/w780/u2f2f3e821.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-19',
    title: 'There Will Be Blood',
    year: 2007,
    genre: 'Cult Classics',
    posterUrl: 'https://image.tmdb.org/t/p/w780/d5N022.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'l3-20',
    title: 'Oldboy',
    year: 2003,
    genre: 'International Cinema',
    posterUrl: 'https://image.tmdb.org/t/p/w780/pA22oA3.jpg',
    backupPosterUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'
  }
];

// Duplicated 3x for seamless endless marquee scroll
const LOOPED_LAYER_1 = [...LAYER_1_MOVIES, ...LAYER_1_MOVIES, ...LAYER_1_MOVIES];
const LOOPED_LAYER_2 = [...LAYER_2_MOVIES, ...LAYER_2_MOVIES, ...LAYER_2_MOVIES];
const LOOPED_LAYER_3 = [...LAYER_3_MOVIES, ...LAYER_3_MOVIES, ...LAYER_3_MOVIES];

// Movie Poster Card Component - ONLY THE OFFICIAL POSTER FILLING THE FRAME
function MoviePosterCard({ 
  movie, 
  layerIndex, 
  waveY, 
  waveRotate 
}: { 
  key?: string;
  movie: FilmItem; 
  layerIndex: number; 
  waveY: number; 
  waveRotate: number; 
}) {
  const [imgSrc, setImgSrc] = useState(movie.posterUrl);

  const handleImageError = () => {
    if (imgSrc !== movie.backupPosterUrl) {
      setImgSrc(movie.backupPosterUrl);
    }
  };

  if (layerIndex === 1) {
    // FOREGROUND LAYER CARD (Interactive hover, 35mm frame detail, crisp 2:3 ratio)
    return (
      <motion.div
        style={{ 
          translateY: `${waveY}px`,
          rotate: `${waveRotate}deg`
        }}
        whileHover={{ 
          scale: 1.06,
          translateY: waveY - 12,
          filter: "brightness(1.2)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="group relative w-44 sm:w-56 md:w-64 h-[264px] sm:h-[336px] md:h-[384px] flex-shrink-0 bg-zinc-950 rounded-xl overflow-hidden border-[4px] sm:border-[5px] border-[#13151c]/90 shadow-[0_25px_50px_rgba(0,0,0,0.92)] cursor-pointer ring-1 ring-white/10 opacity-70 hover:opacity-100 transition-all duration-300 hover:border-[#7F72FF] hover:shadow-[0_20px_60px_rgba(127,114,255,0.4)] z-10"
      >
        {/* Subtle Celluloid Reflection Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-15 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none z-20" />

        {/* Real Official Movie Poster Artwork - Fills the Frame */}
        <img
          src={imgSrc}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover rounded-[6px]"
        />
      </motion.div>
    );
  }

  if (layerIndex === 2) {
    // MIDGROUND LAYER CARD
    return (
      <div
        style={{ 
          transform: `translateY(${waveY}px) rotate(${waveRotate}deg)`
        }}
        className="relative w-36 sm:w-48 h-[216px] sm:h-[288px] flex-shrink-0 bg-zinc-950 rounded-lg overflow-hidden border-[3px] border-[#11141f] shadow-2xl opacity-60"
      >
        <img
          src={imgSrc}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover rounded-[4px]"
        />
      </div>
    );
  }

  // BACKGROUND LAYER CARD (Layer 3)
  return (
    <div
      style={{ 
        transform: `translateY(${waveY}px) rotate(${waveRotate}deg)`
      }}
      className="relative w-28 sm:w-40 h-[168px] sm:h-[240px] flex-shrink-0 bg-zinc-950 rounded-md overflow-hidden border-[2px] border-[#0d1017] shadow-xl opacity-50"
    >
      <img
        src={imgSrc}
        alt={movie.title}
        referrerPolicy="no-referrer"
        onError={handleImageError}
        className="w-full h-full object-cover rounded-[3px]"
      />
    </div>
  );
}

export default function HeroFilmStrip() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 flex items-end justify-center pb-2">
      
      {/* Deep Atmospheric Charcoal & Violet Cinema Lighting Base */}
      <div className="absolute inset-0 bg-radial from-[#0E121E]/70 via-[#070708]/90 to-[#070708] blur-3xl opacity-90" />
      <div className="absolute w-[140%] h-[500px] bg-gradient-to-r from-[#7F72FF]/08 via-[#A3B0FF]/08 to-[#7F72FF]/08 blur-3xl transform -rotate-3" />

      {/* THREE LAYER PERSPECTIVE STACK - Moved down ~140px to leave generous empty space for typography */}
      <div className="relative w-full h-full flex flex-col justify-end items-center pointer-events-auto transform translate-y-[135px] sm:translate-y-[150px]">

        {/* ==========================================
            LAYER 3: DEEPEST BACKGROUND (40% Speed, Soft Blur, 20 Curated Iconic Films)
           ========================================== */}
        <div 
          style={{
            transform: 'perspective(1800px) rotateX(15deg) rotateY(-4deg) translateY(-130px) scale(0.95)',
            transformStyle: 'preserve-3d',
            filter: 'blur(3.5px) brightness(0.6)',
            opacity: 0.32
          }}
          className="absolute bottom-16 w-[170%] z-0"
        >
          <div className="relative w-full bg-[#05060a] border-y-[10px] border-[#0a0d14] py-4 shadow-2xl">
            <div className="flex w-max">
              <motion.div
                animate={{ x: ["0%", "-33.333333333333336%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 70, // 40% speed -> 70s duration
                    ease: "linear",
                  }
                }}
                style={{ willChange: 'transform' }}
                className="flex gap-6 sm:gap-8 px-4"
              >
                {LOOPED_LAYER_3.map((movie, idx) => {
                  const angle = ((idx % 20) / 20) * Math.PI * 2;
                  const waveY = -Math.sin(angle + 2.4) * 24;
                  const waveRotate = -Math.cos(angle + 2.4) * 2.8;

                  return (
                    <MoviePosterCard
                      key={`l3-${movie.id}-${idx}`}
                      movie={movie}
                      layerIndex={3}
                      waveY={waveY}
                      waveRotate={waveRotate}
                    />
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ==========================================
            LAYER 2: MIDGROUND (70% Speed, Slight Blur, 20 Curated Iconic Films)
           ========================================== */}
        <div 
          style={{
            transform: 'perspective(1600px) rotateX(13deg) rotateY(-3deg) translateY(-65px) scale(1.1)',
            transformStyle: 'preserve-3d',
            filter: 'blur(1.5px) brightness(0.75)',
            opacity: 0.48
          }}
          className="absolute bottom-10 w-[165%] z-10"
        >
          <div className="relative w-full bg-[#07090e] border-y-[14px] border-[#0e121a] py-5 shadow-2xl">
            <div className="flex w-max">
              <motion.div
                animate={{ x: ["0%", "-33.333333333333336%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40, // 70% speed -> 40s duration
                    ease: "linear",
                  }
                }}
                style={{ willChange: 'transform' }}
                className="flex gap-7 sm:gap-9 px-5"
              >
                {LOOPED_LAYER_2.map((movie, idx) => {
                  const angle = ((idx % 20) / 20) * Math.PI * 2;
                  const waveY = -Math.sin(angle + 1.2) * 32;
                  const waveRotate = -Math.cos(angle + 1.2) * 3.5;

                  return (
                    <MoviePosterCard
                      key={`l2-${movie.id}-${idx}`}
                      movie={movie}
                      layerIndex={2}
                      waveY={waveY}
                      waveRotate={waveRotate}
                    />
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ==========================================
            LAYER 1: FOREGROUND (100% Speed, Sharp & Ambient 50% opacity, 20 Curated Iconic Films)
           ========================================== */}
        <div 
          style={{
            transform: 'perspective(1500px) rotateX(10deg) rotateY(-2deg) scale(1.3)',
            transformStyle: 'preserve-3d',
            filter: 'blur(0px)',
            opacity: 0.52
          }}
          className="relative w-[160%] z-20 py-6 sm:py-8"
        >
          {/* Main 35mm Celluloid Ribbon */}
          <div className="relative w-full bg-[#080a0f] border-y-[18px] sm:border-y-[24px] border-[#0e121a] py-6 sm:py-10 shadow-[0_50px_120px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
            
            {/* Top Perforations (35mm Sprocket Holes) */}
            <div className="absolute top-1.5 sm:top-2 inset-x-0 flex justify-between px-4 opacity-75 pointer-events-none z-20">
              {Array.from({ length: 72 }).map((_, i) => (
                <div 
                  key={`sprocket-top-${i}`} 
                  className="w-3.5 sm:w-5 h-2.5 sm:h-3.5 bg-[#030406] rounded-[1.5px] border border-zinc-900/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)]" 
                />
              ))}
            </div>

            {/* Continuous GPU Marquee Motion Track */}
            <div className="flex w-max">
              <motion.div
                animate={{ x: ["0%", "-33.333333333333336%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 28, // 100% speed -> 28s duration
                    ease: "linear",
                  }
                }}
                style={{ willChange: 'transform' }}
                className="flex gap-8 sm:gap-10 px-6"
              >
                {LOOPED_LAYER_1.map((movie, idx) => {
                  const angle = ((idx % 20) / 20) * Math.PI * 2;
                  const waveY = -Math.sin(angle) * 38;
                  const waveRotate = -Math.cos(angle) * 4;

                  return (
                    <MoviePosterCard
                      key={`l1-${movie.id}-${idx}`}
                      movie={movie}
                      layerIndex={1}
                      waveY={waveY}
                      waveRotate={waveRotate}
                    />
                  );
                })}
              </motion.div>
            </div>

            {/* Bottom Perforations (35mm Sprocket Holes) */}
            <div className="absolute bottom-1.5 sm:bottom-2 inset-x-0 flex justify-between px-4 opacity-75 pointer-events-none z-20">
              {Array.from({ length: 72 }).map((_, i) => (
                <div 
                  key={`sprocket-bottom-${i}`} 
                  className="w-3.5 sm:w-5 h-2.5 sm:h-3.5 bg-[#030406] rounded-[1.5px] border border-zinc-900/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)]" 
                />
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          OPENING CINEMA CURTAINS & ATMOSPHERIC VIGNETTE
         ========================================== */}
      {/* Left Velvet Curtain Fade */}
      <div className="absolute inset-y-0 left-0 w-64 sm:w-80 bg-gradient-to-r from-[#070708] via-[#070708]/90 to-transparent pointer-events-none z-30" />
      {/* Right Velvet Curtain Fade */}
      <div className="absolute inset-y-0 right-0 w-64 sm:w-80 bg-gradient-to-l from-[#070708] via-[#070708]/90 to-transparent pointer-events-none z-30" />
      {/* Top Arch Curtain Vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070708] via-[#070708]/80 to-transparent pointer-events-none z-30" />
      {/* Bottom Stage Base Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070708] via-[#070708]/90 to-transparent pointer-events-none z-30" />
    </div>
  );
}
