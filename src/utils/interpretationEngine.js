/**
 * Vedic Astrology Life Predictions & Deep Interpretations Engine
 * Interprets Career, Marriage, Wealth, Relationships, and Health
 * according to Maharishi Parashara Hora Shastra principles.
 */

import { RASHIS, HOUSES } from "../data/vedicData";

export function generateLifeInterpretations(kundli, formData) {
  if (!kundli || !kundli.ascendant || !kundli.planets || !kundli.houses) {
    return null;
  }

  const { ascendant, planets, houses, divisionals, dasha, doshasYogas } = kundli;
  const sun = planets.find((p) => p.id === "Sun");
  const moon = planets.find((p) => p.id === "Moon");
  const mars = planets.find((p) => p.id === "Mars");
  const mercury = planets.find((p) => p.id === "Mercury");
  const jupiter = planets.find((p) => p.id === "Jupiter");
  const venus = planets.find((p) => p.id === "Venus");
  const saturn = planets.find((p) => p.id === "Saturn");
  const rahu = planets.find((p) => p.id === "Rahu");
  const ketu = planets.find((p) => p.id === "Ketu");

  // Helper to find planet by house
  const getPlanetsInHouse = (hNum) => planets.filter((p) => p.house === hNum);

  // 1. CAREER & PROFESSIONAL DESTINY (10th House - Karma Bhava)
  const house10 = houses[10] || {};
  const house10Occupants = getPlanetsInHouse(10);
  const house10LordName = house10.lord || "Saturn";
  const house10LordPlanet = planets.find((p) => p.name === house10LordName || p.id === house10LordName);
  const house10LordPlacement = house10LordPlanet ? house10LordPlanet.house : 10;
  const house10Sign = house10.rashi ? house10.rashi.english : "Capricorn";

  // Career fields by 10th sign & lord
  const careerFieldMap = {
    Aries: ["Executive Leadership", "Defense & Law Enforcement", "Engineering & Tech Innovation", "Surgery & Sports Management"],
    Taurus: ["Banking & High Finance", "Real Estate Development", "Luxury Goods & Fashion", "Hospitality & Corporate Consulting"],
    Gemini: ["Software Architecture & IT", "Media & Journalism", "Digital Commerce & Marketing", "Analytics & Data Science"],
    Cancer: ["Public Administration", "Healthcare & Medical Leadership", "Human Resource Strategy", "Hospitality & Real Estate"],
    Leo: ["Government & Public Office", "Corporate Management", "Strategic Policy Advisory", "Entertainment & Creative Direction"],
    Virgo: ["Financial Auditing & FinTech", "Data Analytics & Research", "Pharmaceuticals & Biotechnology", "Management Consulting"],
    Libra: ["Corporate Law & International Diplomacy", "Venture Capital & Partnerships", "Creative Arts & Architecture", "Public Relations"],
    Scorpio: ["Deep Tech & Cybersecurity", "Scientific Research & Investigation", "Surgery & Diagnostics", "Defense & Energy Sectors"],
    Sagittarius: ["Legal Advisory & Judiciary", "Higher Education & Professorship", "Global Trade & Foreign Affairs", "Spiritual & Philosophical Institutions"],
    Capricorn: ["Industrial Governance & Operations", "Civil Services & Public Infrastructure", "Supply Chain & Manufacturing", "Enterprise Management"],
    Aquarius: ["Cutting-edge Innovation & R&D", "Aviation & Space Technologies", "Non-Profit & Social Enterprises", "Telecommunications & AI"],
    Pisces: ["Healthcare & Holistic Medicine", "Creative Arts, Film & Literature", "Maritime & International Business", "Spiritual Leadership & Counseling"]
  };

  const bestIndustries = careerFieldMap[house10Sign] || ["Enterprise Technology", "Strategic Management", "Finance & Advisory", "Creative Industries"];

  let leadershipStyle = "Strategic and disciplined leader with strong long-term vision.";
  if (["Aries", "Leo", "Sagittarius"].includes(house10Sign)) {
    leadershipStyle = "Dynamic, visionary, and pioneering leader who leads from the front with fiery initiative.";
  } else if (["Gemini", "Libra", "Aquarius"].includes(house10Sign)) {
    leadershipStyle = "Collaborative, intellectual, and communicative leader excelling in networking and modern innovation.";
  } else if (["Cancer", "Scorpio", "Pisces"].includes(house10Sign)) {
    leadershipStyle = "Empathetic, intuitive, and deeply perceptive leader who commands fierce loyalty and trust.";
  }

  // Work style quotient: Independent Business vs Job
  let entrepreneurshipScore = 65;
  if ([1, 3, 10, 11].includes(house10LordPlacement)) entrepreneurshipScore += 15;
  if (sun && [1, 10].includes(sun.house)) entrepreneurshipScore += 10;
  if (mars && [1, 10].includes(mars.house)) entrepreneurshipScore += 10;
  entrepreneurshipScore = Math.min(Math.max(entrepreneurshipScore, 45), 96);

  const jobVsBusiness = entrepreneurshipScore >= 75
    ? "Strong aptitude for independent business ownership, entrepreneurship, or executive corporate authority."
    : entrepreneurshipScore >= 60
    ? "Well-suited for senior executive leadership, high-responsibility managerial roles, with potential for advisory ventures."
    : "Flourishes in structured corporate organizations, institutional governance, and stable professional tenures.";

  let careerDashaNote = "Current planetary periods support consistent professional growth.";
  if (dasha && dasha.activeMahadasha) {
    const dLord = dasha.activeMahadasha.lord;
    careerDashaNote = `Currently in ${dLord} Mahadasha. This period emphasizes ${
      dLord === "Sun" ? "authority, government honors, and high visibility." :
      dLord === "Moon" ? "public interaction, creative expansion, and adaptive ventures." :
      dLord === "Mars" ? "courageous decision-making, technological progress, and decisive ambition." :
      dLord === "Mercury" ? "intellectual breakthroughs, trade growth, and lucrative communications." :
      dLord === "Jupiter" ? "wisdom, wealth elevation, mentorship, and professional prestige." :
      dLord === "Venus" ? "prosperity, artistic recognition, executive partnerships, and comforts." :
      dLord === "Saturn" ? "perseverance, solid foundation building, and lasting career milestones." :
      dLord === "Rahu" ? "rapid upward leaps, foreign or digital opportunities, and bold ambitions." :
      "specialized expertise, strategic independence, and profound technical mastery."
    }`;
  }

  // 2. MARRIAGE & SPOUSE COMPATIBILITY (7th House - Kalatra Bhava & Venus)
  const house7 = houses[7] || {};
  const house7Occupants = getPlanetsInHouse(7);
  const house7LordName = house7.lord || "Venus";
  const house7LordPlanet = planets.find((p) => p.name === house7LordName || p.id === house7LordName);
  const house7LordPlacement = house7LordPlanet ? house7LordPlanet.house : 7;
  const house7Sign = house7.rashi ? house7.rashi.english : "Libra";

  const spouseNatureMap = {
    Aries: { nature: "Energetic, bold, independent, direct, and enthusiastic partner.", appearance: "Athletic physique, expressive eyes, and confident aura.", values: "Honesty, courage, active lifestyle, and mutual independence." },
    Taurus: { nature: "Gentle, steadfast, loyal, loving, and grounded personality.", appearance: "Graceful features, soothing voice, and classic refined charm.", values: "Domestic peace, security, financial stability, and artistic comforts." },
    Gemini: { nature: "Witty, intellectually curious, adaptable, and great conversationalist.", appearance: "Youthful appearance, lively demeanor, and expressive smile.", values: "Intellectual connection, freedom of thought, humor, and companionship." },
    Cancer: { nature: "Deeply caring, protective, family-oriented, and emotionally devoted.", appearance: "Soft, gentle countenance, radiant complexion, and warm demeanor.", values: "Emotional security, home warmth, parental devotion, and loyalty." },
    Leo: { nature: "Regal, noble-hearted, confident, generous, and proud partner.", appearance: "Striking presence, charismatic personality, and dignified posture.", values: "Mutual respect, honor, generosity, and inspiring ambition." },
    Virgo: { nature: "Practical, analytical, neat, organized, and remarkably supportive.", appearance: "Refined, neat, graceful, and understated elegance.", values: "Integrity, shared health/wellness routines, and constructive growth." },
    Libra: { nature: "Diplomatic, charming, artistic, peaceful, and harmonious companion.", appearance: "Beautiful symmetry, charming smile, and elegant aesthetic sense.", values: "Fairness, mutual partnership, romance, and aesthetic refinement." },
    Scorpio: { nature: "Deep, intensely loyal, perceptive, resilient, and transformative.", appearance: "Magnetic gaze, captivating presence, and enigmatic aura.", values: "Unwavering commitment, emotional depth, truth, and psychological bond." },
    Sagittarius: { nature: "Optimistic, philosophical, broad-minded, adventurous, and truthful.", appearance: "Tall or athletic carriage, cheerful smile, and noble bearing.", values: "Higher wisdom, travel, spiritual growth, and freedom of expression." },
    Capricorn: { nature: "Responsible, mature, dutiful, patient, and highly dependable partner.", appearance: "Distinguished, poised, serene, and timeless demeanor.", values: "Commitment, traditional values, mutual legacy, and persevering loyalty." },
    Aquarius: { nature: "Progressive, humanitarian, intellectually engaging, and original thinker.", appearance: "Distinctive modern style, friendly gaze, and unique individuality.", values: "Equality, intellectual freedom, shared humanitarian ideals, and friendship." },
    Pisces: { nature: "Compassionate, romantic, empathetic, artistic, and spiritually inclined.", appearance: "Dreamy expressive eyes, gentle demeanor, and graceful aura.", values: "Unconditional love, creative expression, spiritual synergy, and kindness." }
  };

  const spouseTraits = spouseNatureMap[house7Sign] || spouseNatureMap.Libra;

  // Manglik analysis check
  const manglikDosha = doshasYogas?.doshas?.find((d) => d.id === "mangal_dosha");
  const isManglikAfflicted = manglikDosha && (manglikDosha.status.includes("Present") || manglikDosha.status.includes("Active"));
  const isManglikCancelled = manglikDosha && manglikDosha.status.includes("Cancelled");

  let manglikVerdict = "Clear (Non-Manglik) - No planetary friction regarding Mars.";
  if (isManglikAfflicted) {
    manglikVerdict = "Manglik Dosha present - Advised to perform Kundli matching before marriage for harmonious alignment.";
  } else if (isManglikCancelled) {
    manglikVerdict = "Manglik Dosha cancelled by benefic planetary aspects (Dosha Bhanga).";
  }

  let harmonyScore = 86;
  if (house7Occupants.some((p) => ["Jupiter", "Venus", "Moon"].includes(p.id))) harmonyScore += 8;
  if (house7Occupants.some((p) => ["Saturn", "Rahu", "Mars"].includes(p.id))) harmonyScore -= 6;
  if (isManglikAfflicted) harmonyScore -= 5;
  harmonyScore = Math.min(Math.max(harmonyScore, 55), 98);

  const timingInsight = house7LordPlacement === 7 || house7LordPlacement === 1
    ? "Favorable for early-to-moderate marriage timing with strong mutual attraction."
    : [9, 11, 2].includes(house7LordPlacement)
    ? "Marriage is deeply connected to financial prosperity and destiny elevation (Bhagyodaya)."
    : [10, 4].includes(house7LordPlacement)
    ? "Marriage brings major societal elevation and domestic settlement."
    : "Steady and mature timing; deliberate selection ensures enduring happiness and loyalty.";

  // 3. WEALTH & FINANCIAL PROSPERITY (2nd & 11th Houses)
  const house2 = houses[2] || {};
  const house11 = houses[11] || {};
  const house2Sign = house2.rashi ? house2.rashi.english : "Taurus";
  const house11Sign = house11.rashi ? house11.rashi.english : "Aquarius";

  let financialScore = 80;
  if (jupiter && [1, 2, 4, 5, 9, 11].includes(jupiter.house)) financialScore += 8;
  if (venus && [1, 2, 4, 5, 9, 11].includes(venus.house)) financialScore += 6;
  const dhanaYogasFound = doshasYogas?.yogas?.filter((y) =>
    y.category.includes("Wealth") || y.name.includes("Lakshmi") || y.name.includes("Gajakesari") || y.name.includes("Chandra-Mangal")
  ) || [];

  if (dhanaYogasFound.length > 0) financialScore += 6;
  financialScore = Math.min(Math.max(financialScore, 50), 98);

  const incomeSources = [
    "Primary Professional Career & Core Expertise",
    [10, 11, 1].includes(house10LordPlacement) ? "Independent Business Profits & Equity Gains" : "Corporate Leadership & High-Performance Bonuses",
    ["Taurus", "Cancer", "Scorpio", "Capricorn"].includes(house2Sign) ? "Real Estate, Land Assets & Tangible Holdings" : "Strategic Diversified Equities & Portfolio Investments",
    "Advisory, Consulting & Specialized Skills Retainers"
  ];

  const investmentStrengths = [
    ["Taurus", "Virgo", "Capricorn"].includes(house2Sign) ? "High acumen for solid fixed assets, land, and gold." : "Aptitude for modern technology, growth sectors, and diversified assets.",
    jupiter && jupiter.house ? `Jupiter in House ${jupiter.house} provides long-term preservation and wealth compounding.` : "Favorable long-term compound growth mindset.",
    "Potential for substantial secondary passive income streams through strategic investments."
  ];

  // 4. LOVE, ROMANCE & RELATIONSHIPS (5th House - Putra & Romance)
  const house5 = houses[5] || {};
  const house5Sign = house5.rashi ? house5.rashi.english : "Leo";
  const house5Occupants = getPlanetsInHouse(5);

  let romanticStyle = "Devoted, sincere, and values deep mutual understanding.";
  if (["Aries", "Leo", "Sagittarius"].includes(house5Sign)) {
    romanticStyle = "Passionate, enthusiastic, affectionate, and demonstrative in expressing love.";
  } else if (["Taurus", "Virgo", "Capricorn"].includes(house5Sign)) {
    romanticStyle = "Steadfast, caring, grounded, expresses affection through practical support and loyalty.";
  } else if (["Gemini", "Libra", "Aquarius"].includes(house5Sign)) {
    romanticStyle = "Playful, intellectually stimulating, values witty communication and shared adventures.";
  } else {
    romanticStyle = "Deeply romantic, intuitive, empathetic, and craves soulful emotional connection.";
  }

  // 5. HEALTH, VITALITY & WELLNESS (1st & 6th Houses)
  const ascSign = ascendant.rashi ? ascendant.rashi.english : "Aries";
  const constitutionMap = {
    Aries: { type: "Pitta dominant (Fire)", focus: "Head, facial muscles, blood circulation, and physical stamina.", tips: "Stay hydrated, avoid excessive spicy foods, practice regular cardiovascular exercise." },
    Taurus: { type: "Kapha-Vata (Earth)", focus: "Throat, vocal cords, thyroid, neck, and metabolism balance.", tips: "Incorporate warming spices like ginger and cinnamon; maintain an active walking schedule." },
    Gemini: { type: "Vata dominant (Air)", focus: "Respiratory system, nervous system, hands, and mental calm.", tips: "Daily meditation and breathwork (Pranayama) to soothe restless nervous energy." },
    Cancer: { type: "Kapha dominant (Water)", focus: "Digestive system, stomach, chest, and emotional balance.", tips: "Avoid late-night heavy meals; practice mindfulness for gut-brain harmony." },
    Leo: { type: "Pitta dominant (Fire)", focus: "Heart, cardiovascular vitality, spine, and posture alignment.", tips: "Regular aerobic exercise, sun exposure, and heart-healthy antioxidant-rich diet." },
    Virgo: { type: "Vata-Kapha (Earth)", focus: "Digestive intestines, gut microbiome, and nervous resilience.", tips: "Fresh organic meals, probiotics, and consistent daily sleep rhythms." },
    Libra: { type: "Vata dominant (Air)", focus: "Kidneys, lower back, fluid balance, and skin hydration.", tips: "Abundant pure water intake, yoga for spinal alignment, and stress management." },
    Scorpio: { type: "Pitta-Kapha (Water)", focus: "Reproductive system, immunity, cellular regeneration, and toxin release.", tips: "Detoxifying green juices, thermal therapies, and emotional release exercises." },
    Sagittarius: { type: "Pitta dominant (Fire)", focus: "Liver, hips, thighs, arterial health, and physical endurance.", tips: "Outdoor activities, trail hiking, and moderation in rich gourmet foods." },
    Capricorn: { type: "Vata dominant (Earth)", focus: "Knees, bones, skeletal joints, teeth, and skin health.", tips: "Calcium/Vitamin D balance, joint lubrication therapies, and gentle resistance training." },
    Aquarius: { type: "Vata dominant (Air)", focus: "Lower legs, ankles, peripheral circulation, and mental recharge.", tips: "Leg stretching exercises, rhythmic movement, and limiting screen exposure before sleep." },
    Pisces: { type: "Kapha dominant (Water)", focus: "Feet, lymphatic system, immune resilience, and dream wellness.", tips: "Foot massage with sesame oil, lymphatic stimulation, and adequate restful sleep." }
  };

  const healthMeta = constitutionMap[ascSign] || constitutionMap.Aries;

  return {
    career: {
      title: "Career & Professional Destiny",
      sign: house10Sign,
      lord: house10LordName,
      lordPlacementHouse: house10LordPlacement,
      occupants: house10Occupants.map((p) => p.name),
      summary: `Your 10th house of profession (Karma Bhava) falls in ${house10Sign}, ruled by ${house10LordName}. This grants you a formidable sense of vocation, natural executive ability, and determination to leave a lasting impact on your field.`,
      leadershipStyle,
      bestIndustries,
      entrepreneurshipScore,
      jobVsBusiness,
      dashaInfluence: careerDashaNote,
      keyStrengths: [
        `High strategic clarity governed by ${house10LordName}`,
        house10Occupants.length > 0 ? `Powerful planetary propulsion from ${house10Occupants.map((p) => p.name).join(", ")} in 10th house` : "Clear and unobstructed professional arena",
        "Exceptional crisis management and capacity to shoulder executive responsibility",
        "Natural skill for negotiating complex professional relationships"
      ],
      guidance: "Focus on establishing authoritative mastery in your chosen niche. Major advancement peaks occur during periods connecting your 10th, 9th, and 1st house lords."
    },
    marriage: {
      title: "Marriage & Spouse Compatibility",
      sign: house7Sign,
      lord: house7LordName,
      lordPlacementHouse: house7LordPlacement,
      occupants: house7Occupants.map((p) => p.name),
      navamshaSign: divisionals?.D9?.ascSign ? RASHIS[divisionals.D9.ascSign - 1].english : "Libra",
      manglikStatus: manglikVerdict,
      spouseTraits,
      harmonyScore,
      timingInsight,
      guidance: "Mutual respect and clear emotional dialogue are your cornerstones. Cultivate shared goals and collaborative projects with your partner to deepen relationship synergy."
    },
    wealth: {
      title: "Wealth, Finances & Prosperity",
      dhanaSign: house2Sign,
      dhanaLord: house2.lord || "Venus",
      labhaSign: house11Sign,
      labhaLord: house11.lord || "Saturn",
      wealthYogas: dhanaYogasFound.map((y) => y.name),
      financialStabilityScore: financialScore,
      incomeSources,
      investmentStrengths,
      cautionNote: "Avoid impulsive speculative investments during adverse transit periods. Rely on structured compounding and tangible asset building.",
      guidance: "Your chart possesses strong wealth accumulation vectors (Dhana Yogas). Prioritize investments in durable real assets and strategic business equities."
    },
    relationships: {
      title: "Love, Romance & Emotional Compatibility",
      fifthSign: house5Sign,
      fifthLord: house5.lord || "Sun",
      venusPlacement: venus ? `Venus in ${venus.rashi.english} (${venus.house}th House)` : "Venus well-aspected",
      moonNature: moon ? `Moon in ${moon.rashi.english} (${moon.degFormatted})` : "Balanced lunar temperament",
      romanticStyle,
      compatibilityTraits: [
        "Values deep emotional integrity over superficial attractions",
        "Loyal and committed once trust is firmly established",
        "Encourages and celebrates partner's personal aspirations and growth"
      ],
      emotionalScore: 84,
      guidance: "Express your feelings openly and cherish spontaneous quality time together. Emotional transparency strengthens bonding."
    },
    health: {
      title: "Health, Vitality & Wellness",
      ascendantSign: ascSign,
      constitution: healthMeta.type,
      vitalityScore: 88,
      focusAreas: healthMeta.focus,
      tips: healthMeta.tips,
      lifestyleAdvice: "Harmonize physical exertion with restorative sleep and sattvic nutritional nourishment according to your constitutional blueprint.",
      guidance: "Your vital constitution is resilient. Consistent daily routines and mindful stress release maintain optimal vigor."
    }
  };
}
