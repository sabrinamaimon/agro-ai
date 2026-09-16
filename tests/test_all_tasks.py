import asyncio
import numpy as np
import cv2
from backend.services.nlp_intake import extract_intent_nlp
from backend.services.vision_engine import analyze_leaf_image
from backend.services.weather_service import fetch_weather
from backend.services.agronomic_reasoning import generate_agronomic_advisory
from backend.services.anomaly_detector import analyze_price_anomaly
from backend.services.audio_tts import generate_bengali_speech

async def test_suite():
    print("--- 1. Testing Task 1: Voice & NLP Intent Extraction ---")
    sample_query = "আমার আলুর জমিতে পাতায় সাদা দাগ ও ধসা দেখা যাচ্ছে, রোপণ করেছি ১৫ দিন আগে, রংপুর সদর।"
    intake = await extract_intent_nlp(sample_query, language="bn")
    print("Extracted Intent:", intake)
    assert "crop_type" in intake
    assert "estimated_planting_date" in intake
    assert "geographic_union" in intake
    print("✅ Task 1 PASSED!\n")

    print("--- 2. Testing Task 2: Visual CV Disease & Surface Damage % ---")
    blank_leaf = np.zeros((400, 400, 3), dtype=np.uint8)
    cv2.ellipse(blank_leaf, (200, 200), (120, 180), 30, 0, 360, (34, 139, 34), -1) # leaf
    cv2.circle(blank_leaf, (170, 160), 35, (19, 69, 139), -1) # lesion 1
    cv2.circle(blank_leaf, (220, 230), 25, (19, 69, 139), -1) # lesion 2
    _, buffer = cv2.imencode('.jpg', blank_leaf)
    cv_res = analyze_leaf_image(buffer.tobytes(), filename="potato_leaf.jpg")
    print(f"Pathogen: {cv_res['name']}, Damage: {cv_res['damagePercentage']}%, Severity: {cv_res['severity']}")
    print(f"Bounding Boxes: {len(cv_res['bounding_boxes'])} detected")
    assert cv_res["damagePercentage"] > 0
    assert len(cv_res["bounding_boxes"]) > 0
    print("✅ Task 2 PASSED!\n")

    print("--- 3. Testing Task 3: Hyperlocal Weather & Agronomic Reasoning ---")
    weather = fetch_weather("Rangpur Sadar")
    print("Weather Data:", weather)
    assert "temperature" in weather
    assert "humidity" in weather

    advisory = await generate_agronomic_advisory(
        crop_type="Potato (আলু)",
        pathogen_name="Phytophthora infestans",
        damage_percentage=cv_res["damagePercentage"],
        severity=cv_res["severity"],
        weather_data=weather,
        union_name="Rangpur Sadar",
        language="bn"
    )
    print("Root Cause:", advisory.get("root_cause")[:80] + "...")
    print("Chemical Dosage:", advisory.get("chemical_control"))
    print("PHI Days:", advisory.get("phi_days"))
    print("Spray Schedule:", advisory.get("spray_schedule"))
    assert advisory.get("phi_days") is not None
    print("✅ Task 3 PASSED!\n")

    print("--- 4. Testing Task 4: Market Price Anomaly Detection (Isolation Forest) ---")
    # Low predatory price for Potato (benchmark is 28 BDT/kg)
    undercut_res = analyze_price_anomaly("Potato (আলু)", 20.0)
    print("Undercut Test (Offered: 20 BDT, Benchmark: 28 BDT):", undercut_res)
    assert undercut_res["isUndercut"] == True
    assert undercut_res["undercutPercentage"] > 20.0

    # Fair price test
    fair_res = analyze_price_anomaly("Potato (আলু)", 28.5)
    print("Fair Price Test (Offered: 28.5 BDT):", fair_res)
    assert fair_res["isUndercut"] == False
    print("✅ Task 4 PASSED!\n")

    print("--- 5. Testing Task 5: Bengali Audio TTS Synthesis ---")
    test_phrase = "জরুরী কৃষি পরামর্শ: আলুর জমিতে লেট ব্লাইট রোগ নিয়ন্ত্রণে ম্যানকোজেব স্প্রে করুন।"
    audio_path = await generate_bengali_speech(test_phrase)
    print("Generated Audio Path:", audio_path)
    assert audio_path.startswith("/static/audio/")
    print("✅ Task 5 PASSED!\n")

    print("🎉 ALL 5 TASKS TESTED AND FULLY FUNCTIONAL!")

if __name__ == "__main__":
    asyncio.run(test_suite())
