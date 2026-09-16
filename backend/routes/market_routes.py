from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.schema import MarketCheck
from backend.schemas.pydantic_models import PriceAnomalyRequest, PriceAnomalyResponse
from backend.services.anomaly_detector import analyze_price_anomaly, load_dam_market_data

router = APIRouter(prefix="/api", tags=["Task 4: Market Price Anomaly Detection"])

@router.post("/price-anomaly", response_model=PriceAnomalyResponse)
async def check_price_anomaly_endpoint(payload: PriceAnomalyRequest, db: Session = Depends(get_db)):
    result = analyze_price_anomaly(crop_input=payload.crop, offered_price=payload.offeredPrice)

    # Log to Database
    log_entry = MarketCheck(
        crop_name=payload.crop,
        offered_price=payload.offeredPrice,
        benchmark_price=result["benchmarkPrice"],
        is_undercut=result["isUndercut"],
        undercut_pct=result["undercutPercentage"],
        volatility=result["volatility"],
        optimal_window=result["optimalSellingWindow"]
    )
    db.add(log_entry)
    db.commit()

    return PriceAnomalyResponse(
        crop=result["crop"],
        offeredPrice=result["offeredPrice"],
        benchmarkPrice=result["benchmarkPrice"],
        volatility=result["volatility"],
        isUndercut=result["isUndercut"],
        undercutPercentage=result["undercutPercentage"],
        optimalSellingWindow=result["optimalSellingWindow"]
    )

@router.get("/market-benchmarks")
async def get_market_benchmarks():
    data = load_dam_market_data()
    benchmarks = []
    for k, v in data.items():
        benchmarks.append({
            "id": k,
            "crop": f"{v.get('name_en')} ({v.get('name_bn')})",
            "averagePrice": v.get("average_benchmark"),
            "minPrice": v.get("min_price"),
            "maxPrice": v.get("max_price"),
            "unit": v.get("unit")
        })
    return benchmarks
