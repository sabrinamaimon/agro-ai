import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VoiceIntake from './components/VoiceIntake';
import LeafScanner from './components/LeafScanner';
import AdvisoryPanel from './components/AdvisoryPanel';
import PriceChecker from './components/PriceChecker';
import CropPassport from './components/CropPassport';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('bn'); // Default: Bengali ('bn' or 'en')
  const [activeTab, setActiveTab] = useState('home'); // Default: 'home'
  const [intakeData, setIntakeData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  return (
    <div className="app-container">
      {/* Header & Navbar Tabs */}
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="main-layout">
        {/* Home / Landing Page */}
        {activeTab === 'home' && (
          <>
            <Hero language={language} setActiveTab={setActiveTab} />

            {/* Quick Access Task Cards on Landing Page */}
            <VoiceIntake 
              language={language} 
              onIntakeComplete={(data) => setIntakeData(data)} 
            />

            <LeafScanner 
              language={language} 
              onDiagnosisComplete={(data) => setDiagnosisData(data)} 
            />
          </>
        )}

        {/* Task 1: Voice Intake Tab */}
        {activeTab === 'task1' && (
          <VoiceIntake 
            language={language} 
            onIntakeComplete={(data) => setIntakeData(data)} 
          />
        )}

        {/* Task 2: Leaf Scanner Tab */}
        {activeTab === 'task2' && (
          <LeafScanner 
            language={language} 
            onDiagnosisComplete={(data) => setDiagnosisData(data)} 
          />
        )}

        {/* Task 3: Weather & Advisory Tab */}
        {activeTab === 'task3' && (
          <AdvisoryPanel 
            language={language} 
            diagnosis={diagnosisData} 
          />
        )}

        {/* Task 4: Market Price Checker Tab */}
        {activeTab === 'task4' && (
          <PriceChecker 
            language={language} 
            cropType={diagnosisData?.cropType || intakeData?.crop_type} 
            onPriceCheckComplete={(data) => setPriceData(data)} 
          />
        )}

        {/* Task 5: Digital Crop Passport Tab */}
        {activeTab === 'task5' && (
          <CropPassport 
            language={language} 
            intake={intakeData} 
            diagnosis={diagnosisData} 
            price={priceData} 
          />
        )}
      </main>
    </div>
  );
}