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
import AIAstrologerModal from "./components/AIAstrologerModal";
import BrihatKundliPatrika from "./components/BrihatKundliPatrika";
import { generateLifeInterpretations } from "./utils/interpretationEngine";
import { calculateAvakahadaChakra } from "./utils/panchangEngine";
import { generateFullAIFaladesh } from "./utils/aiAstrologerService";

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
  BookOpen,
  Bot,
  FileDown,
  Printer
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
  const [activeTab, setActiveTab] = useState("charts");
  const [activeHouse, setActiveHouse] = useState(null);
  const [activePlanet, setActivePlanet] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPatrikaModalOpen, setIsPatrikaModalOpen] = useState(false);
  const [aiFaladesh, setAiFaladesh] = useState(null);
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

  // Compute Avakahada Chakra & Panchang
  const avakahada = useMemo(() => {
    if (!kundli) return null;
    return calculateAvakahadaChakra(kundli, formData);
  }, [kundli, formData]);

  // Pre-generate AI Faladesh when Kundli is available
  useEffect(() => {
    if (kundli && avakahada) {
      generateFullAIFaladesh(kundli, formData, avakahada)
        .then((res) => {
          setAiFaladesh(res);
        })
        .catch((err) => {
          console.error("Initial AI Faladesh generation error:", err);
        });
    }
  }, [formData.name, formData.date, formData.time, formData.city]);

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
    { key: "aifaladesh", label: "AI ज्योतिषाचार्य (AI Faladesh)", icon: Bot },
    { key: "patrika", label: "बृहत् जन्मपत्रिका (8-Page Kundli)", icon: BookOpen },
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
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenPatrikaModal={() => setIsPatrikaModalOpen(true)}
      />

      <main className="main-content">
        {/* Vedic Hero Banner - Authentic Traditional Vedic Astrology Sanctuary */}
        <section className="hero-banner">
          <div className="hero-bg-overlay"></div>
          <div className="hero-content">
            <div className="hero-emblem-wrap">
              <div className="astrologer-avatar-border glow-pulse">
                <img
                  src="/astrologer_avatar.jpg"
                  alt="Vedic Astrologer Acharya"
                  className="astrologer-avatar-img"
                />
                <span className="avatar-om-crest">ॐ</span>
              </div>
            </div>
            <div className="hero-text-block">
              <div className="hero-badge">
                <Sparkles size={14} /> ॥ ॐ श्री गणेशाय नमः ॥ श्री काशी विश्वनाथ प्रामाणिक ज्योतिष संस्थान
              </div>
              <h2 className="hero-title">
                वैदिक जन्म कुण्डली एवं बृहत् जन्मपत्रिका दर्पण
              </h2>
              <p className="hero-subtitle">
                महर्षि पाराशर होरा शास्त्र एवं वराहमिहिर के प्रामाणिक गणितीय सूत्रों पर आधारित शुद्ध जन्म कुण्डली, १२० वर्षीय विंशोत्तरी महादशा, मांगलिक विचार, ३६ गुण मिलान एवं AI ज्योतिषाचार्य परामर्श।
              </p>

              <div className="hero-highlights-strip">
                <span className="hl-item">✓ १००% शुद्ध गणितीय अयनांश (Lahiri Ayanamsa)</span>
                <span className="hl-item">✓ पंडित जी द्वारा मुद्रित वास्तविक ८-पृष्ठीय कुण्डली</span>
                <span className="hl-item">✓ AI एजेंट द्वारा ऑटो-डेटा निर्माण व त्वरित फलकथन</span>
              </div>
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
            <div className="summary-details-cluster">
              <div className="summary-item">
                <span className="s-label">जातक (Client):</span>
                <strong className="s-val text-gold">{formData.name}</strong>
              </div>
              <div className="summary-item">
                <span className="s-label">Lagna (लग्न):</span>
                <strong className="s-val">
                  {kundli.ascendant.rashi.hindi} ({kundli.ascendant.rashi.english}) {kundli.ascendant.degFormatted}
                </strong>
              </div>
              <div className="summary-item">
                <span className="s-label">Rashi (राशि):</span>
                <strong className="s-val">
                  {moonPlanet?.rashi?.hindi} ({moonPlanet?.rashi?.english})
                </strong>
              </div>
              <div className="summary-item">
                <span className="s-label">Nakshatra (नक्षत्र):</span>
                <strong className="s-val">
                  {moonPlanet?.nakshatra?.hindi || moonPlanet?.nakshatra?.name} (पद {moonPlanet?.nakshatra?.pada})
                </strong>
              </div>
              {avakahada && (
                <>
                  <div className="summary-item">
                    <span className="s-label">गण / नाड़ी:</span>
                    <strong className="s-val text-gold">
                      {avakahada.gana.hindi} / {avakahada.nadi.hindi.split(" ")[0]}
                    </strong>
                  </div>
                  <div className="summary-item">
                    <span className="s-label">तिथि:</span>
                    <strong className="s-val">
                      {avakahada.tithi.hindi}
                    </strong>
                  </div>
                </>
              )}
            </div>

            <div className="summary-cta-cluster">
              <button
                type="button"
                className="summary-cta-btn ai-btn glow-pulse"
                onClick={() => {
                  playTempleChime();
                  setIsAIModalOpen(true);
                }}
                title="AI ज्योतिषाचार्य परामर्श (AI Faladesh & Chat)"
              >
                <Bot size={16} />
                <span>AI ज्योतिषाचार्य परामर्श</span>
              </button>

              <button
                type="button"
                className="summary-cta-btn patrika-btn"
                onClick={() => {
                  playSoftClick();
                  setIsPatrikaModalOpen(true);
                }}
                title="सम्पूर्ण ८-पृष्ठीय कुण्डली पत्रिका (PDF View & Print)"
              >
                <Printer size={16} />
                <span>बृहत् जन्मपत्रिका PDF</span>
              </button>
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

              {/* Tab 2: AI Jyotish Faladesh (सम्पूर्ण फलकथन) */}
              {activeTab === "aifaladesh" && (
                <div className="ai-inline-tab-view glass-card animate-fade-in">
                  <div className="section-title-bar">
                    <div className="title-with-icon">
                      <Bot className="icon-gold" size={24} />
                      <div>
                        <h3>AI ज्योतिषाचार्य सम्पूर्ण फलकथन (AI Vedic Faladesh)</h3>
                        <span className="sub-title-text">
                          महर्षि पाराशर होरा शास्त्र पर आधारित वास्तविक एवं प्रामाणिक जन्मपत्रिका फलकथन
                        </span>
                      </div>
                    </div>

                    <div className="title-actions">
                      <button
                        type="button"
                        className="btn-gold-action"
                        onClick={() => {
                          playTempleChime();
                          setIsAIModalOpen(true);
                        }}
                      >
                        <Bot size={16} />
                        <span>पंडित जी से संवाद / प्रश्न पूछें</span>
                      </button>

                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => {
                          playSoftClick();
                          setIsPatrikaModalOpen(true);
                        }}
                      >
                        <Printer size={16} />
                        <span>बृहत् पत्रिका PDF देखें</span>
                      </button>
                    </div>
                  </div>

                  {aiFaladesh ? (
                    <div className="ai-faladesh-paper inline-paper">
                      <div className="paper-header-strip">
                        <span className="engine-badge">
                          स्रोत: {aiFaladesh.provider} • मॉडल: {aiFaladesh.model}
                        </span>
                        <span className="gen-time">
                          परामर्श दिनांक: {new Date(aiFaladesh.generatedAt).toLocaleDateString("hi-IN")}
                        </span>
                      </div>
                      <div className="paper-body-content">
                        <pre className="faladesh-formatted-text">{aiFaladesh.content}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="ai-empty-placeholder glass-card">
                      <Sparkles size={40} className="text-gold" />
                      <h4>आचार्य जी द्वारा जन्मपत्रिका का सम्पूर्ण फलकथन प्राप्त करें</h4>
                      <p>
                        जातक {formData.name} की कुंडली के अनुसार करियर, विवाह, धन-संपत्ति, स्वास्थ्य एवं वैदिक उपायों का गहन विश्लेषण तैयार करने के लिए नीचे दिए गए बटन पर क्लिक करें।
                      </p>
                      <button
                        type="button"
                        className="btn-gold-action large"
                        onClick={() => {
                          playTempleChime();
                          setIsAIModalOpen(true);
                        }}
                      >
                        <Bot size={18} />
                        <span>एआई सम्पूर्ण फलकथन तैयार करें</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Brihat Kundli Patrika Book Preview Tab */}
              {activeTab === "patrika" && (
                <div className="patrika-inline-tab-view glass-card animate-fade-in">
                  <div className="section-title-bar">
                    <div className="title-with-icon">
                      <BookOpen className="icon-gold" size={24} />
                      <div>
                        <h3>बृहत् जन्मपत्रिका (Real Life Kundli Book)</h3>
                        <span className="sub-title-text">
                          ८ पृष्ठों की सम्पूर्ण प्रामाणिक जन्मपत्रिका - पंचांग, अवकहड़ा चक्र, ग्रह स्थिति, महादशा, राजयोग, भाव फल व उपाय
                        </span>
                      </div>
                    </div>

                    <div className="title-actions">
                      <button
                        type="button"
                        className="btn-gold-action"
                        onClick={() => {
                          playSoftClick();
                          setIsPatrikaModalOpen(true);
                        }}
                      >
                        <Printer size={16} />
                        <span>पत्रिका खोलें एवं PDF डाउनलोड करें</span>
                      </button>
                    </div>
                  </div>

                  <div className="patrika-intro-showcase">
                    <div className="patrika-cover-teaser">
                      <div className="teaser-om">ॐ</div>
                      <h4>बृहत् जन्मपत्रिका</h4>
                      <p className="teaser-client">जातक: <strong>{formData.name}</strong></p>
                      <div className="teaser-pages-list">
                        <span>✓ पृष्ठ १: मुखपृष्ठ एवं सम्पूर्ण अवकहड़ा चक्र (पंचांग, गण, योनि, नाड़ी, पाया)</span>
                        <span>✓ पृष्ठ २: लग्न (D-1) व नवमांश (D-9) कुण्डली चक्र व ग्रह स्पष्ट स्थिति</span>
                        <span>✓ पृष्ठ ३: १२० वर्षीय विंशोत्तरी महादशा एवं सक्रिय अंतर्दशा विचार</span>
                        <span>✓ पृष्ठ ४: मांगलिक दोष, कालसर्प, साढ़ेसाती व शुभ राजयोग परीक्षण</span>
                        <span>✓ पृष्ठ ५: द्वादश भाव (१२ भाव) फल विचार एवं भावेश प्रभाव</span>
                        <span>✓ पृष्ठ ६: विस्तृत जीवन फल (करियर, व्यवसाय, विवाह, धन, स्वास्थ्य)</span>
                        <span>✓ पृष्ठ ७: ज्योतिषाचार्य जी का विशेष व्यक्तिगत परामर्श (AI Faladesh)</span>
                        <span>✓ पृष्ठ ८: अनुभूत वैदिक उपाय, रत्न, रुद्राक्ष, बीज मंत्र व शुभ आशीर्वाद</span>
                      </div>
                      <div className="teaser-actions">
                        <button
                          type="button"
                          className="btn-gold-action large"
                          onClick={() => {
                            playSoftClick();
                            setIsPatrikaModalOpen(true);
                          }}
                        >
                          <BookOpen size={18} />
                          <span>सम्पूर्ण ८-पृष्ठीय पत्रिका देखें व PDF निकालें</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Life Predictions */}
              {activeTab === "predictions" && (
                <LifePredictions
                  interpretations={lifeInterpretations}
                  clientName={formData.name}
                />
              )}

              {/* Tab: 36 Guna Matrimonial Kundli Matching (Milan) */}
              {activeTab === "milan" && (
                <GunMilan
                  nativeFormData={formData}
                  nativeMoonDeg={moonPlanet?.longitude || 0}
                  nativePlanets={kundli.planets}
                  nativeAscendant={kundli.ascendant}
                />
              )}

              {/* Tab: Divisional Charts */}
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

              {/* Tab: Vimshottari Dasha */}
              {activeTab === "dasha" && (
                <VimshottariDasha dashaData={kundli.dasha} />
              )}

              {/* Tab: Doshas & Auspicious Yogas */}
              {activeTab === "doshas" && (
                <DoshaYogaChecker doshasAndYogas={kundli.doshasYogas} />
              )}

              {/* Tab: 12 Houses (Bhavas) Analysis */}
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

              {/* Tab: Gemstones & Vedic Remedies */}
              {activeTab === "remedies" && (
                <RemediesView
                  ascendant={kundli.ascendant}
                  planets={kundli.planets}
                />
              )}
            </>
          )}
        </section>

        {/* Real-Life Multi-Page Brihat Janam Kundli Patrika (Preview & Multi-Page Print) */}
        {kundli && (
          <BrihatKundliPatrika
            isOpen={isPatrikaModalOpen}
            onClose={() => setIsPatrikaModalOpen(false)}
            kundli={kundli}
            formData={formData}
            avakahada={avakahada}
            aiFaladesh={aiFaladesh}
            chartStyle={chartStyle}
            lifeInterpretations={lifeInterpretations}
          />
        )}

        {/* AI Astrologer (Pandit Ji) Consultation Modal */}
        {kundli && (
          <AIAstrologerModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            kundli={kundli}
            formData={formData}
            avakahada={avakahada}
            aiFaladesh={aiFaladesh}
            setAiFaladesh={setAiFaladesh}
            onOpenPatrikaModal={() => setIsPatrikaModalOpen(true)}
          />
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
