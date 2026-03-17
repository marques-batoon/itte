import { useState, useCallback, useRef, useEffect } from "react";
import { TRANSLATIONS, segmentsToText } from "../data/cards";
import Furigana from "./Furigana";
import "./CardPage.css";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function CardPage({ card, onBack }) {
  const [assignedLetter, setAssignedLetter] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showLetterPanel, setShowLetterPanel] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimeout = useRef(null);
  const [revealed, setRevealed] = useState(false);

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

  return (
    <div className="card-page" onClick={closeTooltip}>
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        <span>←</span>
        <span className="back-label">ホーム</span>
      </button>

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
            {/*
            <div className="assigned-meaning">{activeDescription.meaning}</div>
            <div className="assigned-instruction">
              Act out <strong>「{card.title}」</strong> as if you feel:{" "}
              <em>{activeDescription.meaning}</em>
            </div>
            */}
          </div>
        </div>
      )}

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
