import { useState } from "react";
import { Sparkles, Printer, Volume2, VolumeX, FolderHeart, FileText, Bot, BookOpen } from "lucide-react";
import { playTempleChime, playSoftClick, setSoundEnabled } from "../utils/soundEffects";

export default function Navbar({
  soundOn,
  setSoundOn,
  onOpenSavedDrawer,
  savedCount,
  onOpenNotesModal,
  onOpenAIModal,
  onOpenPatrikaModal
}) {
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playTempleChime();
    }
  };

  return (
    <header className="astro-navbar glass-nav">
      <div className="nav-container">
        {/* Brand */}
        <div className="brand-wrap">
          <div className="brand-logo-glow">
            <span className="brand-om">ॐ</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">AstroKundli <span>Portal</span></h1>
            <span className="brand-sub">Vedic Astrology Suite • Real-Life Brihat Janam Patrika</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Audio toggle */}
          <button
            type="button"
            className={`nav-btn ${soundOn ? "active" : ""}`}
            onClick={handleToggleSound}
            title={soundOn ? "Mute Sound Effects" : "Enable Sound Effects"}
          >
            {soundOn ? <Volume2 size={18} className="icon-gold" /> : <VolumeX size={18} />}
            <span className="btn-label">{soundOn ? "Sound On" : "Mute"}</span>
          </button>

          {/* AI Pandit Ji Consultation */}
          <button
            type="button"
            className="nav-btn ai-special-nav-btn glow-pulse"
            onClick={() => {
              playTempleChime();
              onOpenAIModal();
            }}
            title="AI ज्योतिषाचार्य परामर्श (AI Pandit Ji Consultation)"
          >
            <Bot size={18} className="icon-gold" />
            <span className="btn-label text-gold">AI ज्योतिषाचार्य</span>
          </button>

          {/* Astrologer Notes */}
          <button
            type="button"
            className="nav-btn"
            onClick={() => {
              playSoftClick();
              onOpenNotesModal();
            }}
            title="Astrologer Consultation Notes"
          >
            <FileText size={18} />
            <span className="btn-label">Notes</span>
          </button>

          {/* Saved Clients */}
          <button
            type="button"
            className="nav-btn"
            onClick={() => {
              playSoftClick();
              onOpenSavedDrawer();
            }}
            title="Saved Client Charts"
          >
            <FolderHeart size={18} />
            <span className="btn-label">Saved</span>
            {savedCount > 0 && <span className="counter-badge">{savedCount}</span>}
          </button>

          {/* Brihat Kundli Patrika PDF Report */}
          <button
            type="button"
            className="nav-btn primary-action-btn"
            onClick={() => {
              playSoftClick();
              onOpenPatrikaModal();
            }}
            title="सम्पूर्ण बृहत् जन्मपत्रिका (Real Life Kundli PDF Report)"
          >
            <Printer size={18} />
            <span className="btn-label">बृहत् कुण्डली PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}
