import React, { useState } from 'react';
import { Home, Mic, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare, Menu, X, MapPin } from 'lucide-react';
import onkurLogo from '../assets/onkur-logo.png';

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
    { id: 'home', labelBn: 'হোম ও মাঠ পরিচিতি', labelEn: 'Home & Estate', icon: Home },
    { id: 'aichat', labelBn: 'ভয়েস ও এআই চ্যাট', labelEn: 'Voice & AI Chat', icon: MessageSquare },
    { id: 'task2', labelBn: 'এআই রোগ নির্ণয়', labelEn: 'Leaf Pathology Lens', icon: Camera },
    { id: 'task3', labelBn: 'আবহাওয়া ও স্প্রে', labelEn: 'Weather & Spray Radar', icon: CloudRain },
    { id: 'task4', labelBn: '৳ শস্যের বাজার দর', labelEn: '৳ Commodity Exchange', icon: TrendingUp },
    { id: 'fertilizer', labelBn: 'সার ও সেচ ক্যালকুলেটর', labelEn: 'Fertilizer Calculator', icon: Calculator },
    { id: 'task5', labelBn: 'ডিজিটাল ক্রপ পাসপোর্ট', labelEn: 'Digital Crop Passport', icon: FileText }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  const locationDisplay = gpsLocation
    ? (gpsLocation.areaName || `${gpsLocation.lat?.toFixed(2)}°N, ${gpsLocation.lon?.toFixed(2)}°E`)
    : (language === 'bn' ? 'মাঠের লোকেশন নির্বাচন' : 'Set Field Location');

  const isHome = activeTab === 'home';

  return (
    <header className={`navbar ${isHome ? 'navbar-home-corner' : ''}`}>
      <div className="navbar-top">
        
        {/* Brand Logo & Title (Top-Left Corner) */}
        <div 
          className="navbar-brand-wrapper" 
          onClick={() => setActiveTab('home')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="onkur-nav-logo-box">
            <img src={onkurLogo} alt="অঙ্কুর" className="onkur-nav-logo-img" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <h1 className="logo-title font-serif-bn">অঙ্কুর</h1>
              <span className="logo-badge-en font-cinzel">ONKUR</span>
            </div>
            <p className="logo-subtitle">
              {language === 'bn' ? 'সার্বভৌম কৃষি বুদ্ধিমত্তা প্ল্যাটফর্ম' : 'Sovereign Precision Agri-Estate'}
            </p>
          </div>
        </div>

        {/* Middle: Field Location Pill (On non-home or integrated) */}
        <div className="navbar-center-actions">
          <button
            type="button"
            className="navbar-location-btn"
            onClick={onOpenGpsModal}
            title={language === 'bn' ? 'মাঠের জিপিএস বা জেলা নির্বাচন করুন' : 'Select Field GPS / District'}
          >
            <MapPin size={13} className="text-emerald location-pin-icon" />
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

        {/* Right Corner: Language Switcher & Corner Menu Trigger Button */}
        <div className="navbar-right-actions">
          {/* Language Toggle Pill */}
          <div className="lang-toggle-pill" role="group" aria-label="Language Toggle">
            <button
              type="button"
              className={`lang-pill-btn ${language === 'bn' ? 'active' : ''}`}
              onClick={() => setLanguage('bn')}
              title="বাংলা ভাষা"
            >
              বাং
            </button>
            <button
              type="button"
              className={`lang-pill-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Corner Menu Button (Always Available & Elegant) */}
          <button 
            type="button"
            className="corner-menu-trigger-btn" 
            onClick={() => setMenuOpen(true)} 
            aria-label="Open navigation menu"
            title={language === 'bn' ? 'মেনু খুলুন' : 'Open Menu'}
          >
            <Menu size={18} strokeWidth={2.4} />
            <span className="corner-menu-text font-serif-bn">
              {language === 'bn' ? 'মেনু' : 'Menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs (Hidden on Home for pure fullscreen immersion) */}
      {!isHome && (
        <nav className="navbar-tabs animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'task1');
            return (
              <button
                key={item.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Slide-In Corner Drawer Overlay & Luxury Sidebar */}
      {menuOpen && (
        <div className="sidebar-overlay animate-fade-in" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`sidebar-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-box">
              <img src={onkurLogo} alt="অঙ্কুর" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="sidebar-title font-serif-bn">অঙ্কুর</span>
              <span className="sidebar-subtitle font-cinzel text-gold">ONKUR ESTATE</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
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
            <MapPin size={14} className="text-emerald" />
            <span className="navbar-location-text">{locationDisplay}</span>
          </button>
        </div>

        <div className="sidebar-nav-list">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'task1');
            return (
              <button
                key={item.id}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="sidebar-item-index font-mono">0{idx + 1}</span>
                <Icon size={18} />
                <span className="sidebar-item-label font-serif-bn">{language === 'bn' ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer-info font-mono">
          <div className="text-[10px] text-muted">SOVEREIGN AGRI-INTELLIGENCE • 2026</div>
          <div className="text-[11px] text-gold font-bold">ALLUVIAL DELTA PROTOCOL</div>
        </div>
      </aside>
    </header>
  );
}
