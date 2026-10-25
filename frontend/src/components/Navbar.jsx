import React, { useState } from 'react';
import { Home, Camera, CloudRain, TrendingUp, FileText, Calculator, MessageSquare, MapPin, X } from 'lucide-react';
import onkurLogo from '../assets/onkur-logo.png';
import { findNearestDistrict } from '../data/bangladeshDistricts';

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

  const getLocationDisplay = (gps, lang) => {
    if (!gps) return lang === 'bn' ? 'মাঠের লোকেশন নির্বাচন' : 'Set Field Location';
    const name = gps.areaName || '';
    if (name && !name.includes('জিপিএস') && !name.includes('GPS') && !name.includes('°')) {
      return name;
    }
    if (gps.district && !gps.district.includes('°') && !gps.district.includes('জিপিএস')) {
      return lang === 'bn' ? `${gps.district} অঞ্চল` : `${gps.district} Hub`;
    }
    if (gps.lat && gps.lon) {
      const nearest = findNearestDistrict(gps.lat, gps.lon);
      return lang === 'bn' ? `${nearest.nameBn} অঞ্চল` : `${nearest.nameEn} Hub`;
    }
    return lang === 'bn' ? 'মাঠের লোকেশন নির্বাচন' : 'Set Field Location';
  };

  const locationDisplay = getLocationDisplay(gpsLocation, language);

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
          title={language === 'bn' ? 'হোমে ফিরে যান' : 'Go to Home'}
        >
          <div className="proto-logo-box">
            <img src={onkurLogo} alt="অঙ্কুর" className="proto-logo-img" />
          </div>
          <div className="proto-brand-col">
            <div className="proto-brand-title-row">
              <span className="proto-brand-title font-cinzel">ONKUR</span>
              <span className="proto-brand-bn font-serif-bn">অঙ্কুর</span>
            </div>
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
            onClick={() => setMenuOpen(true)}
            aria-label="Open Navigation Menu"
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

      {/* Slide-In Corner Drawer Overlay & Luxury Sidebar */}
      {menuOpen && (
        <div 
          className="proto-drawer-backdrop" 
          onClick={() => setMenuOpen(false)} 
        />
      )}

      <aside className={`proto-corner-drawer ${menuOpen ? 'open' : ''}`} aria-label="Navigation Menu">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand-block">
            <div className="drawer-logo-chip">
              <img src={onkurLogo} alt="অঙ্কুর" className="drawer-logo-img" />
            </div>
            <div className="drawer-brand-text">
              <span className="drawer-brand-title font-cinzel">ONKUR ESTATE</span>
              <span className="drawer-brand-sub font-serif-bn">
                {language === 'bn' ? 'ন্যাভিগেশন মেনু' : 'Navigation Menu'}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="drawer-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Location Info Pill */}
        <div 
          className="drawer-location-badge" 
          onClick={() => { onOpenGpsModal(); setMenuOpen(false); }}
          title={language === 'bn' ? 'মাঠের অবস্থান পরিবর্তন' : 'Change Field Location'}
        >
          <div className="drawer-loc-inner">
            <span className="live-ping-dot"></span>
            <span className="font-serif-bn text-xs text-slate-200">{locationDisplay}</span>
          </div>
          <span className="font-mono text-xs text-gold">GPS 📍</span>
        </div>

        {/* Navigation Links */}
        <nav className="drawer-nav-list">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`drawer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMenuOpen(false);
                }}
              >
                <div className="drawer-item-left">
                  <span className="drawer-item-idx font-mono">0{idx + 1}</span>
                  <div className="drawer-icon-wrap">
                    <Icon size={17} />
                  </div>
                  <span className="drawer-item-label font-serif-bn">
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                </div>
                {isActive && <span className="drawer-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="drawer-helpline-box">
            <span className="font-serif-bn text-xs text-muted-sub">
              {language === 'bn' ? 'জরুরি কৃষক হেল্পলাইন:' : 'Farmer Emergency Line:'}
            </span>
            <strong className="font-mono text-gold text-sm tracking-wider">
              16123 ({language === 'bn' ? 'টোল-ফ্রি' : 'Toll-Free'})
            </strong>
          </div>
          <div className="drawer-copyright font-mono">
            <span>© 2026 ONKUR</span>
          </div>
        </div>
      </aside>
    </>
  );
}
