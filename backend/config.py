import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"
UPLOADS_DIR = STATIC_DIR / "uploads"
ANNOTATED_DIR = STATIC_DIR / "annotated"
AUDIO_DIR = STATIC_DIR / "audio"

for d in [DATA_DIR, STATIC_DIR, UPLOADS_DIR, ANNOTATED_DIR, AUDIO_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'agro_ai.db'}")

# Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "openai/gpt-oss-120b")
GROQ_FAST_MODEL = os.getenv("GROQ_FAST_MODEL", "openai/gpt-oss-20b")
GROQ_WHISPER_MODEL = os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo")

# Bangladesh Major Agricultural Unions / Districts Coordinates
BANGLADESH_LOCATIONS = {
    "rangpur sadar": {"lat": 25.7439, "lon": 89.2752, "name": "Rangpur Sadar, Rangpur"},
    "rangpur": {"lat": 25.7439, "lon": 89.2752, "name": "Rangpur Sadar, Rangpur"},
    "dinajpur sadar": {"lat": 25.6279, "lon": 88.6332, "name": "Dinajpur Sadar, Dinajpur"},
    "dinajpur": {"lat": 25.6279, "lon": 88.6332, "name": "Dinajpur Sadar, Dinajpur"},
    "bogura sadar": {"lat": 24.8465, "lon": 89.3777, "name": "Bogura Sadar, Bogura"},
    "bogura": {"lat": 24.8465, "lon": 89.3777, "name": "Bogura Sadar, Bogura"},
    "bogra": {"lat": 24.8465, "lon": 89.3777, "name": "Bogura Sadar, Bogura"},
    "rajshahi sadar": {"lat": 24.3636, "lon": 88.6241, "name": "Rajshahi Sadar, Rajshahi"},
    "rajshahi": {"lat": 24.3636, "lon": 88.6241, "name": "Rajshahi Sadar, Rajshahi"},
    "jessore sadar": {"lat": 23.1664, "lon": 89.2081, "name": "Jessore Sadar, Jashore"},
    "jessore": {"lat": 23.1664, "lon": 89.2081, "name": "Jessore Sadar, Jashore"},
    "jashore": {"lat": 23.1664, "lon": 89.2081, "name": "Jessore Sadar, Jashore"},
    "mymensingh sadar": {"lat": 24.7471, "lon": 90.4203, "name": "Mymensingh Sadar, Mymensingh"},
    "mymensingh": {"lat": 24.7471, "lon": 90.4203, "name": "Mymensingh Sadar, Mymensingh"},
    "cumilla sadar": {"lat": 23.4682, "lon": 91.1788, "name": "Cumilla Sadar, Cumilla"},
    "cumilla": {"lat": 23.4682, "lon": 91.1788, "name": "Cumilla Sadar, Cumilla"},
    "dhaka": {"lat": 23.8103, "lon": 90.4125, "name": "Dhaka Central, Dhaka"},
}

DEFAULT_LOCATION = BANGLADESH_LOCATIONS["rangpur sadar"]
