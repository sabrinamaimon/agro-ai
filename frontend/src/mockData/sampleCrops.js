// Sample mock dataset for bulletproof hackathon demo

export const SAMPLE_CROPS = [
  {
    id: 'potato-blight',
    name: 'Potato Late Blight (আলুর লেট ব্লাইট)',
    cropType: 'Potato (আলু)',
    pathogen: 'Phytophthora infestans',
    severity: 'Severe',
    damagePercentage: 38,
    union: 'Rangpur Sadar',
    plantingDate: '2026-02-10',
    description: 'White fungal growth with dark brown water-soaked lesions on leaves.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80',
    weather: {
      temperature: 24,
      humidity: 88,
      condition: 'High Humidity & Rain Expected',
      rainInHours: 4
    },
    organicRemedy: 'Remove and destroy infected leaves immediately. Spray Trichoderma viride bio-fungicide.',
    chemicalRemedy: 'Apply Mancozeb 75% WP @ 2.5g/liter of water.',
    phiDays: 14,
    sprayAdvice: 'DO NOT spray today due to rain in 4 hours. Spray tomorrow at 7:00 AM after foliage dries.',
    market: {
      crop: 'Potato',
      offeredPrice: 20,
      benchmarkPrice: 28,
      volatility: 'High',
      isUndercut: true,
      optimalSellingWindow: 'In 3 to 5 days'
    }
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast (ধানের ব্লাস্ট রোগ)',
    cropType: 'Rice (ধান)',
    pathogen: 'Magnaporthe oryzae',
    severity: 'Moderate',
    damagePercentage: 22,
    union: 'Dinajpur Sadar',
    plantingDate: '2026-01-20',
    description: 'Spindle-shaped lesions with gray centers and reddish-brown margins on rice leaves.',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    weather: {
      temperature: 28,
      humidity: 75,
      condition: 'Partly Cloudy',
      rainInHours: 18
    },
    organicRemedy: 'Apply Neem leaf extract spray. Avoid excessive nitrogen fertilizer.',
    chemicalRemedy: 'Spray Tricyclazole 75% WP @ 0.6g/liter of water.',
    phiDays: 21,
    sprayAdvice: 'Safe to spray today. Best time: 4:30 PM under calm wind conditions.',
    market: {
      crop: 'Rice',
      offeredPrice: 32,
      benchmarkPrice: 34,
      volatility: 'Low',
      isUndercut: false,
      optimalSellingWindow: 'Sell now or within 7 days'
    }
  }
];

export const MOCK_WEATHER_DEFAULT = {
  city: 'Rangpur, Bangladesh',
  temperature: 26,
  humidity: 82,
  condition: 'Humid & Overcast',
  rainForecast: 'Moderate rain expected in 4 hours',
  spraySafety: 'Warning: Rain risk within 6h'
};

export const MOCK_PRICE_BENCHMARKS = [
  { crop: 'Potato (আলু)', averagePrice: 28, minPrice: 25, maxPrice: 31, unit: 'BDT/kg' },
  { crop: 'Rice (ধান)', averagePrice: 34, minPrice: 31, maxPrice: 36, unit: 'BDT/kg' },
  { crop: 'Tomato (টমেটো)', averagePrice: 45, minPrice: 38, maxPrice: 52, unit: 'BDT/kg' },
  { crop: 'Wheat (গম)', averagePrice: 38, minPrice: 35, maxPrice: 41, unit: 'BDT/kg' }
];
