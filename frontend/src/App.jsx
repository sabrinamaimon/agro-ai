import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceIntake from './components/VoiceIntake';
import LeafScanner from './components/LeafScanner';
import AdvisoryPanel from './components/AdvisoryPanel';
import PriceChecker from './components/PriceChecker';
import CropPassport from './components/CropPassport';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('bn'); // Default: Bengali ('bn' or 'en')
  const [intakeData, setIntakeData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  return (
    <div className="app-container">
      {/* Header & Language Toggle */}
      <Navbar language={language} setLanguage={setLanguage} />

      {/* 5-Task Hackathon Grid Layout */}
      <main className="main-grid">
        {/* Task 1: Voice Intake & NLP Intent */}
        <VoiceIntake 
          language={language} 
          onIntakeComplete={(data) => setIntakeData(data)} 
        />

        {/* Task 2: Visual Disease Computer Vision Scanner */}
        <LeafScanner 
          language={language} 
          onDiagnosisComplete={(data) => setDiagnosisData(data)} 
        />

        {/* Task 3: Multimodal Agronomic Reasoning & Remedy Engine */}
        <AdvisoryPanel 
          language={language} 
          diagnosis={diagnosisData} 
        />

        {/* Task 4: Market Price Anomaly Detection & Selling Window */}
        <PriceChecker 
          language={language} 
          cropType={diagnosisData?.cropType || intakeData?.crop_type} 
          onPriceCheckComplete={(data) => setPriceData(data)} 
        />

        {/* Task 5: Spoken Bengali Advisory & Digital Crop Passport */}
        <div className="full-width">
          <CropPassport 
            language={language} 
            intake={intakeData} 
            diagnosis={diagnosisData} 
            price={priceData} 
          />
        </div>
      </main>
    </div>
  );
}