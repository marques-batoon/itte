# はぁって言うゲーム — Digital Card Companion

A mobile-first React app for playing the Japanese card game *Haa-tte Iu Game* (はぁって言うゲーム).

Created by **Marques Batoon**
- GitHub: [github.com/marques-batoon](https://github.com/marques-batoon)
- Instagram: [@batoonworld](https://www.instagram.com/batoonworld)

---

## Features

### Homepage
- **Search bar** — find cards by number (e.g. `3`), hiragana (e.g. `すき`), romaji (e.g. `suki`), or English meaning
- **Dropdown selector** — jump to a specific card by number
- **Random card button** — 🎲 loads a random card instantly
- **All Cards grid** — collapsible panel showing all cards as tappable tiles

### Card View
- Displays the card title in large Japanese with **furigana** readings above kanji
- Full **A–H description list**, each entry showing kanji with furigana
- **Tap any word** to see a translation tooltip with:
  - 🇬🇧 English meaning
  - 🇨🇳 Chinese meaning (where available)
  - 🌏 More languages planned
- 🎲 **Auto-Assign** — randomly stamps you a letter A–H
- ✋ **Choose Letter** — opens a grid to manually pick A–H
- Your active letter is highlighted in the list with a **←あなた** marker
- Assigned letter display shows your letter, the Japanese phrase with furigana, and its English meaning

### Design
- Japanese-inspired aesthetic: warm paper tones, red vermillion accents, gold details
- Fonts: Shippori Mincho (display) + Noto Sans JP (UI)
- Fully **mobile-responsive** — optimized for phone play

---

## Setup

```bash
npm install
npm run dev
```

Requires Node.js. Uses Vite 7 + React 18.

---

## Project Structure

```
src/
├── App.jsx                  # Root component, manages home/card view
├── main.jsx                 # Entry point
├── styles/
│   └── global.css           # CSS variables, animations, shared styles
├── data/
│   └── cards.js             # All card data + TRANSLATIONS + segmentsToText helper
└── components/
    ├── HomePage.jsx          # Search, dropdown, random, all-cards grid
    ├── HomePage.css
    ├── CardPage.jsx          # Card view, letter assignment, tooltip
    ├── CardPage.css
    ├── Furigana.jsx          # Reusable ruby/furigana renderer
    └── Furigana.css
```

---

## Adding Cards

Edit `src/data/cards.js` and add a new entry to the `CARDS` array:

```js
{
  id: 11,                          // unique card number
  title: "すごい",                  // Japanese title (hiragana/kanji)
  titleRomaji: "sugoi",            // romaji (used in search + dropdown)
  titleFurigana: null,             // furigana for the title if it contains kanji
                                   // e.g. "ちがう" for 違う, or null if all-kana
  titleMeaning: "Amazing / Wow",   // English description shown under title
  descriptions: [
    {
      letter: "A",
      segments: [
        { k: "感動", f: "かんどう" },  // kanji segment with furigana
        { k: "した" }                 // kana segment (no furigana needed)
      ],
      meaning: "deeply moved",       // English — shown in tooltip + assigned display
    },
    // ... B through H
  ],
}
```

### Furigana segments

Each `segments` entry is either:
- `{ k: "漢字", f: "ふりがな" }` — kanji with furigana reading displayed above
- `{ k: "kana" }` — hiragana/katakana/text with no furigana

### Optional Chinese translations

Add a `TRANSLATIONS` entry in `cards.js` for any phrase you want to show Chinese alongside English in the tooltip:

```js
export const TRANSLATIONS = {
  "感動した": { en: "deeply moved / touched", zh: "深受感动" },
};
```

If a phrase has no `TRANSLATIONS` entry, the tooltip falls back to the `meaning` field automatically.

---

## Multiplayer (Planned)

The app is structured to support real-time multiplayer via WebSockets (e.g., Supabase Realtime, Ably, or Pusher). The intended flow:
- Host creates a room and selects a card
- Players join via room code and each receive (or choose) a letter A–H
- All players' letter selections are visible to the group in real time

---

## Tech Stack

- React 18 + Vite 7
- CSS custom properties (no CSS-in-JS, no UI library)
- Google Fonts: Shippori Mincho, Noto Sans JP
- No external dependencies beyond React
