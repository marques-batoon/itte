import "./styles/global.css";
import { useState, useCallback } from "react";
import HomePage from "./components/HomePage";
import CardPage from "./components/CardPage";

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

  return (
    <div className="app-root">
      {view === "home" ? (
        <HomePage onSelectCard={goToCard} />
      ) : (
        <CardPage card={currentCard} onBack={goHome} />
      )}
    </div>
  );
}
