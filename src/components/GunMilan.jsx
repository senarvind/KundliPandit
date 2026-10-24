import { useState, useMemo } from "react";
import {
  Sparkles,
  Heart,
  CheckCircle2,
  XCircle,
  Award,
  User,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Flame,
  FileCheck2
} from "lucide-react";
import {
  calculateJulianDay,
  calculateLahiriAyanamsa,
  calculatePlanets,
  calculateAscendant,
  calculateNakshatra,
  calculateGunMilan
} from "../utils/astronomyEngine";
import { CITIES, RASHIS } from "../data/vedicData";
import { playTempleChime, playSoftClick } from "../utils/soundEffects";
import confetti from "canvas-confetti";

export default function GunMilan({
  nativeFormData,
  nativeMoonDeg = 48,
  nativePlanets = [],
  nativeAscendant = null
}) {
  // Partner's birth details state
  const [partnerData, setPartnerData] = useState({
    name: "Pooja Verma",
    gender: nativeFormData?.gender === "Female" ? "Male" : "Female",
    date: "1997-08-22",
    time: "14:30:00",
    city: "New Delhi, India",
    lat: 28.6139,
    lng: 77.209,
    tz: 5.5
  });

  const [activeMilanView, setActiveMilanView] = useState("breakdown"); // "breakdown" | "manglik" | "remedies"

  // Quick sample partners for 1-click test
  const samplePartners = [
    { name: "Pooja Verma (Delhi)", gender: "Female", date: "1997-08-22", time: "14:30:00", city: "New Delhi, India", lat: 28.6139, lng: 77.209, tz: 5.5 },
    { name: "Neha Sharma (Mumbai)", gender: "Female", date: "1998-11-14", time: "09:15:00", city: "Mumbai, India", lat: 19.076, lng: 72.8777, tz: 5.5 },
    { name: "Rahul Gupta (Varanasi)", gender: "Male", date: "1995-03-30", time: "18:45:00", city: "Varanasi (Kashi), India", lat: 25.3176, lng: 82.9739, tz: 5.5 }
  ];

  const handleSelectCity = (cityName) => {
    playSoftClick();
    const c = CITIES.find((item) => item.name === cityName);
    if (c) {
      setPartnerData({
        ...partnerData,
        city: c.name,
        lat: c.lat,
        lng: c.lng,
        tz: c.tz
      });
    }
  };

  const handleLoadSamplePartner = (sample) => {
    playSoftClick();
    setPartnerData({ ...sample });
  };

  // Compute Partner's Astro Data
  const partnerAstro = useMemo(() => {
    try {
      const [year, month, day] = partnerData.date.split("-").map(Number);
      const [hour, minute, sec = 0] = partnerData.time.split(":").map(Number);
      const JD = calculateJulianDay(year, month, day, hour, minute, sec, partnerData.tz || 5.5);
      const ayanamsa = calculateLahiriAyanamsa(JD);
      const planets = calculatePlanets(JD, ayanamsa);
      const asc = calculateAscendant(JD, partnerData.lat, partnerData.lng, ayanamsa);

      const moon = planets.find((p) => p.id === "Moon");
      const mars = planets.find((p) => p.id === "Mars");
      const moonDeg = moon ? moon.longitude : 0;
      const nak = calculateNakshatra(moonDeg);

      // Simple Manglik check for partner
      // Mars in 1, 2, 4, 7, 8, 12 from Lagna or Moon
      const marsHouse = mars ? mars.house : 1;
      const isManglik = [1, 2, 4, 7, 8, 12].includes(marsHouse);

      return {
        moonDeg,
        moon,
        mars,
        nak,
        isManglik,
        rashi: moon?.rashi || RASHIS[0]
      };
    } catch (err) {
      console.error("Error computing partner chart:", err);
      return null;
    }
  }, [partnerData]);

  // Native astro details
  const nativeNak = calculateNakshatra(nativeMoonDeg);
  const nativeSignNum = Math.floor(nativeMoonDeg / 30) + 1;
  const nativeRashi = RASHIS[nativeSignNum - 1] || RASHIS[0];

  // Native Manglik check
  const nativeMars = nativePlanets.find((p) => p.id === "Mars");
  const isNativeManglik = nativeMars && [1, 2, 4, 7, 8, 12].includes(nativeMars.house);

  // 36 Guna Ashtakoot Milan Calculation
  const partnerMoonDeg = partnerAstro?.moonDeg || 0;
  const matchResult = useMemo(() => {
    return calculateGunMilan(nativeMoonDeg, partnerMoonDeg);
  }, [nativeMoonDeg, partnerMoonDeg]);

  // Mutual Manglik Analysis
  const isPartnerManglik = partnerAstro?.isManglik || false;
  let manglikCompatibility = "Compatible (Neither is Manglik)";
  let manglikStatusClass = "status-green";
  let manglikExplanation = "Neither partner has Mars affliction in sensitive relationship houses. Natural marital harmony is favored.";

  if (isNativeManglik && isPartnerManglik) {
    manglikCompatibility = "Harmonious (Both are Manglik - Dosha Nullified)";
    manglikStatusClass = "status-green";
    manglikExplanation = "When both partners are Manglik, the fiery intensity balances mutually according to Maharishi Parashara rules. Mars dosha is effectively cancelled.";
  } else if (isNativeManglik && !isPartnerManglik) {
    manglikCompatibility = "Requires Remedy (Native is Manglik, Partner is Non-Manglik)";
    manglikStatusClass = "status-amber";
    manglikExplanation = "Mars energy is stronger in the Native's chart. Astrological remedies (Hanuman Chalisa, Kumbh Vivah) or planetary cancellation checks are recommended.";
  } else if (!isNativeManglik && isPartnerManglik) {
    manglikCompatibility = "Requires Remedy (Partner is Manglik, Native is Non-Manglik)";
    manglikStatusClass = "status-amber";
    manglikExplanation = "Partner has Mars in an afflicting house. Regular worship and mutual astrological alignment ensure steady marital peace.";
  }

  // Check critical Doshas: Nadi & Bhakoot
  const nadiKoot = matchResult.breakdown.find((k) => k.name === "Nadi");
  const bhakootKoot = matchResult.breakdown.find((k) => k.name === "Bhakoot");
  const hasNadiDosha = nadiKoot && nadiKoot.scored === 0;
  const hasBhakootDosha = bhakootKoot && bhakootKoot.scored === 0;

  const triggerCelebration = () => {
    playTempleChime();
    if (matchResult.obtained >= 18) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#ec4899", "#a855f7", "#10b981"]
      });
    }
  };

  return (
    <div className="gun-milan-container glass-card">
      <div className="section-title-bar">
        <div className="title-with-icon">
          <Heart className="icon-gold" size={22} />
          <div>
            <h3>36 Guna Ashtakoot Kundli Matching (Vivah Milan)</h3>
            <span className="sub-title-text">
              Comprehensive Vedic matrimonial compatibility & mutual Manglik Dosha analysis
            </span>
          </div>
        </div>
        <button
          type="button"
          className="celebrate-btn glow-pulse"
          onClick={triggerCelebration}
        >
          <Sparkles size={16} /> Re-Calculate Match
        </button>
      </div>

      {/* Two Profiles Input & Overview Strip */}
      <div className="milan-input-grid">
        {/* Profile 1: Native (You) */}
        <div className="milan-profile-card native-card">
          <div className="profile-badge-top primary">
            <User size={14} /> Profile 1: Native (You)
          </div>
          <div className="profile-main-info">
            <h4>{nativeFormData?.name || "Native"}</h4>
            <div className="profile-sub-details">
              <span>{nativeFormData?.gender || "Male"} • {nativeFormData?.date || "1996-05-18"}</span>
              <span className="location-tag"><MapPin size={12} /> {nativeFormData?.city || "Varanasi, India"}</span>
            </div>
            <div className="profile-astro-pills">
              <span className="m-pill">Moon Sign: <strong>{nativeRashi.english} ({nativeRashi.name})</strong></span>
              <span className="m-pill">Nakshatra: <strong>{nativeNak.name} (Pada {nativeNak.pada})</strong></span>
              <span className="m-pill">Nakshatra Lord: <strong>{nativeNak.lord}</strong></span>
              <span className={`m-pill ${isNativeManglik ? "text-danger" : "text-success"}`}>
                {isNativeManglik ? "Manglik" : "Non-Manglik"}
              </span>
            </div>
          </div>
        </div>

        {/* Central Union Seal */}
        <div className="milan-center-seal">
          <div className="heart-circle">
            <Heart size={26} className="heart-pulse" />
          </div>
          <span className="seal-text">36 GUNA MILAN</span>
        </div>

        {/* Profile 2: Partner (Interactive Form) */}
        <div className="milan-profile-card partner-card">
          <div className="profile-badge-top pink">
            <User size={14} /> Profile 2: Prospective Partner
          </div>

          {/* Quick Partner Samples */}
          <div className="partner-quick-samples">
            <span className="sample-txt">Sample Profiles:</span>
            {samplePartners.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                className="mini-sample-btn"
                onClick={() => handleLoadSamplePartner(sp)}
              >
                {sp.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="partner-form-inline">
            <div className="p-input-row">
              <input
                type="text"
                value={partnerData.name}
                onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })}
                placeholder="Partner Full Name"
                className="astro-input-sm"
              />
              <select
                value={partnerData.gender}
                onChange={(e) => setPartnerData({ ...partnerData, gender: e.target.value })}
                className="astro-select-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div className="p-input-row">
              <input
                type="date"
                value={partnerData.date}
                onChange={(e) => setPartnerData({ ...partnerData, date: e.target.value })}
                className="astro-input-sm"
              />
              <input
                type="time"
                step="1"
                value={partnerData.time}
                onChange={(e) => setPartnerData({ ...partnerData, time: e.target.value })}
                className="astro-input-sm"
              />
            </div>

            <div className="p-input-row">
              <select
                value={partnerData.city}
                onChange={(e) => handleSelectCity(e.target.value)}
                className="astro-select-sm flex-1"
              >
                {CITIES.map((c, i) => (
                  <option key={i} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Computed Partner Astro Pills */}
          {partnerAstro && (
            <div className="profile-astro-pills mt-2">
              <span className="m-pill">Moon: <strong>{partnerAstro.rashi.english}</strong></span>
              <span className="m-pill">Nakshatra: <strong>{partnerAstro.nak.name} (Pada {partnerAstro.nak.pada})</strong></span>
              <span className={`m-pill ${isPartnerManglik ? "text-danger" : "text-success"}`}>
                {isPartnerManglik ? "Manglik" : "Non-Manglik"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Score & Compatibility Banner */}
      <div className={`score-summary-banner ${matchResult.obtained >= 18 ? "auspicious" : "inauspicious"}`}>
        <div className="score-number-wrap">
          <span className="score-big">{matchResult.obtained}</span>
          <span className="score-total">/ 36 Gunas</span>
          <span className="score-percentage-tag">{matchResult.percentage}% Compatible</span>
        </div>
        <div className="score-verdict">
          <h4>
            {matchResult.obtained >= 28
              ? "Exceptional Match (Uttam Vivah - Highest Harmony)"
              : matchResult.obtained >= 18
              ? "Auspicious & Harmonious Match (Madhyam Vivah)"
              : "Requires Astrological Consultation (Low Compatibility Score)"}
          </h4>
          <p>
            {matchResult.obtained >= 18
              ? "According to Vedic astrology, scoring 18 or more points signifies auspicious compatibility for marriage, family prosperity, and mutual growth."
              : "The score is below 18 points. Detailed evaluation of Nadi and Bhakoot doshas by a qualified astrologer is strongly recommended before proceeding."}
          </p>
        </div>
      </div>

      {/* Internal Milan View Toggles */}
      <div className="milan-sub-nav">
        <button
          type="button"
          className={`sub-nav-btn ${activeMilanView === "breakdown" ? "active" : ""}`}
          onClick={() => { playSoftClick(); setActiveMilanView("breakdown"); }}
        >
          <Award size={16} /> 8 Koot Breakdown (36 Gunas)
        </button>
        <button
          type="button"
          className={`sub-nav-btn ${activeMilanView === "manglik" ? "active" : ""}`}
          onClick={() => { playSoftClick(); setActiveMilanView("manglik"); }}
        >
          <Flame size={16} /> Mutual Manglik Check
        </button>
        <button
          type="button"
          className={`sub-nav-btn ${activeMilanView === "remedies" ? "active" : ""}`}
          onClick={() => { playSoftClick(); setActiveMilanView("remedies"); }}
        >
          <ShieldCheck size={16} /> Dosha Remedies & Guidance
        </button>
      </div>

      {/* VIEW 1: 8 Koot Detailed Table */}
      {activeMilanView === "breakdown" && (
        <div className="table-responsive">
          <table className="ashtakoot-table">
            <thead>
              <tr>
                <th>Koot Factor</th>
                <th>Max Guna</th>
                <th>Obtained</th>
                <th>Compatibility Area & Significance</th>
                <th>Verdict</th>
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
                        <XCircle size={14} /> Afflicted ({item.name} Dosha)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: Mutual Manglik Analysis */}
      {activeMilanView === "manglik" && (
        <div className="manglik-milan-view glass-card p-4 animate-fade-in">
          <div className="manglik-header-row">
            <Flame className="icon-gold" size={24} />
            <div>
              <h4>Mutual Manglik Dosha Compatibility Report</h4>
              <p className="text-secondary">Evaluating Mars (Mangal) placements for both charts</p>
            </div>
            <span className={`status-pill ${manglikStatusClass} ml-auto`}>
              {manglikCompatibility}
            </span>
          </div>

          <div className="manglik-comparison-grid mt-4">
            <div className="manglik-col-card">
              <h5>Native Mars Placement</h5>
              <p>
                Status: <strong>{isNativeManglik ? "Manglik" : "Non-Manglik"}</strong>
              </p>
              <p className="sub-text">
                {isNativeManglik
                  ? "Mars is positioned in a house that exerts strong passionate and direct energy."
                  : "Mars resides in a harmonious non-afflicting house."}
              </p>
            </div>

            <div className="manglik-col-card">
              <h5>Partner Mars Placement</h5>
              <p>
                Status: <strong>{isPartnerManglik ? "Manglik" : "Non-Manglik"}</strong>
              </p>
              <p className="sub-text">
                {isPartnerManglik
                  ? "Partner carries assertive Mars energy, matching or requiring energetic balancing."
                  : "Partner has balanced Mars position without relationship friction."}
              </p>
            </div>
          </div>

          <div className="action-guidance-box mt-4">
            <strong>Vedic Astrological Explanation:</strong>
            <p>{manglikExplanation}</p>
          </div>
        </div>
      )}

      {/* VIEW 3: Nadi & Bhakoot Dosha Remedies */}
      {activeMilanView === "remedies" && (
        <div className="dosha-remedies-view glass-card p-4 animate-fade-in">
          <div className="remedies-header-row mb-4">
            <ShieldCheck className="icon-gold" size={24} />
            <div>
              <h4>Special Astrological Dosha Remedies</h4>
              <p className="text-secondary">Specific Vedic solutions for Nadi, Bhakoot, or Gana mismatches</p>
            </div>
          </div>

          <div className="dosha-remedy-cards-grid">
            <div className={`remedy-item-card ${hasNadiDosha ? "border-danger" : "border-ok"}`}>
              <div className="card-top-title">
                {hasNadiDosha ? <AlertTriangle className="text-danger" size={18} /> : <CheckCircle2 className="text-success" size={18} />}
                <strong>Nadi Dosha (Genetic & Spiritual Health)</strong>
              </div>
              <p>
                {hasNadiDosha
                  ? "Nadi score is 0/8. In Vedic astrology, same Nadi can indicate potential genetic sensitivity. Traditional remedy includes chanting Maha Mrityunjaya Mantra (108 times daily), Gold/Cow donation, and performing Lord Shiva Abhishek."
                  : "Nadi score is 8/8. Both charts possess differing Nadis (Adi, Madhya, Antya), ensuring sound genetic compatibility and strong spiritual harmony."}
              </p>
            </div>

            <div className={`remedy-item-card ${hasBhakootDosha ? "border-danger" : "border-ok"}`}>
              <div className="card-top-title">
                {hasBhakootDosha ? <AlertTriangle className="text-danger" size={18} /> : <CheckCircle2 className="text-success" size={18} />}
                <strong>Bhakoot Dosha (Emotional & Financial Dynamics)</strong>
              </div>
              <p>
                {hasBhakootDosha
                  ? "Bhakoot score is 0/7 (2-12, 6-8, or 9-5 sign disposition). May require patience in mutual financial management. Remedy involves worshipping Radha-Krishna or Goddess Parvati on Thursdays and practicing shared charity."
                  : "Bhakoot score is 7/7. Favorable lunar distance promotes mutual emotional affection, family peace, and financial prosperity."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
