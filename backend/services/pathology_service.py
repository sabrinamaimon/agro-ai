import re
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from backend.config import DATA_DIR

logger = logging.getLogger(__name__)

PRIMARY_PATHOLOGY_FILE = DATA_DIR / "crop_disease_dataset.json"
BACKUP_PATHOLOGY_FILE = DATA_DIR / "crop_pathology_db.json"

# In-memory cache
_CACHED_DB: Optional[List[Dict[str, Any]]] = None
_CACHED_MTIME: float = 0.0

BANGLISH_CROP_MAP = {
    "dhan": "ধান", "dhaan": "ধান", "rice": "ধান", "paddy": "ধান",
    "alu": "আলু", "potato": "আলু",
    "tomato": "টমেটো", "tamatar": "টমেটো",
    "begun": "বেগুন", "brinjal": "বেগুন", "eggplant": "বেগুন", "baigun": "বেগুন",
    "morich": "মরিচ", "chilli": "মরিচ", "chili": "মরিচ", "marich": "মরিচ",
    "am": "আম", "aam": "আম", "mango": "আম",
    "kola": "কলা", "banana": "কলা",
    "gom": "গম", "wheat": "গম",
    "bhutta": "ভুট্টা", "vutta": "ভুট্টা", "maize": "ভুট্টা", "corn": "ভুট্টা",
    "shorisha": "সরিষা", "sorisha": "সরিষা", "mustard": "সরিষা",
    "pat": "পাট", "paat": "পাট", "jute": "পাট",
    "piaj": "পেঁয়াজ", "peyaj": "পেঁয়াজ", "peyaz": "পেঁয়াজ", "onion": "পেঁয়াজ",
    "shosa": "শসা", "shosha": "শসা", "cucumber": "শসা",
    "lau": "লাউ", "lao": "লাউ", "bottlegourd": "লাউ", "kaddu": "লাউ",
    "korola": "করলা", "uchhe": "করলা", "bittergourd": "করলা",
    "shim": "শিম", "seem": "শিম", "bean": "শিম",
    "dherosh": "ঢ্যাঁড়শ", "dheros": "ঢ্যাঁড়শ", "okra": "ঢ্যাঁড়শ", "bhendi": "ঢ্যাঁড়শ",
    "potol": "পটল", "pointedgourd": "পটল",
    "kophi": "ফুলকপি ও বাঁধাকপি", "kopi": "ফুলকপি ও বাঁধাকপি", "cabbage": "বাঁধাকপি", "fulkopi": "ফুলকপি ও বাঁধাকপি", "badhakopi": "বাঁধাকপি",
    "pepe": "পেঁপে", "pepey": "পেঁপে", "papaya": "পেঁপে",
    "peyara": "পেয়ারা", "guava": "পেয়ারা",
    "lebu": "লেবু", "lemon": "লেবু", "lime": "লেবু",
    "pan": "পান", "paan": "পান", "betelleaf": "পান",
    "tormuj": "তরমুজ", "tormuz": "তরমুজ", "watermelon": "তরমুজ",
    "mosur": "মসুর", "lentil": "মসুর", "masur": "মসুর",
    "mug": "মুগ", "mung": "মুগ",
    "chinabadam": "চীনাবাদাম", "badam": "চীনাবাদাম", "groundnut": "চীনাবাদাম", "peanut": "চীনাবাদাম",
    "cha": "চা", "tea": "চা",
    "ada": "আদা", "ginger": "আদা",
    "holud": "হলুদ", "turmeric": "হলুদ",
    "roshun": "রসুন", "roshon": "রসুন", "garlic": "রসুন",
    "dragon": "ড্রাগন ফল", "dragonfruit": "ড্রাগন ফল",
    "dalim": "ডালিম", "bedana": "ডালিম", "anar": "ডালিম", "pomegranate": "ডালিম",
    "boroi": "কুল/বরই", "kul": "কুল/বরই", "jujube": "কুল/বরই",
    "lichu": "লিচু", "litchi": "লিচু",
    "narikel": "নারিকেল", "narkel": "নারিকেল", "coconut": "নারিকেল",
    "anaros": "আনারস", "anaras": "আনারস", "pineapple": "আনারস",
    "suryomukhi": "সূর্যমুখী", "surjomukhi": "সূর্যমুখী", "sunflower": "সূর্যমুখী",
    "chola": "ছোলা", "chickpea": "ছোলা",
    "til": "তিল", "sesame": "তিল",
    "khesari": "খেসারি", "grasspea": "খেসারি",
    "mashkalai": "মাষকলাই", "blackgram": "মাষকলাই",
    "malta": "মাল্টা ও কমলা", "komla": "মাল্টা ও কমলা", "orange": "মাল্টা ও কমলা", "citrus": "লেবু",
    "amra": "আমড়া", "hogplum": "আমড়া",
    "angur": "আঙুর", "grape": "আঙুর",
    "jolpai": "জলপাই", "olive": "জলপাই"
}

def load_pathology_db() -> List[Dict[str, Any]]:
    """Loads and caches the 70+ authentic Bangladesh crop diseases dataset."""
    global _CACHED_DB, _CACHED_MTIME
    target = PRIMARY_PATHOLOGY_FILE if PRIMARY_PATHOLOGY_FILE.exists() else BACKUP_PATHOLOGY_FILE
    if not target.exists():
        return []

    try:
        mtime = target.stat().st_mtime
        if _CACHED_DB is not None and mtime == _CACHED_MTIME:
            return _CACHED_DB

        with open(target, "r", encoding="utf-8") as f:
            data = json.load(f)
            diseases = data.get("diseases", [])
            _CACHED_DB = diseases
            _CACHED_MTIME = mtime
            return diseases
    except Exception as e:
        logger.error(f"Error reading crop disease database from {target}: {e}")
        return _CACHED_DB or []

def stem_banglish(word: str) -> str:
    """Stems common Bengali/Banglish grammatical suffixes."""
    word = word.lower().strip()
    for suffix in ["gulo", "gula", "guli", "der", "er", "ur", "te", "ye", "e", "r"]:
        if word.endswith(suffix) and len(word) - len(suffix) >= 2:
            base = word[:-len(suffix)]
            if base in BANGLISH_CROP_MAP:
                return base
    return word

def match_pathologies(
    query_or_crop: str, 
    plant_part: Optional[str] = None, 
    max_results: int = 4,
    visual_traits: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Intelligently retrieves authentic registered diseases matching a crop or user query.
    Handles Bangla script, English names, phonetic Banglish with grammatical suffixes,
    and visual lesion traits (e.g. powdery, scarring, sunken rot).
    """
    diseases = load_pathology_db()
    if not diseases:
        return []

    q_clean = query_or_crop.lower().strip()
    matched_crop_bn = None
    
    # 1. Match from words or stemmed Banglish
    words = re.findall(r"\b[a-zA-Z]+\b", q_clean)
    for word in words:
        if word in BANGLISH_CROP_MAP:
            matched_crop_bn = BANGLISH_CROP_MAP[word]
            break
        stemmed = stem_banglish(word)
        if stemmed in BANGLISH_CROP_MAP:
            matched_crop_bn = BANGLISH_CROP_MAP[stemmed]
            break
            
    # 2. Check Bengali substring in query
    if not matched_crop_bn:
        for d in diseases:
            c_bn = d.get("crop_bn", "")
            if c_bn:
                bn_stem = c_bn.replace("ের", "").replace("র", "").strip()
                if bn_stem and (bn_stem in query_or_crop or c_bn in query_or_crop):
                    matched_crop_bn = c_bn
                    break

    # 3. If crop matched, filter and score its diseases
    results = []
    if matched_crop_bn:
        crop_diseases = [
            d for d in diseases 
            if matched_crop_bn in d.get("crop_bn", "") or d.get("crop_bn", "") in matched_crop_bn
        ]
        
        scored = []
        for d in crop_diseases:
            score = 1
            # Prefer matching plant organ
            if plant_part and plant_part in d.get("plant_parts", []):
                score += 10
            
            n_en = d.get("name_en", "").lower()
            n_bn = d.get("name_bn", "").lower()
            symptom_bn = d.get("symptoms_bn", "").lower()
            symptom_en = d.get("symptoms_en", "").lower()
            d_id = d.get("id", "").lower()
            
            for w in words:
                if len(w) > 2 and (w in n_en or w in d_id):
                    score += 6
            for bn_w in query_or_crop.split():
                if len(bn_w) > 2 and (bn_w in n_bn or bn_w in symptom_bn):
                    score += 3
                    
            if visual_traits:
                vt_lower = visual_traits.lower()
                if ("powdery" in vt_lower or "ash" in vt_lower) and ("powdery" in d_id or "mildew" in d_id or "powdery" in n_en):
                    score += 20
                if "scarring" in vt_lower and ("scarring" in n_en or "scarring" in symptom_en or "ক্ষত" in symptom_bn):
                    score += 18
                if "sunken" in vt_lower and ("anthracnose" in d_id or "blight" in d_id or "ডেবে" in symptom_bn):
                    score += 10
                if ("mosaic" in vt_lower or "curl" in vt_lower) and ("virus" in d_id or "curl" in d_id or "mosaic" in d_id):
                    score += 15

            scored.append((score, d))
            
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [s[1] for s in scored]
    else:
        # Match disease name keywords directly across all crops
        scored = []
        for d in diseases:
            score = 0
            n_bn = d.get("name_bn", "").lower()
            n_en = d.get("name_en", "").lower()
            symptom_bn = d.get("symptoms_bn", "").lower()
            symptom_en = d.get("symptoms_en", "").lower()
            p_id = d.get("id", "").lower()
            
            # Organ compatibility
            if plant_part and plant_part != "auto":
                if plant_part in d.get("plant_parts", []):
                    score += 8
                else:
                    score -= 8  # Penalize non-matching organs when organ is specified
                    
            if visual_traits:
                vt_lower = visual_traits.lower()
                if ("powdery" in vt_lower or "ash" in vt_lower) and ("powdery" in p_id or "mildew" in p_id or "powdery" in n_en):
                    score += 25
                if "scarring" in vt_lower and ("scarring" in n_en or "scarring" in symptom_en or "ক্ষত" in symptom_bn):
                    score += 20
                if "sunken" in vt_lower and ("anthracnose" in p_id or "blight" in p_id or "ডেবে" in symptom_bn):
                    score += 10
                if ("mosaic" in vt_lower or "curl" in vt_lower) and ("virus" in p_id or "curl" in p_id or "mosaic" in p_id):
                    score += 15

            if any(term in q_clean for term in [p_id, n_en.split()[0].lower()]):
                score += 15
                
            if score > 0:
                scored.append((score, d))
                
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [s[1] for s in scored]

    # If no results matched, return fallback diseases
    return results[:max_results] if results else diseases[:max_results]

def format_ground_truth_for_prompt(candidates: List[Dict[str, Any]]) -> str:
    """Formats candidate diseases into a compact, authoritative ground truth block for LLM prompts."""
    entries = []
    for c in candidates:
        med_lines = []
        for m in c.get("commercial_medicines", []):
            med_lines.append(
                f"  - Brand: {m.get('brand_name')} | Generic: {m.get('generic_name')} | Company: {m.get('company')} | Dosage (BN): {m.get('dosage_bn')} | Retail Pack Price: ~{m.get('approx_price_bdt')} ৳"
            )
        meds_str = "\n".join(med_lines)
        entry = (
            f"• Disease ID: {c.get('id')}\n"
            f"  Name (Bengali): {c.get('name_bn')}\n"
            f"  Name (English): {c.get('name_en')}\n"
            f"  Crop: {c.get('crop_bn')} ({c.get('crop_en')})\n"
            f"  Pathogen: {c.get('pathogen')}\n"
            f"  Target Organs: {', '.join(c.get('plant_parts', []))}\n"
            f"  Symptoms (DAE): {c.get('symptoms_bn')}\n"
            f"  Approved Commercial Medicines in Bangladesh:\n{meds_str}\n"
            f"  Organic / Cultural Remedy: {c.get('organic_remedy_bn')}\n"
            f"  Safe Pre-Harvest Interval (PHI): {c.get('phi_days')} days\n"
            f"  Weather Spray Advice: {c.get('spray_advice_bn')}"
        )
        entries.append(entry)
    return "\n\n".join(entries)
