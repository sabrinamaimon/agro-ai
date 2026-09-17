from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class VoiceIntakeRequest(BaseModel):
    transcript: str = Field(..., description="Speech transcript or typed query")
    language: str = Field("bn", description="Language code (bn or en)")

class VoiceIntakeResponse(BaseModel):
    crop_type: str
    estimated_planting_date: str
    observed_damage_description: str
    geographic_union: str
    raw_transcript: Optional[str] = None

class WeatherInfo(BaseModel):
    city: Optional[str] = "Rangpur Sadar, Bangladesh"
    temperature: float = 24.0
    humidity: float = 85.0
    condition: str = "High Humidity & Rain Risk"
    rainInHours: int = 4
    rainForecast: Optional[str] = None
    spraySafety: Optional[str] = None

class MarketInfo(BaseModel):
    crop: str = "Potato"
    offeredPrice: float = 20.0
    benchmarkPrice: float = 28.0
    volatility: str = "High"
    isUndercut: bool = True
    undercutPercentage: Optional[float] = 28.6
    optimalSellingWindow: str = "Wait 3 to 5 days for fair rate"

class VisionDiagnosisResponse(BaseModel):
    id: str
    name: str
    cropType: str
    pathogen: str
    severity: str # Mild, Moderate, Severe, Critical
    damagePercentage: float
    union: str
    plantingDate: str
    description: str
    image: Optional[str] = None
    annotated_image: Optional[str] = None
    bounding_boxes: Optional[List[List[int]]] = []
    weather: Optional[WeatherInfo] = None
    organicRemedy: str
    chemicalRemedy: str
    phiDays: int
    sprayAdvice: str
    plantPart: Optional[str] = "পাতা (Leaf)"
    market: Optional[MarketInfo] = None

class PriceAnomalyRequest(BaseModel):
    crop: str
    offeredPrice: float
    language: Optional[str] = "bn"

class PriceAnomalyResponse(BaseModel):
    crop: str
    offeredPrice: float
    benchmarkPrice: float
    volatility: str
    isUndercut: bool
    undercutPercentage: float
    optimalSellingWindow: str

class AgronomicReasoningRequest(BaseModel):
    crop_type: str
    pathogen_name: str
    damage_percentage: float
    severity: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    union: Optional[str] = "Rangpur Sadar"
    language: Optional[str] = "bn"

class AgronomicReasoningResponse(BaseModel):
    root_cause: str
    organic_control: str
    chemical_control: str
    phi_days: int
    spray_schedule: str
    spray_safety: str

class TTSRequest(BaseModel):
    text: str
    language: str = "bn"
    voice: Optional[str] = "bn-BD-PradeepNeural"

class TTSResponse(BaseModel):
    audio_url: str
    duration_seconds: Optional[float] = None

class CropPassportResponse(BaseModel):
    passport_id: str
    farmer_union: str
    diagnosed_pathogen: str
    damage_severity: str
    damage_percentage: float
    phi_days: int
    dosage_guide: str
    spray_schedule: str
    audio_briefing_url: Optional[str] = None
    whatsapp_share_url: Optional[str] = None
