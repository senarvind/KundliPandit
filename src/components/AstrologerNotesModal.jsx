import { useState, useEffect } from "react";
import { X, Save, FileText, CheckCircle2 } from "lucide-react";
import { playSoftClick, playTempleChime } from "../utils/soundEffects";

export default function AstrologerNotesModal({
  isOpen,
  onClose,
  clientName,
  birthDate
}) {
  const storageKey = `astro_notes_${clientName}_${birthDate}`;
  const [notes, setNotes] = useState("");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotes(saved);
      } else {
        setNotes(
          `Astrological Consultation Notes & Summary:\n\n` +
          `• Client Name: ${clientName}\n` +
          `• Primary Life Area (Career / Health / Marriage): \n` +
          `• Active Dasha Period Influence: \n` +
          `• Recommended Remedies & Gemstones: \n` +
          `• Key Predictions & Milestone Years: \n`
        );
      }
    }
  }, [isOpen, storageKey, clientName]);

  if (!isOpen) return null;

  const handleSave = () => {
    playTempleChime();
    localStorage.setItem(storageKey, notes);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FileText className="icon-gold" size={20} />
            <h3>Astrologer Consultation Notes</h3>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => {
              playSoftClick();
              onClose();
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-sub">
          Client: <strong>{clientName}</strong> | DOB: {birthDate}
        </div>

        <div className="modal-body">
          <textarea
            className="notes-textarea"
            rows={12}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter confidential astrologer notes, predictions, or remedies here..."
          />
        </div>

        <div className="modal-footer">
          {isSavedNotice ? (
            <span className="saved-indicator">
              <CheckCircle2 size={18} /> Notes saved successfully!
            </span>
          ) : (
            <span className="notes-hint">
              These notes are stored privately in your browser.
            </span>
          )}

          <div className="modal-btn-row">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                playSoftClick();
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-save glow-pulse"
              onClick={handleSave}
            >
              <Save size={16} /> Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
