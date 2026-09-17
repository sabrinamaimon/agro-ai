Agro-AI — Smart Agricultural Advisory & Field Intelligence Platform



Project Overview
Agro-AI is an AI-powered field intelligence platform designed to empower Bangladeshi farmers with real-time crop disease diagnosis, voice-assisted symptom intake, localized weather & spray advisory, middleman market price anomaly detection, and printable Digital Crop Passports.

Live Deployments
Frontend (Web Application): https://agro-ai-sooty.vercel.app
Backend (API Service): https://agro-ai-backend-5uto.onrender.com
Source Code: https://github.com/sabrinamaimon/agro-ai


Key Features & Hackathon Tasks

Voice Query Intake & Intent Extraction:
- Dictate crop symptoms in spoken Bengali (`bn-BD`) or English using Web Speech API.
- Extracts structured intent JSON (Crop Type, Planting Date, Observed Damage, Geographic Location).
- Pre-built 1-click sample query chips for rapid demo.

Visual Leaf Pathology Scanner:
- Upload leaf images or select sample diseased leaves (Potato Late Blight, Rice Leaf Blast, Tomato Yellow Curl Virus, Wheat Leaf Rust).
- Calculates disease severity percentage (%) and assigns 4-level risk badges (Low, Moderate, High, Severe).
- Plant part selector (Leaf, Stem, Fruit, Flower, Root) with bounding box damage visualization.

Multimodal Weather & Remedy Advisory:
- Live weather status (Temperature, Humidity, Rain Probability, Wind Speed).
- Dynamic Spray Safety window calculation (Safe / Caution / Risky).
- 4-Tier treatment regimen: Chemical remedies with PHI, Organic alternatives, Long-term cultural prevention, and Fertilizer adjustments.

Market Price Anomaly Checker:
- Middleman price undercut detector across Bangladesh districts in Taka (BDT/kg).
- Compares Official Government Fair Rate vs Local Syndicate Rate with interactive price gain calculator.
- Yield risk and revenue impact calculation based on disease damage severity.

Spoken Audio Briefing & Digital Crop Passport:
- Spoken Bengali audio briefing (`bn-BD` speech synthesis engine).
- Instant downloadable PDF Crop Passport with scannable QR Code validation.
- Field report with farmer metadata, GPS coordinates, and diagnostic summary.

Additional Modules:
AI Agro Prompt Chat: Interactive agricultural advisory interface powered by Groq LLaMA-3 models.
Soil & Fertilizer Calculator: N-P-K (Urea, TSP, DAP, MOP) dosage calculator per decimal land size.
Dual Language: Instant English (EN) and Bangla (BN) toggle in top navigation.



Tech Stack:
Frontend Framework: React 18, Vite
Styling: Vanilla CSS3 (Modern Emerald & White Palette)
Icons: Lucide React
Voice & Audio: Web Speech API (`SpeechRecognition`, `speechSynthesis`)
PDF Generation: `html2pdf.js`
Typography: Google Fonts (*Anek Bangla*, *Poppins*)
Backend Architecture: FastAPI, Python, Groq Cloud API, Open-Meteo API

Steps to Run Locally:

```bash
 1. Clone the repository
git clone https://github.com/sabrinamaimon/agro-ai.git

2. Navigate into the frontend directory
cd agro-ai/frontend

3. Install dependencies
npm install

4. Start the local development server
npm run dev
```

Open `http://localhost:5173` in Google Chrome to test the application.

