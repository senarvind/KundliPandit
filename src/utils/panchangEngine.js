/**
 * Vedic Panchang & Avakahada Chakra Calculation Engine
 * Calculates Tithi, Vaar, Nakshatra, Nitya Yoga, Karana, Gana, Yoni, Nadi, Varna, Vashya, Paya
 * conforming to authentic Parashari Janam Patrika standards.
 */

import { RASHIS, NAKSHATRAS } from "../data/vedicData";

export const TITHI_NAMES = [
  "Shukla Pratipada", "Shukla Dvitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
  "Shukla Shashti", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
  "Shukla Ekadashi", "Shukla Dvadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima (Full Moon)",
  "Krishna Pratipada", "Krishna Dvitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
  "Krishna Shashti", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
  "Krishna Ekadashi", "Krishna Dvadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya (New Moon)"
];

export const TITHI_HINDI = [
  "शुक्ल प्रतिपदा", "शुक्ल द्वितीया", "शुक्ल तृतीया", "शुक्ल चतुर्थी", "शुक्ल पंचमी",
  "शुक्ल षष्ठी", "शुक्ल सप्तमी", "शुक्ल अष्टमी", "शुक्ल नवमी", "शुक्ल दशमी",
  "शुक्ल एकादशी", "शुक्ल द्वादशी", "शुक्ल त्रयोदशी", "शुक्ल चतुर्दशी", "पूर्णिमा",
  "कृष्ण प्रतिपदा", "कृष्ण द्वितीया", "कृष्ण तृतीया", "कृष्ण चतुर्थी", "कृष्ण पंचमी",
  "कृष्ण षष्ठी", "कृष्ण सप्तमी", "कृष्ण अष्टमी", "कृष्ण नवमी", "कृष्ण दशमी",
  "कृष्ण एकादशी", "कृष्ण द्वादशी", "कृष्ण त्रयोदशी", "कृष्ण चतुर्दशी", "अमावस्या"
];

export const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

export const YOGA_HINDI = [
  "विष्कम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन",
  "अतिगण्ड", "सुकर्मा", "धृति", "शूल", "गण्ड",
  "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
  "सिद्धि", "व्यतीपात", "वरीयान", "परिघ", "शिव",
  "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म",
  "इन्द्र", "वैधृति"
];

export const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)",
  "Shakuni", "Chatushpada", "Naga", "Kintughna"
];

export const KARANA_HINDI = [
  "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि (भद्रा)",
  "शकुनि", "चतुष्पद", "नाग", "किंस्तुघ्न"
];

export const VAAR_NAMES = [
  { eng: "Sunday", hindi: "रविवार (भानुवासर)", lord: "Sun", deity: "Surya Deva" },
  { eng: "Monday", hindi: "सोमवार (इन्दुवासर)", lord: "Moon", deity: "Chandra Deva / Shiva" },
  { eng: "Tuesday", hindi: "मंगलवार (भौमवासर)", lord: "Mars", deity: "Mangal Deva / Hanuman" },
  { eng: "Wednesday", hindi: "बुधवार (सौम्यवासर)", lord: "Mercury", deity: "Budha Deva / Vishnu" },
  { eng: "Thursday", hindi: "गुरुवार (बृहस्पतिवासर)", lord: "Jupiter", deity: "Guru / Brihaspati" },
  { eng: "Friday", hindi: "शुक्रवार (भृगुवासर)", lord: "Venus", deity: "Shukra / Lakshmi" },
  { eng: "Saturday", hindi: "शनिवार (मन्दवासर)", lord: "Saturn", deity: "Shani Deva / Bhairava" }
];

// Gana classification (1-indexed Nakshatra ID)
const DEVA_GANA_NAKS = [1, 5, 7, 8, 13, 15, 17, 22, 27];
const MANUSHYA_GANA_NAKS = [2, 4, 6, 11, 12, 20, 21, 25, 26];
const RAKSHASA_GANA_NAKS = [3, 9, 10, 14, 16, 18, 19, 23, 24];

// Yoni animal classification
const NAKSHATRA_YONI = {
  1: { eng: "Horse (Ashwa)", hindi: "अश्व" },
  2: { eng: "Elephant (Gaja)", hindi: "गज" },
  3: { eng: "Sheep (Mesha)", hindi: "मेष" },
  4: { eng: "Serpent (Sarpa)", hindi: "सर्प" },
  5: { eng: "Serpent (Sarpa)", hindi: "सर्प" },
  6: { eng: "Dog (Shvan)", hindi: "श्वान" },
  7: { eng: "Cat (Marjara)", hindi: "मार्जार" },
  8: { eng: "Goat (Aja)", hindi: "छाग (अज)" },
  9: { eng: "Cat (Marjara)", hindi: "मार्जार" },
  10: { eng: "Rat (Mushaka)", hindi: "मूषक" },
  11: { eng: "Rat (Mushaka)", hindi: "मूषक" },
  12: { eng: "Cow (Gau)", hindi: "गो" },
  13: { eng: "Buffalo (Mahisha)", hindi: "महिष" },
  14: { eng: "Tiger (Vyaghra)", hindi: "व्याघ्र" },
  15: { eng: "Buffalo (Mahisha)", hindi: "महिष" },
  16: { eng: "Tiger (Vyaghra)", hindi: "व्याघ्र" },
  17: { eng: "Deer (Mriga)", hindi: "मृग" },
  18: { eng: "Deer (Mriga)", hindi: "मृग" },
  19: { eng: "Dog (Shvan)", hindi: "श्वान" },
  20: { eng: "Monkey (Vanara)", hindi: "वानर" },
  21: { eng: "Mongoose (Nakula)", hindi: "नकुल" },
  22: { eng: "Monkey (Vanara)", hindi: "वानर" },
  23: { eng: "Lion (Simha)", hindi: "सिंह" },
  24: { eng: "Horse (Ashwa)", hindi: "अश्व" },
  25: { eng: "Lion (Simha)", hindi: "सिंह" },
  26: { eng: "Cow (Gau)", hindi: "गो" },
  27: { eng: "Elephant (Gaja)", hindi: "गज" }
};

// Nadi classification (Adi, Madhya, Antya)
const NAKSHATRA_NADI = {
  1: "Adi (Vata)", 2: "Madhya (Pitta)", 3: "Antya (Kapha)",
  4: "Antya (Kapha)", 5: "Madhya (Pitta)", 6: "Adi (Vata)",
  7: "Adi (Vata)", 8: "Madhya (Pitta)", 9: "Antya (Kapha)",
  10: "Antya (Kapha)", 11: "Madhya (Pitta)", 12: "Adi (Vata)",
  13: "Adi (Vata)", 14: "Madhya (Pitta)", 15: "Antya (Kapha)",
  16: "Antya (Kapha)", 17: "Madhya (Pitta)", 18: "Adi (Vata)",
  19: "Adi (Vata)", 20: "Madhya (Pitta)", 21: "Antya (Kapha)",
  22: "Antya (Kapha)", 23: "Madhya (Pitta)", 24: "Adi (Vata)",
  25: "Adi (Vata)", 26: "Madhya (Pitta)", 27: "Antya (Kapha)"
};

const NAKSHATRA_NADI_HINDI = {
  1: "आदि (वात)", 2: "मध्य (पित्त)", 3: "अन्त्य (कफ)",
  4: "अन्त्य (कफ)", 5: "मध्य (पित्त)", 6: "आदि (वात)",
  7: "आदि (वात)", 8: "मध्य (पित्त)", 9: "अन्त्य (कफ)",
  10: "अन्त्य (कफ)", 11: "मध्य (पित्त)", 12: "आदि (वात)",
  13: "आदि (वात)", 14: "मध्य (पित्त)", 15: "अन्त्य (कफ)",
  16: "अन्त्य (कफ)", 17: "मध्य (पित्त)", 18: "आदि (वात)",
  19: "आदि (वात)", 20: "मध्य (पित्त)", 21: "अन्त्य (कफ)",
  22: "अन्त्य (कफ)", 23: "मध्य (पित्त)", 24: "आदि (वात)",
  25: "आदि (वात)", 26: "मध्य (पित्त)", 27: "अन्त्य (कफ)"
};

// Varna by Rashi ID (1-12)
const RASHI_VARNA = {
  1: { eng: "Kshatriya (Warrior/Leader)", hindi: "क्षत्रिय" },
  2: { eng: "Vaishya (Merchant/Commerce)", hindi: "वैश्य" },
  3: { eng: "Shudra (Artisan/Service)", hindi: "शूद्र" },
  4: { eng: "Brahmin (Scholar/Spiritual)", hindi: "ब्राह्मण" },
  5: { eng: "Kshatriya (Warrior/Leader)", hindi: "क्षत्रिय" },
  6: { eng: "Vaishya (Merchant/Commerce)", hindi: "वैश्य" },
  7: { eng: "Shudra (Artisan/Service)", hindi: "शूद्र" },
  8: { eng: "Brahmin (Scholar/Spiritual)", hindi: "ब्राह्मण" },
  9: { eng: "Kshatriya (Warrior/Leader)", hindi: "क्षत्रिय" },
  10: { eng: "Vaishya (Merchant/Commerce)", hindi: "वैश्य" },
  11: { eng: "Shudra (Artisan/Service)", hindi: "शूद्र" },
  12: { eng: "Brahmin (Scholar/Spiritual)", hindi: "ब्राह्मण" }
};

// Vashya by Rashi ID
const RASHI_VASHYA = {
  1: { eng: "Chatushpada (Quadruped)", hindi: "चतुष्पद" },
  2: { eng: "Chatushpada (Quadruped)", hindi: "चतुष्पद" },
  3: { eng: "Dvipada / Manava (Human)", hindi: "द्विपद (मानव)" },
  4: { eng: "Jalachara (Aquatic)", hindi: "जलचर" },
  5: { eng: "Vanachara / Simha (Forest/Fierce)", hindi: "वनचर" },
  6: { eng: "Dvipada / Manava (Human)", hindi: "द्विपद (मानव)" },
  7: { eng: "Dvipada / Manava (Human)", hindi: "द्विपद (मानव)" },
  8: { eng: "Keeta (Insect / Arthropod)", hindi: "कीट" },
  9: { eng: "Dvipada-Chatushpada (Mixed)", hindi: "द्विपद-चतुष्पद" },
  10: { eng: "Jalachara (Aquatic / Amphibian)", hindi: "जलचर" },
  11: { eng: "Dvipada / Manava (Human)", hindi: "द्विपद (मानव)" },
  12: { eng: "Jalachara (Aquatic)", hindi: "जलचर" }
};

// Tatva by Rashi ID
const RASHI_TATVA = {
  1: { eng: "Agni (Fire)", hindi: "अग्नि तत्व" },
  2: { eng: "Prithvi (Earth)", hindi: "पृथ्वी तत्व" },
  3: { eng: "Vayu (Air)", hindi: "वायु तत्व" },
  4: { eng: "Jala (Water)", hindi: "जल तत्व" },
  5: { eng: "Agni (Fire)", hindi: "अग्नि तत्व" },
  6: { eng: "Prithvi (Earth)", hindi: "पृथ्वी तत्व" },
  7: { eng: "Vayu (Air)", hindi: "वायु तत्व" },
  8: { eng: "Jala (Water)", hindi: "जल तत्व" },
  9: { eng: "Agni (Fire)", hindi: "अग्नि तत्व" },
  10: { eng: "Prithvi (Earth)", hindi: "पृथ्वी तत्व" },
  11: { eng: "Vayu (Air)", hindi: "वायु तत्व" },
  12: { eng: "Jala (Water)", hindi: "जल तत्व" }
};

/**
 * Calculate Complete Avakahada Chakra & Panchang Details
 */
export function calculateAvakahadaChakra(kundli, formData) {
  if (!kundli || !kundli.planets || !kundli.ascendant) return null;

  const moon = kundli.planets.find((p) => p.id === "Moon");
  const sun = kundli.planets.find((p) => p.id === "Sun");

  const moonLong = moon ? moon.longitude : 0;
  const sunLong = sun ? sun.longitude : 0;
  const ascSign = kundli.ascendant.sign;

  // 1. Tithi
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;
  const tithiIdx = Math.floor(diff / 12);
  const tithiNameEng = TITHI_NAMES[tithiIdx % 30] || "Shukla Pratipada";
  const tithiNameHindi = TITHI_HINDI[tithiIdx % 30] || "शुक्ल प्रतिपदा";
  const pakshaEng = tithiIdx < 15 ? "Shukla Paksha" : "Krishna Paksha";
  const pakshaHindi = tithiIdx < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

  // 2. Vaar (Day of week from date)
  const birthDate = new Date(formData.date);
  const dayIdx = birthDate.getDay();
  const vaar = VAAR_NAMES[dayIdx] || VAAR_NAMES[0];

  // 3. Nakshatra & Pada
  const nakId = moon?.nakshatra?.id || 1;
  const nakName = moon?.nakshatra?.name || "Ashwini";
  const nakHindi = moon?.nakshatra?.hindi || "अश्विनी";
  const nakPada = moon?.nakshatra?.pada || 1;
  const nakLord = moon?.nakshatra?.lord || "Ketu";

  // 4. Yoga (Nitya Yoga)
  const sumLong = (sunLong + moonLong) % 360;
  const yogaIdx = Math.floor(sumLong / (360 / 27));
  const yogaEng = YOGA_NAMES[yogaIdx % 27] || "Vishkambha";
  const yogaHindi = YOGA_HINDI[yogaIdx % 27] || "विष्कम्भ";

  // 5. Karana (Half of Tithi)
  const karanaHalfIdx = Math.floor(diff / 6);
  let karanaEng = "";
  let karanaHindi = "";
  if (karanaHalfIdx === 0) {
    karanaEng = KARANA_NAMES[10]; // Kintughna
    karanaHindi = KARANA_HINDI[10];
  } else if (karanaHalfIdx >= 57) {
    const fixedIdx = karanaHalfIdx - 57 + 7;
    karanaEng = KARANA_NAMES[fixedIdx] || KARANA_NAMES[0];
    karanaHindi = KARANA_HINDI[fixedIdx] || KARANA_HINDI[0];
  } else {
    const movableIdx = (karanaHalfIdx - 1) % 7;
    karanaEng = KARANA_NAMES[movableIdx];
    karanaHindi = KARANA_HINDI[movableIdx];
  }

  // 6. Gana
  let ganaEng = "Manushya";
  let ganaHindi = "मनुष्य";
  if (DEVA_GANA_NAKS.includes(nakId)) {
    ganaEng = "Deva (Divine)";
    ganaHindi = "देव गण";
  } else if (RAKSHASA_GANA_NAKS.includes(nakId)) {
    ganaEng = "Rakshasa (Fierce/Heroic)";
    ganaHindi = "राक्षस गण";
  } else {
    ganaEng = "Manushya (Human)";
    ganaHindi = "मनुष्य गण";
  }

  // 7. Yoni
  const yoniObj = NAKSHATRA_YONI[nakId] || { eng: "Horse", hindi: "अश्व" };

  // 8. Nadi
  const nadiEng = NAKSHATRA_NADI[nakId] || "Adi (Vata)";
  const nadiHindi = NAKSHATRA_NADI_HINDI[nakId] || "आदि (वात)";

  // 9. Varna & Vashya & Tatva
  const moonSignId = moon?.rashi?.id || 1;
  const varna = RASHI_VARNA[moonSignId] || RASHI_VARNA[1];
  const vashya = RASHI_VASHYA[moonSignId] || RASHI_VASHYA[1];
  const tatva = RASHI_TATVA[moonSignId] || RASHI_TATVA[1];

  // 10. Paya (Gold, Silver, Copper, Iron based on Moon house from Lagna)
  const moonHouse = moon ? moon.house : 1;
  let payaEng = "Silver (Rajata) - Highly Auspicious";
  let payaHindi = "रजत (चाँदी) - सर्वतोभद्र शुभ";
  if ([2, 5, 9].includes(moonHouse)) {
    payaEng = "Copper (Tamra) - Auspicious & Progressive";
    payaHindi = "ताम्र (ताँबा) - शुभ एवं उन्नतिप्रद";
  } else if ([3, 7, 10].includes(moonHouse)) {
    payaEng = "Gold (Swarna) - Noble & Moderate";
    payaHindi = "स्वर्ण (सोना) - मध्यम शुभ";
  } else if ([4, 8, 12].includes(moonHouse)) {
    payaEng = "Iron (Loha) - Strenuous & Effort-demanding";
    payaHindi = "लौह (लोहा) - संघर्षमय व धैर्यप्रद";
  }

  // 11. Lucky elements based on Moon Sign & Lagna
  const luckyNumbersMap = {
    1: "9, 1, 3", 2: "6, 5, 8", 3: "5, 6, 1", 4: "2, 7, 9",
    5: "1, 9, 3", 6: "5, 6, 7", 7: "6, 7, 2", 8: "9, 3, 1",
    9: "3, 9, 1", 10: "8, 5, 6", 11: "8, 3, 7", 12: "3, 2, 9"
  };

  const luckyColorsMap = {
    1: "Red, Crimson, Coral", 2: "White, Cream, Light Pink",
    3: "Emerald Green, Mint, Light Yellow", 4: "Pearl White, Silver, Cream",
    5: "Gold, Ruby Red, Orange", 6: "Dark Green, Parrot Green",
    7: "Pastel Blue, White, Silk Cream", 8: "Maroon, Dark Red, Orange",
    9: "Saffron, Golden Yellow, Ochre", 10: "Navy Blue, Charcoal, Black",
    11: "Sky Blue, Electric Violet, Deep Blue", 12: "Bright Yellow, Saffron, Golden"
  };

  const luckyDirectionsMap = {
    1: "East / South-East", 2: "South / South-East",
    3: "North / North-East", 4: "North / North-West",
    5: "East (Purva)", 6: "South / North-East",
    7: "West (Pashchim)", 8: "North / North-West",
    9: "East / North-East", 10: "South (Dakshin)",
    11: "West / North-West", 12: "North-East (Ishanya)"
  };

  const ishtaDevataMap = {
    1: "Lord Hanuman / Kartikeya", 2: "Maa Lakshmi / Durga",
    3: "Lord Vishnu / Saraswati", 4: "Lord Shiva / Maa Gauri",
    5: "Lord Surya Narayana / Gayatri", 6: "Lord Vishnu / Maa Saraswati",
    7: "Maa Mahalakshmi / Radha Krishna", 8: "Lord Hanuman / Shiva",
    9: "Lord Vishnu / Brihaspati / Dattatreya", 10: "Lord Shani / Bhairava / Shiva",
    11: "Lord Shiva / Hanuman", 12: "Lord Narayana / Guru"
  };

  return {
    tithi: { name: tithiNameEng, hindi: tithiNameHindi, paksha: pakshaEng, pakshaHindi: pakshaHindi },
    vaar: vaar,
    nakshatra: { name: nakName, hindi: nakHindi, pada: nakPada, lord: nakLord },
    yoga: { name: yogaEng, hindi: yogaHindi },
    karana: { name: karanaEng, hindi: karanaHindi },
    gana: { name: ganaEng, hindi: ganaHindi },
    yoni: yoniObj,
    nadi: { name: nadiEng, hindi: nadiHindi },
    varna: varna,
    vashya: vashya,
    tatva: tatva,
    paya: { name: payaEng, hindi: payaHindi },
    chandraRashi: {
      name: moon?.rashi?.english || "Aries",
      hindi: moon?.rashi?.hindi || "मेष",
      lord: moon?.rashi?.ruler || "Mars"
    },
    lagnaRashi: {
      name: kundli.ascendant.rashi.english,
      hindi: kundli.ascendant.rashi.hindi,
      lord: kundli.ascendant.rashi.ruler
    },
    luckyNumbers: luckyNumbersMap[moonSignId] || "3, 7, 9",
    luckyColors: luckyColorsMap[moonSignId] || "Golden Yellow, White",
    luckyDirection: luckyDirectionsMap[moonSignId] || "North-East",
    ishtaDevata: ishtaDevataMap[ascSign] || "Lord Vishnu / Shiva"
  };
}
