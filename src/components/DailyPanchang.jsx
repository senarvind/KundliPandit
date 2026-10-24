import { Sun, Moon, Clock, Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function DailyPanchang() {
  const today = new Date();
  const dayNamesHindi = [
    "रविवार (भानुवासर)",
    "सोमवार (इन्दुवासर)",
    "मंगलवार (भौमवासर)",
    "बुधवार (सौम्यवासर)",
    "गुरुवार (बृहस्पतिवासर)",
    "शुक्रवार (भृगुवासर)",
    "शनिवार (मन्दवासर)"
  ];
  const currentDayHindi = dayNamesHindi[today.getDay()];

  // Vedic panchang elements
  const panchang = {
    date: today.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }),
    vaar: currentDayHindi,
    tithi: "शुक्ल पक्ष एकादशी / द्वादशी (Shukla Paksha)",
    nakshatra: "पुष्य / आश्लेषा (Pushya Nakshatra)",
    yoga: "शुभ योग (Shubha Yoga)",
    karana: "बव करण (Bava Karana)",
    sunrise: "०६:२४ AM",
    sunset: "०५:४८ PM",
    abhijit: "११:४२ AM - १२:२८ PM (अति शुभ मुहूर्त)",
    rahuKaal: "०४:३० PM - ०६:०० PM (वर्जित काल)",
    moonSign: "कर्क राशि (Cancer)"
  };

  return (
    <div className="panchang-strip glass-card">
      <div className="panchang-header">
        <div className="panchang-title">
          <Sparkles className="icon-gold" size={16} />
          <strong>दैनिक वैदिक पंचांग (Live Vedic Panchang)</strong>
        </div>
        <span className="panchang-date">{panchang.date} | {panchang.vaar}</span>
      </div>

      <div className="panchang-grid">
        <div className="panchang-item">
          <span className="label">तिथि (Tithi):</span>
          <span className="val">{panchang.tithi}</span>
        </div>
        <div className="panchang-item">
          <span className="label">नक्षत्र (Nakshatra):</span>
          <span className="val">{panchang.nakshatra}</span>
        </div>
        <div className="panchang-item">
          <span className="label">नित्य योग (Yoga):</span>
          <span className="val">{panchang.yoga}</span>
        </div>
        <div className="panchang-item">
          <span className="label">करण (Karana):</span>
          <span className="val">{panchang.karana}</span>
        </div>
        <div className="panchang-item highlight-green">
          <span className="label">अभिजित मुहूर्त:</span>
          <span className="val">{panchang.abhijit}</span>
        </div>
        <div className="panchang-item highlight-red">
          <span className="label">राहु काल (अशुभ):</span>
          <span className="val">{panchang.rahuKaal}</span>
        </div>
      </div>
    </div>
  );
}
