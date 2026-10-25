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

from backend.services.pathology_service import (
    load_pathology_db,
    match_pathologies,
    format_ground_truth_for_prompt
)

@router.post("/agro-chat")
async def agro_chat_endpoint(request: Request):
    """
    Culturally grounded Agro Chatbot with Banglish comprehension,
    neutral respectful greetings, real commercial medicine recommendations,
    and user GPS location microclimate awareness.
    """
    data = await request.json()
    prompt = data.get("prompt", "")
    lang = data.get("language", "bn")
    user_location = data.get("location") or data.get("gpsLocation") or "বাংলাদেশ (Bangladesh)"

    if not prompt or not prompt.strip():
        return {"response": "অনুগ্রহ করে ফসল, সার, বীজ বা রোগবালাই সম্পর্কে আপনার প্রশ্নটি লিখুন।" if lang == "bn" else "Please enter your agricultural query."}

    loc_str = str(user_location) if isinstance(user_location, str) else str(user_location.get("areaName", "বাংলাদেশ"))

    # RAG Retrieval of verified Bangladesh Crop Pathology Ground Truth
    matched_candidates = match_pathologies(query_or_crop=prompt, max_results=3)
    gt_context = format_ground_truth_for_prompt(matched_candidates) if matched_candidates else ""

    if GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)

            grounding_directive = ""
            if gt_context:
                grounding_directive = (
                    f"\nVERIFIED BANGLADESH GROUND TRUTH REPOSITORY (DAE / BARI / BRRI):\n"
                    f"--------------------------------------------------\n"
                    f"{gt_context}\n"
                    f"--------------------------------------------------\n"
                    f"STRICT GROUNDING INSTRUCTIONS:\n"
                    f"1. When the farmer asks about disease diagnosis, pest control, or medicine, you MUST recommend the authentic commercial brand names, companies, exact dilution dosages (e.g. g/L or ml/L), and approximate retail pack prices (৳) provided in the ground truth above.\n"
                    f"2. DO NOT hallucinate fake chemicals, unregistered trade names, or arbitrary dosages.\n"
                    f"3. Always mention the Pre-Harvest Interval (PHI) and organic/cultural control alternatives.\n"
                )

            system_prompt = (
                "You are 'অঙ্কুর (Onkur) কৃষি সহকারী', an expert Senior Agronomist and Plant Pathologist in Bangladesh.\n"
                f"User Field Location: {loc_str}.\n\n"
                "CRITICAL CULTURAL & LINGUISTIC RULES:\n"
                "1. GREETING: If greeting the farmer, use neutral and respectful Bangladeshi agricultural greetings: 'আসসালামু আলাইকুম / শুভদিন! আমি অঙ্কুর কৃষি সহকারী।' NEVER say 'নমস্কার' unless the user specifically used it first.\n"
                "2. BANGLISH COMPREHENSION: Farmers and agriculture students frequently type in phonetic Banglish (e.g., 'alur patay dag ki osudh dibo', 'dhaner poka marar upay ki', 'jomi te ki sar dibo', 'shorishar jab poka', 'shosar patay sada dag'). You MUST understand Banglish perfectly and respond in fluent, natural Bengali (বাংলা) script with warm, concise, and direct practical instructions.\n"
                "3. LOCATION RELEVANCE: Explicitly ground your response in the user's location and its typical agricultural season (Aman, Boro, Rabi, Kharif).\n"
                f"{grounding_directive}\n"
                f"Respond in {'Bengali (বাংলা)' if lang == 'bn' else 'English'}."
            )
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Location: {loc_str}\nFarmer Query: {prompt}"}
                ],
                model=GROQ_LLM_MODEL,
                temperature=0.2
            )
            return {"response": chat_completion.choices[0].message.content}
        except Exception as e:
            logger.warning(f"Groq Chat failed: {e}. Falling back to knowledge-base engine.")

    # Deterministic Fallback matching our authentic Bangladesh Crop Disease Database
    if matched_candidates:
        d = matched_candidates[0]
        meds = d.get("commercial_medicines", [])
        med_text = "\n".join([f"• {m['brand_name']} ({m.get('company','')}): {m.get('dosage_bn', '')} [খুচরা মূল্য: ~{m.get('approx_price_bdt', '')} ৳]" for m in meds])
        organic = d.get("organic_remedy_bn", "")
        return {
            "response": (
                f"শুভদিন! {loc_str} অঞ্চলের {d.get('crop_bn')} ফসলে {d.get('name_bn')} দমনে DAE ও BARI অনুমোদিত সঠিক নির্দেশনা:\n\n"
                f"📋 অনুমোদিত আসল ওষুধ ও ডোজ:\n{med_text}\n\n"
                f"🌿 জৈব প্রতিকার: {organic}\n\n"
                f"⚠️ পরামর্শ: {d.get('spray_advice_bn', '')} ফসল কাটার পূর্বে নিরাপদ বিরতিকাল (PHI) {d.get('phi_days', 10)} দিন মেনে চলুন।"
            )
        }

    return {
        "response": (
            f"শুভদিন! আমি আপনার অঙ্কুর কৃষি সহকারী। {loc_str} এলাকার ফসল, সার ও কীটনাশক সংক্রান্ত পরামর্শে সর্বদা প্রস্তুত। "
            "আপনার নির্দিষ্ট ফসল (যেমন ধান, আলু, টমেটো, বেগুন, সরিষা বা মরিচ) এবং কী সমস্যা বা লক্ষণ দেখা যাচ্ছে তা লিখে জানালে সঠিক ওষুধ, ডোজ ও সার প্রয়োগের তালিকা জানিয়ে দিচ্ছি।"
        )
    }
