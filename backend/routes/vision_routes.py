import shutil
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import DiagnosisRecord, AdvisoryPlan
from backend.services.vision_engine import analyze_leaf_image, diagnose_pathology_with_ai
from backend.services.weather_service import fetch_weather
from backend.services.anomaly_detector import analyze_price_anomaly
from backend.config import UPLOADS_DIR, DATA_DIR

router = APIRouter(prefix="/api", tags=["Task 2: Visual CV Disease Detection"])

@router.post("/diagnose-vision")
async def diagnose_leaf_image_endpoint(
    image: Optional[UploadFile] = File(None),
    sampleId: Optional[str] = Form(None),
    cropType: Optional[str] = Form(None),
    union: Optional[str] = Form("Rangpur Sadar"),
    language: Optional[str] = Form("bn"),
    db: Session = Depends(get_db)
):
    filename = "potato_late_blight.jpg"
    image_bytes = b""

    if image and image.filename:
        filename = image.filename
        image_bytes = await image.read()
        # Save original upload
        saved_file = UPLOADS_DIR / filename
        with open(saved_file, "wb") as f:
            f.write(image_bytes)
    elif sampleId and "rice" in str(sampleId).lower():
        filename = "rice_blast.jpg"
        sample_path = DATA_DIR / "samples" / filename
        if sample_path.exists():
            with open(sample_path, "rb") as f:
                image_bytes = f.read()
        if not cropType:
            cropType = "Rice (ধান)"
    else:
        filename = "potato_late_blight.jpg"
        sample_path = DATA_DIR / "samples" / filename
        if sample_path.exists():
            with open(sample_path, "rb") as f:
                image_bytes = f.read()
        if not cropType:
            cropType = "Potato (আলু)"

    # 1. Run Physical Computer Vision Pipeline (OpenCV)
    cv_result = analyze_leaf_image(image_bytes, filename=filename)

    # 2. Fetch Live Hyperlocal Weather (Open-Meteo)
    target_union = union or "Rangpur Sadar"
    weather = fetch_weather(target_union)

    # 3. Dynamic Multimodal AI Pathology & Agronomic Reasoning (Groq 120B)
    diagnosis = await diagnose_pathology_with_ai(
        cv_metrics=cv_result,
        crop_hint=cropType,
        weather_data=weather,
        union_name=target_union,
        language=language or "bn"
    )

    # 4. Market Price Anomaly Check for Detected Crop (DAM Isolation Forest)
    market = analyze_price_anomaly(diagnosis.get("cropType", "Potato"), 20.0)

    # 5. Save to Relational Database
    diagnosis_entry = DiagnosisRecord(
        original_image_path=f"/static/uploads/{filename}",
        annotated_image_path=cv_result.get("annotated_file_path"),
        pathogen_name=diagnosis.get("name"),
        scientific_name=diagnosis.get("pathogen"),
        crop_type=diagnosis.get("cropType"),
        damage_percentage=cv_result.get("damagePercentage"),
        severity_level=diagnosis.get("severity"),
        bounding_boxes=cv_result.get("bounding_boxes", [])
    )
    db.add(diagnosis_entry)
    db.commit()
    db.refresh(diagnosis_entry)

    advisory_entry = AdvisoryPlan(
        diagnosis_id=diagnosis_entry.id,
        temp_celsius=weather.get("temperature"),
        humidity_pct=weather.get("humidity"),
        weather_condition=weather.get("condition"),
        rain_in_hours=weather.get("rainInHours"),
        root_cause=diagnosis.get("root_cause"),
        organic_control=diagnosis.get("organicRemedy"),
        chemical_control=diagnosis.get("chemicalRemedy"),
        phi_days=diagnosis.get("phiDays", 14),
        spray_schedule=diagnosis.get("sprayAdvice"),
        spray_safety=weather.get("spraySafety")
    )
    db.add(advisory_entry)
    db.commit()

    return {
        "id": diagnosis.get("id"),
        "name": diagnosis.get("name"),
        "cropType": diagnosis.get("cropType"),
        "pathogen": diagnosis.get("pathogen"),
        "severity": diagnosis.get("severity"),
        "damagePercentage": cv_result.get("damagePercentage"),
        "union": target_union,
        "plantingDate": "15 days ago",
        "description": diagnosis.get("description"),
        "root_cause": diagnosis.get("root_cause"),
        "image": f"/static/uploads/{filename}",
        "annotated_image": cv_result.get("annotated_image"),
        "bounding_boxes": cv_result.get("bounding_boxes", []),
        "weather": weather,
        "organicRemedy": diagnosis.get("organicRemedy"),
        "chemicalRemedy": diagnosis.get("chemicalRemedy"),
        "phiDays": diagnosis.get("phiDays", 14),
        "sprayAdvice": diagnosis.get("sprayAdvice"),
        "market": market
    }
