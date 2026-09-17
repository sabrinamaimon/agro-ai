import re
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from backend.config import GROQ_API_KEY, GROQ_LLM_MODEL, GROQ_WHISPER_MODEL

logger = logging.getLogger(__name__)

CROPS_MAP = {
    # Fruits
    "banana": "Banana (কলা)",
    "কলা": "Banana (কলা)",
    "কলার": "Banana (কলা)",
    "kola": "Banana (কলা)",
    "kolar": "Banana (কলা)",
    "mango": "Mango (আম)",
    "আম": "Mango (আম)",
    "আমের": "Mango (আম)",
    "am": "Mango (আম)",
    "guava": "Guava (পেয়ারা)",
    "পেয়ারা": "Guava (পেয়ারা)",
    "পেয়ারার": "Guava (পেয়ারা)",
    "papaya": "Papaya (পেঁপে)",
    "পেঁপে": "Papaya (পেঁপে)",
    "পেঁপের": "Papaya (পেঁপে)",
    "pepe": "Papaya (পেঁপে)",
    "lemon": "Lemon (লেবু)",
    "লেবু": "Lemon (লেবু)",
    "লেবুর": "Lemon (লেবু)",
    "lebu": "Lemon (লেবু)",
    "jackfruit": "Jackfruit (কাঁঠাল)",
    "কাঁঠাল": "Jackfruit (কাঁঠাল)",
    "কাঁঠালের": "Jackfruit (কাঁঠাল)",
    "litchi": "Litchi (লিচু)",
    "লিচু": "Litchi (লিচু)",

    # Cereals & Cash crops
    "potato": "Potato (আলু)",
    "আলু": "Potato (আলু)",
    "আলুর": "Potato (আলু)",
    "alu": "Potato (আলু)",
    "aloor": "Potato (আলু)",
    "rice": "Rice (ধান)",
    "ধান": "Rice (ধান)",
    "ধানের": "Rice (ধান)",
    "dhan": "Rice (ধান)",
    "paddy": "Rice (ধান)",
    "wheat": "Wheat (গম)",
    "গম": "Wheat (গম)",
    "গমের": "Wheat (গম)",
    "gom": "Wheat (গম)",
    "corn": "Maize (ভুট্টা)",
    "maize": "Maize (ভুট্টা)",
    "ভুট্টা": "Maize (ভুট্টা)",
    "ভুট্টার": "Maize (ভুট্টা)",
    "vutta": "Maize (ভুট্টা)",
    "jute": "Jute (পাট)",
    "পাট": "Jute (পাট)",
    "পাটের": "Jute (পাট)",
    "pat": "Jute (পাট)",
    "mustard": "Mustard (সরিষা)",
    "সরিষা": "Mustard (সরিষা)",
    "সরিষার": "Mustard (সরিষা)",
    "sorisha": "Mustard (সরিষা)",

    # Vegetables & Spices
    "tomato": "Tomato (টমেটো)",
    "টমেটো": "Tomato (টমেটো)",
    "টমেটোর": "Tomato (টমেটো)",
    "tometo": "Tomato (টমেটো)",
    "brinjal": "Brinjal (বেগুন)",
    "eggplant": "Brinjal (বেগুন)",
    "বেগুন": "Brinjal (বেগুন)",
    "বেগুনের": "Brinjal (বেগুন)",
    "begun": "Brinjal (বেগুন)",
    "chilli": "Chilli (মরিচ)",
    "chili": "Chilli (মরিচ)",
    "pepper": "Chilli (মরিচ)",
    "মরিচ": "Chilli (মরিচ)",
    "মরিচের": "Chilli (মরিচ)",
    "morich": "Chilli (মরিচ)",
    "onion": "Onion (পেঁয়াজ)",
    "পেঁয়াজ": "Onion (পেঁয়াজ)",
    "পেঁয়াজের": "Onion (পেঁয়াজ)",
    "peyaj": "Onion (পেঁয়াজ)",
    "garlic": "Garlic (রসুন)",
    "রসুন": "Garlic (রসুন)",
    "রসুনের": "Garlic (রসুন)",
    "ginger": "Ginger (আদা)",
    "আদা": "Ginger (আদা)",
    "আদার": "Ginger (আদা)",
    "cucumber": "Cucumber (শসা)",
    "শসা": "Cucumber (শসা)",
    "শসার": "Cucumber (শসা)",
    "gourd": "Bottle Gourd (লাউ)",
    "লাউ": "Bottle Gourd (লাউ)",
    "লাউয়ের": "Bottle Gourd (লাউ)",
    "pumpkin": "Pumpkin (মিষ্টি কুমড়া)",
    "কুমড়া": "Pumpkin (মিষ্টি কুমড়া)",
    "cabbage": "Cabbage (বাঁধাকপি)",
    "বাঁধাকপি": "Cabbage (বাঁধাকপি)",
    "cauliflower": "Cauliflower (ফুলকপি)",
    "ফুলকপি": "Cauliflower (ফুলকপি)",
    "bean": "Beans (শিম)",
    "শিম": "Beans (শিম)",
    "চা": "Tea (চা)",
    "tea": "Tea (চা)",
    "পান": "Betel Leaf (পান)"
}

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

def parse_transcript_rules(transcript: str, language: str = "bn", gps_location: Optional[str] = None) -> Dict[str, Any]:
    """Fallback rule-based NLP extraction when Groq API is not provided or fails."""
    text_lower = transcript.lower()
    
    # Accurate Crop extraction
    detected_crop = None
    for key, val in CROPS_MAP.items():
        if key in text_lower or key in transcript:
            detected_crop = val
            break
            
    if not detected_crop:
        detected_crop = "অনির্দিষ্ট ফসল" if language == "bn" else "Unspecified Crop"

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

    # Damage description extraction
    observed_damage = transcript.strip()
    if len(observed_damage) < 5:
        observed_damage = "লক্ষণ পর্যবেক্ষণ করা হয়েছে" if language == "bn" else "Symptoms observed"

    return {
        "crop_type": detected_crop,
        "estimated_planting_date": est_date,
        "observed_damage_description": observed_damage,
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
    """Parse raw transcript into structured JSON schema using Groq LLM (or rule fallback)."""
    if not GROQ_API_KEY:
        return parse_transcript_rules(transcript, language, gps_location)

    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        
        system_prompt = (
            "You are an agricultural NLP entity extraction pipeline for Bangladesh farming queries. "
            "Given a farmer's spoken query (in Bengali or English), extract the structured information into valid JSON: "
            "1. 'crop_type': The specific crop name in English and Bengali, e.g., 'Banana (কলা)', 'Potato (আলু)', 'Rice (ধান)', 'Tomato (টমেটো)', 'Mango (আম)', 'Chilli (মরিচ)'. "
            "   If the user mentions কলা, extract 'Banana (কলা)'. If no crop is mentioned, return 'Unspecified Crop (অনির্দিষ্ট ফসল)'. NEVER default to Potato when another crop is spoken! "
            "2. 'estimated_planting_date': Duration or date since planting (e.g. '15 দিন আগে' or '15 days ago'). If not mentioned in query, return 'উল্লেখ নেই' or 'Not mentioned'. DO NOT return null. "
            "3. 'observed_damage_description': Concise description of symptoms or anomalies observed in the query. "
            f"4. 'geographic_union': If user explicitly mentions a district/union in their query, extract it. Otherwise use the farmer's GPS location: '{gps_location or 'মাঠের লোকেশন সনাক্ত হয়নি'}'. NEVER default to 'Rangpur Sadar' unless explicitly stated! "
            "Output ONLY valid JSON."
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Language: {language}\nTranscript: {transcript}"}
            ],
            model=GROQ_LLM_MODEL,
            response_format={"type": "json_object"},
            temperature=0.1
        )

        response_content = chat_completion.choices[0].message.content
        parsed = json.loads(response_content)
        
        # Ensure all required strings are non-null
        if not parsed.get("crop_type"):
            parsed["crop_type"] = "Banana (কলা)" if "কলা" in transcript else ("অনির্দিষ্ট ফসল" if language == "bn" else "Unspecified Crop")
        if not parsed.get("estimated_planting_date"):
            parsed["estimated_planting_date"] = "উল্লেখ নেই" if language == "bn" else "Not mentioned"
        if not parsed.get("observed_damage_description"):
            parsed["observed_damage_description"] = transcript
        if not parsed.get("geographic_union") or parsed.get("geographic_union") == "Rangpur Sadar" and "রংপুর" not in transcript and "rangpur" not in transcript.lower():
            parsed["geographic_union"] = gps_location or ("মাঠের লোকেশন সনাক্ত হয়নি" if language == "bn" else "Location not set")

        parsed["raw_transcript"] = transcript
        return parsed

    except Exception as e:
        logger.warning(f"Groq NLP extraction error: {e}. Falling back to rule parser.")
        return parse_transcript_rules(transcript, language, gps_location)
