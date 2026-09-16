from typing import Optional
from fastapi import APIRouter, Query
from backend.services.weather_service import fetch_weather
from backend.services.agronomic_reasoning import generate_agronomic_advisory
from backend.schemas.pydantic_models import AgronomicReasoningRequest, AgronomicReasoningResponse

router = APIRouter(prefix="/api", tags=["Task 3: Weather & Agronomic Reasoning"])

@router.get("/weather-advisory")
async def get_weather_advisory(union: Optional[str] = Query("Rangpur Sadar")):
    weather = fetch_weather(union_name=union or "Rangpur Sadar")
    return weather

@router.post("/agronomic-reasoning", response_model=AgronomicReasoningResponse)
async def get_agronomic_reasoning(payload: AgronomicReasoningRequest):
    union_name = payload.union or "Rangpur Sadar"
    weather = fetch_weather(union_name=union_name)
    
    if payload.temperature is not None:
        weather["temperature"] = payload.temperature
    if payload.humidity is not None:
        weather["humidity"] = payload.humidity

    result = await generate_agronomic_advisory(
        crop_type=payload.crop_type,
        pathogen_name=payload.pathogen_name,
        damage_percentage=payload.damage_percentage,
        severity=payload.severity,
        weather_data=weather,
        union_name=union_name,
        language=payload.language or "bn"
    )
    return AgronomicReasoningResponse(**result)
