import React from 'react';
import { Sprout, Globe, Type, Home, Mic, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare } from 'lucide-react';

export default function Navbar({ language, setLanguage, activeTab, setActiveTab, selectedFont, setSelectedFont }) {
  const fontOptions = [
    { id: 'jakarta', name: 'Plus Jakarta + Hind Siliguri (Modern Tech)' },
    { id: 'poppins', name: 'Poppins + Anek Bangla (Friendly & Bold)' },
    { id: 'outfit', name: 'Outfit + Noto Sans BN (Futuristic AI)' },
    { id: 'sora', name: 'Sora + Siliguri (Sleek Rounded)' },
    { id: 'space', name: 'Space Grotesk + Noto Sans (Ultra Tech)' },
    { id: 'inter', name: 'Inter + Noto Sans (Classic Minimal)' }
  ];

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'aichat', labelBn: 'এআই চ্যাট', labelEn: 'AI Chat Prompt', icon: MessageSquare },
    { id: 'task1', labelBn: 'ভয়েসে সমস্যা বলুন', labelEn: 'Voice Input', icon: Mic },
    { id: 'task2', labelBn: 'রোগ নির্ণয়', labelEn: 'Leaf Scanner', icon: Camera },
    { id: 'task3', labelBn: 'আবহাওয়া ও স্প্রে', labelEn: 'Weather & Spray', icon: CloudRain },
    { id: 'task4', labelBn: '৳ বাজার দর', labelEn: '৳ Price Checker', icon: TrendingUp },
    { id: 'fertilizer', labelBn: 'সার ক্যালকুলেটর', labelEn: 'Fertilizer Calc', icon: Calculator },
    { id: 'task5', labelBn: 'ডিজিটাল পাসপোর্ট', labelEn: 'Crop Passport', icon: FileText }
  ];

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Sprout size={28} color="#059669" />
          </div>
          <div>
            <h1 className="logo-title">Agro-AI</h1>
            <p className="logo-subtitle">
              {language === 'bn' ? 'কৃষি পরামর্শ ও ফিল্ড ইন্টেলিজেন্স প্ল্যাটফর্ম' : 'Smart Agricultural Advisory Platform'}
            </p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Font Selector Demo Tool */}
          <div className="font-select-box" title="Change Font Demo Live">
            <Type size={16} color="#059669" />
            <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
              {fontOptions.map(font => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </select>
          </div>

          <button 
            className="lang-toggle-btn"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          >
            <Globe size={18} />
            <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="navbar-tabs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
