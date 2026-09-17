export const CROP_CATEGORIES = [
  { 
    id: 'cereal', 
    nameBn: 'শস্য', 
    nameEn: 'Cereals / Grains', 
    icon: '🌾', 
    sampleBn: 'ধান, গম, ভুট্টা',
    sampleEn: 'Rice, Wheat, Maize'
  },
  { 
    id: 'vegetable', 
    nameBn: 'সবজি', 
    nameEn: 'Vegetables', 
    icon: '🥦', 
    sampleBn: 'আলু, টমেটো, বেগুন, কাঁচা মরিচ, শসা, লাউ...',
    sampleEn: 'Potato, Tomato, Brinjal, Chilli, Cucumber...'
  },
  { 
    id: 'spice', 
    nameBn: 'মসলা', 
    nameEn: 'Spices', 
    icon: '🧅', 
    sampleBn: 'পেঁয়াজ, রসুন, আদা, হলুদ',
    sampleEn: 'Onion, Garlic, Ginger, Turmeric'
  },
  { 
    id: 'fruit', 
    nameBn: 'ফল', 
    nameEn: 'Fruits', 
    icon: '🍎', 
    sampleBn: 'আম, কলা, পেঁপে, পেয়ারা, লিচু, লেবু, মাল্টা...',
    sampleEn: 'Mango, Banana, Papaya, Guava, Litchi...'
  },
  { 
    id: 'betel', 
    nameBn: 'পান/পাতা', 
    nameEn: 'Betel Vine & Leaf', 
    icon: '🍃', 
    sampleBn: 'পান',
    sampleEn: 'Betel Leaf'
  },
  { 
    id: 'oilseed_pulse', 
    nameBn: 'তেলবীজ ও ডাল', 
    nameEn: 'Oilseeds & Pulses', 
    icon: '🫘', 
    sampleBn: 'সরিষা, মসুর, মুগ, মাষকলাই, খেসারি, ছোলা...',
    sampleEn: 'Mustard, Lentil, Mung, Chickpea...'
  },
  { 
    id: 'cash_leaf', 
    nameBn: 'অর্থকরী ও পাতা', 
    nameEn: 'Cash Crops & Plantation', 
    icon: '🪴', 
    sampleBn: 'পাট, চা',
    sampleEn: 'Jute, Tea'
  }
];

export const BANGLADESH_CROPS = [
  // ==================== ১. শস্য (Cereals) ====================
  { id: 'rice', nameBn: 'ধান', nameEn: 'Rice (Paddy)', category: 'cereal', icon: '🌾', commonDiseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Sheath Blight', 'Brown Spot'] },
  { id: 'wheat', nameBn: 'গম', nameEn: 'Wheat', category: 'cereal', icon: '🌾', commonDiseases: ['Wheat Blast', 'Leaf Rust', 'Loose Smut', 'Powdery Mildew'] },
  { id: 'maize', nameBn: 'ভুট্টা', nameEn: 'Maize (Corn)', category: 'cereal', icon: '🌽', commonDiseases: ['Fall Armyworm', 'Maydis Leaf Blight', 'Common Rust', 'Stalk Rot'] },

  // ==================== ২. সবজি (Vegetables) ====================
  { id: 'potato', nameBn: 'আলু', nameEn: 'Potato', category: 'vegetable', icon: '🥔', commonDiseases: ['Late Blight', 'Early Blight', 'Common Scab', 'Bacterial Wilt'] },
  { id: 'tomato', nameBn: 'টমেটো', nameEn: 'Tomato', category: 'vegetable', icon: '🍅', commonDiseases: ['Yellow Leaf Curl Virus', 'Early Blight', 'Late Blight', 'Fruit Rot'] },
  { id: 'brinjal', nameBn: 'বেগুন', nameEn: 'Brinjal (Eggplant)', category: 'vegetable', icon: '🍆', commonDiseases: ['Fruit and Shoot Borer', 'Phomopsis Blight', 'Little Leaf', 'Bacterial Wilt'] },
  { id: 'chilli', nameBn: 'কাঁচা মরিচ', nameEn: 'Green Chilli', category: 'vegetable', icon: '🌶️', commonDiseases: ['Chilli Leaf Curl Virus', 'Anthracnose Dieback', 'Bacterial Wilt', 'Thrips'] },
  { id: 'cucumber', nameBn: 'শসা', nameEn: 'Cucumber', category: 'vegetable', icon: '🥒', commonDiseases: ['Downy Mildew', 'Powdery Mildew', 'Mosaic Virus', 'Anthracnose'] },
  { id: 'bottlegourd', nameBn: 'লাউ', nameEn: 'Bottle Gourd', category: 'vegetable', icon: '🥒', commonDiseases: ['Downy Mildew', 'Anthracnose', 'Mosaic Virus', 'Fruit Rot'] },
  { id: 'pointedgourd', nameBn: 'পটল', nameEn: 'Pointed Gourd', category: 'vegetable', icon: '🥒', commonDiseases: ['Fruit Rot', 'Downy Mildew', 'Root Rot', 'Anthracnose'] },
  { id: 'bittergourd', nameBn: 'করলা', nameEn: 'Bitter Gourd', category: 'vegetable', icon: '🥒', commonDiseases: ['Downy Mildew', 'Powdery Mildew', 'Fruit Fly Damage', 'Cercospora Leaf Spot'] },
  { id: 'countrybean', nameBn: 'শিম', nameEn: 'Country Bean', category: 'vegetable', icon: '🫛', commonDiseases: ['Anthracnose', 'Yellow Mosaic Virus', 'Pod Borer', 'Rust'] },
  { id: 'okra', nameBn: 'ঢেঁড়স', nameEn: 'Okra (Ladyfinger)', category: 'vegetable', icon: '🌱', commonDiseases: ['Yellow Vein Mosaic Virus', 'Powdery Mildew', 'Fruit Borer', 'Cercospora Leaf Spot'] },
  { id: 'cauliflower', nameBn: 'ফুলকপি', nameEn: 'Cauliflower', category: 'vegetable', icon: '🥦', commonDiseases: ['Black Rot', 'Downy Mildew', 'Clubroot', 'Damping Off'] },
  { id: 'cabbage', nameBn: 'বাঁধাকপি', nameEn: 'Cabbage', category: 'vegetable', icon: '🥬', commonDiseases: ['Black Rot', 'Clubroot', 'Alternaria Leaf Spot', 'Diamondback Moth'] },

  // ==================== ৩. মসলা (Spices) ====================
  { id: 'onion', nameBn: 'পেঁয়াজ', nameEn: 'Onion', category: 'spice', icon: '🧅', commonDiseases: ['Purple Blotch (Alternaria)', 'Downy Mildew', 'Basal Rot', 'Thrips Infestation'] },
  { id: 'garlic', nameBn: 'রসুন', nameEn: 'Garlic', category: 'spice', icon: '🧄', commonDiseases: ['Purple Blotch', 'Rust', 'Stem and Bulb Rot', 'White Rot'] },
  { id: 'ginger', nameBn: 'আদা', nameEn: 'Ginger', category: 'spice', icon: '🫚', commonDiseases: ['Rhizome Soft Rot (Pythium)', 'Bacterial Wilt', 'Leaf Spot'] },
  { id: 'turmeric', nameBn: 'হলুদ', nameEn: 'Turmeric', category: 'spice', icon: '🌱', commonDiseases: ['Rhizome Rot', 'Leaf Spot (Colletotrichum)', 'Leaf Blotch (Taphrina)'] },

  // ==================== ৪. ফল (Fruits) ====================
  { id: 'mango', nameBn: 'আম', nameEn: 'Mango', category: 'fruit', icon: '🥭', commonDiseases: ['Anthracnose Fruit Rot', 'Powdery Mildew', 'Dieback', 'Bacterial Canker'] },
  { id: 'banana', nameBn: 'কলা', nameEn: 'Banana', category: 'fruit', icon: '🍌', commonDiseases: ['Sigatoka Leaf Spot', 'Panama Wilt (Fusarium)', 'Banana Bunchy Top Virus'] },
  { id: 'papaya', nameBn: 'পেঁপে', nameEn: 'Papaya', category: 'fruit', icon: '🍈', commonDiseases: ['Papaya Ring Spot Virus', 'Anthracnose Fruit Rot', 'Foot Rot (Damping Off)'] },
  { id: 'guava', nameBn: 'পেয়ারা', nameEn: 'Guava', category: 'fruit', icon: '🍐', commonDiseases: ['Guava Wilt (Fusarium)', 'Anthracnose', 'Fruit Canker', 'Stylar End Rot'] },
  { id: 'litchi', nameBn: 'লিচু', nameEn: 'Litchi', category: 'fruit', icon: '🍒', commonDiseases: ['Downy Blight', 'Fruit Rot', 'Leaf Curl Mite', 'Bark Eating Caterpillar'] },
  { id: 'lemon', nameBn: 'লেবু', nameEn: 'Lemon (Lime)', category: 'fruit', icon: '🍋', commonDiseases: ['Citrus Canker (Xanthomonas)', 'Citrus Greening', 'Dieback', 'Gummosis'] },
  { id: 'pomelo', nameBn: 'জাম্বুরা', nameEn: 'Pomelo (Citrus maxima)', category: 'fruit', icon: '🍈', commonDiseases: ['Citrus Canker', 'Gummosis', 'Greening', 'Fruit Borer'] },
  { id: 'pineapple', nameBn: 'আনারস', nameEn: 'Pineapple', category: 'fruit', icon: '🍍', commonDiseases: ['Heart Rot (Phytophthora)', 'Black Rot', 'Mealybug Wilt'] },
  { id: 'orange', nameBn: 'কমলা', nameEn: 'Orange', category: 'fruit', icon: '🍊', commonDiseases: ['Citrus Canker', 'Dieback', 'Tristeza Virus', 'Citrus Scab'] },
  { id: 'malta', nameBn: 'মাল্টা', nameEn: 'Malta (Sweet Orange)', category: 'fruit', icon: '🍊', commonDiseases: ['Citrus Canker', 'Gummosis', 'Greening (Huanglongbing)', 'Dieback'] },
  { id: 'watermelon', nameBn: 'তরমুজ', nameEn: 'Watermelon', category: 'fruit', icon: '🍉', commonDiseases: ['Fusarium Wilt', 'Gummy Stem Blight', 'Downy Mildew', 'Anthracnose'] },
  { id: 'muskmelon', nameBn: 'বাঙ্গি', nameEn: 'Muskmelon', category: 'fruit', icon: '🍈', commonDiseases: ['Downy Mildew', 'Powdery Mildew', 'Fusarium Wilt', 'Fruit Rot'] },
  { id: 'dragonfruit', nameBn: 'ড্রাগন ফল', nameEn: 'Dragon Fruit', category: 'fruit', icon: '🐉', commonDiseases: ['Stem Canker (Neoscytalidium)', 'Anthracnose', 'Bacterial Soft Rot'] },
  { id: 'jujube', nameBn: 'কুল/বরই', nameEn: 'Plum (Jujube)', category: 'fruit', icon: '🫐', commonDiseases: ['Powdery Mildew', 'Sooty Mold', 'Fruit Rot', 'Leaf Spot'] },
  { id: 'hogplum', nameBn: 'আমড়া', nameEn: 'Hog Plum', category: 'fruit', icon: '🍐', commonDiseases: ['Anthracnose', 'Fruit Rot', 'Leaf Spot'] },
  { id: 'jamun', nameBn: 'জাম', nameEn: 'Blackberry (Jamun)', category: 'fruit', icon: '🫐', commonDiseases: ['Anthracnose', 'Leaf Spot', 'Fruit Rot'] },
  { id: 'lotkon', nameBn: 'লটকন', nameEn: 'Burmese Grape (Lotkon)', category: 'fruit', icon: '🟡', commonDiseases: ['Fruit Rot', 'Leaf Spot', 'Dieback'] },
  { id: 'coconut', nameBn: 'নারিকেল', nameEn: 'Coconut', category: 'fruit', icon: '🥥', commonDiseases: ['Bud Rot (Phytophthora)', 'Stem Bleeding', 'Lethal Yellowing', 'Rhinoceros Beetle'] },
  { id: 'olive', nameBn: 'জলপাই', nameEn: 'Olive', category: 'fruit', icon: '🫒', commonDiseases: ['Olive Peacock Spot', 'Anthracnose', 'Fruit Rot', 'Verticillium Wilt'] },
  { id: 'starfruit', nameBn: 'কামরাঙ্গা', nameEn: 'Starfruit (Carambola)', category: 'fruit', icon: '⭐', commonDiseases: ['Anthracnose', 'Fruit Rot', 'Cercospora Leaf Spot'] },
  { id: 'pomegranate', nameBn: 'ডালিম', nameEn: 'Pomegranate', category: 'fruit', icon: '🍎', commonDiseases: ['Bacterial Blight (Xanthomonas)', 'Anthracnose', 'Fruit Borer', 'Fruit Spot'] },
  { id: 'grape', nameBn: 'আঙুর', nameEn: 'Grape', category: 'fruit', icon: '🍇', commonDiseases: ['Downy Mildew', 'Powdery Mildew', 'Anthracnose', 'Black Rot'] },

  // ==================== ৫. পান/পাতা (Betel) ====================
  { id: 'betelleaf', nameBn: 'পান', nameEn: 'Betel Leaf', category: 'betel', icon: '🍃', commonDiseases: ['Foot Rot and Leaf Rot (Phytophthora)', 'Collar Rot (Sclerotium)', 'Anthracnose', 'Bacterial Leaf Spot'] },

  // ==================== ৬. তেলবীজ ও ডাল (Oilseeds & Pulses) ====================
  { id: 'mustard', nameBn: 'সরিষা', nameEn: 'Mustard', category: 'oilseed_pulse', icon: '🌼', commonDiseases: ['Alternaria Blight', 'White Rust (Albugo)', 'Downy Mildew', 'Aphid Attack'] },
  { id: 'lentil', nameBn: 'মসুর', nameEn: 'Lentil (Masur)', category: 'oilseed_pulse', icon: '🫘', commonDiseases: ['Stemphylium Blight', 'Rust', 'Fusarium Wilt', 'Root Rot'] },
  { id: 'mungbean', nameBn: 'মুগ', nameEn: 'Mung Bean', category: 'oilseed_pulse', icon: '🫘', commonDiseases: ['Yellow Mosaic Virus', 'Cercospora Leaf Spot', 'Powdery Mildew'] },
  { id: 'blackgram', nameBn: 'মাষকলাই', nameEn: 'Black Gram', category: 'oilseed_pulse', icon: '🫘', commonDiseases: ['Yellow Mosaic Virus', 'Powdery Mildew', 'Leaf Crinkle', 'Root Rot'] },
  { id: 'grasspea', nameBn: 'খেসারি', nameEn: 'Grass Pea (Khesari)', category: 'oilseed_pulse', icon: '🫘', commonDiseases: ['Downy Mildew', 'Rust', 'Powdery Mildew'] },
  { id: 'chickpea', nameBn: 'ছোলা', nameEn: 'Chickpea (Chola)', category: 'oilseed_pulse', icon: '🫘', commonDiseases: ['Ascochyta Blight', 'Botrytis Gray Mold', 'Fusarium Wilt', 'Root Rot'] },
  { id: 'groundnut', nameBn: 'চীনাবাদাম', nameEn: 'Groundnut (Peanut)', category: 'oilseed_pulse', icon: '🥜', commonDiseases: ['Tikka Disease (Cercospora)', 'Collar Rot (Aspergillus)', 'Rust'] },
  { id: 'sesame', nameBn: 'তিল', nameEn: 'Sesame (Til)', category: 'oilseed_pulse', icon: '🌱', commonDiseases: ['Phyllody (Phytoplasma)', 'Phoma Stem Rot', 'Bacterial Blight'] },
  { id: 'sunflower', nameBn: 'সূর্যমুখী', nameEn: 'Sunflower', category: 'oilseed_pulse', icon: '🌻', commonDiseases: ['Alternaria Blight', 'Head Rot (Rhizopus)', 'Rust', 'Sclerotinia Wilt'] },

  // ==================== ৭. অর্থকরী ও পাতা (Cash Crops & Leaf) ====================
  { id: 'jute', nameBn: 'পাট', nameEn: 'Jute', category: 'cash_leaf', icon: '🌱', commonDiseases: ['Stem Rot (Macrophomina phaseolina)', 'Black Band', 'Anthracnose', 'Yellow Mite Damage'] },
  { id: 'tea', nameBn: 'চা', nameEn: 'Tea', category: 'cash_leaf', icon: '🍵', commonDiseases: ['Blister Blight (Exobasidium)', 'Black Rot (Corticium)', 'Red Rust (Algae)', 'Dieback'] }
];

export const POPULAR_BANGLADESH_CROPS = [
  'rice', 'potato', 'mango', 'tomato', 'brinjal', 'chilli', 'banana', 'onion', 'mustard', 'jute', 'lentil', 'tea'
];
