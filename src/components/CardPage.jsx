import { useState, useCallback, useRef, useEffect } from "react";
import { TRANSLATIONS, segmentsToText, CARDS } from "../data/cards";
import Furigana from "./Furigana";
import "./CardPage.css";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function CardPage({ card, onBack, onNext, onPrev, onRandom, totalCards }) {
  const [assignedLetter, setAssignedLetter] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showLetterPanel, setShowLetterPanel] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimeout = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Reset state when card changes
  useEffect(() => {
    setAssignedLetter(null);
    setSelectedLetter(null);
    setShowLetterPanel(false);
    setRevealed(false);
    setTooltip(null);
  }, [card?.id]);

  useEffect(() => () => clearTimeout(tooltipTimeout.current), []);

  const handleAutoAssign = useCallback(() => {
    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    setAssignedLetter(letter);
    setSelectedLetter(null);
    setRevealed(false);
    setTimeout(() => setRevealed(true), 100);
  }, []);

  const handleSelectLetter = useCallback((letter) => {
    setSelectedLetter(letter);
    setAssignedLetter(null);
    setShowLetterPanel(false);
    setRevealed(false);
    setTimeout(() => setRevealed(true), 100);
  }, []);

  const activeLetter = assignedLetter || selectedLetter;
  const activeDescription = activeLetter
    ? card.descriptions.find((d) => d.letter === activeLetter)
    : null;

  const handleWordClick = useCallback((e, desc) => {
    e.stopPropagation();
    clearTimeout(tooltipTimeout.current);

    const plainText = segmentsToText(desc.segments);
    const translation = TRANSLATIONS[plainText];

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.left, window.innerWidth - 260);
    const y = rect.bottom + 8;

    setTooltip({
      en: translation ? translation.en : desc.meaning,
      zh: translation ? translation.zh : null,
      x,
      y,
    });

    tooltipTimeout.current = setTimeout(() => setTooltip(null), 4000);
  }, []);

  const closeTooltip = () => {
    clearTimeout(tooltipTimeout.current);
    setTooltip(null);
  };

  // Title furigana segments
  const titleSegments = card.titleFurigana
    ? [{ k: card.title, f: card.titleFurigana }]
    : [{ k: card.title }];

  const currentIndex = CARDS.findIndex((c) => c.id === card.id);

  return (
    <div className="card-page" onClick={closeTooltip}>
      {/* Top Nav Row */}
      <div className="card-top-nav">
        <button className="back-btn" onClick={onBack}>
          <span>←</span>
          <span className="back-label">ホーム</span>
        </button>
        <span className="card-counter">{currentIndex + 1} / {totalCards}</span>
      </div>

      {/* Card Header */}
      <div className="card-header">
        <div className="card-id-badge">Card #{card.id}</div>
        <h1 className="card-title">
          <Furigana segments={titleSegments} className="card-title-furigana" />
        </h1>
        <p className="card-meaning">{card.titleMeaning}</p>
      </div>

      {/* Descriptions List */}
      <div className="descriptions-container">
        <div className="desc-header">
          <span className="jp-text">説明リスト</span>
          <span className="desc-hint">Tap a word to translate</span>
        </div>
        <ul className="descriptions-list">
          {card.descriptions.map((desc) => {
            const isActive = activeLetter === desc.letter;
            return (
              <li
                key={desc.letter}
                className={`desc-item ${isActive ? "desc-item--active" : ""}`}
              >
                <span className="desc-letter">{desc.letter}</span>
                <div className="desc-content">
                  <button
                    className="desc-word"
                    onClick={(e) => handleWordClick(e, desc)}
                    title="Tap for translation"
                  >
                    <Furigana segments={desc.segments} />
                  </button>
                </div>
                {isActive && (
                  <span className="active-marker jp-text">←あなた</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <button className="action-btn action-btn--primary" onClick={handleAutoAssign}>
          <span className="action-icon">🎲</span>
          <div className="action-text">
            <span className="action-jp jp-text">ランダム割り当て</span>
            <span className="action-en">Auto-Assign Letter</span>
          </div>
        </button>

        <button
          className={`action-btn action-btn--secondary ${showLetterPanel ? "action-btn--open" : ""}`}
          onClick={(e) => { e.stopPropagation(); setShowLetterPanel((v) => !v); }}
        >
          <span className="action-icon">✋</span>
          <div className="action-text">
            <span className="action-jp jp-text">文字を選択</span>
            <span className="action-en">Choose Your Letter</span>
          </div>
          <span className="chevron">{showLetterPanel ? "▲" : "▼"}</span>
        </button>

        {showLetterPanel && (
          <div className="letter-panel" onClick={(e) => e.stopPropagation()}>
            {LETTERS.map((letter) => {
              const desc = card.descriptions.find((d) => d.letter === letter);
              return (
                <button
                  key={letter}
                  className={`letter-pick-btn ${selectedLetter === letter ? "letter-pick-btn--selected" : ""}`}
                  onClick={() => handleSelectLetter(letter)}
                >
                  <span className="letter-pick-label">{letter}</span>
                  {desc && (
                    <span className="letter-pick-furigana">
                      <Furigana segments={desc.segments} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Assigned Letter Display */}
      {activeLetter && activeDescription && (
        <div
          className={`assigned-display ${revealed ? "assigned-display--revealed" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="assigned-inner">
            <div className="assigned-label">
              {assignedLetter ? "Your assigned letter" : "Your chosen letter"}
            </div>
            <div className="assigned-letter">{activeLetter}</div>
            <div className="assigned-word">
              <Furigana segments={activeDescription.segments} className="furigana-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Card Navigation */}
      <div className="card-nav-section" onClick={(e) => e.stopPropagation()}>
        <button className="card-nav-btn" onClick={onPrev} title="Previous card">
          <span className="card-nav-arrow">←</span>
          <span className="card-nav-label">前のカード</span>
        </button>
        <button className="card-nav-random-btn" onClick={onRandom} title="Random card">
          <span>🎲</span>
          <span className="jp-text">おまかせ</span>
        </button>
        <button className="card-nav-btn" onClick={onNext} title="Next card">
          <span className="card-nav-label">次のカード</span>
          <span className="card-nav-arrow">→</span>
        </button>
      </div>

      {/* Footer */}
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

      {/* Tooltip */}
      {tooltip && (
        <div
          className="tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tooltip-en">🇬🇧 {tooltip.en}</div>
          {tooltip.zh && <div className="tooltip-zh">🇨🇳 {tooltip.zh}</div>}
        </div>
      )}
    </div>
  );
}
