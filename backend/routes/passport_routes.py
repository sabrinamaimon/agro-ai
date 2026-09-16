import urllib.parse
from typing import Optional
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import CropPassport, DiagnosisRecord
from backend.schemas.pydantic_models import TTSRequest, TTSResponse, CropPassportResponse
from backend.services.audio_tts import generate_bengali_speech

router = APIRouter(prefix="/api", tags=["Task 5: Bengali Audio Advisory & Crop Passport"])

@router.post("/tts", response_model=TTSResponse)
async def generate_speech_endpoint(payload: TTSRequest):
    voice = payload.voice or ("bn-BD-PradeepNeural" if payload.language == "bn" else "en-US-GuyNeural")
    audio_url = await generate_bengali_speech(text=payload.text, voice=voice)
    return TTSResponse(audio_url=audio_url)

@router.post("/generate-passport", response_model=CropPassportResponse)
async def generate_passport_endpoint(
    diagnosis_id: Optional[int] = Body(None),
    union: str = Body("Rangpur Sadar"),
    pathogen: str = Body("Potato Late Blight (আলুর লেট ব্লাইট)"),
    severity: str = Body("Severe"),
    damage_pct: float = Body(38.0),
    phi_days: int = Body(14),
    dosage: str = Body("Apply Mancozeb 75% WP @ 2.5g/L"),
    spray_schedule: str = Body("Hold spray today due to rain. Spray tomorrow 07:00 AM."),
    db: Session = Depends(get_db)
):
    # Construct WhatsApp shareable text
    wa_text = (
        f"*Agro-AI Field Health Card (ডিজিটাল ক্রপ পাসপোর্ট)*\n"
        f"🌾 অবস্থান/ইউনিয়ন: {union}\n"
        f"🦠 শনাক্তকৃত রোগ: {pathogen}\n"
        f"⚠️ ক্ষতির মাত্রা: {severity} ({damage_pct}% Leaf Surface)\n"
        f"💊 স্প্রে মাত্রা: {dosage}\n"
        f"⏳ ফসল কাটা নিষেধ (PHI): {phi_days} দিন\n"
        f"🕒 স্প্রে সিডিউল: {spray_schedule}"
    )
    wa_encoded = urllib.parse.quote(wa_text)
    wa_url = f"https://api.whatsapp.com/send?text={wa_encoded}"

    # Generate spoken audio briefing in Bengali
    audio_script = (
        f"জরুরী কৃষি পরামর্শ। আপনার এলাকায় {pathogen} শনাক্ত হয়েছে। "
        f"ক্ষতির মাত্রা {severity}। {spray_schedule} "
        f"ফসল কাটার {phi_days} দিন আগে যেকোনো স্প্রে অবশ্যই বন্ধ রাখুন।"
    )
    audio_url = await generate_bengali_speech(text=audio_script)

    passport_record = CropPassport(
        diagnosis_id=diagnosis_id,
        share_text=wa_text,
        audio_path=audio_url
    )
    db.add(passport_record)
    db.commit()
    db.refresh(passport_record)

    return CropPassportResponse(
        passport_id=passport_record.passport_uuid,
        farmer_union=union,
        diagnosed_pathogen=pathogen,
        damage_severity=severity,
        damage_percentage=damage_pct,
        phi_days=phi_days,
        dosage_guide=dosage,
        spray_schedule=spray_schedule,
        audio_briefing_url=audio_url,
        whatsapp_share_url=wa_url
    )
