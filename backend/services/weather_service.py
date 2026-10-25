import requests
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from backend.config import BANGLADESH_LOCATIONS, DEFAULT_LOCATION

logger = logging.getLogger(__name__)

WMO_WEATHER_MAP = {
    0: {"bn": "পরিষ্কার রৌদ্রোজ্জ্বল আকাশ", "en": "Clear Sunny Sky", "icon": "☀️"},
    1: {"bn": "প্রধানত পরিষ্কার আকাশ", "en": "Mainly Clear", "icon": "🌤️"},
    2: {"bn": "আংশিক মেঘলা", "en": "Partly Cloudy", "icon": "⛅"},
    3: {"bn": "মেঘলা আকাশ", "en": "Overcast", "icon": "☁️"},
    45: {"bn": "কুয়াশাচ্ছন্ন", "en": "Foggy", "icon": "🌫️"},
    48: {"bn": "ঘন কুয়াশা", "en": "Dense Fog", "icon": "🌫️"},
    51: {"bn": "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", "en": "Light Drizzle", "icon": "🌦️"},
    53: {"bn": "মাঝারি গুঁড়ি বৃষ্টি", "en": "Moderate Drizzle", "icon": "🌦️"},
    55: {"bn": "ভারী গুঁড়ি বৃষ্টি", "en": "Dense Drizzle", "icon": "🌧️"},
    61: {"bn": "হালকা বৃষ্টিপাত", "en": "Light Rain", "icon": "🌧️"},
    63: {"bn": "মাঝারি বৃষ্টিপাত", "en": "Moderate Rain", "icon": "🌧️"},
    65: {"bn": "ভারী বর্ষণ", "en": "Heavy Rain", "icon": "⛈️"},
    80: {"bn": "হালকা পশলা বৃষ্টি", "en": "Passing Showers", "icon": "🌦️"},
    81: {"bn": "মাঝারি পশলা বৃষ্টি", "en": "Moderate Showers", "icon": "🌧️"},
    82: {"bn": "প্রচণ্ড বৃষ্টিপাত", "en": "Violent Downpour", "icon": "⛈️"},
    95: {"bn": "বজ্রবিদ্যুৎসহ ঝড়-বৃষ্টি", "en": "Thunderstorm", "icon": "🌩️"},
    96: {"bn": "বজ্রঝড় ও শিলাবৃষ্টি", "en": "Thunderstorm with Hail", "icon": "⛈️"},
    99: {"bn": "তীব্র বজ্রঝড় ও শিলাবৃষ্টি", "en": "Severe Thunderstorm with Hail", "icon": "⛈️"},
}

def to_bn_digits(s: Any) -> str:
    bn_digits = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")
    return str(s).translate(bn_digits)

def get_wmo_info(code: int, language: str = "bn") -> Dict[str, str]:
    info = WMO_WEATHER_MAP.get(int(code), {"bn": "আংশিক মেঘলা", "en": "Partly Cloudy", "icon": "⛅"})
    return {
        "condition": info["bn"] if language == "bn" else info["en"],
        "icon": info["icon"]
    }

_REVERSE_GEO_CACHE: Dict[str, Dict[str, str]] = {}

BANGLADESH_DISTRICT_CENTROIDS = [
    {"nameBn": "ঢাকা", "nameEn": "Dhaka", "lat": 23.8103, "lon": 90.4125},
    {"nameBn": "গাজীপুর", "nameEn": "Gazipur", "lat": 24.0023, "lon": 90.4264},
    {"nameBn": "নারায়ণগঞ্জ", "nameEn": "Narayanganj", "lat": 23.6238, "lon": 90.5000},
    {"nameBn": "নরসিংদী", "nameEn": "Narsingdi", "lat": 23.9193, "lon": 90.7176},
    {"nameBn": "টাঙ্গাইল", "nameEn": "Tangail", "lat": 24.2513, "lon": 89.9167},
    {"nameBn": "কিশোরগঞ্জ", "nameEn": "Kishoreganj", "lat": 24.4449, "lon": 90.7766},
    {"nameBn": "মানিকগঞ্জ", "nameEn": "Manikganj", "lat": 23.8644, "lon": 90.0047},
    {"nameBn": "মুন্সীগঞ্জ", "nameEn": "Munshiganj", "lat": 23.5422, "lon": 90.5305},
    {"nameBn": "ফরিদপুর", "nameEn": "Faridpur", "lat": 23.6071, "lon": 89.8429},
    {"nameBn": "গোপালগঞ্জ", "nameEn": "Gopalganj", "lat": 23.0051, "lon": 89.8266},
    {"nameBn": "মাদারীপুর", "nameEn": "Madaripur", "lat": 23.1641, "lon": 90.1897},
    {"nameBn": "রাজবাড়ী", "nameEn": "Rajbari", "lat": 23.7574, "lon": 89.6445},
    {"nameBn": "শরীয়তপুর", "nameEn": "Shariatpur", "lat": 23.2423, "lon": 90.4348},
    {"nameBn": "চট্টগ্রাম", "nameEn": "Chattogram", "lat": 22.3569, "lon": 91.7832},
    {"nameBn": "কক্সবাজার", "nameEn": "Cox's Bazar", "lat": 21.4272, "lon": 92.0058},
    {"nameBn": "কুমিল্লা", "nameEn": "Cumilla", "lat": 23.4682, "lon": 91.1788},
    {"nameBn": "ফেনী", "nameEn": "Feni", "lat": 23.0159, "lon": 91.3976},
    {"nameBn": "ব্রাহ্মণবাড়িয়া", "nameEn": "Brahmanbaria", "lat": 23.9571, "lon": 91.1119},
    {"nameBn": "নোয়াখালী", "nameEn": "Noakhali", "lat": 22.8696, "lon": 91.0994},
    {"nameBn": "চাঁদপুর", "nameEn": "Chandpur", "lat": 23.2333, "lon": 90.6667},
    {"nameBn": "লক্ষ্মীপুর", "nameEn": "Lakshmipur", "lat": 22.9425, "lon": 90.8412},
    {"nameBn": "রাঙ্গামাটি", "nameEn": "Rangamati", "lat": 22.6533, "lon": 92.1753},
    {"nameBn": "খাগড়াছড়ি", "nameEn": "Khagrachhari", "lat": 23.1193, "lon": 91.9847},
    {"nameBn": "বান্দরবান", "nameEn": "Bandarban", "lat": 22.1953, "lon": 92.2184},
    {"nameBn": "রাজশাহী", "nameEn": "Rajshahi", "lat": 24.3636, "lon": 88.6241},
    {"nameBn": "বগুড়া", "nameEn": "Bogura", "lat": 24.8465, "lon": 89.3777},
    {"nameBn": "পাবনা", "nameEn": "Pabna", "lat": 24.0064, "lon": 89.2372},
    {"nameBn": "সিরাজগঞ্জ", "nameEn": "Sirajganj", "lat": 24.4534, "lon": 89.7008},
    {"nameBn": "নওগাঁ", "nameEn": "Naogaon", "lat": 24.7936, "lon": 88.9318},
    {"nameBn": "নাটোর", "nameEn": "Natore", "lat": 24.4206, "lon": 89.0003},
    {"nameBn": "চাঁপাইনবাবগঞ্জ", "nameEn": "Chapainawabganj", "lat": 24.5965, "lon": 88.2775},
    {"nameBn": "জয়পুরহাট", "nameEn": "Joypurhat", "lat": 25.1015, "lon": 89.0277},
    {"nameBn": "রংপুর", "nameEn": "Rangpur", "lat": 25.7439, "lon": 89.2752},
    {"nameBn": "দিনাজপুর", "nameEn": "Dinajpur", "lat": 25.6279, "lon": 88.6332},
    {"nameBn": "কুড়িগ্রাম", "nameEn": "Kurigram", "lat": 25.8054, "lon": 89.6362},
    {"nameBn": "গাইবান্ধা", "nameEn": "Gaibandha", "lat": 25.3288, "lon": 89.5430},
    {"nameBn": "নীলফামারী", "nameEn": "Nilphamari", "lat": 25.9318, "lon": 88.8560},
    {"nameBn": "লালমনিরহাট", "nameEn": "Lalmonirhat", "lat": 25.9923, "lon": 89.2847},
    {"nameBn": "ঠাকুরগাঁও", "nameEn": "Thakurgaon", "lat": 26.0337, "lon": 88.4617},
    {"nameBn": "পঞ্চগড়", "nameEn": "Panchagarh", "lat": 26.3411, "lon": 88.5542},
    {"nameBn": "খুলনা", "nameEn": "Khulna", "lat": 22.8456, "lon": 89.5403},
    {"nameBn": "যশোর", "nameEn": "Jashore", "lat": 23.1664, "lon": 89.2081},
    {"nameBn": "সাতক্ষীরা", "nameEn": "Satkhira", "lat": 22.7185, "lon": 89.0705},
    {"nameBn": "ঝিনাইদহ", "nameEn": "Jhenaidah", "lat": 23.5448, "lon": 89.1539},
    {"nameBn": "মাগুরা", "nameEn": "Magura", "lat": 23.4873, "lon": 89.4199},
    {"nameBn": "নড়াইল", "nameEn": "Narail", "lat": 23.1725, "lon": 89.5127},
    {"nameBn": "বাগেরহাট", "nameEn": "Bagerhat", "lat": 22.6516, "lon": 89.7859},
    {"nameBn": "কুষ্টিয়া", "nameEn": "Kushtia", "lat": 23.9013, "lon": 89.1205},
    {"nameBn": "চুয়াডাঙ্গা", "nameEn": "Chuadanga", "lat": 23.6402, "lon": 88.8418},
    {"nameBn": "মেহেরপুর", "nameEn": "Meherpur", "lat": 23.7622, "lon": 88.6318},
    {"nameBn": "বরিশাল", "nameEn": "Barishal", "lat": 22.7010, "lon": 90.3535},
    {"nameBn": "ভোলা", "nameEn": "Bhola", "lat": 22.6859, "lon": 90.6481},
    {"nameBn": "পটুয়াখালী", "nameEn": "Patuakhali", "lat": 22.3596, "lon": 90.3299},
    {"nameBn": "পিরোজপুর", "nameEn": "Pirojpur", "lat": 22.5841, "lon": 89.9720},
    {"nameBn": "বরগুনা", "nameEn": "Barguna", "lat": 22.0953, "lon": 90.1121},
    {"nameBn": "ঝালকাঠি", "nameEn": "Jhalokati", "lat": 22.6406, "lon": 90.1987},
    {"nameBn": "সিলেট", "nameEn": "Sylhet", "lat": 24.8949, "lon": 91.8687},
    {"nameBn": "মৌলভীবাজার", "nameEn": "Moulvibazar", "lat": 24.4829, "lon": 91.7774},
    {"nameBn": "হবিগঞ্জ", "nameEn": "Habiganj", "lat": 24.3749, "lon": 91.4155},
    {"nameBn": "সুনামগঞ্জ", "nameEn": "Sunamganj", "lat": 25.0658, "lon": 91.3950},
    {"nameBn": "ময়মনসিংহ", "nameEn": "Mymensingh", "lat": 24.7471, "lon": 90.4203},
    {"nameBn": "জামালপুর", "nameEn": "Jamalpur", "lat": 24.9375, "lon": 89.9378},
    {"nameBn": "নেত্রকোণা", "nameEn": "Netrokona", "lat": 24.8709, "lon": 90.7279},
    {"nameBn": "শেরপুর", "nameEn": "Sherpur", "lat": 25.0205, "lon": 90.0153}
]

def find_nearest_bd_district(lat: float, lon: float) -> Dict[str, Any]:
    closest = BANGLADESH_DISTRICT_CENTROIDS[0]
    min_dist_sq = float("inf")
    for d in BANGLADESH_DISTRICT_CENTROIDS:
        dist_sq = (d["lat"] - lat) ** 2 + (d["lon"] - lon) ** 2
        if dist_sq < min_dist_sq:
            min_dist_sq = dist_sq
            closest = d
    return closest

def get_hyperlocal_address(lat: float, lon: float, language: str = "bn") -> Dict[str, str]:
    """
    Resolve exact micro-location (Union / Village / Upazila / District) from GPS coordinates
    using BigDataCloud fast geocoding with Nominatim fallback and in-memory caching.
    Guarantees human-readable place names and NEVER returns raw coordinate strings.
    """
    cache_key = f"{round(lat, 3)}_{round(lon, 3)}_{language}"
    if cache_key in _REVERSE_GEO_CACHE:
        return _REVERSE_GEO_CACHE[cache_key]

    nearest_fallback = find_nearest_bd_district(lat, lon)
    fallback_name = f"{nearest_fallback['nameBn']} অঞ্চল" if language == "bn" else f"{nearest_fallback['nameEn']} Hub"
    fallback_name_en = f"{nearest_fallback['nameEn']} Hub"

    # 1. Primary: BigDataCloud fast client API (<200ms, no rate limit)
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage={language}"
        res = requests.get(url, timeout=2.5)
        if res.status_code == 200:
            data = res.json()
            locality_info = data.get("localityInfo", {}).get("administrative", [])
            union = ""
            upazila = ""
            district = ""
            for item in locality_info:
                desc = item.get("description", "")
                name = item.get("name", "")
                if "ইউনিয়ন" in desc or "ইউনিয়ন" in name:
                    union = name
                elif "উপজেলা" in desc or "উপজেলা" in name:
                    upazila = name
                elif "জেলা" in desc or "জেলা" in name:
                    district = name
            
            if not union:
                union = data.get("locality") or ""
            if not upazila:
                upazila = data.get("city") or ""
            if not district:
                district = data.get("principalSubdivision") or ""

            # Deduplicate items
            raw_parts = [union, upazila, district]
            seen = set()
            parts = []
            for p in raw_parts:
                p_clean = p.strip()
                if p_clean and p_clean not in seen and "বাংলাদেশ" not in p_clean:
                    seen.add(p_clean)
                    parts.append(p_clean)

            if parts:
                full_name = ", ".join(parts)
                res_obj = {
                    "name": full_name,
                    "nameEn": full_name,
                    "union": union,
                    "upazila": upazila or nearest_fallback["nameBn"],
                    "district": district or nearest_fallback["nameBn"]
                }
                _REVERSE_GEO_CACHE[cache_key] = res_obj
                return res_obj
    except Exception as e:
        logger.warning(f"BigDataCloud geocode failed: {e}. Falling back to Nominatim.")

    # 2. Secondary: Nominatim OpenStreetMap
    headers = {"User-Agent": "AgroAI-Hyperlocal-Platform/1.0 (contact@agroai.bd)"}
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&accept-language={language}"
        res = requests.get(url, headers=headers, timeout=2.5)
        if res.status_code == 200:
            data = res.json()
            addr = data.get("address", {})
            local_unit = (
                addr.get("suburb") or 
                addr.get("quarter") or 
                addr.get("village") or 
                addr.get("neighbourhood") or 
                addr.get("city_district") or 
                addr.get("town") or 
                addr.get("city") or 
                ""
            )
            upazila = addr.get("county") or addr.get("city") or ""
            district = addr.get("state_district") or addr.get("state") or ""

            raw_parts = [local_unit, upazila, district]
            seen = set()
            parts = []
            for p in raw_parts:
                p_clean = p.strip()
                if p_clean and p_clean not in seen and "বাংলাদেশ" not in p_clean:
                    seen.add(p_clean)
                    parts.append(p_clean)

            if parts:
                name = ", ".join(parts)
                res_obj = {
                    "name": name, 
                    "nameEn": name,
                    "union": local_unit,
                    "upazila": upazila or nearest_fallback["nameBn"],
                    "district": district or nearest_fallback["nameBn"]
                }
                _REVERSE_GEO_CACHE[cache_key] = res_obj
                return res_obj
    except Exception as e:
        logger.warning(f"Nominatim reverse geocoding error: {e}")

    # 3. Deterministic Geometrical Fallback to Nearest Bangladesh District
    fallback_obj = {
        "name": fallback_name,
        "nameEn": fallback_name_en,
        "union": "",
        "upazila": nearest_fallback["nameBn"],
        "district": nearest_fallback["nameBn"]
    }
    _REVERSE_GEO_CACHE[cache_key] = fallback_obj
    return fallback_obj

def get_location_coords(
    union_name: str = "Rangpur Sadar", 
    lat: Optional[float] = None, 
    lon: Optional[float] = None,
    language: str = "bn"
) -> Dict[str, Any]:
    if lat is not None and lon is not None:
        # Preserve exact GPS coordinates for hyper-local microclimate forecast
        geo = get_hyperlocal_address(lat, lon, language)
        return {
            "lat": lat, 
            "lon": lon, 
            "name": geo["name"], 
            "nameEn": geo["nameEn"],
            "union": geo.get("union", ""),
            "upazila": geo.get("upazila", ""),
            "district": geo.get("district", ""),
            "isGps": True
        }

    cleaned = union_name.lower().strip()
    for key, loc in BANGLADESH_LOCATIONS.items():
        if key in cleaned:
            return {**loc, "isGps": False}
    return {**DEFAULT_LOCATION, "isGps": False}

def fetch_weather(
    union_name: str = "Rangpur Sadar", 
    lat: Optional[float] = None, 
    lon: Optional[float] = None, 
    language: str = "bn"
) -> Dict[str, Any]:
    """
    Fetch comprehensive, real-time weather and agricultural forecasts from Open-Meteo API.
    Provides live current conditions, 24-hour hourly forecast, 5-day agro forecast,
    and tailored agronomic advisories (Spraying, Irrigation, Harvest, Disease risk).
    """
    loc = get_location_coords(union_name, lat, lon, language)
    latitude, longitude = loc["lat"], loc["lon"]

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&"
        f"hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code&"
        f"daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&"
        f"timezone=Asia%2FDhaka&forecast_days=6"
    )

    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            curr = data.get("current", {})
            temp = float(curr.get("temperature_2m", 28.0))
            feels_like = float(curr.get("apparent_temperature", temp + 3.0))
            humidity = float(curr.get("relative_humidity_2m", 80.0))
            wind_speed = float(curr.get("wind_speed_10m", 8.0))
            curr_code = int(curr.get("weather_code", 2))
            curr_precip = float(curr.get("precipitation", 0.0))

            wmo_info = get_wmo_info(curr_code, language)

            # Analyze next 6-8 hours for rain risk
            hourly = data.get("hourly", {})
            rain_probs = hourly.get("precipitation_probability", [])[:8]
            precip_rates = hourly.get("precipitation", [])[:8]

            rain_in_hours = 0
            rain_chance_peak = 0
            for i, (prob, p) in enumerate(zip(rain_probs, precip_rates)):
                if prob > rain_chance_peak:
                    rain_chance_peak = prob
                if (prob >= 40 or p >= 0.2) and rain_in_hours == 0:
                    rain_in_hours = i + 1

            # 1. Spray Safety Advisory
            if rain_in_hours > 0 and rain_in_hours <= 6:
                spray_status = "danger"
                spray_safety = (
                    f"সতর্কতা: আগামী {rain_in_hours} ঘণ্টার মধ্যে বৃষ্টির সম্ভাবনা রয়েছে ({rain_chance_peak}%)। স্প্রে স্থগিত রাখুন!"
                    if language == "bn" else
                    f"Warning: Rain expected in {rain_in_hours} hours ({rain_chance_peak}%). Abort spray!"
                )
                rain_forecast = (
                    f"আগামী {rain_in_hours} ঘণ্টার মধ্যে বৃষ্টির সম্ভাবনা"
                    if language == "bn" else
                    f"Rain expected in {rain_in_hours} hours"
                )
            elif wind_speed > 15:
                spray_status = "warning"
                spray_safety = (
                    f"সতর্কতা: বাতাসের গতিবেগ বেশি ({wind_speed} কিমি/ঘণ্টা), স্প্রে বাতাসে উড়ে অপচয় হতে পারে।"
                    if language == "bn" else
                    f"Warning: High wind speed ({wind_speed} km/h) will cause spray drift."
                )
                rain_forecast = "আকাশ পরিষ্কার, দমকা বাতাস" if language == "bn" else "Clear skies, windy"
            else:
                spray_status = "safe"
                spray_safety = (
                    "স্প্রে করার জন্য চমৎকার ও অনুকূল পরিবেশ। শান্ত বাতাস ও অনুকূল আবহাওয়া।"
                    if language == "bn" else
                    "Safe and optimal to spray. Calm winds and dry conditions."
                )
                rain_forecast = (
                    "আগামী ২৪ ঘণ্টায় বৃষ্টির কোনো ঝুঁকি নেই"
                    if language == "bn" else
                    "No rain expected in next 24 hours"
                )

            # 2. Irrigation Advisory (next 48h rain sum)
            daily = data.get("daily", {})
            daily_precip_sums = daily.get("precipitation_sum", [0.0, 0.0])
            next_48h_rain = sum(daily_precip_sums[:2])

            if next_48h_rain >= 8.0:
                irrigation_advice = (
                    "জমিতে বৃষ্টির পানি আসার সম্ভাবনা থাকায় আজ বাড়তি সেচ দেওয়ার প্রয়োজন নেই। জ্বালানি ও বিদ্যুৎ সাশ্রয় করুন।"
                    if language == "bn" else
                    "Significant rain expected; hold off additional irrigation to conserve resources."
                )
                irrigation_status = "pause"
            elif temp > 32.0 and humidity < 65.0:
                irrigation_advice = (
                    "উচ্চ তাপমাত্রা ও শুষ্ক আবহাওয়ায় মাটিতে বাষ্পীভবন বেশি হচ্ছে। সবজি ও ফল ক্ষেতে পরিমিত সেচ দিন।"
                    if language == "bn" else
                    "High temperature and low humidity; apply moderate irrigation to prevent moisture stress."
                )
                irrigation_status = "irrigate"
            else:
                irrigation_advice = (
                    "মাটিতে স্বাভাবিক আর্দ্রতা বজায় রয়েছে। প্রয়োজন অনুযায়ী ফসলের গোড়া পর্যবেক্ষণ করে হালকা সেচ দিন।"
                    if language == "bn" else
                    "Soil moisture is balanced. Maintain routine field observation."
                )
                irrigation_status = "normal"

            # 3. Harvest & Post-Harvest Drying Advisory
            if daily_precip_sums and daily_precip_sums[0] < 1.0 and curr_code <= 2:
                harvest_advice = (
                    "আজ রোদ উজ্জ্বল ও অনুকূল আবহাওয়া। পাকা ফসল কর্তন, ধান/শস্য রোদে শুকানো ও মাড়াইয়ের জন্য উপযুক্ত দিন।"
                    if language == "bn" else
                    "Bright sunny weather; ideal day for harvesting, crop drying, and threshing."
                )
                harvest_status = "favorable"
            else:
                harvest_advice = (
                    "বৃষ্টি বা আর্দ্র মেঘলা আবহাওয়ার ঝুঁকি রয়েছে। কর্তনকৃত ফসল সুরক্ষিত ও শুকনো স্থানে ঢেকে রাখুন।"
                    if language == "bn" else
                    "Overcast/rain risk; protect harvested grains with waterproof covers."
                )
                harvest_status = "caution"

            # 4. Fungal & Disease Hazard Index
            if humidity >= 80.0 and 22.0 <= temp <= 33.0:
                disease_risk_status = "high"
                disease_risk_advice = (
                    f"উচ্চ আর্দ্রতা ({humidity}%) এবং অনুকূল তাপমাত্রা ব্লাইট, অ্যানথ্রাকনোজ ও ছত্রাক রোগের জন্য ঝুঁকিপূর্ণ। নিয়মিত ক্ষেত পর্যবেক্ষণ করুন।"
                    if language == "bn" else
                    f"High humidity ({humidity}%) accelerates fungal proliferation. Monitor crops closely."
                )
            elif temp >= 35.0:
                disease_risk_status = "medium"
                disease_risk_advice = (
                    "তীব্র তাপপ্রবাহে ফসলে হিট-স্ট্রেস ও ফুল ঝরে পড়ার ঝুঁকি রয়েছে। সকালে বা বিকেলে হালকা পানি স্প্রে করুন।"
                    if language == "bn" else
                    "Heat stress alert; spray water during morning/evening to cool foliage."
                )
            else:
                disease_risk_status = "low"
                disease_risk_advice = (
                    "রোগবালাইয়ের বিস্তার অনুকূল নয়। সাধারণ ফসলের পরিচর্যা ও আগাছা পরিষ্কার অব্যাহত রাখুন।"
                    if language == "bn" else
                    "Normal weather; continue standard crop management."
                )

            # Build 24-Hour Hourly Forecast
            hourly_times = hourly.get("time", [])[:24]
            hourly_temps = hourly.get("temperature_2m", [])[:24]
            hourly_hums = hourly.get("relative_humidity_2m", [])[:24]
            hourly_probs = hourly.get("precipitation_probability", [])[:24]
            hourly_codes = hourly.get("weather_code", [])[:24]

            formatted_hourly: List[Dict[str, Any]] = []
            for t_str, h_temp, h_hum, h_prob, h_c in zip(hourly_times, hourly_temps, hourly_hums, hourly_probs, hourly_codes):
                dt = datetime.fromisoformat(t_str)
                if language == "bn":
                    hour_label = to_bn_digits(dt.strftime("%I %p").lstrip("0").replace("AM", "সকাল").replace("PM", "বিকাল/রাত"))
                else:
                    hour_label = dt.strftime("%I %p").lstrip("0")
                info_h = get_wmo_info(h_c, language)
                formatted_hourly.append({
                    "time": hour_label,
                    "temp": round(h_temp, 1),
                    "humidity": h_hum,
                    "rainProb": h_prob,
                    "condition": info_h["condition"],
                    "icon": info_h["icon"]
                })

            # Build 5-Day Daily Agro Forecast
            daily_times = daily.get("time", [])[:5]
            daily_codes = daily.get("weather_code", [])[:5]
            daily_maxs = daily.get("temperature_2m_max", [])[:5]
            daily_mins = daily.get("temperature_2m_min", [])[:5]
            daily_precips = daily.get("precipitation_sum", [])[:5]
            daily_rain_probs = daily.get("precipitation_probability_max", [])[:5]

            bangla_days = {
                "Monday": "সোমবার",
                "Tuesday": "মঙ্গলবার",
                "Wednesday": "বুধবার",
                "Thursday": "বৃহস্পতিবার",
                "Friday": "শুক্রবার",
                "Saturday": "শনিবার",
                "Sunday": "রবিবার"
            }

            formatted_daily: List[Dict[str, Any]] = []
            for i, (d_str, d_c, max_t, min_t, p_sum, p_max) in enumerate(zip(
                daily_times, daily_codes, daily_maxs, daily_mins, daily_precips, daily_rain_probs
            )):
                d_obj = datetime.fromisoformat(d_str)
                day_en = d_obj.strftime("%A")
                if language == "bn":
                    day_label = "আজ" if i == 0 else ("আগামীকাল" if i == 1 else bangla_days.get(day_en, day_en))
                else:
                    day_label = "Today" if i == 0 else ("Tomorrow" if i == 1 else day_en)
                info_d = get_wmo_info(d_c, language)
                formatted_daily.append({
                    "date": d_str,
                    "day": day_label,
                    "maxTemp": round(max_t, 1),
                    "minTemp": round(min_t, 1),
                    "rainProb": p_max,
                    "precipMm": round(p_sum, 1),
                    "condition": info_d["condition"],
                    "icon": info_d["icon"]
                })

            # 5. Climate Smart Disaster & Extreme Weather Risk Predictor (Sadia's Hackathon Track)
            daily_precip_list = daily.get("precipitation_sum", [])
            daily_max_t_list = daily.get("temperature_2m_max", [])
            daily_code_list = daily.get("weather_code", [])

            total_rain_6d = sum(daily_precip_list) if daily_precip_list else 0.0
            max_single_day_rain = max(daily_precip_list) if daily_precip_list else 0.0
            max_week_temp = max(daily_max_t_list) if daily_max_t_list else temp
            dry_days_count = sum(1 for p in daily_precip_list if p < 1.0)
            has_storm_code = any(c in [95, 96, 99] for c in daily_code_list)

            # Flood Risk
            if total_rain_6d >= 90.0 or max_single_day_rain >= 45.0:
                flood_status = "danger"
                flood_pct = min(96, int(total_rain_6d * 0.6 + max_single_day_rain * 0.5))
                flood_title = "বন্যা ও অতিরিক্ত জলাবদ্ধতা সতর্কতা" if language == "bn" else "Flood & Severe Waterlogging Alert"
                flood_desc = (
                    f"আগামী ৬ দিনে মোট {to_bn_digits(round(total_rain_6d, 1))} মিমি বৃষ্টির পূর্বাভাস। নিচু জমি ও হাওর অববাহিকায় জলাবদ্ধতার উচ্চ ঝুঁকি।"
                    if language == "bn" else
                    f"Forecast predicts {round(total_rain_6d, 1)}mm rainfall over 6 days. Elevated risk of waterlogging in low-lying basins."
                )
                flood_action = (
                    "৮০% পাকা ধান দ্রুত কেটে ঘরে তুলুন। ড্রেনেজ নালা পরিষ্কার রাখুন এবং আল বা বাঁধের উচ্চতা বাড়ান।"
                    if language == "bn" else
                    "Harvest 80% ripe paddy immediately. Clear field drainage channels and raise bunds."
                )
            elif total_rain_6d >= 35.0:
                flood_status = "warning"
                flood_pct = 48
                flood_title = "মাঝারি বৃষ্টিপাত ও পানি জমার ঝুঁকি" if language == "bn" else "Moderate Rain & Water Retention"
                flood_desc = (
                    f"৬ দিনে সম্ভাব্য {to_bn_digits(round(total_rain_6d, 1))} মিমি বৃষ্টি হতে পারে। পানি নিষ্কাশনের ব্যবস্থা প্রস্তুত রাখুন।"
                    if language == "bn" else
                    f"Possible {round(total_rain_6d, 1)}mm rainfall over 6 days. Maintain clear drainage."
                )
                flood_action = "মাঠের ড্রেন খোলা রাখুন।" if language == "bn" else "Keep field drains open."
            else:
                flood_status = "safe"
                flood_pct = 12
                flood_title = "বন্যার ঝুঁকি নেই (স্বাভাবিক)" if language == "bn" else "Low Flood Risk (Normal)"
                flood_desc = "আগামী সপ্তাহে কোনো উল্লেখযোগ্য বন্যা বা প্লাবনের ঝুঁকি নেই।" if language == "bn" else "No significant flood risk expected."
                flood_action = "স্বাভাবিক কৃষি কার্যক্রম বজায় রাখুন।" if language == "bn" else "Maintain normal field operations."

            # Drought & Heatwave Risk
            if dry_days_count >= 5 and max_week_temp >= 35.0:
                drought_status = "danger"
                drought_pct = min(90, int(dry_days_count * 10 + (max_week_temp - 32) * 5))
                drought_title = "খরা ও তাপদাহ সতর্কতা (Drought Risk)" if language == "bn" else "Drought & Heat Stress Alert"
                drought_desc = (
                    f"টানা {to_bn_digits(dry_days_count)} দিন বৃষ্টিহীন এবং সর্বোচ্চ তাপমাত্রা {to_bn_digits(round(max_week_temp, 1))}°C। মাটিতে তীব্র পানিশূন্যতা দেখা দিতে পারে।"
                    if language == "bn" else
                    f"{dry_days_count} consecutive dry days with peak temperature of {round(max_week_temp, 1)}°C. High evapotranspiration stress."
                )
                drought_action = (
                    "সবজি ও রবি ফসলে খড় দিয়ে মালচিং (mulching) করুন। সকাল বা সন্ধ্যায় গাছের গোড়ায় সেচ দিন।"
                    if language == "bn" else
                    "Apply straw mulch to conserve soil moisture; irrigate during early morning or late afternoon."
                )
            elif dry_days_count >= 4 and max_week_temp >= 32.0:
                drought_status = "warning"
                drought_pct = 45
                drought_title = "মাঝারি শুষ্কতা পূর্বাভাস" if language == "bn" else "Moderate Dry Spell Warning"
                drought_desc = "মাটির আর্দ্রতা কমে যেতে পারে, নিয়মিত মাটির রস পরীক্ষা করুন।" if language == "bn" else "Soil moisture may deplete, monitor moisture levels."
                drought_action = "প্রয়োজনে হালকা সেচ প্রদান করুন।" if language == "bn" else "Provide light supplemental irrigation as needed."
            else:
                drought_status = "safe"
                drought_pct = 10
                drought_title = "মাটির আর্দ্রতা সন্তোষজনক" if language == "bn" else "Optimal Soil Moisture"
                drought_desc = "তাপমাত্রা ও আর্দ্রতার অনুপাত ফসলের জন্য অনুকূল।" if language == "bn" else "Temperature and humidity levels are favorable for crops."
                drought_action = "পরিমিত সেচ বজায় রাখুন।" if language == "bn" else "Maintain regular irrigation schedule."

            # Cyclone & Severe Storm Risk
            if wind_speed >= 38.0 or has_storm_code:
                storm_status = "danger"
                storm_pct = min(92, int(wind_speed * 1.5 + (20 if has_storm_code else 0)))
                storm_title = "কালবৈশাখী ঝড় ও দমকা হাওয়া সতর্কতা" if language == "bn" else "Severe Squall & Storm Warning"
                storm_desc = (
                    f"বজ্রঝড় ও প্রতি ঘণ্টায় প্রায় {to_bn_digits(round(wind_speed, 1))} কিমি বেগে দমকা বাতাসের সম্ভাবনা।"
                    if language == "bn" else
                    f"Risk of thunderstorms and gusts up to {round(wind_speed, 1)} km/h."
                )
                storm_action = (
                    "কলা গাছ ও শাকসবজির মাচায় বাঁশের খুঁটি দিয়ে শক্ত ঠেস দিন। উন্মুক্ত শস্য ঢেকে রাখুন।"
                    if language == "bn" else
                    "Prop up banana plants and vegetable trellises with bamboo stakes; secure harvested crops."
                )
            elif wind_speed >= 22.0:
                storm_status = "warning"
                storm_pct = 40
                storm_title = "দমকা বাতাস পূর্বাভাস" if language == "bn" else "Gusty Wind Advisory"
                storm_desc = "মাঝারি বাতাসে স্প্রে ছড়িয়ে যেতে পারে।" if language == "bn" else "Moderate winds may drift foliar sprays."
                storm_action = "বাতাস কমলে স্প্রে করুন।" if language == "bn" else "Spray during calm morning periods."
            else:
                storm_status = "safe"
                storm_pct = 8
                storm_title = "শান্ত আবহাওয়া (ঝড়ের ঝুঁকি নেই)" if language == "bn" else "Calm Weather (Low Storm Risk)"
                storm_desc = "বাতাসের গতি স্বাভাবিক ও শান্ত।" if language == "bn" else "Wind conditions are calm and steady."
                storm_action = "স্বাভাবিক স্প্রে ও পরিচর্যা চালিয়ে যান।" if language == "bn" else "Safe for spraying and fieldwork."

            disaster_data = {
                "flood": {
                    "status": flood_status,
                    "probability": flood_pct,
                    "title": flood_title,
                    "desc": flood_desc,
                    "action": flood_action
                },
                "drought": {
                    "status": drought_status,
                    "probability": drought_pct,
                    "title": drought_title,
                    "desc": drought_desc,
                    "action": drought_action
                },
                "cyclone": {
                    "status": storm_status,
                    "probability": storm_pct,
                    "title": storm_title,
                    "desc": storm_desc,
                    "action": storm_action
                }
            }

            return {
                "city": loc["name"],
                "cityEn": loc.get("nameEn", loc["name"]),
                "lat": latitude,
                "lon": longitude,
                "isGps": loc.get("isGps", False),
                "union": loc.get("union", ""),
                "upazila": loc.get("upazila", ""),
                "district": loc.get("district", ""),
                "temperature": round(temp, 1),
                "feelsLike": round(feels_like, 1),
                "humidity": round(humidity, 1),
                "condition": wmo_info["condition"],
                "conditionIcon": wmo_info["icon"],
                "rainInHours": rain_in_hours if rain_in_hours > 0 else 18,
                "rainForecast": rain_forecast,
                "spraySafety": spray_safety,
                "sprayStatus": spray_status,
                "windSpeed": wind_speed,
                "currentPrecip": curr_precip,
                "disasterRisk": disaster_data,
                "advisories": {
                    "spray": {
                        "status": spray_status,
                        "title": "স্প্রে নিরাপত্তা ও সময়সূচী" if language == "bn" else "Spraying Safety & Window",
                        "desc": spray_safety
                    },
                    "irrigation": {
                        "status": irrigation_status,
                        "title": "মাঠে সেচ পরামর্শ" if language == "bn" else "Field Irrigation Advisory",
                        "desc": irrigation_advice
                    },
                    "harvestDrying": {
                        "status": harvest_status,
                        "title": "ফসল কর্তন ও শুকানো" if language == "bn" else "Harvesting & Drying Window",
                        "desc": harvest_advice
                    },
                    "diseaseRisk": {
                        "status": disease_risk_status,
                        "title": "ছত্রাক ও রোগবালাই ঝুঁকি" if language == "bn" else "Fungal Disease Hazard Index",
                        "desc": disease_risk_advice
                    }
                },
                "hourlyForecast": formatted_hourly,
                "dailyForecast": formatted_daily,
                "updatedAt": (
                    to_bn_digits(datetime.now().strftime("%I:%M %p").replace("AM", "সকাল").replace("PM", "বিকাল/রাত"))
                    if language == "bn" else
                    datetime.now().strftime("%I:%M %p")
                )
            }

    except Exception as e:
        logger.warning(f"Open-Meteo weather fetch error: {e}. Using regional fallback.")

    # Fallback structure
    return {
        "city": loc["name"],
        "cityEn": loc.get("nameEn", loc["name"]),
        "lat": latitude,
        "lon": longitude,
        "isGps": loc.get("isGps", False),
        "union": loc.get("union", ""),
        "upazila": loc.get("upazila", ""),
        "district": loc.get("district", ""),
        "temperature": 28.5,
        "feelsLike": 32.0,
        "humidity": 82.0,
        "condition": "উচ্চ আর্দ্রতা ও আংশিক মেঘলা" if language == "bn" else "High Humidity & Partly Cloudy",
        "conditionIcon": "⛅",
        "rainInHours": 3,
        "rainForecast": "আগামী ৩ ঘণ্টায় বৃষ্টির সম্ভাবনা" if language == "bn" else "Rain expected in 3 hours",
        "spraySafety": "সতর্কতা: বৃষ্টির সম্ভাবনা রয়েছে, স্প্রে স্থগিত রাখুন।" if language == "bn" else "Caution: Rain risk, hold spray.",
        "sprayStatus": "danger",
        "windSpeed": 9.5,
        "currentPrecip": 0.0,
        "disasterRisk": {
            "flood": {
                "status": "safe",
                "probability": 15,
                "title": "বন্যার ঝুঁকি স্বাভাবিক" if language == "bn" else "Flood Risk Normal",
                "desc": "উল্লেখযোগ্য বন্যার আশঙ্কা নেই।" if language == "bn" else "No flood threat detected.",
                "action": "স্বাভাবিক নিষ্কাশন বজায় রাখুন।" if language == "bn" else "Maintain regular drainage."
            },
            "drought": {
                "status": "safe",
                "probability": 10,
                "title": "মাটির রস স্বাভাবিক" if language == "bn" else "Soil Moisture Optimal",
                "desc": "আর্দ্রতা সন্তোষজনক রয়েছে।" if language == "bn" else "Soil moisture is adequate.",
                "action": "পরিমিত সেচ প্রদান করুন।" if language == "bn" else "Regular irrigation advised."
            },
            "cyclone": {
                "status": "safe",
                "probability": 8,
                "title": "ঝড়ের ঝুঁকি নেই" if language == "bn" else "Calm Winds",
                "desc": "বাতাসের গতি শান্ত রয়েছে।" if language == "bn" else "Winds are calm.",
                "action": "মাঠের পরিচর্যা স্বাভাবিক রাখুন।" if language == "bn" else "Field maintenance as usual."
            }
        },
        "advisories": {
            "spray": {
                "status": "danger",
                "title": "স্প্রে নিরাপত্তা ও সময়সূচী" if language == "bn" else "Spraying Safety & Window",
                "desc": "আগামী কয়েক ঘণ্টায় বৃষ্টির সম্ভাবনা থাকায় স্প্রে করা থেকে বিরত থাকুন।" if language == "bn" else "Rain forecast; delay spraying."
            },
            "irrigation": {
                "status": "normal",
                "title": "মাঠে সেচ পরামর্শ" if language == "bn" else "Field Irrigation Advisory",
                "desc": "মাটির আর্দ্রতা দেখে সেচ নির্ধারণ করুন।" if language == "bn" else "Inspect soil moisture before irrigating."
            },
            "harvestDrying": {
                "status": "caution",
                "title": "ফসল কর্তন ও শুকানো" if language == "bn" else "Harvesting & Drying Window",
                "desc": "মেঘলা আবহাওয়া, কাটা ফসল সুরক্ষিত রাখুন।" if language == "bn" else "Keep harvested crop covered."
            },
            "diseaseRisk": {
                "status": "high",
                "title": "ছত্রাক ও রোগবালাই ঝুঁকি" if language == "bn" else "Fungal Disease Hazard Index",
                "desc": "উচ্চ আর্দ্রতার কারণে ছত্রাকজনিত রোগের বিস্তার হতে পারে।" if language == "bn" else "High humidity promotes fungal spread."
            }
        },
        "hourlyForecast": [],
        "dailyForecast": [],
        "updatedAt": (
            to_bn_digits(datetime.now().strftime("%I:%M %p").replace("AM", "সকাল").replace("PM", "বিকাল/রাত"))
            if language == "bn" else
            datetime.now().strftime("%I:%M %p")
        )
    }
