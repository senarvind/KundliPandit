import { RASHIS, HOUSES } from "../data/vedicData";

export default function SouthIndianChart({
  chartData,
  title = "South Indian Chart",
  onSelectHouse,
  onSelectPlanet,
  activePlanet = null,
  activeHouse = null
}) {
  if (!chartData || !chartData.planets) {
    return <div className="chart-loading">Loading Kundli chart...</div>;
  }

  const ascSign = chartData.ascSign || 1;
  const planets = chartData.planets || [];

  // Group planets by their Sign (1 to 12)
  const signPlanets = Array.from({ length: 13 }, () => []);
  planets.forEach((p) => {
    if (p.sign >= 1 && p.sign <= 12) {
      signPlanets[p.sign].push(p);
    }
  });

  // Map each grid cell (row 0-3, col 0-3) to its fixed Rashi (1-12) or null if center
  const gridSigns = [
    [12, 1, 2, 3],
    [11, null, null, 4],
    [10, null, null, 5],
    [9, 8, 7, 6]
  ];

  return (
    <div className="kundli-chart-wrapper south-indian">
      <div className="chart-header">
        <span className="chart-badge">South Indian Fixed Sign Grid</span>
        <h3 className="chart-title">{title}</h3>
      </div>

      <div className="south-grid-container">
        <div className="south-indian-grid">
          {gridSigns.map((row, rIdx) =>
            row.map((signNum, cIdx) => {
              if (signNum === null) {
                // Center 2x2 merged area: only render once at (1,1) with span
                if (rIdx === 1 && cIdx === 1) {
                  return (
                    <div key="center-cell" className="south-cell center-seal">
                      <div className="seal-om">ॐ</div>
                      <div className="seal-title">Vedic Birth Chart</div>
                      <div className="seal-lagna">
                        Lagna: <strong>{RASHIS[ascSign - 1].english}</strong> ({RASHIS[ascSign - 1].name})
                      </div>
                    </div>
                  );
                }
                return null; // The CSS grid handles 2x2 via grid-column / grid-row span
              }

              const rashi = RASHIS[signNum - 1];
              const isAsc = signNum === ascSign;
              // House number relative to Lagna
              const houseNum = ((signNum - ascSign + 12) % 12) + 1;
              const pList = signPlanets[signNum] || [];
              const isSelected = activeHouse === houseNum;

              return (
                <div
                  key={`cell-${signNum}`}
                  className={`south-cell ${isAsc ? "ascendant-cell" : ""} ${isSelected ? "selected-cell" : ""}`}
                  onClick={() => onSelectHouse && onSelectHouse(houseNum)}
                >
                  <div className="cell-header">
                    <span className="rashi-tag">
                      {rashi.symbol} {rashi.english}
                    </span>
                    <span className="house-badge">House {houseNum}</span>
                  </div>

                  {isAsc && (
                    <div className="asc-indicator">
                      <span className="asc-cross">/ /</span>
                      <span className="asc-text">Lagna (ASC)</span>
                    </div>
                  )}

                  <div className="cell-planets">
                    {pList.map((p, idx) => {
                      let pColor = "#f8fafc";
                      if (p.dignityCode === "exalted") pColor = "#4ade80";
                      else if (p.dignityCode === "debilitated") pColor = "#f87171";
                      else if (p.dignityCode === "own") pColor = "#fbbf24";

                      return (
                        <span
                          key={`p-${p.id}-${idx}`}
                          className={`p-tag ${activePlanet && activePlanet.id === p.id ? "active-planet" : ""}`}
                          style={{ color: pColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlanet && onSelectPlanet(p);
                          }}
                        >
                          {p.shortName || (p.id === "Moon" ? "Moo" : p.id.slice(0, 3))}
                          {p.isRetrograde ? "Ⓡ" : ""}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
