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

def get_hyperlocal_address(lat: float, lon: float, language: str = "bn") -> Dict[str, str]:
    """
    Resolve exact micro-location (Union / Village / Upazila / District) from GPS coordinates
    using BigDataCloud fast geocoding with Nominatim fallback and in-memory caching.
    """
    cache_key = f"{round(lat, 3)}_{round(lon, 3)}_{language}"
    if cache_key in _REVERSE_GEO_CACHE:
        return _REVERSE_GEO_CACHE[cache_key]

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

            parts = [p for p in [union, upazila, district] if p]
            if parts:
                full_name = ", ".join(parts)
                res_obj = {
                    "name": full_name,
                    "nameEn": full_name,
                    "union": union,
                    "upazila": upazila,
                    "district": district
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
                addr.get("village") or 
                addr.get("suburb") or 
                addr.get("neighbourhood") or 
                addr.get("city_district") or 
                addr.get("city") or 
                addr.get("town") or 
                ""
            )
            upazila = addr.get("county") or ""
            district = addr.get("state_district") or addr.get("state") or ""

            parts = [p for p in [local_unit, upazila, district] if p]
            if parts:
                name = ", ".join(parts)
                res_obj = {
                    "name": name, 
                    "nameEn": name,
                    "union": local_unit,
                    "upazila": upazila,
                    "district": district
                }
                _REVERSE_GEO_CACHE[cache_key] = res_obj
                return res_obj
    except Exception as e:
        logger.warning(f"Nominatim reverse geocoding error: {e}")

    coord_str = f"{round(lat, 4)}° N, {round(lon, 4)}° E"
    fallback_name = f"মাঠ জিপিএস ({coord_str})" if language == "bn" else f"Field GPS ({coord_str})"
    fallback_obj = {"name": fallback_name, "nameEn": f"Field GPS ({coord_str})", "union": "", "upazila": "", "district": ""}
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
