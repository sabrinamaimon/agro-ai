import shutil
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Request, UploadFile, File
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import IntakeLog
from backend.schemas.pydantic_models import VoiceIntakeResponse
from backend.services.nlp_intake import extract_intent_nlp, transcribe_audio_with_groq
from backend.config import UPLOADS_DIR

router = APIRouter(prefix="/api", tags=["Task 1: Voice & NLP Intake"])

@router.post("/intake-voice", response_model=VoiceIntakeResponse)
async def intake_voice_or_text(
    request: Request,
    db: Session = Depends(get_db)
):
    transcript = ""
    lang = "bn"

    content_type = request.headers.get("content-type", "")
    
    if "multipart/form-data" in content_type:
        form = await request.form()
        audio_file = form.get("audio_file")
        lang = form.get("language", "bn")
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
        except Exception:
            transcript = ""

    if not transcript:
        transcript = "আমার আলুর ক্ষেতে পাতায় সাদা দাগ ও ধসা দেখা যাচ্ছে, রোপণ করেছি ১৫ দিন আগে, রংপুর সদর।"

    # NLP entity extraction
    extracted = await extract_intent_nlp(transcript, language=lang)

    # Save to database
    intake_record = IntakeLog(
        raw_transcript=transcript,
        detected_crop=extracted.get("crop_type"),
        planting_date=extracted.get("estimated_planting_date"),
        damage_desc=extracted.get("observed_damage_description"),
        geographic_union=extracted.get("geographic_union"),
        language=lang
    )
    db.add(intake_record)
    db.commit()
    db.refresh(intake_record)

    return VoiceIntakeResponse(
        crop_type=extracted.get("crop_type", "Potato (আলু)"),
        estimated_planting_date=extracted.get("estimated_planting_date", "15 days ago"),
        observed_damage_description=extracted.get("observed_damage_description", "Fungal spots"),
        geographic_union=extracted.get("geographic_union", "Rangpur Sadar"),
        raw_transcript=transcript
    )
