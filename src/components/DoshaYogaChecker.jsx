import { Sparkles, AlertTriangle, CheckCircle, ShieldAlert, Award } from "lucide-react";

export default function DoshaYogaChecker({ doshasAndYogas }) {
  if (!doshasAndYogas) return null;

  const { yogas = [], doshas = [] } = doshasAndYogas;

  return (
    <div className="dosha-yoga-container glass-card">
      <div className="section-title-bar">
        <Sparkles className="icon-gold" size={18} />
        <h3>Doshas & Auspicious Yogas Analysis</h3>
      </div>

      {/* Major Dosha Check Cards */}
      <div className="doshas-section">
        <h4 className="sub-heading">Major Astrological Doshas Check:</h4>
        <div className="doshas-grid">
          {doshas.map((d) => {
            const isAfflicted = d.status.includes("Present") || d.status.includes("Active");
            const isCancelled = d.status.includes("Cancelled");

            let statusClass = "status-green";
            if (isAfflicted) statusClass = "status-red";
            else if (isCancelled) statusClass = "status-amber";

            return (
              <div key={d.id} className={`dosha-card ${statusClass}`}>
                <div className="dosha-card-top">
                  <div className="dosha-title-row">
                    {isAfflicted ? (
                      <AlertTriangle className="icon-danger" size={20} />
                    ) : isCancelled ? (
                      <ShieldAlert className="icon-warning" size={20} />
                    ) : (
                      <CheckCircle className="icon-success" size={20} />
                    )}
                    <strong>{d.name}</strong>
                  </div>
                  <span className={`status-pill ${statusClass}`}>{d.status}</span>
                </div>

                <div className="dosha-body">
                  <p className="dosha-desc">{d.description}</p>
                  <div className="remedy-box">
                    <span className="remedy-label">Vedic Remedies & Solutions:</span>
                    <p className="remedy-text">{d.remedy}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auspicious Raj Yogas */}
      <div className="yogas-section">
        <h4 className="sub-heading">Auspicious Raj Yogas Present in Chart:</h4>
        {yogas.length === 0 ? (
          <div className="empty-yogas">
            Standard planetary placements observed. No prominent Mahapurusha Raj Yoga detected in the current planetary configuration.
          </div>
        ) : (
          <div className="yogas-grid">
            {yogas.map((y, idx) => (
              <div key={idx} className="yoga-card glow-border">
                <div className="yoga-card-top">
                  <div className="yoga-title-wrap">
                    <Award className="icon-gold" size={20} />
                    <strong>{y.name}</strong>
                  </div>
                  <span className="yoga-category-pill">{y.category}</span>
                </div>
                <p className="yoga-desc">{y.description}</p>
                <div className="yoga-strength">
                  Strength / Influence: <strong>{y.strength}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
