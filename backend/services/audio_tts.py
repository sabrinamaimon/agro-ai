import uuid
import logging
from pathlib import Path
from backend.config import AUDIO_DIR

logger = logging.getLogger(__name__)

async def generate_bengali_speech(text: str, voice: str = "bn-BD-PradeepNeural") -> str:
    """
    Generate conversational Bengali voice briefing using Microsoft Edge-TTS.
    Returns the relative URL path to the generated MP3 file.
    """
    filename = f"briefing_{uuid.uuid4().hex[:10]}.mp3"
    filepath = AUDIO_DIR / filename

    try:
        import edge_tts
        communicate = edge_tts.Communicate(text=text, voice=voice, rate="+0%", pitch="+0Hz")
        await communicate.save(str(filepath))
        return f"/static/audio/{filename}"
    except Exception as e:
        logger.error(f"Edge-TTS generation error: {e}")
        # In case edge-tts network times out, create a dummy or fallback
        with open(filepath, "wb") as f:
            f.write(b"")
        return f"/static/audio/{filename}"
