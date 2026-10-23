import { Sun, Moon, Clock, Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function DailyPanchang() {
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = dayNames[today.getDay()];

  // Vedic panchang elements
  const panchang = {
    date: today.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    vaar: currentDay,
    tithi: "Shukla Paksha Ekadashi / Dvadashi",
    nakshatra: "Pushya / Ashlesha",
    yoga: "Shubha Yoga",
    karana: "Bava Karana",
    sunrise: "06:24 AM",
    sunset: "05:48 PM",
    abhijit: "11:42 AM - 12:28 PM (Auspicious Muhurat)",
    rahuKaal: "04:30 PM - 06:00 PM (Inauspicious Period)",
    moonSign: "Cancer (Karka)"
  };

  return (
    <div className="panchang-strip glass-card">
      <div className="panchang-header">
        <div className="panchang-title">
          <Sparkles className="icon-gold" size={16} />
          <strong>Live Daily Vedic Panchang</strong>
        </div>
        <span className="panchang-date">{panchang.date} | {panchang.vaar}</span>
      </div>

      <div className="panchang-grid">
        <div className="panchang-item">
          <span className="label">Tithi:</span>
          <span className="val">{panchang.tithi}</span>
        </div>
        <div className="panchang-item">
          <span className="label">Nakshatra:</span>
          <span className="val">{panchang.nakshatra}</span>
        </div>
        <div className="panchang-item">
          <span className="label">Auspicious Yoga:</span>
          <span className="val">{panchang.yoga}</span>
        </div>
        <div className="panchang-item">
          <span className="label">Karana:</span>
          <span className="val">{panchang.karana}</span>
        </div>
        <div className="panchang-item highlight-green">
          <span className="label">Abhijit Muhurat:</span>
          <span className="val">{panchang.abhijit}</span>
        </div>
        <div className="panchang-item highlight-red">
          <span className="label">Rahu Kaal:</span>
          <span className="val">{panchang.rahuKaal}</span>
        </div>
      </div>
    </div>
  );
}
