import { useState } from "react";
import { Sparkles, Info, Eye } from "lucide-react";

export default function GrahaTable({
  planets,
  ascendant,
  onSelectPlanet,
  activePlanet
}) {
  const [selectedInfo, setSelectedInfo] = useState(null);

  if (!planets || planets.length === 0) return null;

  return (
    <div className="graha-table-card glass-card">
      <div className="table-header">
        <div className="table-title">
          <Sparkles className="icon-gold" size={18} />
          <h3>Planetary Positions & Dignity (Navagraha Table)</h3>
        </div>
        <span className="info-pill">
          Ascendant Lord: {ascendant?.rashi?.ruler} ({ascendant?.rashi?.english} {ascendant?.degFormatted})
        </span>
      </div>

      <div className="table-responsive">
        <table className="astro-table">
          <thead>
            <tr>
              <th>Planet</th>
              <th>House</th>
              <th>Sign (Rashi)</th>
              <th>Degrees</th>
              <th>Nakshatra & Pada</th>
              <th>Dignity</th>
              <th>Motion / State</th>
              <th>Aspects (Drishti)</th>
            </tr>
          </thead>
          <tbody>
            {/* Ascendant Row */}
            {ascendant && (
              <tr className="ascendant-row">
                <td>
                  <div className="graha-cell">
                    <span className="graha-symbol asc-sym">ASC</span>
                    <div>
                      <strong>Ascendant (Lagna)</strong>
                      <span className="sub-text">1st House</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="house-tag primary">1</span>
                </td>
                <td>
                  <span className="rashi-tag">
                    {ascendant.rashi?.symbol} {ascendant.rashi?.english} ({ascendant.rashi?.name})
                  </span>
                </td>
                <td>{ascendant.degFormatted}</td>
                <td>-</td>
                <td>
                  <span className="dignity-badge neutral">Base Ascendant</span>
                </td>
                <td>-</td>
                <td>7th House</td>
              </tr>
            )}

            {/* 9 Graha Rows */}
            {planets.map((p) => {
              const isActive = activePlanet && activePlanet.id === p.id;

              // Compute Drishti / aspects
              const aspectOffsets = [7];
              if (p.id === "Mars") aspectOffsets.push(4, 8);
              if (p.id === "Jupiter") aspectOffsets.push(5, 9);
              if (p.id === "Saturn") aspectOffsets.push(3, 10);
              if (p.id === "Rahu" || p.id === "Ketu") aspectOffsets.push(5, 9);

              const drishtiHouses = aspectOffsets
                .map((off) => ((p.house - 1 + (off - 1)) % 12) + 1)
                .join(", ");

              return (
                <tr
                  key={p.id}
                  className={`graha-row ${isActive ? "active-row" : ""}`}
                  onClick={() => onSelectPlanet && onSelectPlanet(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="graha-cell">
                      <span
                        className="graha-symbol"
                        style={{ color: p.color, borderColor: p.color }}
                      >
                        {p.symbol}
                      </span>
                      <div>
                        <strong>{p.name}</strong>
                        <span className="sub-text">{p.sanskrit}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="house-tag">{p.house}</span>
                  </td>
                  <td>
                    <span className="rashi-tag">
                      {p.rashi.symbol} {p.rashi.english} ({p.rashi.name})
                    </span>
                  </td>
                  <td>
                    <span className="deg-mono">{p.degFormatted}</span>
                  </td>
                  <td>
                    <div className="nak-cell">
                      <span>{p.nakshatra.name}</span>
                      <span className="sub-text">
                        Pada {p.nakshatra.pada} (Lord: {p.nakshatra.lord})
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`dignity-badge ${p.dignityCode}`}>
                      {p.dignity}
                    </span>
                  </td>
                  <td>
                    <div className="state-cell">
                      {p.isRetrograde && (
                        <span className="state-badge retrograde" title="Retrograde Motion">
                          Ⓡ Retrograde
                        </span>
                      )}
                      {p.isCombust && (
                        <span className="state-badge combust" title="Combust by Sun">
                          🔥 Combust
                        </span>
                      )}
                      {!p.isRetrograde && !p.isCombust && (
                        <span className="state-badge direct">Direct</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="drishti-text">{drishtiHouses}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
