import { useState } from "react";
import { CITIES, FAMOUS_CHARTS, REAL_LIFE_PROFILES } from "../data/vedicData";
import {
  parseBirthDataWithAI,
  generateRandomRealLifeProfile,
  getCurrentLiveBirthData
} from "../utils/aiAstrologerService";
import { playTempleChime, playSoftClick } from "../utils/soundEffects";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  Compass,
  BookmarkPlus,
  Bot,
  Wand2,
  Dice5,
  History,
  CheckCircle2,
  SendHorizontal
} from "lucide-react";

export default function KundliInputForm({
  formData,
  setFormData,
  onGenerate,
  onSaveClient,
  chartStyle,
  setChartStyle
}) {
  const [showCustomGeo, setShowCustomGeo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileTab, setProfileTab] = useState("reallife"); // "reallife" | "famous"
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (cityName) => {
    playSoftClick();
    const found = CITIES.find((c) => c.name === cityName);
    if (found) {
      setFormData({
        ...formData,
        city: found.name,
        lat: found.lat,
        lng: found.lng,
        tz: found.tz
      });
    }
  };

  const handleLoadSample = (sample) => {
    playTempleChime();
    setFormData({
      name: sample.name,
      gender: sample.gender || "Male",
      date: sample.date,
      time: sample.time,
      city: sample.city,
      lat: sample.lat,
      lng: sample.lng,
      tz: sample.tz || 5.5,
      ayanamsa: sample.ayanamsa || "Lahiri"
    });
    setAiSuccessMsg(`जातक "${sample.name}" का विवरण सफलतापूर्वक लोड किया गया!`);
    setTimeout(() => setAiSuccessMsg(""), 3500);
  };

  // AI Auto-Fill from free-form natural language text
  const handleAiAutoFill = async (e) => {
    e?.preventDefault();
    if (!aiPromptInput.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    playSoftClick();

    try {
      const parsed = await parseBirthDataWithAI(aiPromptInput);
      if (parsed) {
        setFormData(parsed);
        playTempleChime();
        setAiSuccessMsg(`AI ने "${parsed.name}" का जन्म विवरण स्वतः तैयार कर दिया!`);
        setAiPromptInput("");
      }
    } catch (err) {
      console.error("AI parse error:", err);
    } finally {
      setIsAiProcessing(false);
      setTimeout(() => setAiSuccessMsg(""), 4000);
    }
  };

  // AI Generate Random Real-Life Native Profile
  const handleGenerateRandomRealProfile = () => {
    playTempleChime();
    const profile = generateRandomRealLifeProfile();
    setFormData(profile);
    setAiSuccessMsg(`AI ने वास्तविक जीवन जातक "${profile.name}" का विवरण तैयार किया!`);
    setTimeout(() => setAiSuccessMsg(""), 3500);
  };

  // Fill Current Live Date & Time (Prashna Kundli / Newborn)
  const handleFillLiveTime = () => {
    playTempleChime();
    const live = getCurrentLiveBirthData();
    setFormData(live);
    setAiSuccessMsg("वर्तमान समय व स्थान (Live Prashna / Newborn) स्वतः भर दिया गया!");
    setTimeout(() => setAiSuccessMsg(""), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playTempleChime();
    onGenerate();
  };

  return (
    <div className="kundli-form-container glass-card">
      {/* Form Top Title Bar */}
      <div className="form-top-bar">
        <div className="form-header-title">
          <div className="om-mini-badge">ॐ</div>
          <div>
            <h2>जन्म विवरण प्रविष्टि (Birth Data Entry)</h2>
            <span className="form-sub-hint">
              वास्तविक जन्मपत्रिका निर्माण हेतु जातक का नाम, जन्म दिनांक, समय व स्थान दर्ज करें
            </span>
          </div>
        </div>

        <div className="style-toggles">
          <button
            type="button"
            className={`style-btn ${chartStyle === "north" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setChartStyle("north");
            }}
          >
            उत्तर भारतीय (Diamond)
          </button>
          <button
            type="button"
            className={`style-btn ${chartStyle === "south" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setChartStyle("south");
            }}
          >
            दक्षिण भारतीय (Grid)
          </button>
        </div>
      </div>

      {/* ========================================================
          AI SMART AUTO-FILL AGENT BOX (NEW REQUIREMENT)
          ======================================================== */}
      <div className="ai-smart-fill-banner glass-card">
        <div className="ai-fill-header">
          <div className="ai-badge-row">
            <Bot size={18} className="text-gold" />
            <span className="ai-agent-title">AI जन्म विवरण ऑटो-जनरेटर (AI Smart Auto-Fill Agent)</span>
            <span className="ai-agent-tag">स्वतः कुण्डली डेटा निर्माण</span>
          </div>

          <div className="ai-quick-action-btns">
            <button
              type="button"
              className="ai-action-btn glow-pulse"
              onClick={handleGenerateRandomRealProfile}
              title="AI द्वारा वास्तविक जातक का डेटा स्वतः बनाएं"
            >
              <Dice5 size={15} />
              <span>🎲 AI रियल-लाइफ जातक बनाएं</span>
            </button>

            <button
              type="button"
              className="ai-action-btn"
              onClick={handleFillLiveTime}
              title="वर्तमान समय व स्थान से कुण्डली बनाएं (Prashna / Newborn Baby)"
            >
              <Clock size={15} />
              <span>🕒 वर्तमान समय (Live Prashna)</span>
            </button>
          </div>
        </div>

        {/* Natural Language Prompt Input Bar */}
        <form onSubmit={handleAiAutoFill} className="ai-prompt-input-row">
          <div className="prompt-input-wrap">
            <Wand2 size={16} className="prompt-icon text-gold" />
            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder="AI को बोलें या लिखें, e.g. 'रोहन शर्मा, 15 जुलाई 1995, दोपहर 2:30 बजे, वाराणसी' या 'Priya, female, 24 Dec 1999, 10:15 AM, Jaipur'..."
              className="ai-prompt-input"
              disabled={isAiProcessing}
            />
          </div>
          <button
            type="submit"
            className="btn-gold-action ai-fill-submit"
            disabled={!aiPromptInput.trim() || isAiProcessing}
          >
            <SendHorizontal size={16} />
            <span>{isAiProcessing ? "AI तैयार कर रहा है..." : "AI द्वारा भरें"}</span>
          </button>
        </form>

        {aiSuccessMsg && (
          <div className="ai-success-toast animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>{aiSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Real-Life Native Presets vs Famous Charts */}
      <div className="famous-charts-bar">
        <div className="profiles-tab-switcher">
          <button
            type="button"
            className={`ptab-btn ${profileTab === "reallife" ? "active" : ""}`}
            onClick={() => setProfileTab("reallife")}
          >
            ✦ वास्तविक जीवन जातक (Real Life Profiles)
          </button>
          <button
            type="button"
            className={`ptab-btn ${profileTab === "famous" ? "active" : ""}`}
            onClick={() => setProfileTab("famous")}
          >
            ऐतिहासिक कुण्डलियां (Famous Charts)
          </button>
        </div>

        <div className="sample-chips">
          {profileTab === "reallife" &&
            REAL_LIFE_PROFILES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-chip real-life-chip"
                onClick={() => handleLoadSample(item)}
                title={item.tag}
              >
                <span className="chip-cat">{item.category}:</span>
                <span className="chip-name">{item.name.split(" ")[0]}</span>
              </button>
            ))}

          {profileTab === "famous" &&
            FAMOUS_CHARTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-chip"
                onClick={() => handleLoadSample(item)}
              >
                {item.name}
              </button>
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="astro-form-grid">
        {/* Name */}
        <div className="input-group">
          <label>
            <User size={15} /> Full Name (Client / Native)
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Aditya Sharma"
            className="astro-input"
          />
        </div>

        {/* Gender */}
        <div className="input-group">
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="astro-select"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="input-group">
          <label>
            <Calendar size={15} /> Date of Birth
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="astro-input"
          />
        </div>

        {/* Time of Birth */}
        <div className="input-group">
          <label>
            <Clock size={15} /> Time of Birth (24Hr)
          </label>
          <input
            type="time"
            step="1"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="astro-input"
          />
        </div>

        {/* City Selection */}
        <div className="input-group full-width">
          <label>
            <MapPin size={15} /> Birth Place / City
          </label>
          <div className="city-selector-row">
            <select
              value={formData.city}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="astro-select flex-1"
            >
              {CITIES.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name} (Lat: {c.lat}°, Lng: {c.lng}°)
                </option>
              ))}
            </select>
            <button
              type="button"
              className="geo-toggle-btn"
              onClick={() => setShowCustomGeo(!showCustomGeo)}
              title="Enter Custom Coordinates"
            >
              <Compass size={16} /> {showCustomGeo ? "Hide Coordinates" : "Custom Coordinates"}
            </button>
          </div>
        </div>

        {/* Optional Custom Coordinates */}
        {showCustomGeo && (
          <div className="custom-geo-row full-width">
            <div className="input-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="astro-input"
              />
            </div>
            <div className="input-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="astro-input"
              />
            </div>
            <div className="input-group">
              <label>Timezone (UTC)</label>
              <input
                type="number"
                step="0.25"
                value={formData.tz}
                onChange={(e) => setFormData({ ...formData, tz: parseFloat(e.target.value) || 5.5 })}
                className="astro-input"
              />
            </div>
          </div>
        )}

        {/* Ayanamsa */}
        <div className="input-group">
          <label>Ayanamsa System</label>
          <select
            value={formData.ayanamsa}
            onChange={(e) => setFormData({ ...formData, ayanamsa: e.target.value })}
            className="astro-select"
          >
            <option value="Lahiri">Chitrapaksha Lahiri (Standard)</option>
            <option value="Raman">B.V. Raman</option>
            <option value="KP">KP (Krishnamurti Paddhati)</option>
          </select>
        </div>

        {/* Submit Action Buttons */}
        <div className="form-action-group full-width">
          <button type="submit" className="generate-btn glow-pulse">
            <Sparkles size={18} />
            <span>Generate Kundli Chart</span>
          </button>
          <button
            type="button"
            className="save-client-btn"
            onClick={() => {
              playSoftClick();
              onSaveClient();
            }}
          >
            <BookmarkPlus size={18} />
            <span>Save Client Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
