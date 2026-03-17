# はぁって言うゲーム — Digital Card Companion

A mobile-first React app for playing the Japanese card game *Haa-tte Iu Game*.

## Features

- **Homepage** with search bar (Japanese, romaji, or card number), dropdown selector, and random card button
- **Card Grid** for quick access to all cards
- **Card View** showing all A–H descriptions
- **Auto-Assign**: Press 🎲 to randomly receive a letter A–H
- **Manual Letter Select**: Tap ✋ to choose your own letter from A–H
- **Translation Tooltip**: Tap any Japanese word/phrase in the list to see:
  - Romaji pronunciation
  - English translation 🇬🇧
  - Chinese translation 🇨🇳 (where available)
- Full **Japanese + Romaji** support throughout
- Mobile-first responsive design

## Setup

```bash
npm install
npm run dev
```

## Adding Cards

Edit `src/data/cards.js`:

```js
export const CARDS = [
  {
    id: 11, // unique number
    title: "すごい",       // Japanese word
    titleRomaji: "sugoi",  // romaji
    titleMeaning: "Amazing / Wow",
    descriptions: [
      { letter: "A", text: "感動した", romaji: "kandou shita", meaning: "deeply moved" },
      { letter: "B", text: "皮肉っぽく", romaji: "hiniku ppoku", meaning: "sarcastically" },
      // ... C through H
    ],
  },
];
```

Add word-level translations to the `TRANSLATIONS` object in the same file:

```js
export const TRANSLATIONS = {
  "感動した": { en: "deeply moved / touched", zh: "深受感动" },
};
```

## Multiplayer (Planned)

The app is structured to support real-time multiplayer via WebSockets (e.g., Supabase Realtime, Ably, or Pusher). Each player can share their assigned letter and the active card ID via a room code system.

## Tech Stack

- React 18 + Vite
- CSS custom properties (no CSS-in-JS)
- Google Fonts: Shippori Mincho, Noto Sans JP
- No external UI libraries
# itte
