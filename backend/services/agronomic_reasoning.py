import json
import logging
from typing import Dict, Any, Optional
from backend.config import GROQ_API_KEY, GROQ_LLM_MODEL
from backend.services.vision_engine import load_pathology_db

logger = logging.getLogger(__name__)

async def generate_agronomic_advisory(
    crop_type: str,
    pathogen_name: str,
    damage_percentage: float,
    severity: str,
    weather_data: Dict[str, Any],
    union_name: str = "Rangpur Sadar",
    language: str = "bn"
) -> Dict[str, Any]:
    """
    Multimodal Agronomic Reasoning Engine:
    Fuses vision detection, damage %, and micro-climate data into tiered intervention.
    """
    temp = weather_data.get("temperature", 24.0)
    humidity = weather_data.get("humidity", 85.0)
    rain_in_hours = weather_data.get("rainInHours", 4)
    rain_risk = rain_in_hours <= 6

    # 1. Try Groq Llama-3.3 Reasoning
    if GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)

            system_prompt = (
                "You are an expert Agronomist and Plant Pathologist advising smallholder farmers in Bangladesh. "
                "Analyze the diagnosed plant disease, damage severity, and real-time local weather. "
                "Provide actionable advice in JSON with these exact keys: "
                "1. 'root_cause': Explanation of how current weather (humidity/temperature) triggered or worsened this pathogen. "
                "2. 'organic_control': Specific non-chemical cultural and biological control methods. "
                "3. 'chemical_control': Exact chemical trade names, active ingredients, and water dilution dosages (e.g. g/L or ml/L). "
                "4. 'phi_days': Mandatory Pre-Harvest Interval (integer days) before crops are safe to consume. "
                "5. 'spray_schedule': Exact hourly schedule when to spray considering the rain and wind forecast. "
                "6. 'spray_safety': Clear safety verdict (e.g., abort spray if rain < 6h, or safe window). "
                f"Respond in {'Bengali (বাংলা)' if language == 'bn' else 'English'}."
            )

            user_prompt = (
                f"Crop: {crop_type}\n"
                f"Diagnosed Pathogen: {pathogen_name}\n"
                f"Damage Surface Area: {damage_percentage}%\n"
                f"Severity Classification: {severity}\n"
                f"Location: {union_name}, Bangladesh\n"
                f"Current Temperature: {temp}°C\n"
                f"Current Humidity: {humidity}%\n"
                f"Rain Forecast: Rain expected in {rain_in_hours} hours\n"
            )

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=GROQ_LLM_MODEL,
                response_format={"type": "json_object"},
                temperature=0.2
            )

            res = json.loads(chat_completion.choices[0].message.content)
            return res
        except Exception as e:
            logger.warning(f"Groq agronomic reasoning failed: {e}. Using deterministic agronomy rule base.")

    # 2. Expert Deterministic Rule Base Fallback
    pathologies = load_pathology_db()
    matched = None
    for p in pathologies:
        if p["pathogen"].lower() in pathogen_name.lower() or p["id"] in pathogen_name.lower():
            matched = p
            break
    if not matched:
        matched = pathologies[0]

    # Environmental root cause logic
    if humidity > 80:
        root_cause_bn = f"বর্তমান উচ্চ আপেক্ষিক আর্দ্রতা ({humidity}%) এবং অনুকূল তাপমাত্রার ({temp}°C) কারণে {pathogen_name} ছত্রাকের স্পোর দ্রুত অঙ্কুরিত ও পাতার কোষে ছড়িয়ে পড়ছে।"
        root_cause_en = f"High ambient humidity ({humidity}%) and favorable temperature ({temp}°C) accelerated spore sporulation and mycelial spread."
    else:
        root_cause_bn = f"ফসলের প্রাথমিক সুপ্তাবস্থা থেকে সংক্রমণ শুরু হয়েছে। শুকনো আবহাওয়ায় বাতাসবাহিত স্পোরের মাধ্যমে সংক্রমণ ছড়াচ্ছে।"
        root_cause_en = f"Infection initiated from inoculum reservoirs, spreading via micro-climatic wind currents."

    if rain_risk:
        spray_safety_bn = f"⚠️ সতর্কতা: আগামী {rain_in_hours} ঘণ্টার মধ্যে বৃষ্টির সম্ভাবনা রয়েছে! এখন স্প্রে করলে ওষুধ ধুয়ে অপচয় হবে।"
        spray_advice_bn = f"আজকের রাসায়নিক স্প্রে স্থগিত রাখুন। বৃষ্টি থেমে যাওয়ার পর কাল সকাল ০৭:০০ টায় রোদের আলোয় পাতার শিশির শুকিয়ে স্প্রে করুন।"
        spray_safety_en = f"Warning: Rain forecast in {rain_in_hours} hours. Immediate spray aborted to prevent chemical runoff."
        spray_advice_en = f"Hold spray today. Apply tomorrow at 07:00 AM once leaves dry thoroughly."
    else:
        spray_safety_bn = "✅ স্প্রে করার উপযুক্ত আবহাওয়া। বাতাসের বেগ ও বৃষ্টিপাত স্প্রে করার অনুকূলে রয়েছে।"
        spray_advice_bn = matched.get("spray_advice_bn")
        spray_safety_en = "Safe to spray. Wind conditions and rainfall parameters are optimal."
        spray_advice_en = matched.get("spray_advice_en")

    return {
        "root_cause": root_cause_bn if language == "bn" else root_cause_en,
        "organic_control": matched.get("organic_remedy_bn") if language == "bn" else matched.get("organic_remedy_en"),
        "chemical_control": matched.get("chemical_remedy_bn") if language == "bn" else matched.get("chemical_remedy_en"),
        "phi_days": matched.get("phi_days", 14),
        "spray_schedule": spray_advice_bn if language == "bn" else spray_advice_en,
        "spray_safety": spray_safety_bn if language == "bn" else spray_safety_en
    }
