import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VoiceIntake from './components/VoiceIntake';
import LeafScanner from './components/LeafScanner';
import AdvisoryPanel from './components/AdvisoryPanel';
import PriceChecker from './components/PriceChecker';
import FertilizerCalculator from './components/FertilizerCalculator';
import AIChatPrompt from './components/AIChatPrompt';
import CropPassport from './components/CropPassport';
import GpsModal from './components/GpsModal';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('bn'); // Default: Bengali ('bn' or 'en')
  const [activeTab, setActiveTab] = useState('home'); // Default: 'home'
  const [intakeData, setIntakeData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  // Persistent Hyperlocal GPS Location (saved in browser localStorage)
  const [gpsLocation, setGpsLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_gps_location');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Prompt GPS modal on initial visit if no GPS coordinates have been saved and not dismissed in this session
  const [showGpsModal, setShowGpsModal] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_gps_location');
      const dismissed = sessionStorage.getItem('agro_gps_dismissed');
      return !saved && !dismissed;
    } catch (e) {
      return true;
    }
  });

  const handleGpsDetected = (detected) => {
    setGpsLocation(detected);
    setShowGpsModal(false);
    try {
      localStorage.setItem('agro_gps_location', JSON.stringify(detected));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleCloseGpsModal = () => {
    setShowGpsModal(false);
    try {
      sessionStorage.setItem('agro_gps_dismissed', 'true');
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  };

  const handleLoadDemoScenario = (scenarioType = 'rice') => {
    if (scenarioType === 'rice') {
      const demoIntake = language === 'bn' ? {
        crop_type: 'ধান (Rice)',
        issue_summary: 'পাতার উপর চোখের মতো বাদামি দাগ ও ডগা শুকিয়ে যাওয়া',
        geographic_union: 'গাবতলী, বগুড়া',
        confidence: 0.94
      } : {
        crop_type: 'Rice',
        issue_summary: 'Spindle-shaped brown lesions on leaves and dried leaf tips',
        geographic_union: 'Gabtali, Bogura',
        confidence: 0.94
      };
      const demoDiagnosis = language === 'bn' ? {
        name: 'ধানের ব্লাস্ট রোগ (Rice Blast)',
        cropType: 'ধান (Rice)',
        confidence: 0.96,
        severity: 'Critical (মারাত্মক)',
        damagePercentage: 38,
        affectedParts: ['পাতা (Leaf)', 'শীষ (Panicle)'],
        chemicalRemedy: 'ট্রাইসাইক্লাজোল ৭৫% ডব্লিউপি (Tricyclazole 75% WP) প্রতি লিটার পানিতে ০.৭৫ গ্রাম হারে মিশিয়ে স্প্রে করুন।',
        organicRemedy: 'কাঁচা নিম পাতার রস ও ছাইয়ের মিশ্রণ প্রয়োগ করুন এবং পরিমিত পানি নিষ্কাশন নিশ্চিত করুন।',
        sprayAdvice: 'সকালের দিকে হালকা রোদে স্প্রে করুন। বাতাসের গতি ১০ কিমি/ঘণ্টার কম হলে স্প্রে করা নিরাপদ।',
        phiDays: 14,
        diseaseHistory: 'উষ্ণ ও আর্দ্র আবহাওয়ায় ম্যাগনাপোরথে ওরিজি ছত্রাকের দ্রুত বিস্তার।'
      } : {
        name: 'Rice Blast (Magnaporthe oryzae)',
        cropType: 'Rice',
        confidence: 0.96,
        severity: 'Critical',
        damagePercentage: 38,
        affectedParts: ['Leaf', 'Panicle'],
        chemicalRemedy: 'Spray Tricyclazole 75% WP @ 0.75g per liter of water.',
        organicRemedy: 'Apply neem leaf extract & wood ash mixture; ensure good field drainage.',
        sprayAdvice: 'Spray in mild morning sunlight. Safe when wind speed is under 10 km/h.',
        phiDays: 14,
        diseaseHistory: 'Rapid proliferation of Magnaporthe oryzae in warm, humid conditions.'
      };
      const demoPrice = language === 'bn' ? {
        crop: 'ধান (Rice)',
        district: 'বগুড়া',
        marketPrice: 32.50,
        expectedLossAmount: 14200,
        yieldLossPercent: 28,
        recommendation: 'বর্তমানে স্থানীয় পাইকারি বাজারে ধানের চাহিদা ঊর্ধ্বমুখী। স্প্রে করার পর ফসল সুরক্ষিত রাখলে সর্বোচ্চ মূল্য পাওয়া যাবে।'
      } : {
        crop: 'Rice',
        district: 'Bogura',
        marketPrice: 32.50,
        expectedLossAmount: 14200,
        yieldLossPercent: 28,
        recommendation: 'Wholesale mandi demand for paddy is currently high. Preserve quality for maximum market price.'
      };
      const demoGps = language === 'bn' ? {
        lat: 24.8465,
        lon: 89.3777,
        areaName: 'গাবতলী, বগুড়া (শস্য অঞ্চল)'
      } : {
        lat: 24.8465,
        lon: 89.3777,
        areaName: 'Gabtali, Bogura (Grain Hub)'
      };

      setIntakeData(demoIntake);
      setDiagnosisData(demoDiagnosis);
      setPriceData(demoPrice);
      setGpsLocation(demoGps);
      setActiveTab('task5');
    } else {
      const demoIntake = language === 'bn' ? {
        crop_type: 'আলু (Potato)',
        issue_summary: 'পাতার কিনারা কালচে হয়ে পচন ধরা ও সাদাটে ছত্রাকের আস্তরণ',
        geographic_union: 'শিবগঞ্জ, বগুড়া',
        confidence: 0.92
      } : {
        crop_type: 'Potato',
        issue_summary: 'Dark necrotic margins with white mildew and stem rot',
        geographic_union: 'Shibganj, Bogura',
        confidence: 0.92
      };
      const demoDiagnosis = language === 'bn' ? {
        name: 'আলুর লেট ব্লাইট / নাবি ধসা (Late Blight)',
        cropType: 'আলু (Potato)',
        confidence: 0.95,
        severity: 'High (উচ্চ ঝুঁকি)',
        damagePercentage: 42,
        affectedParts: ['পাতা (Leaf)', 'কান্ড (Stem)'],
        chemicalRemedy: 'ম্যানকোজেব + মেটালাক্সিল (Mancozeb + Metalaxyl) প্রতি লিটারে ২ গ্রাম হারে স্প্রে করুন।',
        organicRemedy: 'ট্রাইকোডার্মা ও বোর্দো মিশ্রণ (১%) দ্রুত আক্রান্ত স্থানে ছিটিয়ে দিন।',
        sprayAdvice: 'কুয়াশাচ্ছন্ন সকালে স্প্রে এড়িয়ে চলুন। দুপুর ১২টার পর পাতা শুকনা থাকা অবস্থায় স্প্রে করুন।',
        phiDays: 10,
        diseaseHistory: 'ফাইটোফথোরা ইনফেস্টানস ছত্রাকজনিত সংক্রমণ।'
      } : {
        name: 'Potato Late Blight (Phytophthora infestans)',
        cropType: 'Potato',
        confidence: 0.95,
        severity: 'High',
        damagePercentage: 42,
        affectedParts: ['Leaf', 'Stem'],
        chemicalRemedy: 'Spray Mancozeb + Metalaxyl @ 2g per liter of water.',
        organicRemedy: 'Apply Trichoderma and Bordeaux mixture (1%) over affected spots.',
        sprayAdvice: 'Avoid foggy mornings. Spray after 12:00 PM once foliage dries.',
        phiDays: 10,
        diseaseHistory: 'Phytophthora infestans fungal infection.'
      };
      const demoPrice = language === 'bn' ? {
        crop: 'আলু (Potato)',
        district: 'বগুড়া',
        marketPrice: 28.00,
        expectedLossAmount: 22000,
        yieldLossPercent: 35,
        recommendation: 'রোগ নিয়ন্ত্রণ হলে পাশের মোকামে প্রতি মণে ১২০ টাকা বেশি দরে আলু বিক্রি সম্ভব।'
      } : {
        crop: 'Potato',
        district: 'Bogura',
        marketPrice: 28.00,
        expectedLossAmount: 22000,
        yieldLossPercent: 35,
        recommendation: 'Controlling disease allows selling at 120 BDT/maund premium in adjacent wholesale market.'
      };
      const demoGps = language === 'bn' ? {
        lat: 24.9816,
        lon: 89.3308,
        areaName: 'শিবগঞ্জ, বগুড়া (আলু জোন)'
      } : {
        lat: 24.9816,
        lon: 89.3308,
        areaName: 'Shibganj, Bogura (Potato Hub)'
      };

      setIntakeData(demoIntake);
      setDiagnosisData(demoDiagnosis);
      setPriceData(demoPrice);
      setGpsLocation(demoGps);
      setActiveTab('task5');
    }
  };

  return (
    <div className="app-container">
      {/* Header & Navbar Tabs */}
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gpsLocation={gpsLocation}
        onOpenGpsModal={() => setShowGpsModal(true)}
      />

      {/* Main Content Body */}
      <main className="main-layout">
        {/* Home Landing Page Hub */}
        {activeTab === 'home' && (
          <Hero 
            language={language} 
            setActiveTab={setActiveTab} 
          />
        )}

        {/* AI Agro Prompt Chat & Voice Intake Tab (Merged) */}
        {(activeTab === 'aichat' || activeTab === 'task1') && (
          <AIChatPrompt 
            language={language} 
            gpsLocation={gpsLocation}
            onIntakeComplete={(data) => setIntakeData(data)}
          />
        )}

        {/* Task 2: Leaf Scanner Tab */}
        {activeTab === 'task2' && (
          <LeafScanner 
            language={language} 
            intakeCrop={intakeData?.crop_type}
            intakeUnion={gpsLocation?.areaName || intakeData?.geographic_union}
            onDiagnosisComplete={(data) => setDiagnosisData(data)} 
          />
        )}

        {/* Task 3: Weather & Advisory Tab */}
        {activeTab === 'task3' && (
          <AdvisoryPanel 
            language={language} 
            diagnosis={diagnosisData} 
            gpsLocation={gpsLocation}
            onOpenGpsModal={() => setShowGpsModal(true)}
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
            onLoadDemo={handleLoadDemoScenario}
          />
        )}
      </main>

      {/* Professional Copyright & Farmer Helpline Footer */}
      <Footer 
        language={language} 
        setActiveTab={setActiveTab} 
      />

      {/* Hyperlocal GPS Activation & Calibration Modal */}
      <GpsModal
        isOpen={showGpsModal}
        onClose={handleCloseGpsModal}
        currentGps={gpsLocation}
        onGpsDetected={handleGpsDetected}
        language={language}
      />
    </div>
  );
}


