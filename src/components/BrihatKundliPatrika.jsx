import { useState } from "react";
import NorthIndianChart from "./NorthIndianChart";
import SouthIndianChart from "./SouthIndianChart";
import {
  Printer,
  Sparkles,
  BookOpen,
  X,
  Compass,
  Layers,
  Clock,
  ShieldAlert,
  Grid,
  Heart,
  Gem,
  Award,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import { playSoftClick } from "../utils/soundEffects";

export default function BrihatKundliPatrika({
  isOpen,
  onClose,
  kundli,
  formData,
  avakahada,
  aiFaladesh,
  chartStyle = "north",
  lifeInterpretations
}) {
  const [activePageIndex, setActivePageIndex] = useState(0);

  if (!kundli) return null;

  const moonPlanet = kundli.planets.find((p) => p.id === "Moon");
  const sunPlanet = kundli.planets.find((p) => p.id === "Sun");
  const jupiterPlanet = kundli.planets.find((p) => p.id === "Jupiter");
  const marsPlanet = kundli.planets.find((p) => p.id === "Mars");

  const pages = [
    { id: "page1", title: "१. मुखपृष्ठ एवं पंचांग", label: "Cover & Panchang" },
    { id: "page2", title: "२. कुण्डली एवं ग्रह स्थिति", label: "Charts & Planets" },
    { id: "page3", title: "३. विंशोत्तरी महादशा", label: "Vimshottari Dasha" },
    { id: "page4", title: "४. दोष एवं राजयोग विचार", label: "Doshas & Yogas" },
    { id: "page5", title: "५. द्वादश भाव फल विचार", label: "12 Houses (Bhavas)" },
    { id: "page6", title: "६. जीवन फल (करियर, विवाह, धन)", label: "Life Predictions" },
    { id: "page7", title: "७. आचार्य जी का विशेष परामर्श (AI)", label: "AI Acharya Faladesh" },
    { id: "page8", title: "८. वैदिक उपाय एवं रत्न परामर्श", label: "Remedies & Ashirwad" }
  ];

  const handlePrint = () => {
    playSoftClick();
    window.print();
  };

  // Helper for Karakas (Jaimini based on degrees)
  const sortedPlanetsByDegree = [...kundli.planets]
    .filter((p) => !["Rahu", "Ketu"].includes(p.id))
    .sort((a, b) => b.degree - a.degree);

  const karakaNames = [
    "आत्मकारक (Atmakaraka)",
    "अमात्यकारक (Amatyakaraka)",
    "भ्रातृकारक (Bhratrukaraka)",
    "मातृकारक (Matrukaraka)",
    "पुत्रकारक (Putrakaraka)",
    "ज्ञातिकारक (Gnatikaraka)",
    "दारकारक (Darakaraka)"
  ];

  const getPlanetKaraka = (pId) => {
    const idx = sortedPlanetsByDegree.findIndex((p) => p.id === pId);
    return idx !== -1 ? karakaNames[idx] : "-";
  };

  // Content for Page 1: Cover & Avakahada Chakra
  const renderPage1 = () => (
    <div className="patrika-page page-1">
      <div className="patrika-border-frame">
        <div className="corner-ornament top-left">☸</div>
        <div className="corner-ornament top-right">☸</div>
        <div className="corner-ornament bottom-left">☸</div>
        <div className="corner-ornament bottom-right">☸</div>

        <div className="patrika-inner-content">
          {/* Top Invocations */}
          <div className="sacred-invocations">
            <div className="om-symbol">॥ ॐ श्री गणेशाय नमः ॥</div>
            <div className="shloka-text">
              ब्रह्मा मुरारिस्त्रिपुरान्तकारी भानुः शशी भूमिसुतो बुधश्च ।<br />
              गुरुश्च शुक्रः शनिराहुकेतवः सर्वे ग्रहाः शान्तिकरा भवन्तु ॥
            </div>
            <h1 className="patrika-main-title">बृहत् जन्मपत्रिका</h1>
            <div className="patrika-sub-title">
              महर्षि पाराशर होरा शास्त्रानुमोदित • प्रामाणिक वैदिक जन्म कुण्डली एवं जीवन फलकथन
            </div>
          </div>

          {/* Native Birth Particulars Box */}
          <div className="jataka-particulars-card">
            <div className="card-ribbon-title">जातक जन्म विवरण (Native Birth Particulars)</div>
            <div className="particulars-grid">
              <div className="part-cell">
                <span className="p-lbl">जातक का नाम:</span>
                <span className="p-val text-bold">{formData.name || "Client"}</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">लिंग (Gender):</span>
                <span className="p-val">{formData.gender || "Male"}</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">जन्म दिनांक:</span>
                <span className="p-val text-bold">{formData.date}</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">जन्म समय:</span>
                <span className="p-val text-bold">{formData.time}</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">जन्म स्थान:</span>
                <span className="p-val">{formData.city}</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">अक्षांश / रेखांश:</span>
                <span className="p-val">{formData.lat}° N / {formData.lng}° E</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">अयानांश (Ayanamsa):</span>
                <span className="p-val">{formData.ayanamsa || "Lahiri"} ({kundli.ayanamsa?.toFixed(2)}°)</span>
              </div>
              <div className="part-cell">
                <span className="p-lbl">समय क्षेत्र (TZ):</span>
                <span className="p-val">+{formData.tz || 5.5} hrs GMT</span>
              </div>
            </div>
          </div>

          {/* Avakahada Chakra Table */}
          <div className="avakahada-chakra-card">
            <div className="card-ribbon-title">पंचांग एवं अवकहड़ा चक्र (Avakahada Chakra & Panchang)</div>
            <table className="avakahada-table">
              <tbody>
                <tr>
                  <td className="t-head">जन्म लग्न (Lagna):</td>
                  <td className="t-val"><strong>{kundli.ascendant.rashi.hindi} ({kundli.ascendant.rashi.english}) {kundli.ascendant.degFormatted}</strong></td>
                  <td className="t-head">लग्नेश (Lagna Lord):</td>
                  <td className="t-val"><strong>{kundli.ascendant.rashi.ruler}</strong></td>
                </tr>
                <tr>
                  <td className="t-head">चंद्र राशि (Moon Sign):</td>
                  <td className="t-val"><strong>{moonPlanet?.rashi?.hindi} ({moonPlanet?.rashi?.english})</strong></td>
                  <td className="t-head">राशिश (Rashi Lord):</td>
                  <td className="t-val"><strong>{moonPlanet?.rashi?.ruler}</strong></td>
                </tr>
                <tr>
                  <td className="t-head">जन्म नक्षत्र (Nakshatra):</td>
                  <td className="t-val"><strong>{moonPlanet?.nakshatra?.hindi} ({moonPlanet?.nakshatra?.name})</strong></td>
                  <td className="t-head">नक्षत्र चरण व स्वामी:</td>
                  <td className="t-val">चरण {moonPlanet?.nakshatra?.pada} (स्वामी: {moonPlanet?.nakshatra?.lord})</td>
                </tr>
                <tr>
                  <td className="t-head">तिथि (Tithi):</td>
                  <td className="t-val">{avakahada?.tithi?.hindi} ({avakahada?.tithi?.name})</td>
                  <td className="t-head">वार (Day):</td>
                  <td className="t-val">{avakahada?.vaar?.hindi} ({avakahada?.vaar?.eng})</td>
                </tr>
                <tr>
                  <td className="t-head">नित्य योग (Yoga):</td>
                  <td className="t-val">{avakahada?.yoga?.hindi} ({avakahada?.yoga?.name})</td>
                  <td className="t-head">करण (Karana):</td>
                  <td className="t-val">{avakahada?.karana?.hindi} ({avakahada?.karana?.name})</td>
                </tr>
                <tr>
                  <td className="t-head">गण (Gana):</td>
                  <td className="t-val"><strong>{avakahada?.gana?.hindi}</strong></td>
                  <td className="t-head">योनि (Yoni):</td>
                  <td className="t-val"><strong>{avakahada?.yoni?.hindi} ({avakahada?.yoni?.eng})</strong></td>
                </tr>
                <tr>
                  <td className="t-head">नाड़ी (Nadi):</td>
                  <td className="t-val"><strong>{avakahada?.nadi?.hindi}</strong></td>
                  <td className="t-head">वर्ण (Varna):</td>
                  <td className="t-val">{avakahada?.varna?.hindi}</td>
                </tr>
                <tr>
                  <td className="t-head">वश्य (Vashya):</td>
                  <td className="t-val">{avakahada?.vashya?.hindi}</td>
                  <td className="t-head">तत्व (Element):</td>
                  <td className="t-val">{avakahada?.tatva?.hindi}</td>
                </tr>
                <tr>
                  <td className="t-head">पाया (Paya):</td>
                  <td className="t-val"><strong>{avakahada?.paya?.hindi}</strong></td>
                  <td className="t-head">इष्ट देवता:</td>
                  <td className="t-val"><strong>{avakahada?.ishtaDevata}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lucky Elements Strip */}
          <div className="lucky-elements-strip">
            <div className="lucky-item">
              <span className="l-key">शुभ रत्न:</span>
              <span className="l-val">{kundli.ascendant.rashi.stone}</span>
            </div>
            <div className="lucky-item">
              <span className="l-key">शुभ अंक:</span>
              <span className="l-val">{avakahada?.luckyNumbers}</span>
            </div>
            <div className="lucky-item">
              <span className="l-key">शुभ रंग:</span>
              <span className="l-val">{avakahada?.luckyColors}</span>
            </div>
            <div className="lucky-item">
              <span className="l-key">शुभ दिशा:</span>
              <span className="l-val">{avakahada?.luckyDirection}</span>
            </div>
          </div>

          {/* Page Footer */}
          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ १</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Content for Page 2: Charts & Graha Sthiti
  const renderPage2 = () => (
    <div className="patrika-page page-2">
      <div className="patrika-border-frame">
        <div className="patrika-inner-content">
          <div className="page-header-strip">
            <h2 className="page-title">लग्न कुण्डली (D-1), नवमांश कुण्डली (D-9) एवं सम्पूर्ण ग्रह स्थिति</h2>
            <span className="page-tag">ग्रह स्थिति एवं वर्ग चक्र</span>
          </div>

          {/* Dual Charts Grid */}
          <div className="patrika-dual-charts-box">
            <div className="p-chart-item">
              <div className="chart-box-title">लग्न कुण्डली (D-1 Rashi Chakra)</div>
              {chartStyle === "north" ? (
                <NorthIndianChart
                  chartData={kundli.divisionals.D1}
                  title="लग्न चक्र (D-1)"
                />
              ) : (
                <SouthIndianChart
                  chartData={kundli.divisionals.D1}
                  title="लग्न चक्र (D-1)"
                />
              )}
            </div>

            <div className="p-chart-item">
              <div className="chart-box-title">नवमांश कुण्डली (D-9 Navamsha Chakra)</div>
              {chartStyle === "north" ? (
                <NorthIndianChart
                  chartData={kundli.divisionals.D9}
                  title="नवमांश चक्र (D-9)"
                />
              ) : (
                <SouthIndianChart
                  chartData={kundli.divisionals.D9}
                  title="नवमांश चक्र (D-9)"
                />
              )}
            </div>
          </div>

          {/* Planetary Position Table */}
          <div className="patrika-graha-table-card">
            <div className="card-ribbon-title">ग्रह स्पष्ट स्थिति एवं कारक विचार (Planetary Ephemeris & Dignity)</div>
            <table className="graha-full-table">
              <thead>
                <tr>
                  <th>ग्रह (Graha)</th>
                  <th>राशि (Rashi)</th>
                  <th>अंश / कला (Degree)</th>
                  <th>भाव (House)</th>
                  <th>नक्षत्र (Nakshatra)</th>
                  <th>पद</th>
                  <th>अवस्था / स्थिति (Dignity)</th>
                  <th>जैमिनी कारक</th>
                </tr>
              </thead>
              <tbody>
                {kundli.planets.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong> ({p.hindi})
                      {p.isRetrograde ? " [वक्री]" : ""}
                      {p.isCombust ? " [अस्त]" : ""}
                    </td>
                    <td>{p.rashi.hindi} ({p.rashi.english})</td>
                    <td>{p.degFormatted}</td>
                    <td><strong>भाव {p.house}</strong></td>
                    <td>{p.nakshatra.name}</td>
                    <td>{p.nakshatra.pada}</td>
                    <td>
                      <span className={`dignity-badge ${p.dignity.toLowerCase().replace(/[^a-z]/g, "")}`}>
                        {p.dignity}
                      </span>
                    </td>
                    <td>{getPlanetKaraka(p.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ २</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Content for Page 3: Vimshottari Dasha Timeline
  const renderPage3 = () => (
    <div className="patrika-page page-3">
      <div className="patrika-border-frame">
        <div className="patrika-inner-content">
          <div className="page-header-strip">
            <h2 className="page-title">विंशोत्तरी महादशा एवं अन्तर्दशा चक्र (Vimshottari Dasha)</h2>
            <span className="page-tag">१२० वर्षीय दशा चक्र</span>
          </div>

          {/* Active Dasha Highlight Banner */}
          <div className="active-dasha-hero-box">
            <div className="dasha-hero-title">वर्तमान सक्रिय विंशोत्तरी दशा (Current Active Dasha Period)</div>
            <div className="dasha-hero-grid">
              <div className="dh-cell">
                <span className="dh-lbl">वर्तमान महादशा:</span>
                <span className="dh-val text-gold">{kundli.dasha.activeMahadasha?.lord} महादशा</span>
              </div>
              <div className="dh-cell">
                <span className="dh-lbl">वर्तमान अन्तर्दशा:</span>
                <span className="dh-val text-gold">{kundli.dasha.activeAntardasha?.lord} अन्तर्दशा</span>
              </div>
              <div className="dh-cell">
                <span className="dh-lbl">महादशा अवधि:</span>
                <span className="dh-val">
                  {kundli.dasha.activeMahadasha?.startDate?.toISOString?.()?.split("T")[0]} से{" "}
                  {kundli.dasha.activeMahadasha?.endDate?.toISOString?.()?.split("T")[0]} तक
                </span>
              </div>
              <div className="dh-cell">
                <span className="dh-lbl">जन्म के समय भुक्त/भोग्य:</span>
                <span className="dh-val">{kundli.dasha.birthLord} की {kundli.dasha.balanceYears} वर्ष शेष</span>
              </div>
            </div>
          </div>

          {/* 120-Year Timeline Table */}
          <div className="dasha-table-box">
            <div className="card-ribbon-title">१२० वर्षीय विंशोत्तरी महादशा समय-सारिणी (120-Year Dasha Timeline)</div>
            <table className="dasha-timeline-table">
              <thead>
                <tr>
                  <th>महादशा स्वामी</th>
                  <th>कुल अवधि (वर्ष)</th>
                  <th>प्रारम्भ दिनांक</th>
                  <th>समाप्ति दिनांक</th>
                  <th>वर्तमान स्थिति</th>
                  <th>प्रमुख अन्तर्दशाएं</th>
                </tr>
              </thead>
              <tbody>
                {kundli.dasha.timeline.map((d, idx) => {
                  const isActive = kundli.dasha.activeMahadasha?.lord === d.lord;
                  const startStr = d.startDate?.toISOString?.()?.split("T")[0] || "";
                  const endStr = d.endDate?.toISOString?.()?.split("T")[0] || "";
                  const subLords = (d.antardashas || []).map((a) => a.lord).slice(0, 5).join(", ") + "...";
                  return (
                    <tr key={idx} className={isActive ? "active-dasha-row" : ""}>
                      <td>
                        <strong>{d.lord}</strong> {isActive ? " ★ (सक्रिय)" : ""}
                      </td>
                      <td>{d.effectiveYears ? d.effectiveYears.toFixed(1) : d.totalYears} वर्ष</td>
                      <td>{startStr}</td>
                      <td>{endStr}</td>
                      <td>
                        <span className={`status-pill ${isActive ? "active" : "standard"}`}>
                          {isActive ? "वर्तमान में सक्रिय" : new Date() > d.endDate ? "पूर्ण" : "आगामी"}
                        </span>
                      </td>
                      <td>{subLords}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ ३</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Content for Page 4: Doshas & Raj Yogas
  const renderPage4 = () => {
    const yogas = kundli.doshasYogas?.yogas || [];
    const doshas = kundli.doshasYogas?.doshas || [];
    return (
      <div className="patrika-page page-4">
        <div className="patrika-border-frame">
          <div className="patrika-inner-content">
            <div className="page-header-strip">
              <h2 className="page-title">दोष एवं शुभ राजयोग परीक्षण (Dosha & Raj Yoga Analysis)</h2>
              <span className="page-tag">मांगलिक, कालसर्प, साढ़ेसाती व राजयोग</span>
            </div>

            {/* Doshas Section */}
            <div className="dosha-parikshan-card">
              <div className="card-ribbon-title">प्रमुख दोष परीक्षण (Vedic Dosha Evaluation)</div>
              <div className="dosha-items-grid">
                {doshas.map((d) => (
                  <div key={d.id} className="dosha-item-cell">
                    <div className="d-title-row">
                      <span className="d-name"><strong>{d.name}</strong> ({d.hindi})</span>
                      <span className={`d-status ${d.status.toLowerCase().includes("present") ? "afflicted" : "safe"}`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="d-desc">{d.effect}</p>
                    {d.cancellation && (
                      <div className="d-cancel">
                        <strong>दोष परिहार / अपवाद:</strong> {d.cancellation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auspicious Raj Yogas Section */}
            <div className="yoga-parikshan-card">
              <div className="card-ribbon-title">कुण्डली में उपस्थित शुभ राजयोग व धन योग (Auspicious Yogas)</div>
              {yogas.length > 0 ? (
                <div className="yogas-list-grid">
                  {yogas.map((y, idx) => (
                    <div key={idx} className="yoga-card-box">
                      <div className="yoga-header">
                        <span className="y-symbol">✦</span>
                        <strong className="y-name">{y.name} ({y.hindi})</strong>
                      </div>
                      <p className="y-effect">{y.effect}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-yogas-note">
                  कुण्डली में सामान्य केंद्र-त्रिकोण राजयोग उपस्थित हैं। ग्रहों के निरंतर शुभ प्रभाव से भाग्योदय होगा।
                </div>
              )}
            </div>

            <div className="patrika-page-footer">
              <span>बृहत् जन्मपत्रिका • पृष्ठ ४</span>
              <span>॥ श्री शुभम् भवतु ॥</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Content for Page 5: 12 Houses (Bhavas) Analysis
  const renderPage5 = () => (
    <div className="patrika-page page-5">
      <div className="patrika-border-frame">
        <div className="patrika-inner-content">
          <div className="page-header-strip">
            <h2 className="page-title">द्वादश भाव फल विचार (12 Houses Analysis)</h2>
            <span className="page-tag">तनु भाव से व्यय भाव पर्यन्त</span>
          </div>

          <div className="bhavas-grid-table">
            {Object.keys(kundli.houses).map((hNum) => {
              const h = kundli.houses[hNum];
              const occupants = kundli.planets.filter((p) => p.house === Number(hNum));
              const occStr = occupants.map((p) => `${p.name} (${p.hindi})`).join(", ") || "शुभ दृष्टि";
              return (
                <div key={hNum} className="bhava-grid-card">
                  <div className="bhava-top">
                    <span className="b-num">भाव {hNum}: {h.name}</span>
                    <span className="b-rashi">{h.rashi?.hindi} ({h.rashi?.english})</span>
                  </div>
                  <div className="bhava-middle">
                    <span><strong>भावेश (Lord):</strong> {h.lord}</span>
                    <span><strong>स्थित ग्रह:</strong> {occStr}</span>
                  </div>
                  <div className="bhava-signif">
                    {h.significations}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ ५</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Content for Page 6: Life Predictions (Career, Marriage, Wealth, Health)
  const renderPage6 = () => {
    const career = lifeInterpretations?.career;
    const marriage = lifeInterpretations?.marriage;
    const wealth = lifeInterpretations?.wealth;
    const health = lifeInterpretations?.health;

    return (
      <div className="patrika-page page-6">
        <div className="patrika-border-frame">
          <div className="patrika-inner-content">
            <div className="page-header-strip">
              <h2 className="page-title">विस्तृत जीवन फलकथन (Life Predictions: Career, Marriage, Wealth, Health)</h2>
              <span className="page-tag">पाराशरीय फल विचार</span>
            </div>

            <div className="predictions-box-grid">
              {/* Career */}
              <div className="pred-section-card">
                <div className="sec-header">
                  <span className="sec-icon">💼</span>
                  <h3>१. आजीविका, व्यवसाय एवं करियर (Karma Bhava - 10th House)</h3>
                </div>
                <p className="sec-text">
                  <strong>दशम भाव राशि:</strong> {career?.sign} (अधिपति: {career?.lord})<br />
                  <strong>अनुशंसित कार्यक्षेत्र:</strong> {career?.bestIndustries?.join(", ") || "प्रबंधन, तकनीकी, वित्त"}<br />
                  <strong>कार्यशैली:</strong> {career?.jobVsBusiness}<br />
                  <strong>दशा प्रभाव:</strong> {career?.dashaNote}
                </p>
              </div>

              {/* Marriage */}
              <div className="pred-section-card">
                <div className="sec-header">
                  <span className="sec-icon">💍</span>
                  <h3>२. विवाह, दांपत्य जीवन एवं जीवनसाथी (Kalatra Bhava - 7th House)</h3>
                </div>
                <p className="sec-text">
                  <strong>सप्तम भाव राशि:</strong> {marriage?.sign} (अधिपति: {marriage?.lord})<br />
                  <strong>जीवनसाथी का स्वभाव व स्वरूप:</strong> {marriage?.spouseNature}<br />
                  <strong>मांगलिक स्थिति:</strong> {marriage?.manglikNote}<br />
                  <strong>वैवाहिक सामंजस्य:</strong> जीवनसाथी सहयोगी, विचारशील एवं परिवार का मान बढ़ाने वाला होगा।
                </p>
              </div>

              {/* Wealth */}
              <div className="pred-section-card">
                <div className="sec-header">
                  <span className="sec-icon">💰</span>
                  <h3>३. धन, संपत्ति एवं आर्थिक समृद्धि (Dhana & Labha Bhavas)</h3>
                </div>
                <p className="sec-text">
                  <strong>द्वितीय व एकादश भाव:</strong> द्वितीय भाव संचित धन व एकादश भाव नियमित लाभ को दर्शाता है।<br />
                  <strong>धन संचय योग:</strong> {wealth?.savingsPotential || "जीवन के मध्य काल में अप्रत्याशित संपत्ति संचय के सुंदर योग हैं।"}<br />
                  <strong>सलाह:</strong> स्थिर संपत्ति, स्वर्ण एवं दीर्घकालिक निवेश में धन लगाना सर्वोत्तम लाभ देगा।
                </p>
              </div>

              {/* Health */}
              <div className="pred-section-card">
                <div className="sec-header">
                  <span className="sec-icon">🌿</span>
                  <h3>४. स्वास्थ्य, जीवनी शक्ति एवं दीर्घायु (Tanu & Rog Bhavas)</h3>
                </div>
                <p className="sec-text">
                  <strong>स्वास्थ्य स्थिति:</strong> {health?.overall || "जीवनी शक्ति प्रबल है। मौसमी परिवर्तनों में पाचन तंत्र का विशेष ध्यान रखें।"}<br />
                  <strong>संवेदनशील अंग:</strong> {health?.vulnerabilities || "पाचन, स्नायु तंत्र एवं रक्तचाप।"}<br />
                  <strong>आचार्य सुझाव:</strong> नित्य प्रातः सूर्य नमस्कार, प्राणायाम एवं सात्विक आहार स्वास्थ्य की रक्षा करेगा।
                </p>
              </div>
            </div>

            <div className="patrika-page-footer">
              <span>बृहत् जन्मपत्रिका • पृष्ठ ६</span>
              <span>॥ श्री शुभम् भवतु ॥</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Content for Page 7: AI Pandit Ji Special Faladesh
  const renderPage7 = () => (
    <div className="patrika-page page-7">
      <div className="patrika-border-frame">
        <div className="patrika-inner-content">
          <div className="page-header-strip">
            <h2 className="page-title">ज्योतिषाचार्य जी का विशेष व्यक्तिगत परामर्श (Acharya Consultation Faladesh)</h2>
            <span className="page-tag">
              {aiFaladesh?.provider ? `${aiFaladesh.provider}` : "AI Vedic Consultation"}
            </span>
          </div>

          <div className="ai-faladesh-print-paper">
            {aiFaladesh?.content ? (
              <pre className="ai-faladesh-print-text">{aiFaladesh.content}</pre>
            ) : (
              <div className="ai-pending-print-notice">
                <p>
                  जातक {formData.name} की कुण्डली का सम्पूर्ण वैदिक फलकथन तैयार है। विस्तृत व्यक्तिगत परामर्श के लिए एप्लिकेशन में "AI ज्योतिषाचार्य परामर्श" बटन पर क्लिक कर परामर्श प्राप्त करें।
                </p>
              </div>
            )}
          </div>

          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ ७</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Content for Page 8: Vedic Remedies & Astrologer Ashirwad
  const renderPage8 = () => (
    <div className="patrika-page page-8">
      <div className="patrika-border-frame">
        <div className="patrika-inner-content">
          <div className="page-header-strip">
            <h2 className="page-title">अनुभूत वैदिक उपाय, रत्न परामर्श एवं शुभ आशीर्वाद</h2>
            <span className="page-tag">दैवीय शांति एवं कल्याणकारी उपाय</span>
          </div>

          {/* Gemstone Recommendation Box */}
          <div className="remedies-full-box">
            <div className="card-ribbon-title">भाग्यवर्धक रत्न परामर्श (Prescribed Auspicious Gemstones)</div>
            <div className="gem-rec-grid">
              <div className="gem-rec-card">
                <span className="gem-badge primary">जीवन रत्न (Life Stone - Lagnesh)</span>
                <h4>{kundli.ascendant.rashi.stone}</h4>
                <div className="gem-specs">
                  <span><strong>धातु:</strong> सोना अथवा तांबा/अष्टधातु</span>
                  <span><strong>उंगली:</strong> अनामिका / तर्जनी</span>
                  <span><strong>शुभ वार:</strong> शुक्ल पक्ष का शुभ दिन</span>
                  <span><strong>शुद्धि:</strong> गंगाजल, कच्चा दूध एवं तुलसी पत्र</span>
                </div>
              </div>

              <div className="gem-rec-card">
                <span className="gem-badge gold">भाग्य रत्न (Lucky Gemstone - Bhagyesh)</span>
                <h4>{moonPlanet?.rashi?.stone || "पीला पुखराज"}</h4>
                <div className="gem-specs">
                  <span><strong>धातु:</strong> पंचधातु / चांदी</span>
                  <span><strong>उंगली:</strong> कनिष्ठिका / मध्यमा</span>
                  <span><strong>शुभ वार:</strong> गुरुवार अथवा सोमवार</span>
                  <span><strong>शुद्धि:</strong> पंचामृत एवं मंत्रोच्चार</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rudraksha & Mantras */}
          <div className="mantra-rudraksha-box">
            <div className="card-ribbon-title">रुद्राक्ष एवं नित्य जपनीय नवग्रह बीज मंत्र</div>
            <div className="mantra-rudraksha-grid">
              <div className="mr-col">
                <strong>अनुशंसित रुद्राक्ष:</strong>
                <p>
                  जातक के लिए ५ मुखी एवं ७ मुखी नेपाली रुद्राक्ष धारण करना महालक्ष्मी व शिव कृपा से समस्त संकटों का निवारण करेगा।
                </p>
              </div>
              <div className="mr-col">
                <strong>नित्य कल्याणकारी मंत्र:</strong>
                <p>
                  "ॐ नमो भगवते वासुदेवाय" अथवा "ॐ नमः शिवाय" का नित्य १०८ बार शांत चित्त से जप करें।
                </p>
              </div>
            </div>
          </div>

          {/* Ashirwad, Seal & Astrologer Signature */}
          <div className="patrika-ashirwad-section">
            <div className="ashirwad-shloka">
              ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥<br />
              ॥ सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
            </div>
            <p className="ashirwad-trans">
              "समस्त प्राणी सुखी हों, सभी निरोगी रहें, सभी का कल्याण हो तथा कोई भी दुःख का भागी न बने।"
            </p>

            <div className="seal-and-signature-grid">
              <div className="seal-box">
                <div className="circle-seal">
                  <span>श्री</span>
                  <span>ज्योतिषाचार्य</span>
                  <span>काशी</span>
                </div>
                <span className="seal-text">अधिकृत वैदिक मुहर (Astrologer Verified)</span>
              </div>

              <div className="signature-box">
                <div className="sig-line">____________________________________</div>
                <strong className="sig-name">आचार्य विद्याधर शास्त्री (काशी)</strong>
                <span className="sig-title">पाराशर ज्योतिष अनुसंधान संस्थान</span>
                <span className="sig-date">निर्गम दिनांक: {new Date().toLocaleDateString("hi-IN")}</span>
              </div>
            </div>
          </div>

          <div className="patrika-page-footer">
            <span>बृहत् जन्मपत्रिका • पृष्ठ ८</span>
            <span>॥ श्री शुभम् भवतु ॥</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* On-screen Patrika Preview Modal */}
      {isOpen && (
        <div className="modal-overlay patrika-modal-overlay">
          <div className="modal-dialog patrika-dialog glass-card animate-fade-in">
            {/* Modal Top Bar */}
            <div className="patrika-modal-header">
              <div className="patrika-modal-title-wrap">
                <div className="p-om-logo">ॐ</div>
                <div>
                  <h2 className="p-modal-title">बृहत् जन्मपत्रिका (Real Life Kundli Patrika)</h2>
                  <span className="p-modal-sub">
                    जातक: <strong>{formData.name}</strong> • सम्पूर्ण ८-पृष्ठीय प्रामाणिक कुण्डली पत्रिका
                  </span>
                </div>
              </div>

              <div className="patrika-modal-actions">
                <button
                  type="button"
                  className="btn-gold-action"
                  onClick={handlePrint}
                  title="Print / Save complete PDF"
                >
                  <Printer size={16} />
                  <span>पत्रिका PDF डाउनलोड / प्रिंट करें</span>
                </button>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => {
                    playSoftClick();
                    onClose();
                  }}
                  title="Close Preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Page Navigation Tabs */}
            <div className="patrika-page-tabs">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`patrika-page-tab-btn ${activePageIndex === idx ? "active" : ""}`}
                  onClick={() => {
                    playSoftClick();
                    setActivePageIndex(idx);
                  }}
                >
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            {/* Single Page Preview Screen */}
            <div className="patrika-preview-viewport">
              <div className="patrika-single-page-preview">
                {activePageIndex === 0 && renderPage1()}
                {activePageIndex === 1 && renderPage2()}
                {activePageIndex === 2 && renderPage3()}
                {activePageIndex === 3 && renderPage4()}
                {activePageIndex === 4 && renderPage5()}
                {activePageIndex === 5 && renderPage6()}
                {activePageIndex === 6 && renderPage7()}
                {activePageIndex === 7 && renderPage8()}
              </div>

              {/* Page Navigator Bottom Controls */}
              <div className="patrika-page-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  disabled={activePageIndex === 0}
                  onClick={() => {
                    playSoftClick();
                    setActivePageIndex((prev) => Math.max(0, prev - 1));
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>पिछला पृष्ठ (Previous)</span>
                </button>

                <span className="stepper-count">
                  पृष्ठ {activePageIndex + 1} / {pages.length}
                </span>

                <button
                  type="button"
                  className="stepper-btn"
                  disabled={activePageIndex === pages.length - 1}
                  onClick={() => {
                    playSoftClick();
                    setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 1));
                  }}
                >
                  <span>अगला पृष्ठ (Next)</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Printable Container (Hidden on screen, rendered in full multi-page flow for window.print()) */}
      <div className="brihat-patrika-print-container">
        {renderPage1()}
        {renderPage2()}
        {renderPage3()}
        {renderPage4()}
        {renderPage5()}
        {renderPage6()}
        {renderPage7()}
        {renderPage8()}
      </div>
    </>
  );
}
