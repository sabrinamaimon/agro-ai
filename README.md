# 🌾 Agro-AI — Smart Agricultural Advisory & Field Intelligence Platform

> Developed for **BUP CSE FEST 2026 Hackathon** (In association with Poridhi)

---

## 📌 Project Overview
**Agro-AI** is an AI-powered field intelligence platform designed to empower Bangladeshi farmers with real-time crop disease diagnosis, voice-assisted symptom intake, localized weather & spray advisory, middleman market price anomaly detection, and printable Digital Crop Passports.

---

## ✨ Key Features & Hackathon Tasks

### 🎙️ Task 1: Voice Query Intake & Intent Extraction
- Dictate crop symptoms in spoken Bengali (`bn-BD`) or English using Web Speech API.
- Extracts structured intent JSON (Crop Type, Planting Date, Observed Damage, Geographic Location).
- Pre-built 1-click sample query chips for rapid demo.

### 🍃 Task 2: Visual Leaf Pathology Scanner
- Upload leaf images or select sample diseased leaves (Potato Late Blight, Rice Leaf Blast, Tomato Yellow Curl Virus, Wheat Leaf Rust).
- Calculates disease severity percentage (%) and assigns 4-level risk badges (Low, Moderate, High, Severe).

### 🌧️ Task 3: Multimodal Weather & Remedy Advisory
- Live weather status (Temperature, Humidity, Rain Probability).
- Organic & Chemical remedy dosages, Spray Safety Protocols, and Pre-Harvest Interval (PHI) guidance.

### ৳ Task 4: Market Price Anomaly Checker
- Middleman price undercut detector using Bangladeshi Taka (`৳/কেজি`).
- Compares Official Government Fair Rate vs Local Syndicate Rate with interactive price gain calculator.

### 📜 Task 5: Spoken Audio Briefing & Digital Crop Passport
- Spoken Bengali audio briefing (`bn-BD` text-to-speech engine).
- Instant downloadable PDF Crop Passport with scannable QR Code validation.

### 💬 Additional Modules
- **AI Agro Prompt Chat**: Interactive text prompt interface for Gemini AI agricultural Q&A.
- **Soil & Fertilizer Calculator**: N-P-K (Urea, TSP, Potash, Zinc) dosage calculator per decimal land size.
- **Dual Language**: Seamless English (EN) and Bangla (BN) toggle.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 18, Vite
- **Styling**: Vanilla CSS3 (Modern Emerald & White Palette)
- **Icons**: Lucide React
- **Voice / Speech**: Web Speech API (`SpeechRecognition`, `speechSynthesis`)
- **PDF Generation**: `html2pdf.js`
- **Typography**: Google Fonts (*Anek Bangla*, *Poppins*)

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/sabrinamaimon/agro-ai.git

# 2. Navigate into the frontend directory
cd agro-ai/frontend

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open `http://localhost:5173` in Google Chrome to test the application.

---

## 🏆 Hackathon Team
- **Frontend Lead**: Member 1 (React, Vite, UI/UX, Voice & Speech Integration)
