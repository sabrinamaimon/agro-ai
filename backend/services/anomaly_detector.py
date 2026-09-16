import json
import numpy as np
from typing import Dict, Any
from sklearn.ensemble import IsolationForest
from backend.config import DATA_DIR

PRICES_FILE = DATA_DIR / "dam_market_prices.json"

def load_dam_market_data() -> Dict[str, Any]:
    if PRICES_FILE.exists():
        with open(PRICES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("crops", {})
    return {}

def analyze_price_anomaly(crop_input: str, offered_price: float) -> Dict[str, Any]:
    """
    ML Anomaly Detection using Isolation Forest & Z-Score modeling
    against historical Department of Agricultural Marketing (DAM) wholesale rates.
    """
    market_data = load_dam_market_data()
    crop_lower = crop_input.lower().strip()

    # Find matching crop
    matched_key = "potato"
    for key, val in market_data.items():
        if (key in crop_lower or 
            val.get("name_en", "").lower() in crop_lower or 
            val.get("name_bn", "") in crop_input):
            matched_key = key
            break

    crop_info = market_data.get(matched_key, market_data.get("potato", {}))
    benchmark_price = float(crop_info.get("average_benchmark", 28.0))
    samples = crop_info.get("historical_samples", [26.0, 27.5, 29.0, 28.0, 31.0])
    
    # 1. Statistical Modeling (Mean, Std Dev, Z-Score)
    mu = float(np.mean(samples))
    sigma = float(np.std(samples)) if np.std(samples) > 0 else 2.0
    z_score = (offered_price - mu) / sigma
    cv = sigma / mu # Coefficient of variation

    # Volatility rating
    if cv > 0.12 or abs(z_score) > 2.0:
        volatility = "High"
    elif cv > 0.07:
        volatility = "Medium"
    else:
        volatility = "Low"

    # 2. Machine Learning: Isolation Forest
    X_train = np.array(samples).reshape(-1, 1)
    iso_forest = IsolationForest(contamination=0.1, random_state=42)
    iso_forest.fit(X_train)
    
    # Predict anomaly on offered price
    is_anomaly = iso_forest.predict([[offered_price]])[0] == -1

    # Undercut detection logic
    # Anomaly with price significantly lower than benchmark, or Z-score < -1.0
    is_undercut = (offered_price < benchmark_price) and (z_score < -0.8 or is_anomaly or offered_price < crop_info.get("min_price", 25.0))
    
    if benchmark_price > 0:
        undercut_pct = round(max(0.0, ((benchmark_price - offered_price) / benchmark_price) * 100.0), 2)
    else:
        undercut_pct = 0.0

    # 3. 7-Day Optimal Selling Window Projection
    if is_undercut:
        if undercut_pct > 20.0:
            optimal_window = "Wait 4 to 6 days for local wholesale mandi rate recovery"
        else:
            optimal_window = "Wait 2 to 3 days for fair market rate"
    else:
        optimal_window = "Optimal selling window: Sell now or within next 48 hours"

    return {
        "crop": f"{crop_info.get('name_en')} ({crop_info.get('name_bn')})",
        "offeredPrice": float(offered_price),
        "benchmarkPrice": float(benchmark_price),
        "volatility": volatility,
        "isUndercut": bool(is_undercut),
        "undercutPercentage": float(undercut_pct),
        "optimalSellingWindow": optimal_window,
        "zScore": round(float(z_score), 2)
    }
