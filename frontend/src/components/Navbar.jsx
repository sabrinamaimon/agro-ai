import React, { useState } from 'react';
import { Home, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare, MapPin, X } from 'lucide-react';
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

  const locationDisplay = gpsLocation
    ? (gpsLocation.areaName || `${gpsLocation.lat?.toFixed(1)}°N, ${gpsLocation.lon?.toFixed(1)}°E`)
    : (language === 'bn' ? 'বগুড়া • ২৪°C' : 'Bogura • 24°C');

  const isHome = activeTab === 'home';

  // ON OTHER TABS (Leaf Scanner, Weather Radar, Price Checker, Fertilizer, Crop Passport):
  // Render the regular full-width Agro navigation header
  if (!isHome) {
    return (
      <header className="navbar">
        <div className="navbar-top">
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

          <div className="navbar-center-actions">
            <button
              type="button"
              className="navbar-location-btn"
              onClick={onOpenGpsModal}
            >
              <MapPin size={13} className="text-emerald location-pin-icon" />
              <span className="navbar-location-text">{locationDisplay}</span>
              <span className="location-edit-pill">
                {gpsLocation ? (language === 'bn' ? 'পরিবর্তন' : 'Edit') : (language === 'bn' ? 'যুক্ত করুন' : 'Add')}
              </span>
            </button>

            <div className="field-ready-badge">
              <span className="pulse-dot"></span>
              <span className="field-ready-text">{language === 'bn' ? 'ফিল্ড রেডি' : 'Field Ready'}</span>
            </div>
          </div>

          <div className="navbar-right-actions">
            <div className="lang-toggle-pill" role="group">
              <button
                type="button"
                className={`lang-pill-btn ${language === 'bn' ? 'active' : ''}`}
                onClick={() => setLanguage('bn')}
              >
                বাং
              </button>
              <button
                type="button"
                className={`lang-pill-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>

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
      </header>
    );
  }

  // ON HOME SCREEN: Pure Luxury Corner Layout matching Onkur Luxury Prototype!
  return (
    <>
      <header className="onkur-proto-navbar">
        {/* Top-Left Corner: Framed Monogram + ONKUR ESTATE 2026 */}
        <div 
          className="proto-corner-left"
          onClick={() => setActiveTab('home')}
        >
          <div className="proto-logo-box">
            <img src={onkurLogo} alt="অঙ্কুর" className="w-full h-full object-cover" />
          </div>
          <div className="proto-brand-col">
            <span className="proto-brand-title font-cinzel">ONKUR</span>
            <span className="proto-brand-meta font-mono">ESTATE • 2026</span>
          </div>
        </div>

        {/* Top-Right Corner: Location Pill + Language Toggle + Menu Pill */}
        <div className="proto-corner-right">
          {/* Pill 1: Location */}
          <button 
            type="button"
            className="proto-pill-btn"
            onClick={onOpenGpsModal}
            title={language === 'bn' ? 'মাঠের অবস্থান' : 'Field Location'}
          >
            <span className="proto-loc-text font-serif-bn">{locationDisplay}</span>
          </button>

          {/* Pill 2: Language */}
          <div className="proto-lang-pill font-mono">
            <button 
              type="button"
              className={`proto-lang-opt ${language === 'bn' ? 'active' : ''}`}
              onClick={() => setLanguage('bn')}
            >
              বাং
            </button>
            <span className="proto-lang-sep">/</span>
            <button 
              type="button"
              className={`proto-lang-opt ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {/* Pill 3: Corner Menu Trigger Button */}
          <button 
            type="button"
            className="proto-menu-trigger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="proto-burger-lines">
              <span className="line line-1"></span>
              <span className="line line-2"></span>
              <span className="line line-3"></span>
            </div>
            <span className="proto-menu-label font-serif-bn font-bold">
              {language === 'bn' ? 'মেনু' : 'MENU'}
            </span>
          </button>
        </div>
      </header>

      {/* Floating Corner Dropdown Menu: Attached strictly to the Top-Right Corner */}
      {menuOpen && (
        <div 
          className="proto-menu-backdrop" 
          onClick={() => setMenuOpen(false)} 
        />
      )}

      <div className={`proto-corner-dropdown ${menuOpen ? 'open' : ''}`}>
        <div className="proto-dropdown-header">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded border border-[#C5A880]/50 overflow-hidden">
              <img src={onkurLogo} alt="অঙ্কুর" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif-bn font-bold text-white text-sm">অঙ্কুর মেনু</span>
          </div>
          <button 
            type="button"
            className="proto-dropdown-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="proto-dropdown-nav">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`proto-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMenuOpen(false);
                }}
              >
                <span className="proto-nav-idx font-mono">0{idx + 1}</span>
                <Icon size={16} />
                <span className="proto-nav-title font-serif-bn">
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
