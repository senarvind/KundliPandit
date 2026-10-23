import { useState } from "react";
import { RASHIS, HOUSES } from "../data/vedicData";

export default function NorthIndianChart({
  chartData,
  title = "Lagna Kundli (D-1 Chart)",
  onSelectHouse,
  onSelectPlanet,
  activePlanet = null,
  activeHouse = null
}) {
  const [hoveredHouse, setHoveredHouse] = useState(null);

  // If chartData is not provided or incomplete
  if (!chartData || !chartData.planets) {
    return <div className="chart-loading">Loading Kundli chart...</div>;
  }

  const ascSign = chartData.ascSign || 1;
  const planets = chartData.planets || [];

  // Group planets by house (1-12)
  const housePlanets = Array.from({ length: 13 }, () => []);
  planets.forEach((p) => {
    if (p.house >= 1 && p.house <= 12) {
      housePlanets[p.house].push(p);
    }
  });

  // Calculate Rashi sign number (1-12) for each house (1-12)
  const getHouseSign = (houseNum) => {
    return ((ascSign - 1 + (houseNum - 1)) % 12) + 1;
  };

  // House definition geometries & text positions (500 x 500 coordinates)
  const houseDefs = [
    {
      num: 1,
      name: "Tanu (Lagna)",
      path: "M 250 0 L 375 125 L 250 250 L 125 125 Z",
      signPos: { x: 250, y: 70 },
      planetPos: { x: 250, y: 145 },
      center: { x: 250, y: 125 }
    },
    {
      num: 2,
      name: "Dhana",
      path: "M 0 0 L 250 0 L 125 125 Z",
      signPos: { x: 125, y: 40 },
      planetPos: { x: 125, y: 80 },
      center: { x: 125, y: 55 }
    },
    {
      num: 3,
      name: "Sahaja",
      path: "M 0 0 L 125 125 L 0 250 Z",
      signPos: { x: 40, y: 125 },
      planetPos: { x: 65, y: 160 },
      center: { x: 55, y: 125 }
    },
    {
      num: 4,
      name: "Sukha",
      path: "M 0 250 L 125 125 L 250 250 L 125 375 Z",
      signPos: { x: 70, y: 250 },
      planetPos: { x: 145, y: 250 },
      center: { x: 125, y: 250 }
    },
    {
      num: 5,
      name: "Putra",
      path: "M 0 250 L 125 375 L 0 500 Z",
      signPos: { x: 40, y: 375 },
      planetPos: { x: 65, y: 345 },
      center: { x: 55, y: 375 }
    },
    {
      num: 6,
      name: "Shatru",
      path: "M 0 500 L 125 375 L 250 500 Z",
      signPos: { x: 125, y: 470 },
      planetPos: { x: 125, y: 430 },
      center: { x: 125, y: 445 }
    },
    {
      num: 7,
      name: "Kalatra",
      path: "M 250 250 L 375 375 L 250 500 L 125 375 Z",
      signPos: { x: 250, y: 435 },
      planetPos: { x: 250, y: 355 },
      center: { x: 250, y: 375 }
    },
    {
      num: 8,
      name: "Ayur",
      path: "M 250 500 L 375 375 L 500 500 Z",
      signPos: { x: 375, y: 470 },
      planetPos: { x: 375, y: 430 },
      center: { x: 375, y: 445 }
    },
    {
      num: 9,
      name: "Bhagya",
      path: "M 375 375 L 500 250 L 500 500 Z",
      signPos: { x: 460, y: 375 },
      planetPos: { x: 435, y: 345 },
      center: { x: 445, y: 375 }
    },
    {
      num: 10,
      name: "Karma",
      path: "M 250 250 L 375 125 L 500 250 L 375 375 Z",
      signPos: { x: 430, y: 250 },
      planetPos: { x: 355, y: 250 },
      center: { x: 375, y: 250 }
    },
    {
      num: 11,
      name: "Labha",
      path: "M 375 125 L 500 0 L 500 250 Z",
      signPos: { x: 460, y: 125 },
      planetPos: { x: 435, y: 160 },
      center: { x: 445, y: 125 }
    },
    {
      num: 12,
      name: "Vyaya",
      path: "M 250 0 L 500 0 L 375 125 Z",
      signPos: { x: 375, y: 40 },
      planetPos: { x: 375, y: 80 },
      center: { x: 375, y: 55 }
    }
  ];

  // Drishti / Aspects calculation for active planet
  const getAspectedHouses = (planet) => {
    if (!planet) return [];
    const ph = planet.house;
    const aspectOffsets = [7]; // All planets aspect 7th house
    if (planet.id === "Mars") aspectOffsets.push(4, 8);
    if (planet.id === "Jupiter") aspectOffsets.push(5, 9);
    if (planet.id === "Saturn") aspectOffsets.push(3, 10);
    if (planet.id === "Rahu" || planet.id === "Ketu") aspectOffsets.push(5, 9);

    return aspectOffsets.map((off) => ((ph - 1 + (off - 1)) % 12) + 1);
  };

  const aspectedHouses = activePlanet ? getAspectedHouses(activePlanet) : [];

  return (
    <div className="kundli-chart-wrapper north-indian">
      <div className="chart-header">
        <span className="chart-badge">North Indian Diamond Chart</span>
        <h3 className="chart-title">{title}</h3>
      </div>

      <div className="svg-container">
        <svg
          viewBox="0 0 500 500"
          className="kundli-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Golden radial gradient for active/hovered houses */}
            <radialGradient id="kendraGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="trikonaAmber" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0.06" />
            </radialGradient>
            <radialGradient id="aspectGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="hoverGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
            </radialGradient>
            {/* Outer border glow filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* House Polygons */}
          {houseDefs.map((def) => {
            const isHovered = hoveredHouse === def.num;
            const isSelected = activeHouse === def.num;
            const isAspected = aspectedHouses.includes(def.num);
            const isKendra = [1, 4, 7, 10].includes(def.num);
            const isTrikona = [5, 9].includes(def.num);

            let fillColor = "rgba(11, 17, 33, 0.65)";
            if (isSelected) fillColor = "url(#hoverGlow)";
            else if (isHovered) fillColor = "rgba(245, 158, 11, 0.22)";
            else if (isAspected) fillColor = "url(#aspectGlow)";
            else if (isKendra) fillColor = "url(#kendraGold)";
            else if (isTrikona) fillColor = "url(#trikonaAmber)";

            return (
              <g
                key={`house-poly-${def.num}`}
                className="house-group"
                onMouseEnter={() => setHoveredHouse(def.num)}
                onMouseLeave={() => setHoveredHouse(null)}
                onClick={() => onSelectHouse && onSelectHouse(def.num)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={def.path}
                  fill={fillColor}
                  stroke={isSelected ? "#f59e0b" : isHovered ? "#fbbf24" : isAspected ? "#38bdf8" : "#854d0e"}
                  strokeWidth={isSelected || isHovered ? "2.5" : "1.5"}
                  strokeLinejoin="round"
                  className="house-path"
                />
              </g>
            );
          })}

          {/* Golden Chart Geometric Lines (Crisp overlay) */}
          <g className="chart-grid-lines" stroke="#eab308" strokeWidth="1.8" fill="none">
            {/* Outer Frame */}
            <rect x="2" y="2" width="496" height="496" stroke="#f59e0b" strokeWidth="3" rx="4" />
            {/* Main Diamond */}
            <polygon points="250,2 498,250 250,498 2,250" stroke="#f59e0b" strokeWidth="2.2" />
            {/* Diagonals */}
            <line x1="2" y1="2" x2="498" y2="498" stroke="#ca8a04" strokeWidth="1.8" />
            <line x1="498" y1="2" x2="2" y2="498" stroke="#ca8a04" strokeWidth="1.8" />
          </g>

          {/* House Content: Rashi Numbers & Planets */}
          {houseDefs.map((def) => {
            const signNum = getHouseSign(def.num);
            const rashi = RASHIS[signNum - 1];
            const pList = housePlanets[def.num] || [];
            const isHovered = hoveredHouse === def.num;

            return (
              <g key={`house-content-${def.num}`} pointerEvents="none">
                {/* House Roman / Hindu sign number */}
                <text
                  x={def.signPos.x}
                  y={def.signPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered ? "#fef08a" : "#ca8a04"}
                  fontSize="15"
                  fontWeight="700"
                  fontFamily="'Cinzel', serif"
                  className="rashi-num"
                >
                  {signNum}
                </text>

                {/* Sub-label for Lagna (1st house) */}
                {def.num === 1 && (
                  <text
                    x={def.signPos.x}
                    y={def.signPos.y - 18}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="1px"
                  >
                    LAGNA (ASC)
                  </text>
                )}

                {/* Planets inside this house */}
                <g className="planet-badges" pointerEvents="auto">
                  {pList.map((p, idx) => {
                    const totalP = pList.length;
                    // Distribute planets in cluster around planetPos
                    let offsetX = 0;
                    let offsetY = 0;
                    if (totalP === 1) {
                      offsetX = 0;
                      offsetY = 0;
                    } else if (totalP === 2) {
                      offsetX = (idx - 0.5) * 44;
                      offsetY = 0;
                    } else if (totalP === 3) {
                      offsetX = (idx - 1) * 38;
                      offsetY = idx % 2 === 0 ? -12 : 12;
                    } else {
                      offsetX = ((idx % 2) - 0.5) * 42;
                      offsetY = Math.floor(idx / 2) * 22 - 12;
                    }

                    const px = def.planetPos.x + offsetX;
                    const py = def.planetPos.y + offsetY;
                    const isPActive = activePlanet && activePlanet.id === p.id;

                    // Planet color by dignity
                    let pColor = "#f8fafc";
                    let badgeBg = "rgba(15, 23, 42, 0.75)";
                    let badgeBorder = "#475569";

                    if (p.dignityCode === "exalted") {
                      pColor = "#4ade80"; // Bright Green for Exalted
                      badgeBorder = "#22c55e";
                    } else if (p.dignityCode === "debilitated") {
                      pColor = "#f87171"; // Coral Red for Debilitated
                      badgeBorder = "#ef4444";
                    } else if (p.dignityCode === "own") {
                      pColor = "#fbbf24"; // Warm Gold for Own Sign
                      badgeBorder = "#d97706";
                    }

                    if (isPActive) {
                      badgeBorder = "#38bdf8";
                      badgeBg = "rgba(14, 165, 233, 0.35)";
                    }

                    return (
                      <g
                        key={`planet-${p.id}-${idx}`}
                        transform={`translate(${px}, ${py})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlanet && onSelectPlanet(p);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Planet Pill Badge */}
                        <rect
                          x="-20"
                          y="-10"
                          width="40"
                          height="20"
                          rx="4"
                          fill={badgeBg}
                          stroke={badgeBorder}
                          strokeWidth="1.2"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={pColor}
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="'Outfit', sans-serif"
                        >
                          {p.shortName || (p.id === "Moon" ? "Moo" : p.id.slice(0, 3))}
                          {p.isRetrograde ? "Ⓡ" : ""}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Legend & Quick House Inspector */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot exalted"></span>
          <span>Exalted</span>
        </div>
        <div className="legend-item">
          <span className="dot own"></span>
          <span>Own Sign</span>
        </div>
        <div className="legend-item">
          <span className="dot debilitated"></span>
          <span>Debilitated</span>
        </div>
        <div className="legend-item">
          <span className="dot retrograde"></span>
          <span>Ⓡ Retrograde</span>
        </div>
      </div>

      {hoveredHouse && (
        <div className="house-hover-card">
          <div className="hover-header">
            <strong>House {hoveredHouse} ({HOUSES[hoveredHouse - 1].title || HOUSES[hoveredHouse - 1].name}):</strong> {RASHIS[getHouseSign(hoveredHouse) - 1].english} ({RASHIS[getHouseSign(hoveredHouse) - 1].name})
          </div>
          <div className="hover-sub">
            Lord: {RASHIS[getHouseSign(hoveredHouse) - 1].ruler} | Significations: {HOUSES[hoveredHouse - 1].significations.slice(0, 70)}...
          </div>
        </div>
      )}
    </div>
  );
}
