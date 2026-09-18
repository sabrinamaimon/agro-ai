import React, { useState } from 'react';
import { Sprout, Globe, Home, Mic, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare, Menu, X, Navigation, MapPin } from 'lucide-react';

export default function Navbar({
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  gpsLocation,
  onOpenGpsModal
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'aichat', labelBn: 'ভয়েস ও এআই চ্যাট', labelEn: 'Voice & AI Chat', icon: MessageSquare },
    { id: 'task2', labelBn: 'রোগ নির্ণয়', labelEn: 'Leaf Scanner', icon: Camera },
    { id: 'task3', labelBn: 'আবহাওয়া ও স্প্রে', labelEn: 'Weather & Spray', icon: CloudRain },
    { id: 'task4', labelBn: '৳ বাজার দর', labelEn: '৳ Price Checker', icon: TrendingUp },
    { id: 'fertilizer', labelBn: 'সার ক্যালকুলেটর', labelEn: 'Fertilizer Calc', icon: Calculator },
    { id: 'task5', labelBn: 'ডিজিটাল পাসপোর্ট', labelEn: 'Digital Passport', icon: FileText }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  const locationDisplay = gpsLocation
    ? (gpsLocation.areaName || `${gpsLocation.lat?.toFixed(2)}°N, ${gpsLocation.lon?.toFixed(2)}°E`)
    : (language === 'bn' ? 'মাঠের লোকেশন নির্বাচন' : 'Set Field Location');

  return (
    <header className="navbar">
      <div className="navbar-top">
        {/* Left Mobile Menu Toggle Button */}
        <button 
          className="menu-toggle-btn" 
          onClick={() => setMenuOpen(true)} 
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Brand Logo & Title */}
        <div 
          className="navbar-brand-wrapper" 
          onClick={() => setActiveTab('home')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">
            <Sprout size={24} color="#059669" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <h1 className="logo-title">Agro-AI</h1>
            </div>
            <p className="logo-subtitle">
              {language === 'bn' ? 'কৃষি পরামর্শ ও ফিল্ড ইন্টেলিজেন্স' : 'Smart Agricultural Advisory'}
            </p>
          </div>
        </div>

        {/* Middle: Location Pill & Field Ready Status */}
        <div className="navbar-center-actions">
          <button
            type="button"
            className="navbar-location-btn"
            onClick={onOpenGpsModal}
            title={language === 'bn' ? 'মাঠের জিপিএস বা জেলা নির্বাচন করুন' : 'Select Field GPS / District'}
          >
            <MapPin size={14} className="text-emerald location-pin-icon" />
            <span className="navbar-location-text">{locationDisplay}</span>
            <span className="location-edit-pill">
              {gpsLocation ? (language === 'bn' ? 'পরিবর্তন' : 'Edit') : (language === 'bn' ? 'যুক্ত করুন' : 'Add')}
            </span>
          </button>

          <div 
            className="field-ready-badge" 
            title={language === 'bn' ? 'মাঠ পর্যায়ের অফলাইন ক্যাশ ও স্থানীয় এআই সক্রিয়' : 'Offline local cache and field models active'}
          >
            <span className="pulse-dot"></span>
            <span className="field-ready-text">{language === 'bn' ? 'ফিল্ড রেডি' : 'Field Ready'}</span>
          </div>
        </div>

        {/* Right: Language Switcher Pill */}
        <div className="navbar-right-actions">
          <div className="lang-toggle-pill" role="group" aria-label="Language Toggle">
            <button
              type="button"
              className={`lang-pill-btn ${language === 'bn' ? 'active' : ''}`}
              onClick={() => setLanguage('bn')}
              title="বাংলা ভাষা নির্বাচন করুন"
            >
              বাংলা
            </button>
            <button
              type="button"
              className={`lang-pill-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              title="Select English Language"
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav className="navbar-tabs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'task1');
          return (
            <button
              key={item.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={17} />
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Sidebar Overlay & Drawer */}
      {menuOpen && (
        <div className="sidebar-overlay animate-fade-in" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`sidebar-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Sprout size={20} color="#059669" />
            <span className="sidebar-title">Agro-AI</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-location-box">
          <button
            type="button"
            className="navbar-location-btn sidebar-loc-btn"
            onClick={() => {
              setMenuOpen(false);
              onOpenGpsModal();
            }}
          >
            <MapPin size={15} className="text-emerald" />
            <span className="navbar-location-text">{locationDisplay}</span>
          </button>
        </div>

        <div className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'task1');
            return (
              <button
                key={item.id}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={19} />
                <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}