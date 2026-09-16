import datetime
import uuid
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Anonymous Farmer")
    phone = Column(String(20), nullable=True)
    union_name = Column(String(100), default="Rangpur Sadar")
    district = Column(String(100), default="Rangpur")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    intakes = relationship("IntakeLog", back_populates="farmer")

class IntakeLog(Base):
    __tablename__ = "intake_logs"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    raw_transcript = Column(Text, nullable=False)
    detected_crop = Column(String(100), nullable=True)
    planting_date = Column(String(100), nullable=True)
    damage_desc = Column(Text, nullable=True)
    geographic_union = Column(String(100), default="Rangpur Sadar")
    language = Column(String(10), default="bn")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="intakes")
    diagnoses = relationship("DiagnosisRecord", back_populates="intake")

class DiagnosisRecord(Base):
    __tablename__ = "diagnosis_records"

    id = Column(Integer, primary_key=True, index=True)
    intake_id = Column(Integer, ForeignKey("intake_logs.id"), nullable=True)
    original_image_path = Column(String(255), nullable=True)
    annotated_image_path = Column(String(255), nullable=True)
    pathogen_name = Column(String(150), nullable=False)
    scientific_name = Column(String(150), nullable=True)
    crop_type = Column(String(100), nullable=False)
    damage_percentage = Column(Float, default=0.0)
    severity_level = Column(String(50), default="Moderate") # Mild, Moderate, Severe, Critical
    bounding_boxes = Column(JSON, nullable=True) # list of [x, y, w, h]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    intake = relationship("IntakeLog", back_populates="diagnoses")
    advisory = relationship("AdvisoryPlan", back_populates="diagnosis", uselist=False)
    passport = relationship("CropPassport", back_populates="diagnosis", uselist=False)

class AdvisoryPlan(Base):
    __tablename__ = "advisory_plans"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_id = Column(Integer, ForeignKey("diagnosis_records.id"), nullable=True)
    temp_celsius = Column(Float, nullable=True)
    humidity_pct = Column(Float, nullable=True)
    weather_condition = Column(String(100), nullable=True)
    rain_in_hours = Column(Integer, default=0)
    root_cause = Column(Text, nullable=True)
    organic_control = Column(Text, nullable=True)
    chemical_control = Column(Text, nullable=True)
    phi_days = Column(Integer, default=14)
    spray_schedule = Column(Text, nullable=True)
    spray_safety = Column(String(100), default="Safe to spray")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    diagnosis = relationship("DiagnosisRecord", back_populates="advisory")

class MarketCheck(Base):
    __tablename__ = "market_checks"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False)
    offered_price = Column(Float, nullable=False)
    benchmark_price = Column(Float, nullable=False)
    is_undercut = Column(Boolean, default=False)
    undercut_pct = Column(Float, default=0.0)
    volatility = Column(String(50), default="Low") # Low, Medium, High
    optimal_window = Column(String(100), default="In 3 to 5 days")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CropPassport(Base):
    __tablename__ = "crop_passports"

    id = Column(Integer, primary_key=True, index=True)
    passport_uuid = Column(String(64), unique=True, index=True, default=lambda: f"AGRO-BD-{uuid.uuid4().hex[:8].upper()}")
    diagnosis_id = Column(Integer, ForeignKey("diagnosis_records.id"), nullable=True)
    pdf_path = Column(String(255), nullable=True)
    audio_path = Column(String(255), nullable=True)
    share_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    diagnosis = relationship("DiagnosisRecord", back_populates="passport")
