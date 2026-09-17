import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VoiceIntake from './components/VoiceIntake';
import LeafScanner from './components/LeafScanner';
import AdvisoryPanel from './components/AdvisoryPanel';
import PriceChecker from './components/PriceChecker';
import FertilizerCalculator from './components/FertilizerCalculator';
import AIChatPrompt from './components/AIChatPrompt';
import CropPassport from './components/CropPassport';
import LocationModal from './components/LocationModal';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('bn'); // Default: Bengali ('bn' or 'en')
  const [activeTab, setActiveTab] = useState('home'); // Default: 'home'
  const [intakeData, setIntakeData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  // Persistent User Location (saved in browser localStorage)
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_user_location');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Prompt location selector on initial visit if no location has been stored
  const [showLocationModal, setShowLocationModal] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_user_location');
      return !saved;
    } catch (e) {
      return true;
    }
  });

  const handleSelectLocation = (loc) => {
    setUserLocation(loc);
    try {
      localStorage.setItem('agro_user_location', JSON.stringify(loc));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setShowLocationModal(false);
  };

  return (
    <div className="app-container">
      {/* Header & Navbar Tabs */}
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userLocation={userLocation}
        onOpenLocationModal={() => setShowLocationModal(true)}
      />

      {/* Main Content Body */}
      <main className="main-layout">
        {/* Home Landing Page Hub */}
        {activeTab === 'home' && (
          <Hero language={language} setActiveTab={setActiveTab} />
        )}

        {/* AI Agro Prompt Chat Tab */}
        {activeTab === 'aichat' && (
          <AIChatPrompt 
            language={language} 
          />
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
            intakeCrop={intakeData?.crop_type}
            intakeUnion={userLocation?.nameBn || intakeData?.geographic_union}
            onDiagnosisComplete={(data) => setDiagnosisData(data)} 
          />
        )}

        {/* Task 3: Weather & Advisory Tab */}
        {activeTab === 'task3' && (
          <AdvisoryPanel 
            language={language} 
            diagnosis={diagnosisData} 
            userLocation={userLocation}
            onOpenLocationModal={() => setShowLocationModal(true)}
            setActiveTab={setActiveTab}
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

        {/* Fertilizer Calculator Tab */}
        {activeTab === 'fertilizer' && (
          <FertilizerCalculator 
            language={language} 
          />
        )}

        {/* Task 5: Digital Crop Passport Tab */}
        {activeTab === 'task5' && (
          <CropPassport 
            language={language} 
            intake={intakeData} 
            diagnosis={diagnosisData} 
            price={priceData} 
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Global Location Selection Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
        language={language}
      />
    </div>
  );
}

