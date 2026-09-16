import shutil
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import DiagnosisRecord, AdvisoryPlan
from backend.services.vision_engine import analyze_leaf_image
from backend.services.weather_service import fetch_weather
from backend.services.agronomic_reasoning import generate_agronomic_advisory
from backend.services.anomaly_detector import analyze_price_anomaly
from backend.config import UPLOADS_DIR

router = APIRouter(prefix="/api", tags=["Task 2: Visual CV Disease Detection"])

@router.post("/diagnose-vision")
async def diagnose_leaf_image_endpoint(
    image: Optional[UploadFile] = File(None),
    sampleId: Optional[str] = Form(None),
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
    else:
        # Fallback synthesized sample leaf
        import numpy as np, cv2
        blank_leaf = np.zeros((400, 400, 3), dtype=np.uint8)
        # Draw green leaf polygon
        cv2.ellipse(blank_leaf, (200, 200), (120, 180), 30, 0, 360, (34, 139, 34), -1)
        # Draw brown lesions
        cv2.circle(blank_leaf, (170, 160), 35, (19, 69, 139), -1)
        cv2.circle(blank_leaf, (220, 230), 25, (19, 69, 139), -1)
        _, buffer = cv2.imencode('.jpg', blank_leaf)
        image_bytes = buffer.tobytes()

    # 1. Run Computer Vision Pipeline
    cv_result = analyze_leaf_image(image_bytes, filename=filename)

    # 2. Fetch Hyperlocal Weather
    target_union = union or "Rangpur Sadar"
    weather = fetch_weather(target_union)

    # 3. Multimodal Agronomic Reasoning
    advisory = await generate_agronomic_advisory(
        crop_type=cv_result["cropType"],
        pathogen_name=cv_result["pathogen"],
        damage_percentage=cv_result["damagePercentage"],
        severity=cv_result["severity"],
        weather_data=weather,
        union_name=target_union,
        language=language or "bn"
    )

    # 4. Market Baseline Check
    market = analyze_price_anomaly(cv_result["cropType"], 20.0)

    # 5. Save to Database
    diagnosis_entry = DiagnosisRecord(
        original_image_path=f"/static/uploads/{filename}",
        annotated_image_path=cv_result.get("annotated_file_path"),
        pathogen_name=cv_result["name"],
        scientific_name=cv_result["pathogen"],
        crop_type=cv_result["cropType"],
        damage_percentage=cv_result["damagePercentage"],
        severity_level=cv_result["severity"],
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
        root_cause=advisory.get("root_cause"),
        organic_control=advisory.get("organic_control"),
        chemical_control=advisory.get("chemical_control"),
        phi_days=advisory.get("phi_days", 14),
        spray_schedule=advisory.get("spray_schedule"),
        spray_safety=advisory.get("spray_safety")
    )
    db.add(advisory_entry)
    db.commit()

    return {
        "id": cv_result.get("id"),
        "name": cv_result.get("name"),
        "cropType": cv_result.get("cropType"),
        "pathogen": cv_result.get("pathogen"),
        "severity": cv_result.get("severity"),
        "damagePercentage": cv_result.get("damagePercentage"),
        "union": target_union,
        "plantingDate": "15 days ago",
        "description": cv_result.get("description"),
        "image": f"/static/uploads/{filename}",
        "annotated_image": cv_result.get("annotated_image"),
        "bounding_boxes": cv_result.get("bounding_boxes", []),
        "weather": weather,
        "organicRemedy": advisory.get("organic_control"),
        "chemicalRemedy": advisory.get("chemical_control"),
        "phiDays": advisory.get("phi_days", 14),
        "sprayAdvice": advisory.get("spray_schedule"),
        "market": market
    }
