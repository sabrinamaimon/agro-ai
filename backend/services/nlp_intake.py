import re
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from backend.config import GROQ_API_KEY, GROQ_LLM_MODEL, GROQ_WHISPER_MODEL

logger = logging.getLogger(__name__)

CROPS_MAP = {
    "potato": "Potato (আলু)",
    "আলু": "Potato (আলু)",
    "alu": "Potato (আলু)",
    "rice": "Rice (ধান)",
    "ধান": "Rice (ধান)",
    "dhan": "Rice (ধান)",
    "paddy": "Rice (ধান)",
    "tomato": "Tomato (টমেটো)",
    "টমেটো": "Tomato (টমেটো)",
    "tometo": "Tomato (টমেটো)",
    "wheat": "Wheat (গম)",
    "গম": "Wheat (গম)",
    "gom": "Wheat (গম)",
    "onion": "Onion (পেঁয়াজ)",
    "পেঁয়াজ": "Onion (পেঁয়াজ)",
    "peyaj": "Onion (পেঁয়াজ)",
    "brinjal": "Brinjal (বেগুন)",
    "বেগুন": "Brinjal (বেগুন)",
    "begun": "Brinjal (বেগুন)",
    "jute": "Jute (পাট)",
    "পাট": "Jute (পাট)",
    "pat": "Jute (পাট)",
    "corn": "Maize (ভুট্টা)",
    "maize": "Maize (ভুট্টা)",
    "ভুট্টা": "Maize (ভুট্টা)",
    "vutta": "Maize (ভুট্টা)"
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
    "ঢাকা": "Dhaka Central"
}

def parse_transcript_rules(transcript: str, language: str = "bn") -> Dict[str, Any]:
    """Fallback rule-based NLP extraction when Groq API is not provided."""
    text_lower = transcript.lower()
    
    # Crop extraction
    detected_crop = "Potato (আলু)"
    for key, val in CROPS_MAP.items():
        if key in text_lower or key in transcript:
            detected_crop = val
            break
            
    # Union extraction
    detected_union = "Rangpur Sadar"
    for key, val in UNIONS_MAP.items():
        if key in text_lower or key in transcript:
            detected_union = val
            break

    # Planting date extraction
    # Look for patterns like "10 days ago", "১০ দিন আগে", "2 weeks ago", "গত সপ্তাহে"
    days_match = re.search(r'(\d+)\s*(days?|দিন|din)', transcript, re.IGNORECASE)
    weeks_match = re.search(r'(\d+)\s*(weeks?|সপ্তাহ|soptaho)', transcript, re.IGNORECASE)
    
    if days_match:
        count = int(days_match.group(1))
        est_date = f"{count} days ago"
    elif weeks_match:
        count = int(weeks_match.group(1))
        est_date = f"{count * 7} days ago"
    elif "গত সপ্তাহে" in transcript or "last week" in text_lower:
        est_date = "7 days ago"
    elif "গত মাসে" in transcript or "last month" in text_lower:
        est_date = "30 days ago"
    else:
        est_date = "15 days ago"

    # Damage description extraction
    observed_damage = transcript.strip()
    if len(observed_damage) < 5:
        observed_damage = "পাতা হলুদ হয়ে পোড়া দাগ ও ছত্রাকের সংক্রমণ দেখা যাচ্ছে" if language == "bn" else "Leaf discoloration with fungal lesion patches"

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
        return "আমার আলুর জমিতে পাতায় সাদা দাগ ও ধসা দেখা যাচ্ছে, রোপণ করেছি ১৫ দিন আগে, রংপুর সদর।"
        
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
        return "আমার আলুর জমিতে পাতায় সাদা দাগ ও ধসা দেখা যাচ্ছে, রোপণ করেছি ১৫ দিন আগে, রংপুর সদর।"

async def extract_intent_nlp(transcript: str, language: str = "bn") -> Dict[str, Any]:
    """Parse raw transcript into structured JSON schema using Groq Llama-3.3 (or rule fallback)."""
    if not GROQ_API_KEY:
        return parse_transcript_rules(transcript, language)

    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        
        system_prompt = (
            "You are an agricultural NLP entity extraction pipeline for Bangladesh farming queries. "
            "Given a farmer's spoken query (in Bengali or English), extract the structured information into valid JSON: "
            "1. 'crop_type': The crop name in English and Bengali, e.g., 'Potato (আলু)', 'Rice (ধান)', 'Tomato (টমেটো)', 'Wheat (গম)'. Default to 'Potato (আলু)' if not mentioned. "
            "2. 'estimated_planting_date': Relative date or duration since planting, e.g. '10 days ago', '2 weeks ago', or date string. "
            "3. 'observed_damage_description': Concise description of symptoms or anomalies observed. "
            "4. 'geographic_union': Upazila, union or district in Bangladesh (e.g., 'Rangpur Sadar', 'Dinajpur Sadar', 'Bogura Sadar'). Default to 'Rangpur Sadar' if unmentioned. "
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
        parsed["raw_transcript"] = transcript
        return parsed

    except Exception as e:
        logger.warning(f"Groq NLP extraction error: {e}. Falling back to rule parser.")
        return parse_transcript_rules(transcript, language)
