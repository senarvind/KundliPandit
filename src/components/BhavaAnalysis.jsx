import { HOUSES } from "../data/vedicData";
import { Sparkles, Shield, Award, Heart, Briefcase } from "lucide-react";

export default function BhavaAnalysis({
  houses,
  ascendant,
  activeHouse,
  onSelectHouse
}) {
  if (!houses) return null;

  return (
    <div className="bhava-analysis-container glass-card">
      <div className="section-title-bar">
        <Sparkles className="icon-gold" size={18} />
        <h3>12 Houses Analysis (Bhava Kundli)</h3>
      </div>

      <div className="bhavas-grid">
        {HOUSES.map((meta) => {
          const h = houses[meta.num];
          if (!h) return null;

          const isSelected = activeHouse === meta.num;
          const isKendra = [1, 4, 7, 10].includes(meta.num);
          const isTrikona = [1, 5, 9].includes(meta.num);
          const isDusthana = [6, 8, 12].includes(meta.num);
          const isUpachaya = [3, 6, 10, 11].includes(meta.num);

          let classification = "General House";
          let badgeClass = "badge-neutral";
          if (isKendra && isTrikona) {
            classification = "Ascendant (Kendra-Trikona)";
            badgeClass = "badge-royal";
          } else if (isKendra) {
            classification = "Kendra (Pillar of Life)";
            badgeClass = "badge-kendra";
          } else if (isTrikona) {
            classification = "Trikona (Fortune & Lakshmi)";
            badgeClass = "badge-trikona";
          } else if (isDusthana) {
            classification = "Dusthana (Challenges & Growth)";
            badgeClass = "badge-dusthana";
          } else if (isUpachaya) {
            classification = "Upachaya (Improvement Over Time)";
            badgeClass = "badge-upachaya";
          }

          return (
            <div
              key={meta.num}
              className={`bhava-card ${isSelected ? "selected" : ""} ${isKendra ? "kendra-card" : ""}`}
              onClick={() => onSelectHouse && onSelectHouse(meta.num)}
            >
              <div className="bhava-card-header">
                <div className="bhava-num-badge">House {meta.num}</div>
                <span className={`bhava-type-pill ${badgeClass}`}>
                  {classification}
                </span>
              </div>

              <div className="bhava-rashi-info">
                <strong>{h.rashi.english} ({h.rashi.name})</strong>
                <span className="bhava-lord">Lord: {h.lord}</span>
              </div>

              <div className="bhava-planets-list">
                <span className="occupants-label">Occupying Planets:</span>
                {h.planets.length === 0 ? (
                  <span className="no-planets">None (Empty House)</span>
                ) : (
                  <div className="occupant-chips">
                    {h.planets.map((p) => (
                      <span
                        key={p.id}
                        className={`occupant-badge ${p.dignityCode}`}
                      >
                        {p.name} {p.isRetrograde ? "Ⓡ" : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bhava-significations">
                <p>{meta.significations}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
