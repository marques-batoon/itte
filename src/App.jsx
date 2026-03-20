import "./styles/global.css";
import { useState, useCallback } from "react";
import HomePage from "./components/HomePage";
import CardPage from "./components/CardPage";
import { CARDS } from "./data/cards";

export default function App() {
  const [currentCard, setCurrentCard] = useState(null);
  const [view, setView] = useState("home"); // "home" | "card"

  const goToCard = useCallback((card) => {
    setCurrentCard(card);
    setView("card");
  }, []);

  const goHome = useCallback(() => {
    setCurrentCard(null);
    setView("home");
  }, []);

  const goToNext = useCallback(() => {
    setCurrentCard((prev) => {
      if (!prev) return prev;
      const idx = CARDS.findIndex((c) => c.id === prev.id);
      return CARDS[(idx + 1) % CARDS.length];
    });
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentCard((prev) => {
      if (!prev) return prev;
      const idx = CARDS.findIndex((c) => c.id === prev.id);
      return CARDS[(idx - 1 + CARDS.length) % CARDS.length];
    });
  }, []);

  const goToRandom = useCallback(() => {
    setCurrentCard(CARDS[Math.floor(Math.random() * CARDS.length)]);
  }, []);

  return (
    <div className="app-root">
      {view === "home" ? (
        <HomePage onSelectCard={goToCard} />
      ) : (
        <CardPage
          card={currentCard}
          onBack={goHome}
          onNext={goToNext}
          onPrev={goToPrev}
          onRandom={goToRandom}
          totalCards={CARDS.length}
        />
      )}
    </div>
  );
}
