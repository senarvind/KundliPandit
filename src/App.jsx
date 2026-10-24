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
import LifePredictions from "./components/LifePredictions";
import AstrologerNotesModal from "./components/AstrologerNotesModal";
import SavedChartsDrawer from "./components/SavedChartsDrawer";
import { generateLifeInterpretations } from "./utils/interpretationEngine";

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
  const [chartViewMode, setChartViewMode] = useState("d1"); // "d1" | "d9" | "dual"
  const [activeTab, setActiveTab] = useState("charts"); // "charts" | "predictions" | "milan" | "vargas" | "dasha" | "doshas" | "bhavas" | "remedies"
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

  // Generate life interpretations for Career, Marriage, Wealth, Relationships, Health
  const lifeInterpretations = useMemo(() => {
    if (!kundli) return null;
    return generateLifeInterpretations(kundli, formData);
  }, [kundli, formData]);

  const moonPlanet = kundli?.planets?.find((p) => p.id === "Moon");

  const navTabs = [
    { key: "charts", label: "Birth Chart & Planets", icon: Compass },
    { key: "predictions", label: "Life Predictions (Career, Marriage, Money)", icon: Sparkles },
    { key: "milan", label: "Kundli Matching (36 Guna)", icon: Heart },
    { key: "vargas", label: "Divisional Charts (D9/D10/D7)", icon: Layers },
    { key: "dasha", label: "Vimshottari Mahadasha", icon: Clock },
    { key: "doshas", label: "Doshas & Raj Yogas", icon: ShieldAlert },
    { key: "bhavas", label: "12 Houses (Bhavas)", icon: Grid },
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
                  {/* Lagna (D-1) vs Navamsha (D-9) vs Dual View Toggles */}
                  <div className="chart-view-selector-bar glass-card">
                    <div className="view-mode-buttons">
                      <button
                        type="button"
                        className={`view-mode-btn ${chartViewMode === "d1" ? "active" : ""}`}
                        onClick={() => {
                          playSoftClick();
                          setChartViewMode("d1");
                        }}
                      >
                        <Compass size={15} />
                        <span>Lagna Chart (D-1)</span>
                      </button>
                      <button
                        type="button"
                        className={`view-mode-btn ${chartViewMode === "d9" ? "active" : ""}`}
                        onClick={() => {
                          playSoftClick();
                          setChartViewMode("d9");
                        }}
                      >
                        <Layers size={15} />
                        <span>Navamsha Chart (D-9)</span>
                      </button>
                      <button
                        type="button"
                        className={`view-mode-btn ${chartViewMode === "dual" ? "active" : ""}`}
                        onClick={() => {
                          playSoftClick();
                          setChartViewMode("dual");
                        }}
                      >
                        <Sparkles size={15} />
                        <span>Dual View (D-1 & D-9)</span>
                      </button>
                    </div>

                    <div className="chart-mode-info-tag">
                      {chartViewMode === "d1" && <span><strong>Lagna Kundli (D-1):</strong> Physical constitution, life foundation & ascendant houses</span>}
                      {chartViewMode === "d9" && <span><strong>Navamsha Kundli (D-9):</strong> Soul's destiny, marriage fruitfulness & inner planetary strength</span>}
                      {chartViewMode === "dual" && <span><strong>Side-by-Side Comparison:</strong> Lagna (D-1) & Navamsha (D-9) viewed together</span>}
                    </div>
                  </div>

                  {chartViewMode === "dual" ? (
                    <div className="dual-charts-wrapper">
                      <div className="dual-charts-side-by-side">
                        <div className="chart-col-half">
                          {chartStyle === "north" ? (
                            <NorthIndianChart
                              chartData={kundli.divisionals.D1}
                              title="Lagna Kundli (D-1 Rashi)"
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
                              title="Lagna Kundli (D-1 South Indian)"
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

                        <div className="chart-col-half">
                          {chartStyle === "north" ? (
                            <NorthIndianChart
                              chartData={kundli.divisionals.D9}
                              title="Navamsha Kundli (D-9 Navamsha)"
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
                              chartData={kundli.divisionals.D9}
                              title="Navamsha Kundli (D-9 South Indian)"
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
                      </div>

                      <div className="dual-table-section">
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
                  ) : (
                    <div className="chart-and-graha-layout">
                      <div className="chart-col">
                        {chartStyle === "north" ? (
                          <NorthIndianChart
                            chartData={chartViewMode === "d9" ? kundli.divisionals.D9 : kundli.divisionals.D1}
                            title={chartViewMode === "d9" ? "Navamsha Kundli (D-9 Chart)" : "Lagna Kundli (D-1 Rashi Chart)"}
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
                            chartData={chartViewMode === "d9" ? kundli.divisionals.D9 : kundli.divisionals.D1}
                            title={chartViewMode === "d9" ? "Navamsha Kundli (D-9 South Indian)" : "Lagna Kundli (D-1 South Indian)"}
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
                  )}
                </div>
              )}

              {/* Tab 2: Life Predictions & Deep Interpretations (Career, Marriage, Money, Relationships) */}
              {activeTab === "predictions" && (
                <LifePredictions
                  interpretations={lifeInterpretations}
                  clientName={formData.name}
                />
              )}

              {/* Tab 3: 36 Guna Matrimonial Kundli Matching (Milan) */}
              {activeTab === "milan" && (
                <GunMilan
                  nativeFormData={formData}
                  nativeMoonDeg={moonPlanet?.longitude || 0}
                  nativePlanets={kundli.planets}
                  nativeAscendant={kundli.ascendant}
                />
              )}

              {/* Tab 4: Divisional Charts */}
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

              {/* Tab 5: Vimshottari Dasha */}
              {activeTab === "dasha" && (
                <VimshottariDasha dashaData={kundli.dasha} />
              )}

              {/* Tab 6: Doshas & Auspicious Yogas */}
              {activeTab === "doshas" && (
                <DoshaYogaChecker doshasAndYogas={kundli.doshasYogas} />
              )}

              {/* Tab 7: 12 Houses (Bhavas) Analysis */}
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

              {/* Tab 8: Gemstones & Vedic Remedies */}
              {activeTab === "remedies" && (
                <RemediesView
                  ascendant={kundli.ascendant}
                  planets={kundli.planets}
                />
              )}
            </>
          )}
        </section>

        {/* Printable Astrologer Kundli Certificate (Hidden on screen, strictly 1-page during Print/PDF) */}
        {kundli && (
          <div className="print-report-container">
            {/* Header / Invocations */}
            <div className="print-header">
              <div className="print-om-invoc">॥ ॐ श्री गणेशाय नमः ॥</div>
              <h1 className="print-main-title">Vedic Birth Chart Kundli</h1>
              <div className="print-sub-header">
                Astrological Consultation Report • Parashara Janam Patrika
              </div>

              {/* Client & Birth Particulars Grid */}
              <div className="print-meta-grid">
                <div className="print-meta-cell">
                  <span className="pm-label">Client Name:</span>
                  <span className="pm-val"><strong>{formData.name || "Client"}</strong> ({formData.gender || "Male"})</span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Date of Birth:</span>
                  <span className="pm-val"><strong>{formData.date}</strong></span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Time of Birth:</span>
                  <span className="pm-val"><strong>{formData.time}</strong></span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Place of Birth:</span>
                  <span className="pm-val"><strong>{formData.city}</strong></span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Ascendant (Lagna):</span>
                  <span className="pm-val"><strong>{kundli.ascendant.rashi.english}</strong> ({kundli.ascendant.degFormatted})</span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Moon Sign (Rashi):</span>
                  <span className="pm-val"><strong>{moonPlanet?.rashi?.english}</strong> ({moonPlanet?.rashi?.name})</span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Birth Nakshatra:</span>
                  <span className="pm-val"><strong>{moonPlanet?.nakshatra?.name}</strong> (Pada {moonPlanet?.nakshatra?.pada})</span>
                </div>
                <div className="print-meta-cell">
                  <span className="pm-label">Ayanamsa:</span>
                  <span className="pm-val"><strong>{formData.ayanamsa}</strong> ({kundli.ayanamsa.toFixed(2)}°)</span>
                </div>
              </div>
            </div>

            {/* Core Section: Kundli Chart (Left) + Planets Table (Right) */}
            <div className="print-core-grid">
              <div className="print-chart-box">
                {chartStyle === "north" ? (
                  <NorthIndianChart
                    chartData={kundli.divisionals.D1}
                    title="Lagna Kundli (D-1)"
                  />
                ) : (
                  <SouthIndianChart
                    chartData={kundli.divisionals.D1}
                    title="Lagna Kundli (D-1)"
                  />
                )}
              </div>

              <div className="print-planets-box">
                <div className="print-box-heading">Planetary Positions (Graha Sthiti)</div>
                <table className="print-graha-table">
                  <thead>
                    <tr>
                      <th>Graha</th>
                      <th>Rashi</th>
                      <th>Degree</th>
                      <th>Bhava</th>
                      <th>Status / Dignity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kundli.planets.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong> ({p.hindi})</td>
                        <td>{p.rashi.english}</td>
                        <td>{p.degFormatted}</td>
                        <td>House {p.house}</td>
                        <td>
                          {p.isRetrograde ? "[R] " : ""}
                          {p.dignity.split(" ")[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vimshottari Dasha Summary Strip */}
            <div className="print-dasha-strip">
              <div className="print-dasha-label">
                <strong>Vimshottari Dasha:</strong>
              </div>
              <div className="print-dasha-items">
                <span>Mahadasha: <strong>{kundli.dasha.activeMahadasha?.lord}</strong></span>
                <span className="p-dot">•</span>
                <span>Antardasha: <strong>{kundli.dasha.activeAntardasha?.lord || "Active"}</strong></span>
                <span className="p-dot">•</span>
                <span>Nakshatra Lord: <strong>{moonPlanet?.nakshatra?.lord}</strong></span>
              </div>
            </div>

            {/* Footer / Auspicious Blessing / Signature */}
            <div className="print-footer">
              <div className="print-footer-info">
                <div className="p-auth-txt">Verified Astrological Kundli Report</div>
                <div className="p-sys-txt">Maharishi Parashara Hora Shastra Principles</div>
              </div>
              <div className="print-blessing-wrap">
                <div className="p-sanskrit">॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥</div>
                <div className="p-english">"May all beings be happy, healthy, prosperous and peaceful."</div>
              </div>
              <div className="print-seal-wrap">
                <div className="p-seal-head">Astrologer Signature & Seal</div>
                <div className="seal-line">__________________________</div>
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
