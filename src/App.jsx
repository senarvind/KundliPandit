import { useState, useEffect, useMemo } from "react";
import CosmicBackground from "./components/CosmicBackground";
import Navbar from "./components/Navbar";
import DailyPanchang from "./components/DailyPanchang";
import KundliInputForm from "./components/KundliInputForm";
import NorthIndianChart from "./components/NorthIndianChart";
import SouthIndianChart from "./components/SouthIndianChart";
import DivisionalCharts from "./components/DivisionalCharts";
import GrahaTable from "./components/GrahaTable";
import BhavaAnalysis from "./components/BhavaAnalysis";
import VimshottariDasha from "./components/VimshottariDasha";
import DoshaYogaChecker from "./components/DoshaYogaChecker";
import RemediesView from "./components/RemediesView";
import GunMilan from "./components/GunMilan";
import AstrologerNotesModal from "./components/AstrologerNotesModal";
import SavedChartsDrawer from "./components/SavedChartsDrawer";

import {
  calculateJulianDay,
  calculateLahiriAyanamsa,
  calculateAscendant,
  calculatePlanets,
  calculateHouses,
  calculateDivisionalCharts,
  calculateVimshottariDasha,
  detectDoshasAndYogas,
  calculateAshtakavarga
} from "./utils/astronomyEngine";

import { FAMOUS_CHARTS } from "./data/vedicData";
import { playTempleChime, playSoftClick } from "./utils/soundEffects";
import {
  Sparkles,
  Compass,
  Layers,
  Clock,
  ShieldAlert,
  Grid,
  Heart,
  Gem,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function App() {
  // Client Form Data
  const [formData, setFormData] = useState({
    name: "Aditya Sharma",
    gender: "Male",
    date: "1996-05-18",
    time: "08:45:00",
    city: "Varanasi (Kashi), India",
    lat: 25.3176,
    lng: 82.9739,
    tz: 5.5,
    ayanamsa: "Lahiri"
  });

  const [chartStyle, setChartStyle] = useState("north"); // "north" | "south"
  const [activeTab, setActiveTab] = useState("charts"); // "charts" | "vargas" | "dasha" | "doshas" | "bhavas" | "milan" | "remedies"
  const [activeHouse, setActiveHouse] = useState(null);
  const [activePlanet, setActivePlanet] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedCharts, setSavedCharts] = useState([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Load saved charts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("astro_saved_charts");
      if (stored) {
        setSavedCharts(JSON.parse(stored));
      } else {
        // Preload famous sample profiles
        setSavedCharts(FAMOUS_CHARTS);
        localStorage.setItem("astro_saved_charts", JSON.stringify(FAMOUS_CHARTS));
      }
    } catch (e) {
      console.error("Localstorage load error", e);
    }
  }, []);

  // Compute Kundli data from formData
  const kundli = useMemo(() => {
    try {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [hour, minute, sec = 0] = formData.time.split(":").map(Number);

      const JD = calculateJulianDay(
        year,
        month,
        day,
        hour,
        minute,
        sec,
        formData.tz || 5.5
      );

      // Base Ayanamsa (Lahiri)
      let ayanamsa = calculateLahiriAyanamsa(JD);
      if (formData.ayanamsa === "Raman") {
        ayanamsa -= 1.4; // Raman offset
      } else if (formData.ayanamsa === "KP") {
        ayanamsa += 0.1; // KP offset
      }

      const asc = calculateAscendant(JD, formData.lat, formData.lng, ayanamsa);
      const planets = calculatePlanets(JD, ayanamsa);
      const houses = calculateHouses(asc, planets);
      const divisionals = calculateDivisionalCharts(asc, planets);

      const moon = planets.find((p) => p.id === "Moon");
      const moonLong = moon ? moon.longitude : 0;
      const dasha = calculateVimshottariDasha(moonLong, formData.date);
      const doshasYogas = detectDoshasAndYogas(planets, asc, houses);
      const ashtakavarga = calculateAshtakavarga(asc, planets);

      return {
        JD,
        ayanamsa,
        ascendant: asc,
        planets,
        houses,
        divisionals,
        dasha,
        doshasYogas,
        ashtakavarga
      };
    } catch (err) {
      console.error("Error computing Kundli:", err);
      return null;
    }
  }, [formData]);

  const handleSaveClient = () => {
    const newEntry = { ...formData, id: Date.now() };
    const updated = [newEntry, ...savedCharts.filter((c) => c.name !== newEntry.name)];
    setSavedCharts(updated);
    localStorage.setItem("astro_saved_charts", JSON.stringify(updated));
    setSaveSuccessMsg(`Client profile "${formData.name}" saved successfully!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleDeleteClient = (clientToDelete) => {
    const updated = savedCharts.filter((c) => c.name !== clientToDelete.name);
    setSavedCharts(updated);
    localStorage.setItem("astro_saved_charts", JSON.stringify(updated));
  };

  const handleLoadSavedChart = (chart) => {
    setFormData({
      name: chart.name,
      gender: chart.gender || "Male",
      date: chart.date,
      time: chart.time,
      city: chart.city,
      lat: chart.lat,
      lng: chart.lng,
      tz: chart.tz || 5.5,
      ayanamsa: chart.ayanamsa || "Lahiri"
    });
  };

  const moonPlanet = kundli?.planets?.find((p) => p.id === "Moon");

  const navTabs = [
    { key: "charts", label: "Birth Chart & Planets", icon: Compass },
    { key: "vargas", label: "Divisional Charts (D9/D10/D7)", icon: Layers },
    { key: "dasha", label: "Vimshottari Mahadasha", icon: Clock },
    { key: "doshas", label: "Doshas & Raj Yogas", icon: ShieldAlert },
    { key: "bhavas", label: "12 Houses (Bhavas)", icon: Grid },
    { key: "milan", label: "36 Guna Match (Milan)", icon: Heart },
    { key: "remedies", label: "Gemstones & Remedies", icon: Gem }
  ];

  return (
    <div className="astro-app">
      {/* Dynamic Starry Canvas */}
      <CosmicBackground />

      {/* Navigation Bar */}
      <Navbar
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        savedCount={savedCharts.length}
        onOpenNotesModal={() => setIsNotesModalOpen(true)}
      />

      <main className="main-content">
        {/* Vedic Hero Banner with generated cosmic artwork */}
        <section className="hero-banner">
          <div className="hero-bg-overlay"></div>
          <div className="hero-content">
            <div className="hero-emblem-wrap">
              <img
                src="/astrologer_avatar.jpg"
                alt="Vedic Astrologer"
                className="astrologer-avatar-img"
              />
            </div>
            <div className="hero-text-block">
              <div className="hero-badge">
                <Sparkles size={14} /> Vedic Astrology Portal • Birth Chart Kundli Mirror
              </div>
              <h2 className="hero-title">
                Vedic Birth Chart & Kundli Horoscope Portal
              </h2>
              <p className="hero-subtitle">
                High-precision planetary positions, Navamsha D-9 chart, Vimshottari Dasha timeline, Manglik Dosha analysis, and 36 Guna Ashtakoot matrimonial compatibility.
              </p>
            </div>
          </div>
        </section>

        {/* Live Daily Panchang Ticker */}
        <DailyPanchang />

        {/* Success toast if client saved */}
        {saveSuccessMsg && (
          <div className="toast-notice glass-card glow-pulse">
            <CheckCircle2 className="icon-success" size={18} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Birth Details Input Form */}
        <KundliInputForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={() => {}}
          onSaveClient={handleSaveClient}
          chartStyle={chartStyle}
          setChartStyle={setChartStyle}
        />

        {/* Client Kundli Details Summary Strip */}
        {kundli && (
          <section className="client-summary-strip glass-card">
            <div className="summary-item">
              <span className="s-label">Client Name:</span>
              <strong className="s-val text-gold">{formData.name}</strong>
            </div>
            <div className="summary-item">
              <span className="s-label">Ascendant (Lagna):</span>
              <strong className="s-val">
                {kundli.ascendant.rashi.english} ({kundli.ascendant.rashi.name}) {kundli.ascendant.degFormatted}
              </strong>
            </div>
            <div className="summary-item">
              <span className="s-label">Moon Sign (Rashi):</span>
              <strong className="s-val">
                {moonPlanet?.rashi?.english} ({moonPlanet?.rashi?.name})
              </strong>
            </div>
            <div className="summary-item">
              <span className="s-label">Birth Nakshatra:</span>
              <strong className="s-val">
                {moonPlanet?.nakshatra?.name} (Pada {moonPlanet?.nakshatra?.pada})
              </strong>
            </div>
            <div className="summary-item">
              <span className="s-label">Ayanamsa:</span>
              <strong className="s-val">
                {formData.ayanamsa} ({kundli.ayanamsa.toFixed(2)}°)
              </strong>
            </div>
          </section>
        )}

        {/* Astrologer Interactive Feature Tabs */}
        <section className="kundli-tabs-navigation">
          <div className="tabs-bar">
            {navTabs.map((t) => {
              const IconComp = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={`main-tab-btn ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => {
                    playSoftClick();
                    setActiveTab(t.key);
                  }}
                >
                  <IconComp size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tab Content Display */}
        <section className="kundli-view-container">
          {kundli && (
            <>
              {/* Tab 1: Charts & Planetary Positions */}
              {activeTab === "charts" && (
                <div className="charts-tab-content">
                  <div className="chart-and-graha-layout">
                    <div className="chart-col">
                      {chartStyle === "north" ? (
                        <NorthIndianChart
                          chartData={kundli.divisionals.D1}
                          title="Lagna Kundli (D-1 Rashi Chart)"
                          onSelectHouse={(h) => {
                            playSoftClick();
                            setActiveHouse(activeHouse === h ? null : h);
                          }}
                          onSelectPlanet={(p) => {
                            playSoftClick();
                            setActivePlanet(activePlanet?.id === p.id ? null : p);
                          }}
                          activePlanet={activePlanet}
                          activeHouse={activeHouse}
                        />
                      ) : (
                        <SouthIndianChart
                          chartData={kundli.divisionals.D1}
                          title="Lagna Kundli (South Indian D-1 Chart)"
                          onSelectHouse={(h) => {
                            playSoftClick();
                            setActiveHouse(activeHouse === h ? null : h);
                          }}
                          onSelectPlanet={(p) => {
                            playSoftClick();
                            setActivePlanet(activePlanet?.id === p.id ? null : p);
                          }}
                          activePlanet={activePlanet}
                          activeHouse={activeHouse}
                        />
                      )}
                    </div>

                    <div className="table-col">
                      <GrahaTable
                        planets={kundli.planets}
                        ascendant={kundli.ascendant}
                        onSelectPlanet={(p) => {
                          playSoftClick();
                          setActivePlanet(activePlanet?.id === p.id ? null : p);
                        }}
                        activePlanet={activePlanet}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Divisional Charts */}
              {activeTab === "vargas" && (
                <DivisionalCharts
                  divisionalData={kundli.divisionals}
                  chartStyle={chartStyle}
                  onSelectHouse={(h) => {
                    playSoftClick();
                    setActiveHouse(activeHouse === h ? null : h);
                  }}
                  onSelectPlanet={(p) => {
                    playSoftClick();
                    setActivePlanet(activePlanet?.id === p.id ? null : p);
                  }}
                  activePlanet={activePlanet}
                  activeHouse={activeHouse}
                />
              )}

              {/* Tab 3: Vimshottari Dasha */}
              {activeTab === "dasha" && (
                <VimshottariDasha dashaData={kundli.dasha} />
              )}

              {/* Tab 4: Doshas & Auspicious Yogas */}
              {activeTab === "doshas" && (
                <DoshaYogaChecker doshasAndYogas={kundli.doshasYogas} />
              )}

              {/* Tab 5: 12 Houses (Bhavas) Analysis */}
              {activeTab === "bhavas" && (
                <BhavaAnalysis
                  houses={kundli.houses}
                  ascendant={kundli.ascendant}
                  activeHouse={activeHouse}
                  onSelectHouse={(h) => {
                    playSoftClick();
                    setActiveHouse(activeHouse === h ? null : h);
                  }}
                />
              )}

              {/* Tab 6: 36 Guna Ashtakoot Vivah Milan */}
              {activeTab === "milan" && (
                <GunMilan nativeMoonDeg={moonPlanet?.longitude || 0} />
              )}

              {/* Tab 7: Gemstones & Vedic Remedies */}
              {activeTab === "remedies" && (
                <RemediesView
                  ascendant={kundli.ascendant}
                  planets={kundli.planets}
                />
              )}
            </>
          )}
        </section>

        {/* Printable Astrologer Kundli Certificate (Hidden on screen, visible during Print/PDF) */}
        {kundli && (
          <div className="print-report-container">
            <div className="print-header">
              <h1>Om Shree Ganeshaya Namah</h1>
              <h2>Vedic Birth Chart Kundli - Authorized Astrological Consultation Report</h2>
              <div className="print-meta-grid">
                <div>Client Name: <strong>{formData.name}</strong></div>
                <div>Date of Birth: <strong>{formData.date}</strong></div>
                <div>Time of Birth: <strong>{formData.time}</strong></div>
                <div>Birth Place: <strong>{formData.city}</strong></div>
                <div>Ascendant: <strong>{kundli.ascendant.rashi.english} ({kundli.ascendant.degFormatted})</strong></div>
                <div>Moon Sign: <strong>{moonPlanet?.rashi?.english}</strong></div>
                <div>Birth Nakshatra: <strong>{moonPlanet?.nakshatra?.name} (Pada {moonPlanet?.nakshatra?.pada})</strong></div>
                <div>Ayanamsa: <strong>{formData.ayanamsa}</strong></div>
              </div>
            </div>

            <div className="print-chart-box">
              <NorthIndianChart
                chartData={kundli.divisionals.D1}
                title="Lagna Kundli (D-1)"
              />
            </div>

            <div className="print-dasha-summary">
              <h3>Current Active Vimshottari Dasha</h3>
              <p>
                Mahadasha: <strong>{kundli.dasha.activeMahadasha?.lord}</strong> | Antardasha: <strong>{kundli.dasha.activeAntardasha?.lord}</strong>
              </p>
            </div>

            <div className="print-footer">
              <div className="print-seal">
                <div>Astrologer Signature & Seal</div>
                <div className="seal-line">__________________________</div>
              </div>
              <div className="print-blessing">
                "May all beings be happy, healthy, prosperous, and free from suffering."
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Astrologer Consultation Notes Modal */}
      <AstrologerNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        clientName={formData.name}
        birthDate={formData.date}
      />

      {/* Saved Clients Drawer */}
      <SavedChartsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedCharts={savedCharts}
        onLoadChart={handleLoadSavedChart}
        onDeleteChart={handleDeleteClient}
      />

      {/* Footer */}
      <footer className="astro-footer">
        <div className="footer-content">
          <p>
            © {new Date().getFullYear()} AstroKundli Portal • Authentic calculations based on ancient Maharishi Parashara Hora Shastra & Varahamihira principles.
          </p>
          <span className="footer-blessing">Om Shantih Shantih Shantih</span>
        </div>
      </footer>
    </div>
  );
}
