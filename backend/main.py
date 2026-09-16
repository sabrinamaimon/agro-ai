import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import STATIC_DIR
from backend.database import engine, Base
from backend.routes.intake_routes import router as intake_router
from backend.routes.vision_routes import router as vision_router
from backend.routes.weather_routes import router as weather_router
from backend.routes.market_routes import router as market_router
from backend.routes.passport_routes import router as passport_router

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agro-AI Backend API",
    description="AI-Driven Climate-Resilient Agricultural Advisory & Crop Health Platform",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder for images and audio files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Register Routers
app.include_router(intake_router)
app.include_router(vision_router)
app.include_router(weather_router)
app.include_router(market_router)
app.include_router(passport_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Agro-AI Field Intelligence Platform",
        "version": "1.0.0",
        "tasks_supported": [
            "Task 1: Voice-Guided Farmer Query Intake & Intent Extraction",
            "Task 2: Visual Crop Disease Detection & Damage Severity Estimation",
            "Task 3: Multimodal Agronomic Reasoning & Treatment Engine",
            "Task 4: Yield Risk & Market Price Anomaly Detection",
            "Task 5: Bengali Audio Advisory & Digital Crop Passport Generation"
        ]
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Agro-AI API. Access Swagger documentation at /docs",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
