import shutil
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Request, UploadFile, File
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import IntakeLog
from backend.schemas.pydantic_models import VoiceIntakeResponse
from backend.services.nlp_intake import extract_intent_nlp, transcribe_audio_with_groq
from backend.config import UPLOADS_DIR, GROQ_API_KEY, GROQ_LLM_MODEL

router = APIRouter(prefix="/api", tags=["Task 1: Voice & NLP Intake & AI Chat"])

@router.post("/intake-voice", response_model=VoiceIntakeResponse)
async def intake_voice_or_text(
    request: Request,
    db: Session = Depends(get_db)
):
    transcript = ""
    lang = "bn"
    gps_location = None

    content_type = request.headers.get("content-type", "")
    
    if "multipart/form-data" in content_type:
        form = await request.form()
        audio_file = form.get("audio_file")
        lang = form.get("language", "bn")
        gps_location = form.get("gps_location") or form.get("gpsLocation")
        if audio_file and hasattr(audio_file, "filename") and audio_file.filename:
            saved_audio = UPLOADS_DIR / audio_file.filename
            with open(saved_audio, "wb") as buffer:
                shutil.copyfileobj(audio_file.file, buffer)
            transcript = await transcribe_audio_with_groq(str(saved_audio), language=lang)
        elif form.get("transcript"):
            transcript = form.get("transcript")
    else:
        try:
            body = await request.json()
            transcript = body.get("transcript", "")
            lang = body.get("language", "bn")
            gps_location = body.get("gps_location") or body.get("gpsLocation")
        except Exception:
            transcript = ""

    if not transcript:
        transcript = "কলার পাতায় কালো দাগ দেখা যাচ্ছে"

    # NLP entity extraction with farmer's GPS location
    extracted = await extract_intent_nlp(transcript, language=lang, gps_location=gps_location)

    crop_type = extracted.get("crop_type") or ("অনির্দিষ্ট ফসল" if lang == "bn" else "Unspecified Crop")
    planting_date = extracted.get("estimated_planting_date") or ("উল্লেখ নেই" if lang == "bn" else "Not mentioned")
    damage_desc = extracted.get("observed_damage_description") or transcript
    union = extracted.get("geographic_union") or gps_location or ("মাঠের লোকেশন সনাক্ত হয়নি" if lang == "bn" else "Location not set")
    query_category = extracted.get("query_category") or ("সাধারণ কৃষি পরামর্শ" if lang == "bn" else "General Advice")
    expert_advisory = extracted.get("expert_advisory")

    # Save to database
    intake_record = IntakeLog(
        raw_transcript=transcript,
        detected_crop=crop_type,
        planting_date=planting_date,
        damage_desc=f"[{query_category}] {damage_desc}",
        geographic_union=union,
        language=lang
    )
    db.add(intake_record)
    db.commit()
    db.refresh(intake_record)

    return VoiceIntakeResponse(
        crop_type=crop_type,
        estimated_planting_date=planting_date,
        observed_damage_description=damage_desc,
        geographic_union=union,
        raw_transcript=transcript,
        query_category=query_category,
        expert_advisory=expert_advisory
    )

@router.post("/agro-chat")
async def agro_chat_endpoint(request: Request):
    """Real AI Agro Chatbot powered by Groq 120B parameter model."""
    data = await request.json()
    prompt = data.get("prompt", "")
    lang = data.get("language", "bn")
    if not prompt:
        return {"response": "অনুগ্রহ করে আপনার প্রশ্ন বা প্রম্পট লিখুন।"}

    if GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)
            system_prompt = (
                "You are Agro-AI, an expert Agricultural AI Assistant for farmers, SAAOs, and agronomists in Bangladesh. "
                "Answer the user's prompt directly, practically, and scientifically in clear language. "
                "Recommend organic biological methods, exact chemical dosages with commercial brands available in Bangladesh (e.g. Indofil M-45, Ridomil Gold, Nativo 75 WG, Tilt 250 EC, Confidor, Virtako), fertilizer schedules, irrigation guidance, or soil management. "
                f"Respond naturally in {'Bengali (বাংলা)' if lang == 'bn' else 'English'}."
            )
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model=GROQ_LLM_MODEL,
                temperature=0.3
            )
            return {"response": chat_completion.choices[0].message.content}
        except Exception as e:
            return {"response": f"AI প্রতিক্রিয়া পেতে সমস্যা হয়েছে: {str(e)}"}

    return {"response": "এআই সেবা এই মুহূর্তে সংযোগ করতে পারছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।"}
