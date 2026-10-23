// Vedic Astrology Astronomy & Ephemeris Calculation Engine
import { RASHIS, NAKSHATRAS, GRAHAS } from '../data/vedicData';

// Utility math functions in degrees
const d2r = (deg) => (deg * Math.PI) / 180.0;
const r2d = (rad) => (rad * 180.0) / Math.PI;
const norm360 = (deg) => {
  let val = deg % 360.0;
  if (val < 0) val += 360.0;
  return val;
};

/**
 * Calculate Julian Day Number from Gregorian Date, Time, and Timezone
 */
export function calculateJulianDay(year, month, day, hour, minute, second = 0, tzOffset = 5.5) {
  // Convert local time to UTC hours
  const decimalLocalHour = hour + minute / 60.0 + second / 3600.0;
  let utcHour = decimalLocalHour - tzOffset;
  let y = year;
  let m = month;
  let d = day;

  if (utcHour < 0) {
    utcHour += 24.0;
    d -= 1;
  } else if (utcHour >= 24) {
    utcHour -= 24.0;
    d += 1;
  }

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             d + (utcHour / 24.0) + B - 1524.5;

  return JD;
}

/**
 * Calculate Lahiri Ayanamsa (Chitrapaksha)
 * J2000.0 (JD 2451545.0) Ayanamsa ~ 23° 51' 25.5" (23.85709 deg)
 * Annual precession ~ 50.29 arcsec (0.013969 deg/year)
 */
export function calculateLahiriAyanamsa(JD) {
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  const ayanamsa = 23.85709 + 1.39697 * T + 0.000308 * T * T;
  return ayanamsa;
}

/**
 * Calculate Sidereal Ascendant (Lagna)
 */
export function calculateAscendant(JD, lat, lng, ayanamsa) {
  const T = (JD - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time in degrees
  let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) +
             0.000387933 * T * T - (T * T * T) / 38710000.0;
  GMST = norm360(GMST);

  // Local Sidereal Time
  const LST = norm360(GMST + lng);
  const lstRad = d2r(LST);

  // Obliquity of the Ecliptic
  const eps = 23.439291 - 0.0130042 * T;
  const epsRad = d2r(eps);
  const latRad = d2r(lat);

  // Ascendant formula (tropical)
  // tan(Asc) = cos(LST) / (-sin(LST)*cos(eps) - tan(lat)*sin(eps))
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = norm360(r2d(Math.atan2(y, x)));

  // Convert to Sidereal using Ayanamsa
  const ascSidereal = norm360(ascTropical - ayanamsa);
  const signNum = Math.floor(ascSidereal / 30) + 1;
  const degreeInSign = ascSidereal % 30;

  return {
    longitude: ascSidereal,
    sign: signNum,
    rashi: RASHIS[signNum - 1],
    degree: degreeInSign,
    ayanamsa: ayanamsa
  };
}

/**
 * Calculate positions for all 9 Grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
 */
export function calculatePlanets(JD, ayanamsa) {
  const T = (JD - 2451545.0) / 36525.0;
  const T2 = T * T;

  // 1. SUN (Surya)
  const sunMeanLong = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T2);
  const sunMeanAnomaly = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T2);
  const sunC = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(d2r(sunMeanAnomaly)) +
               (0.019993 - 0.000101 * T) * Math.sin(d2r(2 * sunMeanAnomaly)) +
               0.000289 * Math.sin(d2r(3 * sunMeanAnomaly));
  const sunTropical = norm360(sunMeanLong + sunC);
  const sunSidereal = norm360(sunTropical - ayanamsa);

  // 2. MOON (Chandra)
  const moonL0 = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T2);
  const moonD = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T2); // Elongation
  const moonM = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2); // Sun anomaly
  const moonMprime = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T2); // Moon anomaly
  const moonF = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T2); // Moon argument of latitude

  // Periodic perturbations for Moon
  const moonPeriodic = 6.288774 * Math.sin(d2r(moonMprime)) +
                       1.274027 * Math.sin(d2r(2 * moonD - moonMprime)) +
                       0.658314 * Math.sin(d2r(2 * moonD)) +
                       0.213618 * Math.sin(d2r(2 * moonMprime)) -
                       0.185116 * Math.sin(d2r(moonM)) -
                       0.114332 * Math.sin(d2r(2 * moonF)) +
                       0.058793 * Math.sin(d2r(2 * moonD - 2 * moonMprime)) +
                       0.057066 * Math.sin(d2r(2 * moonD - moonM - moonMprime)) +
                       0.053322 * Math.sin(d2r(2 * moonD + moonMprime)) +
                       0.046175 * Math.sin(d2r(2 * moonD - moonM));
  const moonTropical = norm360(moonL0 + moonPeriodic);
  const moonSidereal = norm360(moonTropical - ayanamsa);

  // 3. RAHU & KETU (Mean Lunar Nodes)
  // Rahu regresses ~19.34 degrees per year
  const omega = norm360(125.04452 - 1934.136261 * T + 0.0020708 * T2);
  const rahuSidereal = norm360(omega - ayanamsa);
  const ketuSidereal = norm360(rahuSidereal + 180.0);

  // Planetary Mean elements & Kepler approximations (Tropical -> Sidereal)
  // MARS
  const marsL = norm360(355.433275 + 19140.299314 * T);
  const marsM = norm360(19.373 + 19139.8585 * T);
  const marsEq = 10.691 * Math.sin(d2r(marsM)) + 0.623 * Math.sin(d2r(2 * marsM));
  const marsHelio = norm360(marsL + marsEq);
  // Geocentric correction
  const marsGeocOffset = 5.2 * Math.sin(d2r(sunTropical - marsHelio));
  const marsSidereal = norm360(marsHelio + marsGeocOffset - ayanamsa);

  // MERCURY
  const mercL = norm360(178.179078 + 149472.674111 * T);
  const mercM = norm360(174.7948 + 149472.515 * T);
  const mercEq = 23.44 * Math.sin(d2r(mercM)) + 2.98 * Math.sin(d2r(2 * mercM));
  const mercHelio = norm360(mercL + mercEq);
  // Mercury never strays > 28° from Sun
  const mercElong = 22.5 * Math.sin(d2r(mercHelio - sunTropical));
  const mercSidereal = norm360(sunTropical + mercElong - ayanamsa);

  // JUPITER
  const jupL = norm360(34.351484 + 3034.905674 * T);
  const jupM = norm360(20.020 + 3034.696 * T);
  const jupEq = 5.555 * Math.sin(d2r(jupM)) + 0.166 * Math.sin(d2r(2 * jupM));
  const jupHelio = norm360(jupL + jupEq);
  const jupGeocOffset = 10.8 * Math.sin(d2r(sunTropical - jupHelio));
  const jupSidereal = norm360(jupHelio + jupGeocOffset - ayanamsa);

  // VENUS
  const venL = norm360(50.4161 + 58517.815387 * T);
  const venM = norm360(50.115 + 58517.803 * T);
  const venEq = 0.776 * Math.sin(d2r(venM));
  const venHelio = norm360(venL + venEq);
  // Venus never strays > 48° from Sun
  const venElong = 46.0 * Math.sin(d2r(venHelio - sunTropical));
  const venSidereal = norm360(sunTropical + venElong - ayanamsa);

  // SATURN
  const satL = norm360(50.077471 + 1222.113794 * T);
  const satM = norm360(317.020 + 1221.554 * T);
  const satEq = 6.358 * Math.sin(d2r(satM)) + 0.220 * Math.sin(d2r(2 * satM));
  const satHelio = norm360(satL + satEq);
  const satGeocOffset = 5.8 * Math.sin(d2r(sunTropical - satHelio));
  const satSidereal = norm360(satHelio + satGeocOffset - ayanamsa);

  // Build raw array
  const rawList = [
    { id: "Sun", longitude: sunSidereal, speed: 0.98 },
    { id: "Moon", longitude: moonSidereal, speed: 13.17 },
    { id: "Mars", longitude: marsSidereal, speed: 0.52 },
    { id: "Mercury", longitude: mercSidereal, speed: 1.2 },
    { id: "Jupiter", longitude: jupSidereal, speed: 0.08 },
    { id: "Venus", longitude: venSidereal, speed: 1.15 },
    { id: "Saturn", longitude: satSidereal, speed: 0.03 },
    { id: "Rahu", longitude: rahuSidereal, speed: -0.05 },
    { id: "Ketu", longitude: ketuSidereal, speed: -0.05 }
  ];

  // Decorate each planet with Rashi, Nakshatra, Pada, Dignity, Retrograde
  return rawList.map((p) => {
    const meta = GRAHAS.find((g) => g.id === p.id);
    const signNum = Math.floor(p.longitude / 30) + 1;
    const degInSign = p.longitude % 30;
    const nakshatra = calculateNakshatra(p.longitude);

    // Retrograde check (Outer planets are retrograde when opposite the Sun)
    let isRetrograde = false;
    if (p.id === "Rahu" || p.id === "Ketu") {
      isRetrograde = true; // Always in reverse motion
    } else if (["Mars", "Jupiter", "Saturn"].includes(p.id)) {
      const diffFromSun = Math.abs(norm360(p.longitude - sunSidereal) - 180);
      if (diffFromSun < 55) isRetrograde = true;
    } else if (p.id === "Mercury" || p.id === "Venus") {
      // Inner planets retrograde during inferior conjunction
      const diffFromSun = Math.abs(norm360(p.longitude - sunSidereal));
      if (diffFromSun < 12 && p.id === "Mercury") isRetrograde = true;
      if (diffFromSun < 8 && p.id === "Venus") isRetrograde = true;
    }

    // Combustion (Asta) check with Sun
    let isCombust = false;
    if (p.id !== "Sun" && p.id !== "Rahu" && p.id !== "Ketu") {
      const distToSun = Math.min(
        Math.abs(p.longitude - sunSidereal),
        360 - Math.abs(p.longitude - sunSidereal)
      );
      if (p.id === "Moon" && distToSun < 12) isCombust = true;
      if (p.id === "Mars" && distToSun < 17) isCombust = true;
      if (p.id === "Mercury" && distToSun < 14) isCombust = true;
      if (p.id === "Jupiter" && distToSun < 11) isCombust = true;
      if (p.id === "Venus" && distToSun < 10) isCombust = true;
      if (p.id === "Saturn" && distToSun < 15) isCombust = true;
    }

    // Dignity: Exalted, Debilitated, Own, or Neutral
    let dignity = "Neutral (Sama)";
    let dignityCode = "neutral";
    if (meta.exalted === signNum) {
      dignity = "Exalted (Uccha)";
      dignityCode = "exalted";
    } else if (meta.debilitated === signNum) {
      dignity = "Debilitated (Neecha)";
      dignityCode = "debilitated";
    } else if (meta.own.includes(signNum)) {
      dignity = "Own Sign (Swakshetra)";
      dignityCode = "own";
    }

    return {
      ...meta,
      longitude: p.longitude,
      sign: signNum,
      rashi: RASHIS[signNum - 1],
      degInSign: degInSign,
      degFormatted: formatDegree(degInSign),
      nakshatra: nakshatra,
      isRetrograde: isRetrograde,
      isCombust: isCombust,
      dignity: dignity,
      dignityCode: dignityCode
    };
  });
}

/**
 * Format degree into standard DD° MM' SS" format
 */
export function formatDegree(deg) {
  const d = Math.floor(deg);
  const minDec = (deg - d) * 60;
  const m = Math.floor(minDec);
  const s = Math.round((minDec - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

/**
 * Calculate Nakshatra (0 - 26) from 360-degree longitude
 */
export function calculateNakshatra(deg) {
  const span = 360.0 / 27.0; // 13.333333 degrees per nakshatra
  const idx = Math.floor(deg / span);
  const safeIdx = Math.min(Math.max(idx, 0), 26);
  const nak = NAKSHATRAS[safeIdx];
  const degIntoNak = deg % span;
  const pada = Math.floor(degIntoNak / (span / 4.0)) + 1;

  return {
    ...nak,
    index: safeIdx,
    pada: pada,
    degIntoNak: degIntoNak
  };
}

/**
 * Map Planets into Houses (Equal House sign-based system: Bhava 1 = Lagna Sign)
 */
export function calculateHouses(ascendant, planets) {
  const ascSign = ascendant.sign; // 1 to 12
  const houseMap = {};

  for (let h = 1; h <= 12; h++) {
    // Sign in house h
    const signNum = ((ascSign - 1 + (h - 1)) % 12) + 1;
    const rashi = RASHIS[signNum - 1];
    houseMap[h] = {
      houseNum: h,
      signNum: signNum,
      rashi: rashi,
      lord: rashi.ruler,
      planets: []
    };
  }

  // Place planets
  planets.forEach((p) => {
    // Which house does planet's sign fall in?
    // h = (p.sign - ascSign + 12) % 12 + 1
    const houseNum = ((p.sign - ascSign + 12) % 12) + 1;
    p.house = houseNum;
    if (houseMap[houseNum]) {
      houseMap[houseNum].planets.push(p);
    }
  });

  return houseMap;
}

/**
 * Calculate Divisional Charts:
 * D1: Rashi
 * D9: Navamsha (marriage & spiritual fortune)
 * D10: Dashamsha (career & public prominence)
 * D7: Saptamsha (children & prosperity)
 * Chandra Kundli (Moon chart: Moon becomes House 1)
 */
export function calculateDivisionalCharts(ascendant, planets) {
  // Navamsha (D9)
  const calcNavamshaSign = (signNum, degInSign) => {
    const pada = Math.floor(degInSign / (30.0 / 9.0)); // 0 to 8
    // Element based starting sign:
    // Fire (1, 5, 9): starts at Aries (1)
    // Earth (2, 6, 10): starts at Capricorn (10)
    // Air (3, 7, 11): starts at Libra (7)
    // Water (4, 8, 12): starts at Cancer (4)
    let startSign = 1;
    if ([1, 5, 9].includes(signNum)) startSign = 1;
    else if ([2, 6, 10].includes(signNum)) startSign = 10;
    else if ([3, 7, 11].includes(signNum)) startSign = 7;
    else if ([4, 8, 12].includes(signNum)) startSign = 4;

    return ((startSign - 1 + pada) % 12) + 1;
  };

  // Dashamsha (D10)
  const calcDashamshaSign = (signNum, degInSign) => {
    const part = Math.floor(degInSign / 3.0); // 0 to 9
    // Odd signs start from same sign; Even signs start from 9th sign
    let startSign = signNum % 2 !== 0 ? signNum : ((signNum - 1 + 8) % 12) + 1;
    return ((startSign - 1 + part) % 12) + 1;
  };

  // Saptamsha (D7)
  const calcSaptamshaSign = (signNum, degInSign) => {
    const part = Math.floor(degInSign / (30.0 / 7.0)); // 0 to 6
    // Odd signs start from same sign; Even signs start from 7th sign
    let startSign = signNum % 2 !== 0 ? signNum : ((signNum - 1 + 6) % 12) + 1;
    return ((startSign - 1 + part) % 12) + 1;
  };

  const navamshaAscSign = calcNavamshaSign(ascendant.sign, ascendant.degree);
  const navamshaPlanets = planets.map((p) => {
    const d9Sign = calcNavamshaSign(p.sign, p.degInSign);
    return {
      ...p,
      sign: d9Sign,
      rashi: RASHIS[d9Sign - 1],
      house: ((d9Sign - navamshaAscSign + 12) % 12) + 1
    };
  });

  const dashamshaAscSign = calcDashamshaSign(ascendant.sign, ascendant.degree);
  const dashamshaPlanets = planets.map((p) => {
    const d10Sign = calcDashamshaSign(p.sign, p.degInSign);
    return {
      ...p,
      sign: d10Sign,
      rashi: RASHIS[d10Sign - 1],
      house: ((d10Sign - dashamshaAscSign + 12) % 12) + 1
    };
  });

  const saptamshaAscSign = calcSaptamshaSign(ascendant.sign, ascendant.degree);
  const saptamshaPlanets = planets.map((p) => {
    const d7Sign = calcSaptamshaSign(p.sign, p.degInSign);
    return {
      ...p,
      sign: d7Sign,
      rashi: RASHIS[d7Sign - 1],
      house: ((d7Sign - saptamshaAscSign + 12) % 12) + 1
    };
  });

  // Chandra Kundli: Moon is House 1
  const moonPlanet = planets.find((p) => p.id === "Moon");
  const moonSign = moonPlanet ? moonPlanet.sign : 1;
  const chandraPlanets = planets.map((p) => {
    return {
      ...p,
      house: ((p.sign - moonSign + 12) % 12) + 1
    };
  });

  return {
    D1: {
      title: "Lagna / Rashi Chart (D-1)",
      hindi: "Lagna Kundli (Primary D-1 Chart)",
      ascSign: ascendant.sign,
      planets: planets
    },
    D9: {
      title: "Navamsha Chart (D-9)",
      hindi: "Navamsha Kundli (Marriage & Destiny D-9)",
      ascSign: navamshaAscSign,
      planets: navamshaPlanets
    },
    D10: {
      title: "Dashamsha Chart (D-10)",
      hindi: "Dashamsha Kundli (Career & Status D-10)",
      ascSign: dashamshaAscSign,
      planets: dashamshaPlanets
    },
    D7: {
      title: "Saptamsha Chart (D-7)",
      hindi: "Saptamsha Kundli (Children & Progeny D-7)",
      ascSign: saptamshaAscSign,
      planets: saptamshaPlanets
    },
    Chandra: {
      title: "Chandra Kundli (Moon Chart)",
      hindi: "Chandra Kundli (Moon Chart / Mind)",
      ascSign: moonSign,
      planets: chandraPlanets
    }
  };
}

/**
 * Vimshottari Dasha Engine (120-year cycle with Antardashas & current active dasha detection)
 */
export function calculateVimshottariDasha(moonLongitude, birthDateStr) {
  // Dasha sequence & durations
  const DASHA_ORDER = [
    { lord: "Ketu", years: 7, color: "#a855f7" },
    { lord: "Venus", years: 20, color: "#f472b6" },
    { lord: "Sun", years: 6, color: "#f59e0b" },
    { lord: "Moon", years: 10, color: "#e2e8f0" },
    { lord: "Mars", years: 7, color: "#ef4444" },
    { lord: "Rahu", years: 18, color: "#8b5cf6" },
    { lord: "Jupiter", years: 16, color: "#eab308" },
    { lord: "Saturn", years: 19, color: "#6366f1" },
    { lord: "Mercury", years: 17, color: "#10b981" }
  ];

  const nak = calculateNakshatra(moonLongitude);
  // Find index of Nakshatra Lord in DASHA_ORDER
  const startLordIdx = DASHA_ORDER.findIndex((d) => d.lord === nak.lord);
  const totalNakSpan = 360.0 / 27.0; // 13.333333°
  const elapsedInNak = nak.degIntoNak;
  const fractionElapsed = elapsedInNak / totalNakSpan;
  const fractionRemaining = 1.0 - fractionElapsed;

  const birthDate = new Date(birthDateStr);
  const now = new Date();

  const timeline = [];
  let currentDate = new Date(birthDate);

  // First balance Dasha
  const firstDasha = DASHA_ORDER[startLordIdx];
  const balanceYears = firstDasha.years * fractionRemaining;
  const firstEndDate = new Date(currentDate.getTime() + balanceYears * 365.25 * 24 * 3600 * 1000);

  // Subperiods (Antardashas) for first dasha
  const antardashasFirst = calculateAntardashas(firstDasha.lord, currentDate, firstEndDate, DASHA_ORDER);

  timeline.push({
    lord: firstDasha.lord,
    totalYears: firstDasha.years,
    effectiveYears: balanceYears,
    startDate: new Date(currentDate),
    endDate: new Date(firstEndDate),
    antardashas: antardashasFirst,
    isBalance: true
  });

  currentDate = new Date(firstEndDate);

  // Subsequent dashas to complete 120 years
  for (let i = 1; i <= 9; i++) {
    const nextIdx = (startLordIdx + i) % 9;
    const dasha = DASHA_ORDER[nextIdx];
    const endDate = new Date(currentDate.getTime() + dasha.years * 365.25 * 24 * 3600 * 1000);
    const antardashas = calculateAntardashas(dasha.lord, currentDate, endDate, DASHA_ORDER);

    timeline.push({
      lord: dasha.lord,
      totalYears: dasha.years,
      effectiveYears: dasha.years,
      startDate: new Date(currentDate),
      endDate: new Date(endDate),
      antardashas: antardashas,
      isBalance: false
    });

    currentDate = new Date(endDate);
  }

  // Find currently active Mahadasha & Antardasha
  let activeMaha = null;
  let activeAntar = null;

  for (const d of timeline) {
    if (now >= d.startDate && now < d.endDate) {
      activeMaha = d;
      for (const a of d.antardashas) {
        if (now >= a.startDate && now < a.endDate) {
          activeAntar = a;
          break;
        }
      }
      break;
    }
  }

  // Fallback if future or historical
  if (!activeMaha && timeline.length > 0) {
    activeMaha = timeline[0];
    activeAntar = activeMaha.antardashas[0];
  }

  return {
    timeline: timeline,
    activeMahadasha: activeMaha,
    activeAntardasha: activeAntar,
    balanceYears: balanceYears.toFixed(2),
    birthLord: firstDasha.lord
  };
}

/**
 * Calculate Antardashas within a Mahadasha
 */
function calculateAntardashas(mahaLord, startDate, endDate, DASHA_ORDER) {
  const mahaIndex = DASHA_ORDER.findIndex((d) => d.lord === mahaLord);
  const mahaDurationMs = endDate.getTime() - startDate.getTime();
  const subperiods = [];
  let cur = new Date(startDate);

  for (let j = 0; j < 9; j++) {
    const antarIndex = (mahaIndex + j) % 9;
    const antar = DASHA_ORDER[antarIndex];
    // Proportion of 120 years
    const fraction = antar.years / 120.0;
    const antarDurationMs = mahaDurationMs * fraction;
    const antarEnd = new Date(cur.getTime() + antarDurationMs);

    subperiods.push({
      lord: antar.lord,
      startDate: new Date(cur),
      endDate: new Date(antarEnd)
    });

    cur = new Date(antarEnd);
  }

  return subperiods;
}

/**
 * Dosha & Yoga Engine: Mangal Dosha, Kaal Sarp Dosha, Sade Sati, and Auspicious Raj Yogas
 */
export function detectDoshasAndYogas(planets, ascendant, houses) {
  const yogas = [];
  const doshas = [];

  const mars = planets.find((p) => p.id === "Mars");
  const moon = planets.find((p) => p.id === "Moon");
  const jupiter = planets.find((p) => p.id === "Jupiter");
  const sun = planets.find((p) => p.id === "Sun");
  const mercury = planets.find((p) => p.id === "Mercury");
  const venus = planets.find((p) => p.id === "Venus");
  const saturn = planets.find((p) => p.id === "Saturn");
  const rahu = planets.find((p) => p.id === "Rahu");
  const ketu = planets.find((p) => p.id === "Ketu");

  // 1. MANGLIK / KUJA DOSHA
  // Mars in houses 1, 4, 7, 8, 12 from Lagna or Moon
  const manglikHousesLagna = [1, 4, 7, 8, 12];
  const isLagnaManglik = mars && manglikHousesLagna.includes(mars.house);

  const moonHouse = moon ? moon.house : 1;
  const marsFromMoon = mars ? ((mars.house - moonHouse + 12) % 12) + 1 : 1;
  const isMoonManglik = manglikHousesLagna.includes(marsFromMoon);

  if (isLagnaManglik || isMoonManglik) {
    // Check cancellations
    let isCancelled = false;
    let cancelReason = "";

    if (mars.sign === 1 && mars.house === 1) {
      isCancelled = true;
      cancelReason = "Mars in own sign (Aries) in 1st house negates Mangal Dosha.";
    } else if (mars.sign === 8 && mars.house === 4) {
      isCancelled = true;
      cancelReason = "Mars in own sign (Scorpio) in 4th house cancels Dosha.";
    } else if (mars.sign === 10 && mars.house === 7) {
      isCancelled = true;
      cancelReason = "Exalted Mars (Capricorn) in 7th house confers Ruchaka Yoga instead.";
    } else if (jupiter && Math.abs(jupiter.house - mars.house) === 6) {
      isCancelled = true;
      cancelReason = "Benefic Jupiter aspects Mars directly, mitigating malefic effects.";
    }

    doshas.push({
      id: "mangal_dosha",
      name: "Mangal Dosha (Mars Affliction)",
      status: isCancelled ? "Cancelled (Dosha Bhanga)" : "Present (Manglik)",
      severity: isCancelled ? "Nil / Neutral" : (isLagnaManglik && isMoonManglik ? "Full Manglik" : "Partial Manglik"),
      description: `Mars is placed in House ${mars.house} from Lagna (and House ${marsFromMoon} from Moon). ${isCancelled ? cancelReason : 'Creates strong fiery willpower, may require Kundli matching before marriage or Hanuman Upasana.'}`,
      remedy: "Worship Lord Hanuman, recite Hanuman Chalisa every Tuesday, wear a copper ring or perform Kumbh Vivah if indicated by astrologer."
    });
  } else {
    doshas.push({
      id: "mangal_dosha",
      name: "Mangal Dosha (Mars Affliction)",
      status: "Absent (Non-Manglik)",
      severity: "None",
      description: "Mars is positioned favorably in non-afflicting houses. No Kuja Dosha present.",
      remedy: "No specific remedy required."
    });
  }

  // 2. KAAL SARP DOSHA
  // All 7 planets hemmed between Rahu and Ketu
  let isKaalSarp = false;
  if (rahu && ketu) {
    const rahuLong = rahu.longitude;
    const ketuLong = ketu.longitude;
    const sevenPlanets = [sun, moon, mars, mercury, jupiter, venus, saturn];

    let allOneSide = true;
    let allOtherSide = true;

    sevenPlanets.forEach((p) => {
      if (!p) return;
      const angleFromRahu = norm360(p.longitude - rahuLong);
      if (angleFromRahu > 180) allOneSide = false;
      if (angleFromRahu < 180) allOtherSide = false;
    });

    isKaalSarp = allOneSide || allOtherSide;

    const KAAL_SARP_NAMES = [
      "Anant Kaal Sarp", "Kulik Kaal Sarp", "Vasuki Kaal Sarp", "Shankhpal Kaal Sarp",
      "Padma Kaal Sarp", "Mahapadma Kaal Sarp", "Takshak Kaal Sarp", "Karkotak Kaal Sarp",
      "Shankhchud Kaal Sarp", "Ghatak Kaal Sarp", "Vishdhar Kaal Sarp", "Sheshnaag Kaal Sarp"
    ];
    const typeName = KAAL_SARP_NAMES[rahu.house - 1] || "Anant Kaal Sarp";

    if (isKaalSarp) {
      doshas.push({
        id: "kaal_sarp",
        name: `Kaal Sarp Yoga (${typeName})`,
        status: "Present (Active)",
        severity: "Moderate to High",
        description: `All seven classical planets are hemmed between the Rahu-Ketu nodal axis. Rahu resides in House ${rahu.house}, giving rise to ${typeName}.`,
        remedy: "Maha Mrityunjaya Japa, Shiva Abhishek on Mondays, Nag Panchami Puja, silver serpent ring on little finger."
      });
    } else {
      doshas.push({
        id: "kaal_sarp",
        name: "Kaal Sarp Yoga",
        status: "Absent (Free)",
        severity: "None",
        description: "Planets are distributed across both sides of the Rahu-Ketu axis. No Kaal Sarp bondage.",
        remedy: "Kundli is free from Kaal Sarp dosha."
      });
    }
  }

  // 3. SHANI SADE SATI
  // Current Saturn transit is in Kumbha (11) and Meena (12) in sidereal zodiac
  if (moon) {
    const natalMoonSign = moon.sign;
    // Current transiting Saturn sign: Aquarius (11) moving into Pisces (12)
    const currentTransitSaturnSign = 11;
    const diff = (natalMoonSign - currentTransitSaturnSign + 12) % 12;

    let sadeSatiPhase = null;
    if (diff === 1) sadeSatiPhase = "Rising Phase (1st Phase - Transit over 12th from Moon)";
    else if (diff === 0) sadeSatiPhase = "Peak Phase (2nd Phase - Transit over Natal Moon)";
    else if (diff === 11) sadeSatiPhase = "Setting Phase (3rd Phase - Transit over 2nd from Moon)";

    if (sadeSatiPhase) {
      doshas.push({
        id: "sade_sati",
        name: "Shani Sade Sati (Saturn 7.5 Years Transit)",
        status: "Active (Afflicted)",
        severity: "Ongoing",
        description: `Currently undergoing ${sadeSatiPhase} with natal Moon in ${moon.rashi.name} (${moon.rashi.english}). Requires disciplined focus, ethical deeds, and patience.`,
        remedy: "Light mustard oil lamp under Peepal tree on Saturdays, chant Shani Gayatri or Dasharatha Shani Stotram, feed crows or black dogs."
      });
    } else {
      doshas.push({
        id: "sade_sati",
        name: "Shani Sade Sati",
        status: "Inactive (Not in Phase)",
        severity: "None",
        description: `Natal Moon is in ${moon.rashi.name}. You are currently free from Shani Sade Sati.`,
        remedy: "Maintain righteous karmic actions (Dharma)."
      });
    }
  }

  // 4. GAJAKESARI YOGA
  if (jupiter && moon) {
    const dist = ((jupiter.house - moon.house + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(dist)) {
      yogas.push({
        name: "Gajakesari Yoga",
        category: "Maha Raj Yoga",
        strength: "Very Auspicious",
        description: "Jupiter resides in an auspicious Kendra house relative to the Moon. Bestows wisdom, renown, leadership, and resilient fortune."
      });
    }
  }

  // 5. BUDHADITYA YOGA
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: "Budhaditya Yoga",
      category: "Intellect & Fame Yoga",
      strength: "Auspicious",
      description: `Sun and Mercury are conjunct in House ${sun.house}. Imparts razor-sharp analytical intellect, public oratorical brilliance, and administrative capacity.`
    });
  }

  // 6. PANCHA MAHAPURUSHA YOGAS
  const kendras = [1, 4, 7, 10];
  if (mars && kendras.includes(mars.house) && (mars.sign === 10 || [1, 8].includes(mars.sign))) {
    yogas.push({
      name: "Ruchaka Yoga",
      category: "Pancha Mahapurusha",
      strength: "Supreme Royal Yoga",
      description: "Mars is in its own or exalted sign in a Kendra house. Grants fearlessness, military/executive authority, athletic power, and conquest over rivals."
    });
  }
  if (mercury && kendras.includes(mercury.house) && (mercury.sign === 6 || [3, 6].includes(mercury.sign))) {
    yogas.push({
      name: "Bhadra Yoga",
      category: "Pancha Mahapurusha",
      strength: "Supreme Royal Yoga",
      description: "Mercury in Kendra in its own or exalted sign. Grants scholarly genius, diplomatic tact, commerce mastery, and enduring legacy."
    });
  }
  if (jupiter && kendras.includes(jupiter.house) && (jupiter.sign === 4 || [9, 12].includes(jupiter.sign))) {
    yogas.push({
      name: "Hamsa Yoga",
      category: "Pancha Mahapurusha",
      strength: "Supreme Royal Yoga",
      description: "Jupiter in Kendra in Cancer, Sagittarius or Pisces. Bestows noble character, spiritual reverence, divine protection, and universal respect."
    });
  }
  if (venus && kendras.includes(venus.house) && (venus.sign === 12 || [2, 7].includes(venus.sign))) {
    yogas.push({
      name: "Malavya Yoga",
      category: "Pancha Mahapurusha",
      strength: "Supreme Royal Yoga",
      description: "Venus in Kendra in Pisces, Taurus or Libra. Bestows refined artistic aesthetic, prosperity, charismatic vehicle/property comforts, and domestic bliss."
    });
  }
  if (saturn && kendras.includes(saturn.house) && (saturn.sign === 7 || [10, 11].includes(saturn.sign))) {
    yogas.push({
      name: "Sasa Yoga",
      category: "Pancha Mahapurusha",
      strength: "Supreme Royal Yoga",
      description: "Saturn in Kendra in Libra, Capricorn or Aquarius. Imparts grassroots public influence, supreme resilience, land mastery, and judicial discipline."
    });
  }

  // 7. CHANDRA-MANGAL YOGA
  if (moon && mars && moon.house === mars.house) {
    yogas.push({
      name: "Chandra-Mangal Yoga",
      category: "Wealth Yoga",
      strength: "Auspicious",
      description: `Moon and Mars are conjunct in House ${moon.house}. Known for creating commercial ingenuity, strong enterprising spirit, and accumulating financial assets.`
    });
  }

  // 8. LAKSHMI YOGA (Venus or 9th Lord strongly placed)
  if (venus && [1, 5, 9].includes(venus.house) && venus.dignityCode !== "debilitated") {
    yogas.push({
      name: "Lakshmi Yoga",
      category: "Prosperity Yoga",
      strength: "High",
      description: "Venus strongly placed in a Trikona (Trine) house. Confers grace, refined beauty, financial abundance, and moral conduct."
    });
  }

  return { yogas, doshas };
}

/**
 * Sarvashtakavarga Points per House (approximate Vedic point distribution ~337 total)
 */
export function calculateAshtakavarga(ascendant, planets) {
  // Base baseline points per house
  const basePoints = [31, 28, 33, 27, 32, 29, 26, 24, 34, 35, 36, 22];
  const ascSign = ascendant.sign;

  return Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signNum = ((ascSign - 1 + i) % 12) + 1;
    // Calculate variation based on occupants
    const occupants = planets.filter((p) => p.house === houseNum);
    let pts = basePoints[i];
    occupants.forEach((p) => {
      if (p.dignityCode === "exalted") pts += 3;
      if (p.dignityCode === "own") pts += 2;
      if (p.dignityCode === "debilitated") pts -= 2;
    });

    return {
      house: houseNum,
      sign: signNum,
      rashi: RASHIS[signNum - 1],
      points: Math.min(Math.max(pts, 18), 44),
      strength: pts >= 30 ? "Strong (Bali)" : pts >= 25 ? "Moderate (Madhyam)" : "Requires Attention (Alpa)"
    };
  });
}

/**
 * Ashtakoot Milan (Gun Milan) 36 Guna Calculator between two Moon longitudes
 */
export function calculateGunMilan(brideMoonDeg, groomMoonDeg) {
  const brideNak = calculateNakshatra(brideMoonDeg);
  const groomNak = calculateNakshatra(groomMoonDeg);

  const brideSign = Math.floor(brideMoonDeg / 30) + 1;
  const groomSign = Math.floor(groomMoonDeg / 30) + 1;

  // 1. Varna (1 Point)
  // Brahmin: 4, 8, 12; Kshatriya: 1, 5, 9; Vaishya: 2, 6, 10; Shudra: 3, 7, 11
  const getVarnaScore = (s) => ([4, 8, 12].includes(s) ? 4 : [1, 5, 9].includes(s) ? 3 : [2, 6, 10].includes(s) ? 2 : 1);
  const brideV = getVarnaScore(brideSign);
  const groomV = getVarnaScore(groomSign);
  const varnaPts = groomV >= brideV ? 1 : 0;

  // 2. Vashya (2 Points)
  const diffSign = Math.abs(groomSign - brideSign);
  const vashyaPts = diffSign === 0 || diffSign === 4 || diffSign === 8 ? 2 : diffSign === 6 ? 0.5 : 1;

  // 3. Tara (3 Points)
  const count1 = ((groomNak.index - brideNak.index + 27) % 9) + 1;
  const count2 = ((brideNak.index - groomNak.index + 27) % 9) + 1;
  const taraGood = (c) => ![3, 5, 7].includes(c);
  let taraPts = 0;
  if (taraGood(count1) && taraGood(count2)) taraPts = 3;
  else if (taraGood(count1) || taraGood(count2)) taraPts = 1.5;

  // 4. Yoni (4 Points)
  const yoniDiff = Math.abs(groomNak.index - brideNak.index) % 7;
  const yoniPts = yoniDiff === 0 ? 4 : yoniDiff === 1 ? 3 : yoniDiff === 2 ? 2 : 1;

  // 5. Graha Maitri (5 Points)
  const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const bLord = signLords[brideSign - 1];
  const gLord = signLords[groomSign - 1];
  const maitriPts = bLord === gLord ? 5 : 4;

  // 6. Gana (6 Points)
  // Deva, Manushya, Rakshasa
  const ganaPts = (groomNak.index % 3 === brideNak.index % 3) ? 6 : (groomNak.index % 3 !== 2 && brideNak.index % 3 !== 2) ? 5 : 1;

  // 7. Bhakoot (7 Points)
  // Distance between signs: 2-12, 6-8, 9-5
  const distSign = ((groomSign - brideSign + 12) % 12) + 1;
  let bhakootPts = 7;
  if ([2, 12, 6, 8].includes(distSign)) {
    bhakootPts = 0; // Bhakoot Dosha
  }

  // 8. Nadi (8 Points)
  // Adi (0), Madhya (1), Antya (2)
  const bNadi = brideNak.index % 3;
  const gNadi = groomNak.index % 3;
  const nadiPts = bNadi !== gNadi ? 8 : 0; // Nadi Dosha if same

  const totalObtained = varnaPts + vashyaPts + taraPts + yoniPts + maitriPts + ganaPts + bhakootPts + nadiPts;

  return {
    totalPoints: 36,
    obtained: totalObtained,
    percentage: Math.round((totalObtained / 36) * 100),
    isApproved: totalObtained >= 18,
    breakdown: [
      { name: "Varna", max: 1, scored: varnaPts, desc: "Ego, spiritual compatibility & nature" },
      { name: "Vashya", max: 2, scored: vashyaPts, desc: "Mutual attraction, influence & dominance" },
      { name: "Tara", max: 3, scored: taraPts, desc: "Health, destiny & longevity alignment" },
      { name: "Yoni", max: 4, scored: yoniPts, desc: "Physical intimacy & biological compatibility" },
      { name: "Graha Maitri", max: 5, scored: maitriPts, desc: "Psychological harmony & friendship" },
      { name: "Gana", max: 6, scored: ganaPts, desc: "Temperament & social outlook" },
      { name: "Bhakoot", max: 7, scored: bhakootPts, desc: "Emotional love, family welfare & finances" },
      { name: "Nadi", max: 8, scored: nadiPts, desc: "Genetic health, progeny & spiritual synergy" }
    ]
  };
}
