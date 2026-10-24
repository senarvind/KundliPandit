import { useState } from "react";
import {
  Briefcase,
  Heart,
  Coins,
  ShieldPlus,
  Smile,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Compass,
  Star
} from "lucide-react";
import { playSoftClick } from "../utils/soundEffects";

export default function LifePredictions({ interpretations }) {
  const [activeCategory, setActiveCategory] = useState("career");

  if (!interpretations) return null;

  const { career, marriage, wealth, relationships, health } = interpretations;

  const categories = [
    { key: "career", label: "Career & Profession", icon: Briefcase, color: "#38bdf8", badge: "Karma Bhava" },
    { key: "marriage", label: "Marriage & Spouse", icon: Heart, color: "#ec4899", badge: "Kalatra Bhava" },
    { key: "wealth", label: "Money & Wealth", icon: Coins, color: "#fbbf24", badge: "Dhana Bhava" },
    { key: "relationships", label: "Love & Romance", icon: Smile, color: "#a855f7", badge: "Putra Bhava" },
    { key: "health", label: "Health & Vitality", icon: ShieldPlus, color: "#10b981", badge: "Tanu Bhava" }
  ];

  return (
    <div className="life-predictions-container glass-card">
      <div className="section-title-bar">
        <div className="title-with-icon">
          <Sparkles className="icon-gold" size={20} />
          <div>
            <h3>Astrological Life Predictions & Deep Interpretations</h3>
            <span className="sub-title-text">
              Personalized analysis for Career, Marriage, Wealth, Relationships & Health based on your chart
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="pred-category-tabs">
        {categories.map((c) => {
          const IconComp = c.icon;
          const isActive = activeCategory === c.key;
          return (
            <button
              key={c.key}
              type="button"
              className={`pred-cat-btn ${isActive ? "active" : ""}`}
              onClick={() => {
                playSoftClick();
                setActiveCategory(c.key);
              }}
            >
              <IconComp size={18} style={{ color: isActive ? "#fbbf24" : c.color }} />
              <div className="cat-btn-text">
                <span className="cat-label">{c.label}</span>
                <span className="cat-sub">{c.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Panel */}
      <div className="prediction-content-display">
        {/* 1. CAREER & PROFESSION */}
        {activeCategory === "career" && career && (
          <div className="pred-detail-card glow-border animate-fade-in">
            <div className="pred-card-header">
              <div className="badge-row">
                <span className="astro-pill primary">
                  <Compass size={14} /> 10th House: {career.sign} (Lord: {career.lord})
                </span>
                <span className="astro-pill gold">
                  Lord in House {career.lordPlacementHouse}
                </span>
              </div>
              <h4>{career.title}</h4>
              <p className="pred-summary-p">{career.summary}</p>
            </div>

            {/* Score & Job vs Business */}
            <div className="metric-box-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-title">Entrepreneurial & Leadership Quotient</span>
                  <span className="metric-val text-gold">{career.entrepreneurshipScore}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${career.entrepreneurshipScore}%` }}></div>
                </div>
                <span className="metric-desc">{career.jobVsBusiness}</span>
              </div>

              <div className="metric-card highlight-box">
                <span className="metric-title">Leadership & Work Style</span>
                <p className="metric-style-text">{career.leadershipStyle}</p>
              </div>
            </div>

            {/* Best Industry Recommendations */}
            <div className="pred-section-block">
              <h5>
                <Award size={16} className="icon-gold" /> Best Suited Industries & Career Fields
              </h5>
              <div className="industry-tags-wrap">
                {career.bestIndustries.map((ind, i) => (
                  <span key={i} className="industry-tag">
                    <Star size={13} className="text-gold" /> {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Strengths & Current Dasha Influence */}
            <div className="pred-two-col">
              <div className="pred-col-card">
                <h5>Key Professional Strengths</h5>
                <ul className="pred-bullet-list">
                  {career.keyStrengths.map((st, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} className="text-success" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pred-col-card dasha-card-tint">
                <h5>Active Mahadasha Career Influence</h5>
                <p className="dasha-influence-text">{career.dashaInfluence}</p>
                <div className="action-guidance-box">
                  <strong>Strategic Career Advice:</strong>
                  <p>{career.guidance}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MARRIAGE & SPOUSE */}
        {activeCategory === "marriage" && marriage && (
          <div className="pred-detail-card glow-border animate-fade-in">
            <div className="pred-card-header">
              <div className="badge-row">
                <span className="astro-pill pink">
                  <Heart size={14} /> 7th House: {marriage.sign} (Lord: {marriage.lord})
                </span>
                <span className="astro-pill purple">
                  Navamsha D-9 Lagna: {marriage.navamshaSign}
                </span>
              </div>
              <h4>{marriage.title}</h4>
              <p className="pred-summary-p">
                Your 7th house (Kalatra Bhava) governs marriage, lifelong companionship, and spouse characteristics.
                In your chart, it is positioned in {marriage.sign}, guided by {marriage.lord}.
              </p>
            </div>

            {/* Manglik Status Banner */}
            <div className="manglik-status-strip glass-card">
              <div className="manglik-header">
                <strong>Manglik Dosha Assessment:</strong>
                <span className={`status-pill ${marriage.manglikStatus.includes("Clear") ? "status-green" : "status-amber"}`}>
                  {marriage.manglikStatus}
                </span>
              </div>
            </div>

            {/* Expected Spouse Traits Grid */}
            <div className="spouse-traits-section">
              <h5>Expected Life Partner Profile & Attributes</h5>
              <div className="spouse-cards-grid">
                <div className="trait-card">
                  <span className="trait-label">Nature & Demeanor</span>
                  <p>{marriage.spouseTraits.nature}</p>
                </div>
                <div className="trait-card">
                  <span className="trait-label">Physical & Presence Traits</span>
                  <p>{marriage.spouseTraits.appearance}</p>
                </div>
                <div className="trait-card">
                  <span className="trait-label">Core Values & Compatibility</span>
                  <p>{marriage.spouseTraits.values}</p>
                </div>
              </div>
            </div>

            {/* Marriage Timing & Astrological Advice */}
            <div className="pred-two-col">
              <div className="pred-col-card">
                <h5>Timing & Destiny Elevation</h5>
                <p>{marriage.timingInsight}</p>
                <div className="harmony-score-box">
                  <span>Inherent Marital Harmony Potential</span>
                  <div className="progress-track">
                    <div className="progress-fill pink-fill" style={{ width: `${marriage.harmonyScore}%` }}></div>
                  </div>
                  <strong className="text-gold">{marriage.harmonyScore}% Alignment</strong>
                </div>
              </div>

              <div className="pred-col-card">
                <h5>Vedic Marriage Guidance</h5>
                <p className="guidance-body-text">{marriage.guidance}</p>
                <div className="action-guidance-box">
                  <strong>Horoscope Matching Tip:</strong>
                  <p>Check the 36 Guna Ashtakoot Matching tab for complete mutual compatibility with your partner.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MONEY, WEALTH & PROSPERITY */}
        {activeCategory === "wealth" && wealth && (
          <div className="pred-detail-card glow-border animate-fade-in">
            <div className="pred-card-header">
              <div className="badge-row">
                <span className="astro-pill gold">
                  <Coins size={14} /> 2nd House (Dhana): {wealth.dhanaSign}
                </span>
                <span className="astro-pill green">
                  <TrendingUp size={14} /> 11th House (Labha): {wealth.labhaSign}
                </span>
              </div>
              <h4>{wealth.title}</h4>
              <p className="pred-summary-p">
                Your financial prospects, accumulated savings (2nd House), and incoming gains (11th House) indicate
                a robust potential for financial security and wealth compounding over time.
              </p>
            </div>

            {/* Financial Stability Metric */}
            <div className="metric-box-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-title">Wealth Accumulation & Stability Index</span>
                  <span className="metric-val text-gold">{wealth.financialStabilityScore}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill gold-fill" style={{ width: `${wealth.financialStabilityScore}%` }}></div>
                </div>
                <span className="metric-desc">High potential for asset preservation and long-term security.</span>
              </div>

              <div className="metric-card">
                <span className="metric-title">Active Dhana & Lakshmi Yogas</span>
                <div className="yoga-mini-chips">
                  {wealth.wealthYogas.length > 0 ? (
                    wealth.wealthYogas.map((y, i) => (
                      <span key={i} className="mini-yoga-tag">
                        <Sparkles size={12} className="text-gold" /> {y}
                      </span>
                    ))
                  ) : (
                    <span className="mini-yoga-tag neutral">Consistent Organic Financial Growth</span>
                  )}
                </div>
              </div>
            </div>

            {/* Income Streams & Investment Assets */}
            <div className="pred-two-col">
              <div className="pred-col-card">
                <h5>Primary Income Channels</h5>
                <ul className="pred-bullet-list">
                  {wealth.incomeSources.map((src, i) => (
                    <li key={i}>
                      <Coins size={15} className="text-gold" />
                      <span>{src}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pred-col-card">
                <h5>Investment Strengths & Strategic Growth</h5>
                <ul className="pred-bullet-list">
                  {wealth.investmentStrengths.map((inv, i) => (
                    <li key={i}>
                      <TrendingUp size={15} className="text-success" />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
                <div className="caution-box">
                  <AlertCircle size={16} className="text-warning" />
                  <span>{wealth.cautionNote}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. LOVE, ROMANCE & RELATIONSHIPS */}
        {activeCategory === "relationships" && relationships && (
          <div className="pred-detail-card glow-border animate-fade-in">
            <div className="pred-card-header">
              <div className="badge-row">
                <span className="astro-pill purple">
                  <Smile size={14} /> 5th House (Romance): {relationships.fifthSign}
                </span>
                <span className="astro-pill pink">
                  {relationships.venusPlacement}
                </span>
              </div>
              <h4>{relationships.title}</h4>
              <p className="pred-summary-p">
                The 5th house and planetary placements of Venus and Moon govern your emotional intelligence,
                romantic expression, and capacity for deep heartfelt intimacy.
              </p>
            </div>

            <div className="pred-two-col">
              <div className="pred-col-card">
                <h5>Romantic Nature & Style</h5>
                <p className="romantic-style-lead">{relationships.romanticStyle}</p>
                <div className="lunar-note-box">
                  <strong>Lunar Temperament:</strong>
                  <p>{relationships.moonNature}</p>
                </div>
              </div>

              <div className="pred-col-card">
                <h5>Emotional Compatibility Strengths</h5>
                <ul className="pred-bullet-list">
                  {relationships.compatibilityTraits.map((tr, i) => (
                    <li key={i}>
                      <Heart size={15} className="text-pink" />
                      <span>{tr}</span>
                    </li>
                  ))}
                </ul>
                <div className="action-guidance-box">
                  <strong>Relationship Advice:</strong>
                  <p>{relationships.guidance}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. HEALTH & VITALITY */}
        {activeCategory === "health" && health && (
          <div className="pred-detail-card glow-border animate-fade-in">
            <div className="pred-card-header">
              <div className="badge-row">
                <span className="astro-pill green">
                  <ShieldPlus size={14} /> Ascendant: {health.ascendantSign}
                </span>
                <span className="astro-pill gold">
                  Ayurvedic Type: {health.constitution}
                </span>
              </div>
              <h4>{health.title}</h4>
              <p className="pred-summary-p">
                Vedic astrology assesses physical stamina and vitality (Tanu Bhava) through your ascendant
                elemental balance, solar vitality, and lifestyle harmony.
              </p>
            </div>

            <div className="metric-box-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-title">Inherent Physical Vitality Index</span>
                  <span className="metric-val text-gold">{health.vitalityScore}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill green-fill" style={{ width: `${health.vitalityScore}%` }}></div>
                </div>
                <span className="metric-desc">Robust immune constitution and good recuperative capacity.</span>
              </div>

              <div className="metric-card">
                <span className="metric-title">Sensitive Areas for Preventive Care</span>
                <p className="focus-areas-text">{health.focusAreas}</p>
              </div>
            </div>

            <div className="pred-two-col">
              <div className="pred-col-card">
                <h5>Ayurvedic Lifestyle & Diet Tips</h5>
                <p>{health.tips}</p>
              </div>

              <div className="pred-col-card">
                <h5>Daily Wellness Strategy</h5>
                <p>{health.lifestyleAdvice}</p>
                <div className="action-guidance-box">
                  <strong>Holistic Vitality Note:</strong>
                  <p>{health.guidance}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
