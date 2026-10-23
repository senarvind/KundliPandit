import { useState } from "react";
import { Sparkles, Printer, Volume2, VolumeX, FolderHeart, FileText } from "lucide-react";
import { playTempleChime, playSoftClick, setSoundEnabled } from "../utils/soundEffects";

export default function Navbar({
  soundOn,
  setSoundOn,
  onOpenSavedDrawer,
  savedCount,
  onOpenNotesModal
}) {
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playTempleChime();
    }
  };

  const handlePrint = () => {
    playSoftClick();
    window.print();
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
            <span className="brand-sub">Vedic Astrology Suite • Professional Astrologer Edition</span>
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
            <span className="btn-label">Consultation Notes</span>
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
            <span className="btn-label">Saved Charts</span>
            {savedCount > 0 && <span className="counter-badge">{savedCount}</span>}
          </button>

          {/* Print / Export Report */}
          <button
            type="button"
            className="nav-btn primary-action-btn"
            onClick={handlePrint}
            title="Print / Export Kundli PDF Report"
          >
            <Printer size={18} />
            <span className="btn-label">Print / PDF Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
