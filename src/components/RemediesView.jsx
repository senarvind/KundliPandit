import { useState } from "react";
import { Sparkles, Gem, Volume2, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { playTempleChime, playSoftClick } from "../utils/soundEffects";
import { VEDIC_REMEDIES_GUIDE } from "../data/vedicData";

export default function RemediesView({ ascendant, planets }) {
  const [playingMantra, setPlayingMantra] = useState(null);

  if (!ascendant || !planets) return null;

  // Compute Lagna Lord (Life Stone), 5th Lord (Punya Stone), 9th Lord (Bhagya Stone)
  const lagnaRuler = ascendant.rashi?.ruler?.split(" ")[0]; // e.g. "Mars", "Jupiter", etc.
  
  // 5th house sign
  const fifthSign = ((ascendant.sign - 1 + 4) % 12) + 1;
  // 9th house sign
  const ninthSign = ((ascendant.sign - 1 + 8) % 12) + 1;

  const signRulers = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const fifthLord = signRulers[fifthSign - 1];
  const ninthLord = signRulers[ninthSign - 1];

  const getGemForLord = (lordName) => {
    const map = {
      Sun: "Ruby",
      Moon: "Pearl",
      Mars: "Red Coral",
      Mercury: "Emerald",
      Jupiter: "Yellow Sapphire",
      Venus: "Diamond",
      Saturn: "Blue Sapphire",
      Rahu: "Hessonite",
      Ketu: "Cat's Eye"
    };
    return map[lordName] || "Yellow Sapphire";
  };

  const lifeGem = getGemForLord(lagnaRuler);
  const punyaGem = getGemForLord(fifthLord);
  const bhagyaGem = getGemForLord(ninthLord);

  const lifeMeta = VEDIC_REMEDIES_GUIDE.gemstones[lifeGem] || VEDIC_REMEDIES_GUIDE.gemstones["Yellow Sapphire"];
  const bhagyaMeta = VEDIC_REMEDIES_GUIDE.gemstones[bhagyaGem] || VEDIC_REMEDIES_GUIDE.gemstones["Ruby"];
  const punyaMeta = VEDIC_REMEDIES_GUIDE.gemstones[punyaGem] || VEDIC_REMEDIES_GUIDE.gemstones["Emerald"];

  const handleChant = (mantraName) => {
    playTempleChime();
    setPlayingMantra(mantraName);
    setTimeout(() => setPlayingMantra(null), 3000);
  };

  return (
    <div className="remedies-container glass-card">
      <div className="section-title-bar">
        <Sparkles className="icon-gold" size={18} />
        <h3>Vedic Gemstones, Rudraksha & Astrological Remedies</h3>
      </div>

      {/* Gemstones Section */}
      <div className="gemstones-grid">
        {/* Bhagya Ratna */}
        <div className="gem-card primary-gem glow-border">
          <div className="gem-badge-top">Fortune Stone (9th House Lord - Bhagyesh)</div>
          <div className="gem-title-wrap">
            <Gem className="icon-gold" size={24} />
            <h4>{bhagyaMeta.name || bhagyaMeta.hindi}</h4>
          </div>
          <div className="gem-details-list">
            <div>
              <span>Metal:</span> <strong>{bhagyaMeta.metal}</strong>
            </div>
            <div>
              <span>Finger:</span> <strong>{bhagyaMeta.finger}</strong>
            </div>
            <div>
              <span>Wearing Day:</span> <strong>{bhagyaMeta.day}</strong>
            </div>
            <div className="mantra-line">
              <span>Beej Mantra:</span> <code>{bhagyaMeta.mantra}</code>
            </div>
          </div>
        </div>

        {/* Life Stone */}
        <div className="gem-card">
          <div className="gem-badge-top">Life Stone (Ascendant Lord - Lagnesh)</div>
          <div className="gem-title-wrap">
            <Gem size={22} />
            <h4>{lifeMeta.name || lifeMeta.hindi}</h4>
          </div>
          <div className="gem-details-list">
            <div>
              <span>Metal:</span> <strong>{lifeMeta.metal}</strong>
            </div>
            <div>
              <span>Finger:</span> <strong>{lifeMeta.finger}</strong>
            </div>
            <div>
              <span>Wearing Day:</span> <strong>{lifeMeta.day}</strong>
            </div>
            <div className="mantra-line">
              <span>Mantra:</span> <code>{lifeMeta.mantra}</code>
            </div>
          </div>
        </div>

        {/* Punya Stone */}
        <div className="gem-card">
          <div className="gem-badge-top">Punya Stone (5th House Lord - Intellect & Fortune)</div>
          <div className="gem-title-wrap">
            <Gem size={22} />
            <h4>{punyaMeta.name || punyaMeta.hindi}</h4>
          </div>
          <div className="gem-details-list">
            <div>
              <span>Metal:</span> <strong>{punyaMeta.metal}</strong>
            </div>
            <div>
              <span>Finger:</span> <strong>{punyaMeta.finger}</strong>
            </div>
            <div>
              <span>Wearing Day:</span> <strong>{punyaMeta.day}</strong>
            </div>
            <div className="mantra-line">
              <span>Mantra:</span> <code>{punyaMeta.mantra}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Rudraksha & Mantras Grid */}
      <div className="rudraksha-mantra-section">
        <div className="rudraksha-card">
          <div className="card-header-small">
            <ShieldCheck className="icon-gold" size={18} />
            <h4>Recommended Rudraksha</h4>
          </div>
          <p className="rudraksha-text">
            Based on your ascendant, a <strong>5 Mukhi Rudraksha</strong> (ruled by Jupiter / Shiva) and a <strong>3 Mukhi Rudraksha</strong> (ruled by Mars for energy balance) are most beneficial. They promote mental peace, stress reduction, and focused willpower.
          </p>
        </div>

        <div className="mantras-card">
          <div className="card-header-small">
            <Volume2 className="icon-gold" size={18} />
            <h4>Daily Protective & Auspicious Mantras</h4>
          </div>
          <div className="mantra-buttons-list">
            <div className="mantra-item">
              <div>
                <strong>Maha Mrityunjaya Mantra:</strong>
                <p>Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat.</p>
              </div>
              <button
                type="button"
                className={`chant-btn ${playingMantra === "mryt" ? "playing" : ""}`}
                onClick={() => handleChant("mryt")}
              >
                {playingMantra === "mryt" ? "Playing Chime..." : "Om Chant Chime"}
              </button>
            </div>

            <div className="mantra-item">
              <div>
                <strong>Gayatri Mahamantra:</strong>
                <p>Om Bhur Bhuvah Svah, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat.</p>
              </div>
              <button
                type="button"
                className={`chant-btn ${playingMantra === "gayatri" ? "playing" : ""}`}
                onClick={() => handleChant("gayatri")}
              >
                {playingMantra === "gayatri" ? "Playing Chime..." : "Om Chant Chime"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
