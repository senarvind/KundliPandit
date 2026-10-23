// Vedic Astrology Static Data & Reference Tables

export const RASHIS = [
  { id: 1, name: "Mesha", hindi: "मेष", english: "Aries", symbol: "♈", element: "Fire", ruler: "Mars", quality: "Movable (Chara)", color: "Coral Red", stone: "Red Coral" },
  { id: 2, name: "Vrishabha", hindi: "वृषभ", english: "Taurus", symbol: "♉", element: "Earth", ruler: "Venus", quality: "Fixed (Sthira)", color: "White / Cream", stone: "Diamond / Opal" },
  { id: 3, name: "Mithuna", hindi: "मिथुन", english: "Gemini", symbol: "♊", element: "Air", ruler: "Mercury", quality: "Dual (Dvisvabhava)", color: "Emerald Green", stone: "Emerald" },
  { id: 4, name: "Karka", hindi: "कर्क", english: "Cancer", symbol: "♋", element: "Water", ruler: "Moon", quality: "Movable (Chara)", color: "Pearl White / Silver", stone: "Pearl" },
  { id: 5, name: "Simha", hindi: "सिंह", english: "Leo", symbol: "♌", element: "Fire", ruler: "Sun", quality: "Fixed (Sthira)", color: "Golden Yellow / Ruby Red", stone: "Ruby" },
  { id: 6, name: "Kanya", hindi: "कन्या", english: "Virgo", symbol: "♍", element: "Earth", ruler: "Mercury", quality: "Dual (Dvisvabhava)", color: "Dark Green", stone: "Emerald" },
  { id: 7, name: "Tula", hindi: "तुला", english: "Libra", symbol: "♎", element: "Air", ruler: "Venus", quality: "Movable (Chara)", color: "Pastel Blue / White", stone: "Diamond / Opal" },
  { id: 8, name: "Vrischika", hindi: "वृश्चिक", english: "Scorpio", symbol: "♏", element: "Water", ruler: "Mars", quality: "Fixed (Sthira)", color: "Dark Red / Blood Orange", stone: "Red Coral" },
  { id: 9, name: "Dhanu", hindi: "धनु", english: "Sagittarius", symbol: "♐", element: "Fire", ruler: "Jupiter", quality: "Dual (Dvisvabhava)", color: "Bright Yellow / Saffron", stone: "Yellow Sapphire" },
  { id: 10, name: "Makara", hindi: "मकर", english: "Capricorn", symbol: "♑", element: "Earth", ruler: "Saturn", quality: "Movable (Chara)", color: "Deep Blue / Black", stone: "Blue Sapphire" },
  { id: 11, name: "Kumbha", hindi: "कुम्भ", english: "Aquarius", symbol: "♒", element: "Air", ruler: "Saturn", quality: "Fixed (Sthira)", color: "Sky Blue / Navy", stone: "Blue Sapphire / Amethyst" },
  { id: 12, name: "Meena", hindi: "मीन", english: "Pisces", symbol: "♓", element: "Water", ruler: "Jupiter", quality: "Dual (Dvisvabhava)", color: "Golden / Light Saffron", stone: "Yellow Sapphire" }
];

export const NAKSHATRAS = [
  { id: 1, name: "Ashwini", hindi: "अश्विनी", lord: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse's Head", dashaYears: 7 },
  { id: 2, name: "Bharani", hindi: "भरणी", lord: "Venus", deity: "Yama", symbol: "Yoni / Vagina", dashaYears: 20 },
  { id: 3, name: "Krittika", hindi: "कृत्तिका", lord: "Sun", deity: "Agni", symbol: "Razor / Flame", dashaYears: 6 },
  { id: 4, name: "Rohini", hindi: "रोहिणी", lord: "Moon", deity: "Brahma / Prajapati", symbol: "Cart / Chariot", dashaYears: 10 },
  { id: 5, name: "Mrigashira", hindi: "मृगशिरा", lord: "Mars", deity: "Soma", symbol: "Deer's Head", dashaYears: 7 },
  { id: 6, name: "Ardra", hindi: "आर्द्रा", lord: "Rahu", deity: "Rudra", symbol: "Teardrop / Diamond", dashaYears: 18 },
  { id: 7, name: "Punarvasu", hindi: "पुनर्वसु", lord: "Jupiter", deity: "Aditi", symbol: "Bow & Quiver", dashaYears: 16 },
  { id: 8, name: "Pushya", hindi: "पुष्य", lord: "Saturn", deity: "Brihaspati", symbol: "Flower / Cow's Udder", dashaYears: 19 },
  { id: 9, name: "Ashlesha", hindi: "आश्लेषा", lord: "Mercury", deity: "Nagas (Serpents)", symbol: "Coiled Serpent", dashaYears: 17 },
  { id: 10, name: "Magha", hindi: "मघा", lord: "Ketu", deity: "Pitris (Ancestors)", symbol: "Royal Throne", dashaYears: 7 },
  { id: 11, name: "Purva Phalguni", hindi: "पूर्वाफाल्गुनी", lord: "Venus", deity: "Bhaga", symbol: "Front of Bed / Hammock", dashaYears: 20 },
  { id: 12, name: "Uttara Phalguni", hindi: "उत्तराफाल्गुनी", lord: "Sun", deity: "Aryaman", symbol: "Back of Bed", dashaYears: 6 },
  { id: 13, name: "Hasta", hindi: "हस्त", lord: "Moon", deity: "Savitri (Sun)", symbol: "Open Hand / Palm", dashaYears: 10 },
  { id: 14, name: "Chitra", hindi: "चित्रा", lord: "Mars", deity: "Tvashtar (Divine Architect)", symbol: "Bright Jewel / Pearl", dashaYears: 7 },
  { id: 15, name: "Swati", hindi: "स्वाति", lord: "Rahu", deity: "Vayu (Wind)", symbol: "Young Plant Shoot / Coral", dashaYears: 18 },
  { id: 16, name: "Vishakha", hindi: "विशाखा", lord: "Jupiter", deity: "Indra-Agni", symbol: "Triumphal Arch", dashaYears: 16 },
  { id: 17, name: "Anuradha", hindi: "अनुराधा", lord: "Saturn", deity: "Mitra", symbol: "Lotus Flower / Staff", dashaYears: 19 },
  { id: 18, name: "Jyeshtha", hindi: "ज्येष्ठा", lord: "Mercury", deity: "Indra", symbol: "Earring / Umbrella", dashaYears: 17 },
  { id: 19, name: "Mula", hindi: "मूल", lord: "Ketu", deity: "Nirriti", symbol: "Tied Bundle of Roots", dashaYears: 7 },
  { id: 20, name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apas (Water Goddess)", symbol: "Winnowing Basket / Fan", dashaYears: 20 },
  { id: 21, name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishwadevas", symbol: "Elephant's Tusk", dashaYears: 6 },
  { id: 22, name: "Shravana", hindi: "श्रवण", lord: "Moon", deity: "Vishnu", symbol: "Ear / Three Footprints", dashaYears: 10 },
  { id: 23, name: "Dhanishta", hindi: "धनिष्ठा", lord: "Mars", deity: "Eight Vasus", symbol: "Mridangam / Flute", dashaYears: 7 },
  { id: 24, name: "Shatabhisha", hindi: "शतभिषा", lord: "Rahu", deity: "Varuna", symbol: "100 Physicians / Empty Circle", dashaYears: 18 },
  { id: 25, name: "Purva Bhadrapada", hindi: "पूर्वभाद्रपद", lord: "Jupiter", deity: "Aja Ekapada", symbol: "Front of Funeral Cot / Sword", dashaYears: 16 },
  { id: 26, name: "Uttara Bhadrapada", hindi: "उत्तरभाद्रपद", lord: "Saturn", deity: "Ahirbudhnya", symbol: "Back of Funeral Cot / Twins", dashaYears: 19 },
  { id: 27, name: "Revati", hindi: "रेवती", lord: "Mercury", deity: "Pushan", symbol: "Fish / Drum", dashaYears: 17 }
];

export const GRAHAS = [
  { id: "Sun", name: "Sun", sanskrit: "Surya", hindi: "सूर्य", symbol: "☉", exalted: 1, debilitated: 7, own: [5], gem: "Ruby", color: "#f59e0b", metal: "Copper / Gold", nature: "Mild Malefic (Krura)", mantra: "Om Suryaya Namah" },
  { id: "Moon", name: "Moon", sanskrit: "Chandra", hindi: "चन्द्र", symbol: "☽", exalted: 2, debilitated: 8, own: [4], gem: "Pearl", color: "#e2e8f0", metal: "Silver", nature: "Benefic (Saumya)", mantra: "Om Somaya Namah" },
  { id: "Mars", name: "Mars", sanskrit: "Mangal", hindi: "मंगल", symbol: "♂", exalted: 10, debilitated: 4, own: [1, 8], gem: "Red Coral", color: "#ef4444", metal: "Copper", nature: "Malefic (Krura)", mantra: "Om Bhaumaya Namah" },
  { id: "Mercury", name: "Mercury", sanskrit: "Budha", hindi: "बुध", symbol: "☿", exalted: 6, debilitated: 12, own: [3, 6], gem: "Emerald", color: "#10b981", metal: "Bronze / Brass", nature: "Benefic (Conditional)", mantra: "Om Budhaya Namah" },
  { id: "Jupiter", name: "Jupiter", sanskrit: "Guru / Brihaspati", hindi: "गुरु", symbol: "♃", exalted: 4, debilitated: 10, own: [9, 12], gem: "Yellow Sapphire", color: "#eab308", metal: "Gold", nature: "Supreme Benefic (Param Saumya)", mantra: "Om Brihaspataye Namah" },
  { id: "Venus", name: "Venus", sanskrit: "Shukra", hindi: "शुक्र", symbol: "♀", exalted: 12, debilitated: 6, own: [2, 7], gem: "Diamond / White Zircon", color: "#f472b6", metal: "Silver / Platinum", nature: "Benefic (Saumya)", mantra: "Om Shukraya Namah" },
  { id: "Saturn", name: "Saturn", sanskrit: "Shani", hindi: "शनि", symbol: "♄", exalted: 7, debilitated: 1, own: [10, 11], gem: "Blue Sapphire", color: "#6366f1", metal: "Iron", nature: "Malefic (Manda)", mantra: "Om Sham Shanaishcharaya Namah" },
  { id: "Rahu", name: "Rahu", sanskrit: "Rahu", hindi: "राहु", symbol: "☊", exalted: 2, debilitated: 8, own: [11], gem: "Hessonite Garnet", color: "#8b5cf6", metal: "Mixed Alloys", nature: "Shadow Malefic (Chhaya)", mantra: "Om Rahave Namah" },
  { id: "Ketu", name: "Ketu", sanskrit: "Ketu", hindi: "केतु", symbol: "☋", exalted: 8, debilitated: 2, own: [8], gem: "Cat's Eye", color: "#a855f7", metal: "Moksha Karaka", nature: "Shadow Malefic (Chhaya)", mantra: "Om Ketave Namah" }
];

export const HOUSES = [
  { num: 1, name: "Tanu Bhava", title: "Lagna / Self", hindi: "Tanu Bhava (1st House)", type: "Kendra & Trikona", significations: "Physical body, vitality, character, appearance, health, self-identity, beginning of life." },
  { num: 2, name: "Dhana Bhava", title: "Wealth & Speech", hindi: "Dhana Bhava (2nd House)", type: "Maraka & Panaphara", significations: "Accumulated wealth, family lineage, speech, facial traits, eating habits, right eye." },
  { num: 3, name: "Sahaja Bhava", title: "Courage & Siblings", hindi: "Sahaja Bhava (3rd House)", type: "Upachaya & Apoklima", significations: "Younger siblings, valor, courage, short journeys, writing, communication, hands & shoulders." },
  { num: 4, name: "Sukha Bhava", title: "Mother & Property", hindi: "Sukha Bhava (4th House)", type: "Kendra", significations: "Mother, domestic happiness, ancestral landed property, vehicles, chest & heart, peace of mind." },
  { num: 5, name: "Putra Bhava", title: "Children & Intellect", hindi: "Putra Bhava (5th House)", type: "Trikona", significations: "Children, past life merit (Purva Punya), intelligence, creativity, education, mantra siddhi, romance." },
  { num: 6, name: "Ari / Shatru Bhava", title: "Debts, Enemies & Health", hindi: "Shatru Bhava (6th House)", type: "Dusthana & Upachaya", significations: "Diseases, debts, enemies, daily work routine, litigation, maternal uncles, digestive system." },
  { num: 7, name: "Kalatra Bhava", title: "Spouse & Partnerships", hindi: "Kalatra Bhava (7th House)", type: "Kendra & Maraka", significations: "Spouse, marriage, business partnerships, public relations, overseas business, sexual vitality." },
  { num: 8, name: "Ayur Bhava", title: "Longevity & Occult", hindi: "Ayur Bhava (8th House)", type: "Dusthana", significations: "Longevity, sudden unexpected events, hidden wealth / inheritance, occult, research, transformation." },
  { num: 9, name: "Dharma Bhava", title: "Fortune & Dharma", hindi: "Dharma Bhava (9th House)", type: "Trikona", significations: "Dharma, fortune (Bhagya), father, spirituality, guru, higher learning, pilgrimage, long journeys." },
  { num: 10, name: "Karma Bhava", title: "Career & Status", hindi: "Karma Bhava (10th House)", type: "Kendra & Upachaya", significations: "Profession, social status, fame, authority, government honors, public accomplishments, kneecaps." },
  { num: 11, name: "Labha Bhava", title: "Gains & Aspirations", hindi: "Labha Bhava (11th House)", type: "Upachaya", significations: "Income, financial gains, fulfillment of desires, elder siblings, social circle, awards & recognition." },
  { num: 12, name: "Vyaya Bhava", title: "Losses & Liberation", hindi: "Vyaya Bhava (12th House)", type: "Dusthana & Moksha", significations: "Expenditure, foreign residence, spiritual liberation (Moksha), sleep, dreams, sub-conscious, meditation." }
];

export const CITIES = [
  { name: "New Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: "Mumbai, India", lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: "Varanasi (Kashi), India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: "Haridwar, India", lat: 29.9457, lng: 78.1642, tz: 5.5 },
  { name: "Ayodhya, India", lat: 26.7922, lng: 82.1998, tz: 5.5 },
  { name: "Ujjain, India", lat: 23.1765, lng: 75.7885, tz: 5.5 },
  { name: "Bengaluru, India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: "Kolkata, India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: "Chennai, India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: "Hyderabad, India", lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: "Jaipur, India", lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: "Ahmedabad, India", lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: "Lucknow, India", lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: "Pune, India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: "Patna, India", lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: "Indore, India", lat: 22.7196, lng: 75.8577, tz: 5.5 },
  { name: "Chandigarh, India", lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { name: "Bhopal, India", lat: 23.2599, lng: 77.4126, tz: 5.5 },
  { name: "Amritsar, India", lat: 31.6340, lng: 74.8723, tz: 5.5 },
  { name: "Guwahati, India", lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: "London, UK", lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: "New York, USA", lat: 40.7128, lng: -74.0060, tz: -5 },
  { name: "San Francisco, USA", lat: 37.7749, lng: -122.4194, tz: -8 },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, tz: 4 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, tz: 8 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
  { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832, tz: -5 },
  { name: "Kathmandu, Nepal", lat: 27.7172, lng: 85.3240, tz: 5.75 }
];

export const FAMOUS_CHARTS = [
  {
    name: "Narendra Modi",
    gender: "Male",
    date: "1950-09-17",
    time: "11:00",
    city: "Ahmedabad, India",
    lat: 23.0225,
    lng: 72.5714,
    tz: 5.5,
    note: "Vrishchika (Scorpio) Lagna with Mars & Moon creating Ruchaka & Chandra-Mangal Yoga. Strong 10th house Sun."
  },
  {
    name: "Amitabh Bachchan",
    gender: "Male",
    date: "1942-10-11",
    time: "16:00",
    city: "Lucknow, India",
    lat: 26.8467,
    lng: 80.9462,
    tz: 5.5,
    note: "Kumbha (Aquarius) Lagna with remarkable 4-planet conjunction in 8th house and Jupiter in 6th house (Hamsa Yoga)."
  },
  {
    name: "Sachin Tendulkar",
    gender: "Male",
    date: "1973-04-24",
    time: "13:00",
    city: "Mumbai, India",
    lat: 19.0760,
    lng: 72.8777,
    tz: 5.5,
    note: "Karka / Dhanu Lagna with exalted Sun in Aries 10th house and exalted Mars in 7th house."
  },
  {
    name: "Dr. A.P.J. Abdul Kalam",
    gender: "Male",
    date: "1931-10-15",
    time: "01:15",
    city: "Chennai, India",
    lat: 13.0827,
    lng: 80.2707,
    tz: 5.5,
    note: "Karka Lagna with Jupiter exalted in Lagna forming Hamsa Mahapurusha Yoga, spiritual dedication."
  },
  {
    name: "Swami Vivekananda",
    gender: "Male",
    date: "1863-01-12",
    time: "06:33",
    city: "Kolkata, India",
    lat: 22.5726,
    lng: 88.3639,
    tz: 5.5,
    note: "Dhanu Lagna with Sun in Lagna, Saturn in 10th house and Mars in 5th house forming spiritual titan Raj Yoga."
  }
];

export const VEDIC_REMEDIES_GUIDE = {
  gemstones: {
    "Ruby": { name: "Ruby (Sun)", hindi: "Ruby (Sun)", metal: "Gold / Copper", finger: "Ring finger", day: "Sunday morning", mantra: "Om Ghrinih Suryaya Namah" },
    "Pearl": { name: "Pearl (Moon)", hindi: "Pearl (Moon)", metal: "Silver", finger: "Little finger", day: "Monday evening", mantra: "Om Somaya Namah" },
    "Red Coral": { name: "Red Coral (Mars)", hindi: "Red Coral (Mars)", metal: "Copper / Gold", finger: "Ring finger", day: "Tuesday morning", mantra: "Om Bhaumaya Namah" },
    "Emerald": { name: "Emerald (Mercury)", hindi: "Emerald (Mercury)", metal: "Gold / Bronze", finger: "Little finger", day: "Wednesday morning", mantra: "Om Budhaya Namah" },
    "Yellow Sapphire": { name: "Yellow Sapphire (Jupiter)", hindi: "Yellow Sapphire (Jupiter)", metal: "Gold", finger: "Index finger", day: "Thursday morning", mantra: "Om Brihaspataye Namah" },
    "Diamond": { name: "Diamond / White Zircon (Venus)", hindi: "Diamond / Opal (Venus)", metal: "Silver / Platinum", finger: "Middle / Little finger", day: "Friday morning", mantra: "Om Shukraya Namah" },
    "Blue Sapphire": { name: "Blue Sapphire (Saturn)", hindi: "Blue Sapphire (Saturn)", metal: "Panchdhatu / Iron", finger: "Middle finger", day: "Saturday evening", mantra: "Om Sham Shanaishcharaya Namah" },
    "Hessonite": { name: "Hessonite Garnet (Rahu)", hindi: "Hessonite Garnet (Rahu)", metal: "Silver / Ashtadhatu", finger: "Middle finger", day: "Wednesday / Saturday night", mantra: "Om Rahave Namah" },
    "Cat's Eye": { name: "Cat's Eye (Ketu)", hindi: "Cat's Eye (Ketu)", metal: "Silver", finger: "Middle / Little finger", day: "Tuesday / Thursday night", mantra: "Om Ketave Namah" }
  },
  rudraksha: {
    1: "1 Mukhi (Surya) - For supreme leadership, aura enlightenment, and overcoming ego.",
    2: "2 Mukhi (Chandra) - Ardhanarishwara, harmonious relationships, mental tranquility.",
    3: "3 Mukhi (Mangal) - Agni, destroys past sins, purifies digestive fire & self-confidence.",
    4: "4 Mukhi (Budha) - Brahma, enhances eloquence, sharp memory and intellect.",
    5: "5 Mukhi (Guru) - Kalagni Rudra, supreme wisdom, peaceful heart, auspicious health.",
    6: "6 Mukhi (Shukra/Kartikeya) - Attracts luxury, artistic charisma, willpower.",
    7: "7 Mukhi (Shani/Mahalakshmi) - Abundant wealth, overcoming financial setbacks & Sade Sati relief.",
    8: "8 Mukhi (Rahu/Ganesha) - Removes all obstacles (Vighnaharta), protects from unseen enemies.",
    9: "9 Mukhi (Ketu/Durga) - Divine fearlessness, spiritual awakening, destroys lethargy."
  }
};

