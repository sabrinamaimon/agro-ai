import React, { useState } from 'react';
import { Sprout, Globe, Home, Mic, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare, Menu, X } from 'lucide-react';

export default function Navbar({ language, setLanguage, activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'aichat', labelBn: 'এআই চ্যাট', labelEn: 'AI Chat Prompt', icon: MessageSquare },
    { id: 'task1', labelBn: 'ভয়েস ইনপুট', labelEn: 'Voice Input', icon: Mic },
    { id: 'task2', labelBn: 'রোগ নির্ণয়', labelEn: 'Leaf Scanner', icon: Camera },
    { id: 'task3', labelBn: 'আবহাওয়া ও স্প্রে', labelEn: 'Weather & Spray', icon: CloudRain },
    { id: 'task4', labelBn: '৳ বাজার দর', labelEn: '৳ Price Checker', icon: TrendingUp },
    { id: 'fertilizer', labelBn: 'সার ক্যালকুলেটর', labelEn: 'Fertilizer Calc', icon: Calculator },
    { id: 'task5', labelBn: 'ডিজিটাল পাসপোর্ট', labelEn: 'Crop Passport', icon: FileText }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>

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

        <button 
          className="lang-toggle-btn"
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
        >
          <Globe size={18} />
          <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`sidebar-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
          <button className="sidebar-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={20} />
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}