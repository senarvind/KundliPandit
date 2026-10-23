import { useState } from "react";
import { CITIES, FAMOUS_CHARTS } from "../data/vedicData";
import { playTempleChime, playSoftClick } from "../utils/soundEffects";
import { Sparkles, Calendar, Clock, MapPin, User, Compass, BookmarkPlus } from "lucide-react";

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
    playSoftClick();
    setFormData({
      name: sample.name,
      gender: sample.gender,
      date: sample.date,
      time: sample.time,
      city: sample.city,
      lat: sample.lat,
      lng: sample.lng,
      tz: sample.tz,
      ayanamsa: "Lahiri"
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playTempleChime();
    onGenerate();
  };

  return (
    <div className="kundli-form-container glass-card">
      <div className="form-top-bar">
        <div className="form-header-title">
          <Sparkles className="icon-gold" size={20} />
          <h2>Birth Data Entry (Kundli Details)</h2>
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
            North Indian (Diamond)
          </button>
          <button
            type="button"
            className={`style-btn ${chartStyle === "south" ? "active" : ""}`}
            onClick={() => {
              playSoftClick();
              setChartStyle("south");
            }}
          >
            South Indian (Grid)
          </button>
        </div>
      </div>

      {/* Quick Test Astrological Profiles */}
      <div className="famous-charts-bar">
        <span className="sample-label">Quick Test Profiles:</span>
        <div className="sample-chips">
          {FAMOUS_CHARTS.map((item, idx) => (
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
