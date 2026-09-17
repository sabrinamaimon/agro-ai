import re
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from backend.config import GROQ_API_KEY, GROQ_LLM_MODEL, GROQ_WHISPER_MODEL

logger = logging.getLogger(__name__)

# Comprehensive Agricultural Crop Dictionary for Bangladesh Farming
CROP_DICTIONARY = {
    "Brinjal (বেগুন)": [
        "বেগুন", "বেগুনের", "বেগুনগাছ", "বেগুনগাছে", "বেগুনগাছের", "বেগুনক্ষেত", "বেগুনখেত",
        "brinjal", "brinjals", "eggplant", "eggplants", "aubergine", "begun", "beguner"
    ],
    "Banana (কলা)": [
        "কলা", "কলার", "কলাগাছ", "কলাগাছে", "কলাগাছের", "কলাবাগান",
        "banana", "bananas", "kola", "kolar"
    ],
    "Potato (আলু)": [
        "আলু", "আলুর", "আলুগাছ", "আলুরক্ষেত", "আলুরখেত", "আলুক্ষেত", "আলুখেত",
        "potato", "potatoes", "alu", "aloor"
    ],
    "Rice (ধান)": [
        "ধান", "ধানের", "ধানগাছ", "ধানক্ষেত", "ধানখেত", "বোরো", "আমন", "আউশ",
        "rice", "paddy", "dhan", "dhaner"
    ],
    "Wheat (গম)": [
        "গম", "গমের", "গমগাছ", "গমক্ষেত", "গমখেত",
        "wheat", "gom", "gomer"
    ],
    "Maize (ভুট্টা)": [
        "ভুট্টা", "ভুট্টার", "ভুট্টাগাছ", "ভুট্টাক্ষেত", "ভুট্টাখেত",
        "maize", "corn", "vutta", "vuttar", "bhutta"
    ],
    "Tomato (টমেটো)": [
        "টমেটো", "টমেটোর", "টমেটোগাছ", "টমেটোরখেত", "টমেটোরক্ষেত",
        "tomato", "tomatoes", "tometo"
    ],
    "Chilli (মরিচ)": [
        "মরিচ", "মরিচের", "মরিচগাছ", "কাঁচামরিচ", "কাঁচা মরিচ",
        "chilli", "chili", "pepper", "peppers", "morich", "moricher"
    ],
    "Onion (পেঁয়াজ)": [
        "পেঁয়াজ", "পেঁয়াজের", "পিয়াজ", "পিয়াজের", "পেয়াজ", "পেয়াজের",
        "onion", "onions", "peyaj", "peyajer"
    ],
    "Garlic (রসুন)": [
        "রসুন", "রসুনের", "garlic", "roshun", "roshuner"
    ],
    "Ginger (আদা)": [
        "আদা", "আদার", "ginger", "ada", "adar"
    ],
    "Cucumber (শসা)": [
        "শসা", "শসার", "শশাগাছ", "cucumber", "cucumbers", "shosha"
    ],
    "Bottle Gourd (লাউ)": [
        "লাউ", "লাউয়ের", "লাউগাছ", "gourd", "bottle gourd", "lau"
    ],
    "Pumpkin (মিষ্টি কুমড়া)": [
        "মিষ্টি কুমড়া", "মিষ্টি কুমড়ার", "মিষ্টিকুমড়া", "মিষ্টিকুমড়ার", "কুমড়া", "কুমড়ার",
        "pumpkin", "pumpkins", "kumra"
    ],
    "Cabbage (বাঁধাকপি)": [
        "বাঁধাকপি", "বাঁধাকপির", "cabbage", "badhakopi"
    ],
    "Cauliflower (ফুলকপি)": [
        "ফুলকপি", "ফুলকপির", "cauliflower", "phulkopi"
    ],
    "Beans (শিম)": [
        "শিম", "শিমের", "শিমগাছ", "bean", "beans", "shim"
    ],
    "Jute (পাট)": [
        "পাট", "পাটের", "পাটগাছ", "পাটক্ষেত", "পাটখেত", "jute", "pat"
    ],
    "Mustard (সরিষা)": [
        "সরিষা", "সরিষার", "সরিষাখেত", "সরিষাক্ষেত", "সরষে", "mustard", "sorisha"
    ],
    "Mango (আম)": [
        "আম", "আমের", "আমগাছ", "আমগাছে", "আমগাছের", "আমবাগান",
        "mango", "mangoes", "mangos", "am", "amer"
    ],
    "Guava (পেয়ারা)": [
        "পেয়ারা", "পেয়ারার", "পেয়ারা", "পেয়ারার", "guava", "peyara"
    ],
    "Papaya (পেঁপে)": [
        "পেঁপে", "পেঁপের", "পেপে", "পেপের", "papaya", "pepe"
    ],
    "Lemon (লেবু)": [
        "লেবু", "লেবুর", "লেবুগাছ", "lemon", "lime", "lebu"
    ],
    "Jackfruit (কাঁঠাল)": [
        "কাঁঠাল", "কাঁঠালের", "কাঁঠালগাছ", "jackfruit", "kathal"
    ],
    "Litchi (লিচু)": [
        "লিচু", "লিচুর", "লিচুগাছ", "litchi", "lychee", "lichu"
    ],
    "Watermelon (তরমুজ)": [
        "তরমুজ", "তরমুজের", "watermelon", "tormuj"
    ],
    "Betel Leaf (পান)": [
        "পান", "পানের", "পানগাছ", "পানবরজ", "পানপাতা", "betel", "betel leaf", "pan"
    ],
    "Tea (চা)": [
        "চা", "চায়ের", "চায়ের", "চাবাগান", "চা-বাগান", "tea"
    ]
}

# Legacy flat map for backward compatibility
CROPS_MAP = {}
for crop_name, tokens in CROP_DICTIONARY.items():
    for token in tokens:
        CROPS_MAP[token] = crop_name

UNIONS_MAP = {
    "rangpur": "Rangpur Sadar",
    "রংপুর": "Rangpur Sadar",
    "dinajpur": "Dinajpur Sadar",
    "দিনাজপুর": "Dinajpur Sadar",
    "bogura": "Bogura Sadar",
    "বগুড়া": "Bogura Sadar",
    "rajshahi": "Rajshahi Sadar",
    "রাজশাহী": "Rajshahi Sadar",
    "jashore": "Jessore Sadar",
    "যশোর": "Jessore Sadar",
    "jessore": "Jessore Sadar",
    "mymensingh": "Mymensingh Sadar",
    "ময়মনসিংহ": "Mymensingh Sadar",
    "cumilla": "Cumilla Sadar",
    "কুমিল্লা": "Cumilla Sadar",
    "dhaka": "Dhaka Central",
    "ঢাকা": "Dhaka Central",
    "sylhet": "Sylhet Sadar",
    "সিলেট": "Sylhet Sadar",
    "khulna": "Khulna Sadar",
    "খুলনা": "Khulna Sadar",
    "barishal": "Barishal Sadar",
    "বরিশাল": "Barishal Sadar",
    "chattogram": "Chattogram Sadar",
    "চট্টগ্রাম": "Chattogram Sadar"
}

def detect_crop_from_text(text: str, desc: str = "", llm_crop: Optional[str] = None) -> Optional[str]:
    """
    Robust word-boundary and token-aware agricultural crop detection.
    Prevents false substring matches (e.g. prevents 'আমার' matching 'আম', or 'পানি' matching 'পান').
    """
    # 1. If LLM suggested a crop, check if it maps to any known crop in dictionary
    if llm_crop and "unspecified" not in llm_crop.lower() and "অনির্দিষ্ট" not in llm_crop:
        llm_crop_lower = llm_crop.lower().strip()
        for crop_name, tokens in CROP_DICTIONARY.items():
            if crop_name.lower() == llm_crop_lower or any(tok.lower() == llm_crop_lower for tok in tokens):
                return crop_name
            if any(tok.lower() in llm_crop_lower for tok in tokens):
                return crop_name
        if "(" in llm_crop and ")" in llm_crop:
            return llm_crop

    # 2. Check input query and symptoms description
    combined = f"{text} {desc}".strip().lower()
    if not combined:
        return None

    # Tokenize into words to respect word boundaries in Bengali and English
    words = set(re.findall(r"[\w\u0980-\u09FF]+", combined))

    # A. Multi-word phrases first (e.g. "মিষ্টি কুমড়া", "কাঁচা মরিচ", "bottle gourd", "betel leaf")
    for crop_name, tokens in CROP_DICTIONARY.items():
        for token in tokens:
            if " " in token and token.lower() in combined:
                return crop_name

    # B. Single-word token match against word tokens
    for crop_name, tokens in CROP_DICTIONARY.items():
        for token in tokens:
            if " " not in token and token.lower() in words:
                return crop_name

    return None

def parse_transcript_rules(transcript: str, language: str = "bn", gps_location: Optional[str] = None) -> Dict[str, Any]:
    """Fallback rule-based NLP extraction when Groq API is not provided or fails."""
    text_lower = transcript.lower()
    
    # Accurate Crop extraction
    detected_crop = detect_crop_from_text(transcript) or ("অনির্দিষ্ট ফসল" if language == "bn" else "Unspecified Crop")

    # Union extraction: only set if explicitly found in query, otherwise use GPS location
    detected_union = None
    for key, val in UNIONS_MAP.items():
        if key in text_lower or key in transcript:
            detected_union = val
            break
            
    if not detected_union:
        detected_union = gps_location or ("মাঠের লোকেশন সনাক্ত হয়নি" if language == "bn" else "Location not set")

    # Planting date extraction
    days_match = re.search(r'(\d+)\s*(days?|দিন|din)', transcript, re.IGNORECASE)
    weeks_match = re.search(r'(\d+)\s*(weeks?|সপ্তাহ|soptaho)', transcript, re.IGNORECASE)
    
    if days_match:
        count = int(days_match.group(1))
        est_date = f"{count} দিন আগে" if language == "bn" else f"{count} days ago"
    elif weeks_match:
        count = int(weeks_match.group(1))
        est_date = f"{count} সপ্তাহ আগে" if language == "bn" else f"{count * 7} days ago"
    elif "গত সপ্তাহে" in transcript or "last week" in text_lower:
        est_date = "গত সপ্তাহে" if language == "bn" else "7 days ago"
    elif "গত মাসে" in transcript or "last month" in text_lower:
        est_date = "গত মাসে" if language == "bn" else "30 days ago"
    else:
        est_date = "উল্লেখ নেই" if language == "bn" else "Not mentioned"

    # Detect Query Category
    if any(w in text_lower for w in ["সার", "ইউরিয়া", "টিএসপি", "পটাশ", "জিপসাম", "সার দেওয়া", "fertilizer", "urea", "dap"]):
        query_category = "সার ও পুষ্টি ব্যবস্থাপনা" if language == "bn" else "Fertilizer & Soil Nutrition"
        advisory = (
            f"{detected_crop} চাষে সঠিক মাত্রায় ইউরিয়া, টিএসপি, এমওপি এবং জৈব সার জমি তৈরির সময় ও বৃদ্ধির পর্যায়ে সুষমভাবে প্রয়োগ করুন।"
            if language == "bn" else f"Apply balanced N-P-K and organic manure for {detected_crop} according to growth stages."
        )
    elif any(w in text_lower for w in ["কীটনাশক", "স্প্রে", "পোকামাকড়", "পোকা", "বালাই", "বিষ", "pesticide", "insecticide", "spray", "pest"]):
        query_category = "কীটনাশক ও বালাই দমন" if language == "bn" else "Pest & Disease Control"
        advisory = (
            f"{detected_crop} গাছে বালাই দমনে আক্রান্ত অংশ অপসারণ করুন এবং অনুমোদিত বালাইনাশক বিকেলে সঠিক মাত্রায় স্প্রে করুন।"
            if language == "bn" else f"Remove affected plant parts and spray approved pest controls for {detected_crop} in the late afternoon."
        )
    elif any(w in text_lower for w in ["বৃষ্টি", "আবহাওয়া", "সেচ", "পানি", "খরা", "weather", "rain", "irrigation"]):
        query_category = "আবহাওয়া ও সেচ" if language == "bn" else "Weather & Irrigation"
        advisory = (
            "আবহাওয়ার পূর্বাভাস দেখে সেচ দিন। বৃষ্টিপাতের সম্ভাবনা থাকলে সেচ স্থগিত রাখুন এবং জমিতে অতিরিক্ত পানি নিষ্কাশনের ব্যবস্থা রাখুন।"
            if language == "bn" else "Check weather forecast before irrigation. Delay watering if rain is anticipated and ensure drainage."
        )
    elif any(w in text_lower for w in ["মাটি", "জমি", "দোআঁশ", "চাষ", "বেলে", "soil", "land", "plow", "tillage"]):
        query_category = "জমি ও মাটি প্রস্তুতি" if language == "bn" else "Land & Soil Preparation"
        advisory = (
            "জমি ভালোভাবে ৩-৪ বার চাষ ও মই দিয়ে ঝুরঝুরে করে নিন। জমিতে পর্যাপ্ত পচা গোবর বা জৈব সার মিশিয়ে দিলে ফলন বৃদ্ধি পায়।"
            if language == "bn" else "Plow and harrow land 3-4 times. Incorporate well-rotted organic compost for best yield."
        )
    else:
        query_category = "রোগ ও লক্ষণ সনাক্তকরণ" if language == "bn" else "Crop Health & Symptoms"
        advisory = (
            f"{detected_crop} ফসলের লক্ষণ পর্যবেক্ষণ করে আক্রান্ত অংশ সংগ্রহ করুন এবং নিকটস্থ কৃষি কর্মকর্তার সাথে পরামর্শ করে ব্যবস্থা নিন।"
            if language == "bn" else f"Monitor {detected_crop} symptoms carefully and apply recommended cultural or chemical practices."
        )

    # Damage / query description extraction
    observed_damage = transcript.strip()
    if len(observed_damage) < 5:
        observed_damage = "লক্ষণ পর্যবেক্ষণ করা হয়েছে" if language == "bn" else "Symptoms observed"

    return {
        "query_category": query_category,
        "crop_type": detected_crop,
        "estimated_planting_date": est_date,
        "observed_damage_description": observed_damage,
        "expert_advisory": advisory,
        "geographic_union": detected_union,
        "raw_transcript": transcript
    }

async def transcribe_audio_with_groq(audio_file_path: str, language: str = "bn") -> str:
    """Speech-to-text using Groq Whisper API."""
    if not GROQ_API_KEY:
        logger.warning("GROQ_API_KEY not found. Using fallback text.")
        return "কলার পাতায় কালো দাগ দেখা যাচ্ছে।"
        
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        with open(audio_file_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=f,
                model=GROQ_WHISPER_MODEL,
                language="bn" if language == "bn" else "en",
                response_format="text"
            )
        return str(transcription)
    except Exception as e:
        logger.error(f"Groq Whisper transcription failed: {e}")
        return "কলার পাতায় কালো দাগ দেখা যাচ্ছে।"

async def extract_intent_nlp(transcript: str, language: str = "bn", gps_location: Optional[str] = None) -> Dict[str, Any]:
    """Parse raw transcript into structured JSON schema and comprehensive agricultural advice using Groq LLM."""
    if not GROQ_API_KEY:
        return parse_transcript_rules(transcript, language, gps_location)

    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        
        system_prompt = (
            f"You are Agro-AI, an expert Agricultural NLP and Advisory system for farmers and agronomists in Bangladesh.\n"
            f"Farmers may speak or write queries in {'Bengali (বাংলা)' if language == 'bn' else 'English'} on ANY farming topic:\n"
            f" - সার ও পুষ্টি ব্যবস্থাপনা (Fertilizer doses: Urea, TSP, DAP, MoP, Gypsum, Zinc, Boron, compost, application schedules)\n"
            f" - কীটনাশক ও বালাই দমন (Pesticides, insecticides, fungicides with registered Bangladesh brands like Indofil, Ridomil Gold, Tilt, Confidor, Virtako, Karate, Voliam Flexi, dosage per liter/decimal)\n"
            f" - জমি ও মাটি প্রস্তুতি (Land preparation, plowing, leveling, cow dung, soil types like sandy loam / দোআঁশ, pH, drainage)\n"
            f" - আবহাওয়া ও সেচ (Weather risk, rain timing, irrigation precaution, waterlogging)\n"
            f" - রোগবালাই ও লক্ষণ (Disease symptoms, blight, rot, leaf curl, wilts)\n"
            f" - অন্যান্য সাধারণ কৃষি প্রশ্ন (Crop varieties, seed germination, market timing)\n\n"
            f"Extract structured information into valid JSON with these fields:\n"
            f"1. 'query_category': Category in {'Bengali' if language == 'bn' else 'English'}, one of:\n"
            f"   ['সার ও পুষ্টি ব্যবস্থাপনা', 'কীটনাশক ও বালাই দমন', 'আবহাওয়া ও সেচ', 'জমি ও মাটি প্রস্তুতি', 'রোগ ও লক্ষণ সনাক্তকরণ', 'সাধারণ কৃষি পরামর্শ']\n"
            f"2. 'crop_type': The specific crop name in 'English (বাংলা)' format (e.g. 'Brinjal (বেগুন)', 'Banana (কলা)', 'Potato (আলু)', 'Rice (ধান)', 'Tomato (টমেটো)', 'Mango (আম)', 'Chilli (মরিচ)', 'Wheat (গম)', 'Maize (ভুট্টা)'). If no specific crop is mentioned (e.g. general soil, rain, or farming question), return 'অনির্দিষ্ট ফসল'.\n"
            f"3. 'estimated_planting_date': Duration or date if mentioned (e.g. '১৫ দিন আগে'). If not stated, return 'উল্লেখ নেই'. DO NOT return null.\n"
            f"4. 'observed_damage_description': Concise summary of what the farmer is asking or observing in {'Bengali (বাংলা)' if language == 'bn' else 'English'}.\n"
            f"5. 'expert_advisory': Comprehensive, highly practical, and actionable answer/solution for the farmer in {'clear fluent Bengali (বাংলা)' if language == 'bn' else 'English'}. Include specific brand names, dosages per decimal/bigha/liter, spray timing, or cultural steps.\n"
            f"6. 'geographic_union': Use the farmer's GPS location: '{gps_location or ('মাঠের লোকেশন সনাক্ত হয়নি' if language == 'bn' else 'Location not set')}' unless they named another area in query. NEVER invent 'Rangpur Sadar'!\n"
            f"Output ONLY valid JSON."
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Language: {language}\nFarmer Query: {transcript}\nFarmer Location: {gps_location or 'GPS'}"}
            ],
            model=GROQ_LLM_MODEL,
            response_format={"type": "json_object"},
            temperature=0.2
        )

        response_content = chat_completion.choices[0].message.content
        parsed = json.loads(response_content)
        
        # Deterministically resolve crop name using CROP_DICTIONARY + LLM output
        llm_crop = parsed.get("crop_type")
        llm_desc = parsed.get("observed_damage_description", "")
        detected_crop = detect_crop_from_text(transcript, desc=llm_desc, llm_crop=llm_crop)

        if detected_crop:
            parsed["crop_type"] = detected_crop
        elif llm_crop and "unspecified" not in llm_crop.lower() and "অনির্দিষ্ট" not in llm_crop:
            parsed["crop_type"] = llm_crop
        else:
            parsed["crop_type"] = "Unspecified Crop (অনির্দিষ্ট ফসল)" if language == "en" else "অনির্দিষ্ট ফসল"

        # Ensure query_category
        if not parsed.get("query_category"):
            parsed["query_category"] = "সাধারণ কৃষি পরামর্শ" if language == "bn" else "General Agricultural Advice"

        # Ensure expert_advisory
        if not parsed.get("expert_advisory"):
            rule_fallback = parse_transcript_rules(transcript, language, gps_location)
            parsed["expert_advisory"] = rule_fallback.get("expert_advisory")

        # Ensure all required strings are non-null and properly localized
        if not parsed.get("estimated_planting_date"):
            parsed["estimated_planting_date"] = "উল্লেখ নেই" if language == "bn" else "Not mentioned"
            
        if not parsed.get("observed_damage_description"):
            parsed["observed_damage_description"] = transcript
            
        if not parsed.get("geographic_union") or (parsed.get("geographic_union") == "Rangpur Sadar" and "রংপুর" not in transcript and "rangpur" not in transcript.lower()):
            parsed["geographic_union"] = gps_location or ("মাঠের লোকেশন সনাক্ত হয়নি" if language == "bn" else "Location not set")

        parsed["raw_transcript"] = transcript
        return parsed

    except Exception as e:
        logger.warning(f"Groq NLP extraction error: {e}. Falling back to rule parser.")
        return parse_transcript_rules(transcript, language, gps_location)
