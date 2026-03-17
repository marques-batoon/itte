import { useState, useRef, useEffect, useMemo } from "react";
import { CARDS } from "../data/cards";
import "./HomePage.css";

// Search a card against a query string
// Matches: card number, title (hiragana/kanji), titleRomaji, titleMeaning
function cardMatchesQuery(card, raw) {
  const q = raw.trim().toLowerCase();
  if (!q) return false;

  // Number match — exact or partial e.g. "1", "10"
  if (card.id.toString().startsWith(q)) return true;

  // Japanese title match (hiragana input or kanji)
  if (card.title.includes(raw.trim())) return true;

  // Furigana/hiragana match (e.g. typing "すき" matches 好き)
  if (card.titleFurigana && card.titleFurigana.includes(raw.trim())) return true;

  // Romaji match — partial, case-insensitive
  if (card.titleRomaji && card.titleRomaji.toLowerCase().includes(q)) return true;

  // English meaning match
  if (card.titleMeaning.toLowerCase().includes(q)) return true;

  return false;
}

export default function HomePage({ onSelectCard }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const searchRef = useRef(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return CARDS.filter((card) => cardMatchesQuery(card, searchQuery));
  }, [searchQuery]);

  // Show results whenever query is non-empty
  useEffect(() => {
    setShowResults(!!searchQuery.trim());
  }, [searchQuery]);

  const handleDropdown = (e) => {
    const val = e.target.value;
    setDropdownValue(val);
    if (val) {
      const card = CARDS.find((c) => c.id === parseInt(val));
      if (card) onSelectCard(card);
    }
  };

  const handleRandom = () => {
    const randomCard = CARDS[Math.floor(Math.random() * CARDS.length)];
    onSelectCard(randomCard);
  };

  // Close results on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-stamp">ゲーム</div>
        <h1 className="home-title jp-text">はぁって言うゲーム</h1>
        <p className="home-subtitle">3-8プレイ人数</p>
        <p className="home-desc">
          今言った「はぁ」は、怒ってる？とぼけてる？それとも、感心してる？与えられたお題を"声"と"表情"だけで演じて当て合うゲーム！
        </p>
      </header>

      <main className="home-main">
        {/* Search */}
        <section className="control-section" ref={searchRef}>
          <label className="control-label">
            <span className="label-jp jp-text">検索</span>
            <span className="label-en">Search Card</span>
          </label>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Number (1), hiragana (はぁ), or romaji (haa)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
            />
            {searchQuery && (
              <button
                className="clear-btn"
                onClick={() => { setSearchQuery(""); setShowResults(false); }}
                aria-label="Clear search"
              >×</button>
            )}
          </div>

          {showResults && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="no-results">
                  <span>No cards found for </span>
                  <strong>「{searchQuery}」</strong>
                </div>
              ) : (
                searchResults.map((card) => (
                  <button
                    key={card.id}
                    className="result-item"
                    onClick={() => { onSelectCard(card); setShowResults(false); setSearchQuery(""); }}
                  >
                    <span className="result-num">#{card.id}</span>
                    <span className="result-jp jp-text">{card.title}</span>
                    <span className="result-romaji">{card.titleRomaji}</span>
                    <span className="result-meaning">{card.titleMeaning}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {/* Dropdown */}
        <section className="control-section">
          <label className="control-label">
            <span className="label-jp jp-text">カード選択</span>
            <span className="label-en">Select by Number</span>
          </label>
          <div className="select-wrapper">
            <select
              className="card-select"
              value={dropdownValue}
              onChange={handleDropdown}
            >
              <option value="">— Choose a card —</option>
              {CARDS.map((card) => (
                <option key={card.id} value={card.id}>
                  #{card.id} — {card.title} ({card.titleRomaji})
                </option>
              ))}
            </select>
            <span className="select-arrow">▼</span>
          </div>
        </section>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text jp-text">または</span>
          <span className="divider-line" />
        </div>

        {/* Random Button */}
        <section className="random-section">
          <button className="random-btn" onClick={handleRandom}>
            <span className="random-icon">🎲</span>
            <span className="random-jp jp-text">おまかせ</span>
            <span className="random-en">Random Card</span>
          </button>
        </section>

        {/* Card Grid */}
        <section className="card-grid-section">
          <button
            className="grid-toggle"
            onClick={() => setShowGrid((v) => !v)}
          >
            <span className="grid-toggle-left">
              <span className="jp-text">全カード</span>
              <span className="grid-toggle-en">All Cards</span>
            </span>
            <span className="grid-toggle-chevron">{showGrid ? "▲" : "▼"}</span>
          </button>
          {showGrid && (
            <div className="card-grid">
              {CARDS.map((card) => (
                <button
                  key={card.id}
                  className="card-thumb"
                  onClick={() => onSelectCard(card)}
                >
                  <span className="thumb-num">#{card.id}</span>
                  <span className="thumb-jp jp-text">{card.title}</span>
                  <span className="thumb-romaji">{card.titleRomaji}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="home-footer">
        <p className="footer-name">Made by <span>Marques Batoon</span></p>
        <div className="footer-links">
          <a
            className="footer-link footer-link--github"
            href="https://github.com/marques-batoon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            className="footer-link footer-link--instagram"
            href="https://www.instagram.com/batoonworld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Instagram
          </a>
        </div>
        <p className="footer-copy">はぁって言うゲーム Digital Companion</p>
      </footer>
    </div>
  );
}
