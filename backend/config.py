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
    "rangpur sadar": {"lat": 25.7439, "lon": 89.2752, "name": "রংপুর সদর, রংপুর", "nameEn": "Rangpur Sadar, Rangpur"},
    "rangpur": {"lat": 25.7439, "lon": 89.2752, "name": "রংপুর সদর, রংপুর", "nameEn": "Rangpur Sadar, Rangpur"},
    "dinajpur sadar": {"lat": 25.6279, "lon": 88.6332, "name": "দিনাজপুর সদর, দিনাজপুর", "nameEn": "Dinajpur Sadar, Dinajpur"},
    "dinajpur": {"lat": 25.6279, "lon": 88.6332, "name": "দিনাজপুর সদর, দিনাজপুর", "nameEn": "Dinajpur Sadar, Dinajpur"},
    "bogura sadar": {"lat": 24.8465, "lon": 89.3777, "name": "বগুড়া সদর, বগুড়া", "nameEn": "Bogura Sadar, Bogura"},
    "bogura": {"lat": 24.8465, "lon": 89.3777, "name": "বগুড়া সদর, বগুড়া", "nameEn": "Bogura Sadar, Bogura"},
    "bogra": {"lat": 24.8465, "lon": 89.3777, "name": "বগুড়া সদর, বগুড়া", "nameEn": "Bogura Sadar, Bogura"},
    "rajshahi sadar": {"lat": 24.3636, "lon": 88.6241, "name": "রাজশাহী সদর, রাজশাহী", "nameEn": "Rajshahi Sadar, Rajshahi"},
    "rajshahi": {"lat": 24.3636, "lon": 88.6241, "name": "রাজশাহী সদর, রাজশাহী", "nameEn": "Rajshahi Sadar, Rajshahi"},
    "jessore sadar": {"lat": 23.1664, "lon": 89.2081, "name": "যশোর সদর, যশোর", "nameEn": "Jashore Sadar, Jashore"},
    "jessore": {"lat": 23.1664, "lon": 89.2081, "name": "যশোর সদর, যশোর", "nameEn": "Jashore Sadar, Jashore"},
    "jashore": {"lat": 23.1664, "lon": 89.2081, "name": "যশোর সদর, যশোর", "nameEn": "Jashore Sadar, Jashore"},
    "mymensingh sadar": {"lat": 24.7471, "lon": 90.4203, "name": "ময়মনসিংহ সদর, ময়মনসিংহ", "nameEn": "Mymensingh Sadar, Mymensingh"},
    "mymensingh": {"lat": 24.7471, "lon": 90.4203, "name": "ময়মনসিংহ সদর, ময়মনসিংহ", "nameEn": "Mymensingh Sadar, Mymensingh"},
    "cumilla sadar": {"lat": 23.4682, "lon": 91.1788, "name": "কুমিল্লা সদর, কুমিল্লা", "nameEn": "Cumilla Sadar, Cumilla"},
    "cumilla": {"lat": 23.4682, "lon": 91.1788, "name": "কুমিল্লা সদর, কুমিল্লা", "nameEn": "Cumilla Sadar, Cumilla"},
    "comilla": {"lat": 23.4682, "lon": 91.1788, "name": "কুমিল্লা সদর, কুমিল্লা", "nameEn": "Cumilla Sadar, Cumilla"},
    "dhaka": {"lat": 23.8103, "lon": 90.4125, "name": "ঢাকা সেন্ট্রাল, ঢাকা", "nameEn": "Dhaka Central, Dhaka"},
    "sylhet": {"lat": 24.8949, "lon": 91.8687, "name": "সিলেট সদর, সিলেট", "nameEn": "Sylhet Sadar, Sylhet"},
    "barishal": {"lat": 22.7010, "lon": 90.3535, "name": "বরিশাল সদর, বরিশাল", "nameEn": "Barishal Sadar, Barishal"},
    "barisal": {"lat": 22.7010, "lon": 90.3535, "name": "বরিশাল সদর, বরিশাল", "nameEn": "Barishal Sadar, Barishal"},
    "chattogram": {"lat": 22.3569, "lon": 91.7832, "name": "চট্টগ্রাম সদর, চট্টগ্রাম", "nameEn": "Chattogram Sadar, Chattogram"},
    "chittagong": {"lat": 22.3569, "lon": 91.7832, "name": "চট্টগ্রাম সদর, চট্টগ্রাম", "nameEn": "Chattogram Sadar, Chattogram"},
    "khulna": {"lat": 22.8456, "lon": 89.5403, "name": "খুলনা সদর, খুলনা", "nameEn": "Khulna Sadar, Khulna"},
    "pabna": {"lat": 24.0064, "lon": 89.2372, "name": "পাবনা সদর, পাবনা", "nameEn": "Pabna Sadar, Pabna"},
    "natore": {"lat": 24.4102, "lon": 88.9796, "name": "নাটোর সদর, নাটোর", "nameEn": "Natore Sadar, Natore"},
    "kushtia": {"lat": 23.9013, "lon": 89.1205, "name": "কুষ্টিয়া সদর, কুষ্টিয়া", "nameEn": "Kushtia Sadar, Kushtia"},
    "tangail": {"lat": 24.2513, "lon": 89.9167, "name": "টাঙ্গাইল সদর, টাঙ্গাইল", "nameEn": "Tangail Sadar, Tangail"},
    "faridpur": {"lat": 23.6071, "lon": 89.8429, "name": "ফরিদপুর সদর, ফরিদপুর", "nameEn": "Faridpur Sadar, Faridpur"},
    "jamalpur": {"lat": 24.9375, "lon": 89.9378, "name": "জামালপুর সদর, জামালপুর", "nameEn": "Jamalpur Sadar, Jamalpur"},
    "naogaon": {"lat": 24.7936, "lon": 88.9318, "name": "নওগাঁ সদর, নওগাঁ", "nameEn": "Naogaon Sadar, Naogaon"},
    "sirajganj": {"lat": 24.4534, "lon": 89.7008, "name": "সিরাজগঞ্জ সদর, সিরাজগঞ্জ", "nameEn": "Sirajganj Sadar, Sirajganj"},
    "kurigram": {"lat": 25.8054, "lon": 89.6362, "name": "কুড়িগ্রাম সদর, কুড়িগ্রাম", "nameEn": "Kurigram Sadar, Kurigram"},
    "nilphamari": {"lat": 25.9318, "lon": 88.8560, "name": "নীলফামারী সদর, নীলফামারী", "nameEn": "Nilphamari Sadar, Nilphamari"},
    "panchagarh": {"lat": 26.3411, "lon": 88.5542, "name": "পঞ্চগড় সদর, পঞ্চগড়", "nameEn": "Panchagarh Sadar, Panchagarh"},
    "thakurgaon": {"lat": 26.0337, "lon": 88.4617, "name": "ঠাকুরগাঁও সদর, ঠাকুরগাঁও", "nameEn": "Thakurgaon Sadar, Thakurgaon"},
    "cox's bazar": {"lat": 21.4272, "lon": 92.0058, "name": "কক্সবাজার সদর, কক্সবাজার", "nameEn": "Cox's Bazar, Cox's Bazar"},
    "patuakhali": {"lat": 22.3596, "lon": 90.3298, "name": "পটুয়াখালী সদর, পটুয়াখালী", "nameEn": "Patuakhali Sadar, Patuakhali"}
}

DEFAULT_LOCATION = BANGLADESH_LOCATIONS["rangpur sadar"]

