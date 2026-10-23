import { useState } from "react";
import { Sparkles, Calendar, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { playSoftClick } from "../utils/soundEffects";

export default function VimshottariDasha({ dashaData }) {
  const [expandedMaha, setExpandedMaha] = useState(null);

  if (!dashaData || !dashaData.timeline) return null;

  const { timeline, activeMahadasha, activeAntardasha, balanceYears, birthLord } = dashaData;

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const toggleExpand = (lord) => {
    playSoftClick();
    setExpandedMaha(expandedMaha === lord ? null : lord);
  };

  // Compute progress percentage of active Mahadasha
  let progressPercent = 50;
  if (activeMahadasha) {
    const start = new Date(activeMahadasha.startDate).getTime();
    const end = new Date(activeMahadasha.endDate).getTime();
    const now = Date.now();
    if (end > start) {
      progressPercent = Math.min(Math.max(Math.round(((now - start) / (end - start)) * 100), 0), 100);
    }
  }

  return (
    <div className="vimshottari-container glass-card">
      <div className="section-title-bar">
        <Sparkles className="icon-gold" size={18} />
        <h3>Vimshottari Mahadasha & Antardasha (120-Year Planetary Cycle)</h3>
      </div>

      {/* Current Active Dasha Banner */}
      {activeMahadasha && (
        <div className="active-dasha-banner">
          <div className="active-dasha-header">
            <span className="live-indicator">
              <span className="live-pulse"></span>
              Current Active Period
            </span>
            <span className="balance-info">
              Birth Dasha Balance: <strong>{birthLord} ({balanceYears} Years)</strong>
            </span>
          </div>

          <div className="active-dasha-content">
            <div className="dasha-highlight-card">
              <div className="dasha-type">Mahadasha Lord</div>
              <div className="dasha-lord-name">{activeMahadasha.lord}</div>
              <div className="dasha-dates">
                {formatDate(activeMahadasha.startDate)} — {formatDate(activeMahadasha.endDate)}
              </div>
            </div>

            <div className="dasha-divider">⤏</div>

            <div className="dasha-highlight-card secondary">
              <div className="dasha-type">Antardasha Lord</div>
              <div className="dasha-lord-name">{activeAntardasha?.lord || "Progressing"}</div>
              <div className="dasha-dates">
                {formatDate(activeAntardasha?.startDate)} — {formatDate(activeAntardasha?.endDate)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="dasha-progress-wrap">
            <div className="progress-labels">
              <span>Mahadasha Progress</span>
              <span>{progressPercent}% Elapsed</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Full 120-Year Timeline List */}
      <div className="timeline-section">
        <h4 className="timeline-title">Complete 120-Year Dasha Timeline:</h4>
        <div className="dasha-timeline-list">
          {timeline.map((item, idx) => {
            const isCurrent = activeMahadasha && activeMahadasha.lord === item.lord;
            const isExpanded = expandedMaha === item.lord;

            return (
              <div
                key={idx}
                className={`dasha-row-card ${isCurrent ? "current-maha" : ""}`}
              >
                <div
                  className="dasha-row-header"
                  onClick={() => toggleExpand(item.lord)}
                >
                  <div className="dasha-info-left">
                    {isExpanded ? (
                      <ChevronDown size={18} className="icon-gold" />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <span className="maha-badge">{item.lord} Mahadasha</span>
                    <span className="years-tag">
                      {item.isBalance ? `${item.effectiveYears.toFixed(1)} Yrs (Balance)` : `${item.totalYears} Years`}
                    </span>
                    {isCurrent && <span className="active-pill">Running</span>}
                  </div>
                  <div className="dasha-info-right">
                    <Calendar size={14} />
                    <span>
                      {formatDate(item.startDate)} to {formatDate(item.endDate)}
                    </span>
                  </div>
                </div>

                {/* Subperiod Antardasha Expansion */}
                {isExpanded && (
                  <div className="antardasha-grid">
                    {item.antardashas.map((sub, sIdx) => {
                      const isSubCurrent =
                        activeAntardasha &&
                        isCurrent &&
                        activeAntardasha.lord === sub.lord;

                      return (
                        <div
                          key={sIdx}
                          className={`antar-chip ${isSubCurrent ? "active-antar" : ""}`}
                        >
                          <div className="antar-name">
                            <strong>{item.lord} - {sub.lord}</strong>
                            {isSubCurrent && <span className="sub-current-dot">●</span>}
                          </div>
                          <div className="antar-dates">
                            {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
