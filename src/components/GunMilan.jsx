import { useState } from "react";
import { Sparkles, Heart, CheckCircle2, XCircle, Award } from "lucide-react";
import { calculateGunMilan, calculateNakshatra } from "../utils/astronomyEngine";
import { playTempleChime, playSoftClick } from "../utils/soundEffects";
import confetti from "canvas-confetti";

export default function GunMilan({ nativeMoonDeg }) {
  // Partner Moon degree state (default offset for interesting match)
  const [partnerOffset, setPartnerOffset] = useState(48); // Taurus Rohini
  const [partnerName, setPartnerName] = useState("Potential Partner");

  const partnerMoonDeg = (nativeMoonDeg + partnerOffset) % 360;
  const matchResult = calculateGunMilan(nativeMoonDeg, partnerMoonDeg);

  const nativeNak = calculateNakshatra(nativeMoonDeg);
  const partnerNak = calculateNakshatra(partnerMoonDeg);

  const triggerCelebration = () => {
    playTempleChime();
    if (matchResult.obtained >= 18) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#ec4899", "#a855f7"]
      });
    }
  };

  return (
    <div className="gun-milan-container glass-card">
      <div className="section-title-bar">
        <div className="title-with-icon">
          <Heart className="icon-gold" size={20} />
          <h3>36 Guna Ashtakoot Vivah Milan (Horoscope Matching)</h3>
        </div>
        <button
          type="button"
          className="celebrate-btn"
          onClick={triggerCelebration}
        >
          <Sparkles size={16} /> Check Match Compatibility
        </button>
      </div>

      {/* Nakshatra Pair Overview */}
      <div className="milan-pair-cards">
        <div className="milan-person-card">
          <span className="card-badge">Native</span>
          <div className="person-nak">
            <strong>{nativeNak.name}</strong> (Pada {nativeNak.pada})
          </div>
          <span className="person-lord">Nakshatra Lord: {nativeNak.lord}</span>
        </div>

        <div className="milan-vs">
          <Heart size={24} className="heart-pulse" />
        </div>

        <div className="milan-person-card partner">
          <span className="card-badge">Partner</span>
          <div className="person-nak">
            <strong>{partnerNak.name}</strong> (Pada {partnerNak.pada})
          </div>
          <span className="person-lord">Nakshatra Lord: {partnerNak.lord}</span>
        </div>
      </div>

      {/* Partner Nakshatra Slider / Selector */}
      <div className="milan-controls">
        <label>Adjust Partner's Moon Position (Nakshatra):</label>
        <input
          type="range"
          min="0"
          max="359"
          value={partnerOffset}
          onChange={(e) => {
            playSoftClick();
            setPartnerOffset(parseFloat(e.target.value));
          }}
          className="milan-slider"
        />
      </div>

      {/* Score Summary Banner */}
      <div className={`score-summary-banner ${matchResult.obtained >= 18 ? "auspicious" : "inauspicious"}`}>
        <div className="score-number-wrap">
          <span className="score-big">{matchResult.obtained}</span>
          <span className="score-total">/ 36 Gunas</span>
        </div>
        <div className="score-verdict">
          <h4>
            {matchResult.obtained >= 25
              ? "Exceptional Match (Uttam Vivah)"
              : matchResult.obtained >= 18
              ? "Auspicious Match (Madhyam Vivah)"
              : "Requires Astrological Consultation (Low Compatibility)"}
          </h4>
          <p>
            {matchResult.obtained >= 18
              ? "According to Vedic astrology, scoring 18 or more points indicates a harmonious and auspicious union."
              : "Score is below 18 points. Detailed Nadi or Bhakoot Dosha consultation is advised before proceeding."}
          </p>
        </div>
      </div>

      {/* Detailed Ashtakoot Table */}
      <div className="table-responsive">
        <table className="ashtakoot-table">
          <thead>
            <tr>
              <th>Koot Factor</th>
              <th>Max Guna</th>
              <th>Obtained</th>
              <th>Significance & Compatibility Area</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {matchResult.breakdown.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.max}</td>
                <td>
                  <strong className={item.scored > 0 ? "text-success" : "text-danger"}>
                    {item.scored}
                  </strong>
                </td>
                <td className="desc-text">{item.desc}</td>
                <td>
                  {item.scored > 0 ? (
                    <span className="tag-ok">
                      <CheckCircle2 size={14} /> Compatible
                    </span>
                  ) : (
                    <span className="tag-warn">
                      <XCircle size={14} /> Afflicted / Low
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
