import { useState } from "react";
import NorthIndianChart from "./NorthIndianChart";
import SouthIndianChart from "./SouthIndianChart";
import { Sparkles, Compass } from "lucide-react";
import { playSoftClick } from "../utils/soundEffects";

export default function DivisionalCharts({
  divisionalData,
  chartStyle = "north",
  onSelectHouse,
  onSelectPlanet,
  activePlanet,
  activeHouse
}) {
  const [activeTab, setActiveTab] = useState("D1");

  if (!divisionalData) return null;

  const tabs = [
    { key: "D1", label: "Lagna Chart (D-1)", desc: "Primary Birth Chart (Overall Life & Physical Self)" },
    { key: "D9", label: "Navamsha (D-9)", desc: "Marriage, Relationships & Destiny (Spiritual Potential)" },
    { key: "D10", label: "Dashamsha (D-10)", desc: "Career, Fame & Professional Status" },
    { key: "D7", label: "Saptamsha (D-7)", desc: "Children, Progeny & Creative Lineage" },
    { key: "Chandra", label: "Moon Chart (Chandra)", desc: "Emotional Mind, Perception & Mental Well-being" }
  ];

  const currentChart = divisionalData[activeTab] || divisionalData.D1;

  const handleTabChange = (key) => {
    playSoftClick();
    setActiveTab(key);
  };

  return (
    <div className="divisional-charts-container glass-card">
      <div className="divisional-header">
        <div className="header-left">
          <Sparkles className="icon-gold" size={18} />
          <h3>Vedic Divisional Charts (Varga Charts)</h3>
        </div>
        <div className="varga-desc-badge">
          {tabs.find((t) => t.key === activeTab)?.desc}
        </div>
      </div>

      <div className="varga-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`varga-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => handleTabChange(tab.key)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="varga-chart-display">
        {chartStyle === "north" ? (
          <NorthIndianChart
            chartData={currentChart}
            title={currentChart.title || currentChart.name}
            onSelectHouse={onSelectHouse}
            onSelectPlanet={onSelectPlanet}
            activePlanet={activePlanet}
            activeHouse={activeHouse}
          />
        ) : (
          <SouthIndianChart
            chartData={currentChart}
            title={currentChart.title || currentChart.name}
            onSelectHouse={onSelectHouse}
            onSelectPlanet={onSelectPlanet}
            activePlanet={activePlanet}
            activeHouse={activeHouse}
          />
        )}
      </div>
    </div>
  );
}
