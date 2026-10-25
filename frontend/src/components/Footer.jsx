import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer({ language = 'bn', activeTab = 'home', setActiveTab }) {
  const scrollToHomeSection = (sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 70;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    if (activeTab !== 'home') {
      if (setActiveTab) {
        setActiveTab('home');
      }
      setTimeout(doScroll, 120);
      setTimeout(doScroll, 320);
    } else {
      doScroll();
    }
  };

  return (
    <footer id="footer-section" className="app-main-footer">
      <div className="footer-inner-container">
        
        {/* Top Grid: 3 Main Structured Columns */}
        <div className="footer-columns-grid">
          
          {/* Column 1: Organization Identity & Direct Contacts */}
          <div className="footer-col-identity">
            <div className="footer-brand-header">
              <div className="footer-brand-logo-icon">
                <Sprout size={20} color="#10B981" />
              </div>
              <div>
                <h3 className="footer-brand-title font-serif-bn">
                  {language === 'bn' ? 'অঙ্কুর (Onkur Agro AI)' : 'Onkur Agro AI'}
                </h3>
                <p className="footer-brand-tagline font-cinzel">
                  SOVEREIGN AGRI-INTELLIGENCE
                </p>
              </div>
            </div>

            <p className="footer-about-text font-serif-bn">
              {language === 'bn' 
                ? 'বাংলাদেশের ক্ষুদ্র ও প্রান্তিক কৃষকদের জন্য ডেডিকেটেড কৃত্রিম বুদ্ধিমত্তা চালিত শস্য স্বাস্থ্য সুরক্ষা ও সিদ্ধান্ত সহায়তাকারী প্ল্যাটফর্ম।'
                : 'Sovereign precision agri-intelligence platform dedicated to smallholder growers across Bangladesh.'}
            </p>

            <div className="footer-contact-details font-serif-bn">
              <div className="footer-contact-row">
                <span className="contact-icon">📍</span>
                <span>
                  {language === 'bn' 
                    ? 'কৃষি গবেষণা ও সম্প্রসারণ কেন্দ্র, খামারবাড়ি, ফার্মগেট, ঢাকা-১২১৫' 
                    : 'Agri Research & Extension Center, Khamarbari, Farmgate, Dhaka-1215'}
                </span>
              </div>
              <div className="footer-contact-row">
                <span className="contact-icon">✉️</span>
                <a href="mailto:support@onkur.ag" className="font-mono text-gold-hover">
                  support@onkur.ag
                </a>
              </div>
            </div>

            {/* Farmer Helpline Box */}
            <div className="footer-helpline-card">
              <div className="helpline-card-header">
                <span className="font-serif-bn text-gold font-bold text-xs">
                  {language === 'bn' ? 'জরুরি কৃষক সহায়তা লাইন:' : 'Farmer Emergency Helplines:'}
                </span>
                <span className="badge-toll-free font-serif-bn">
                  {language === 'bn' ? 'টোল-ফ্রি' : 'Toll-Free'}
                </span>
              </div>
              <div className="helpline-numbers-row font-mono">
                <a href="tel:16123" className="helpline-pill">16123 (কৃষি)</a>
                <a href="tel:1090" className="helpline-pill">1090 (দুর্যোগ)</a>
                <a href="tel:333" className="helpline-pill">333 (নাগরিক সেবা)</a>
              </div>
              <div className="helpline-timings font-serif-bn">
                {language === 'bn' 
                  ? '(সার্বক্ষণিক এআই সমাধান ও কল সেন্টার: সকাল ৯টা - বিকাল ৫টা)'
                  : '(24/7 AI diagnosis & Call Center: 9:00 AM - 5:00 PM)'}
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links & Tools */}
          <div className="footer-col-links">
            <h4 className="footer-section-title font-serif-bn">
              <span>🔗</span> 
              <span>{language === 'bn' ? 'প্রয়োজনীয় লিংক ও সেবা' : 'Useful Links & Services'}</span>
            </h4>
            
            <ul className="footer-links-list font-serif-bn">
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab && setActiveTab('task2')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'ফসলের রোগ স্ক্যান নির্দেশিকা' : 'Crop Disease Scanner'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab && setActiveTab('task5')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'ডিজিটাল ক্রপ পাসপোর্ট ভেরিফিকেশন' : 'Digital Crop Passport'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab && setActiveTab('fertilizer')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'সার ও পুষ্টি পরিমাপক ক্যালকুলেটর' : 'Fertilizer Calculator'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab && setActiveTab('task4')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'মোকাম ও পাইকারি বাজার দর' : 'Mandi Market Prices'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollToHomeSection('how-it-works')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'অ্যাপের সচিত্র গাইড (How It Works)' : 'Illustrated App Guide'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollToHomeSection('our-vision')} 
                  className="footer-nav-link"
                >
                  <span>{language === 'bn' ? 'আমাদের উদ্দেশ্য ও রূপকল্প' : 'Our Mission & Vision'}</span>
                  <span className="link-arrow">↗</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media & App Download */}
          <div className="footer-col-social">
            <div className="footer-social-block">
              <h4 className="footer-section-title font-serif-bn">
                {language === 'bn' ? 'সামাজিক মাধ্যমে অঙ্কুর' : 'Connect on Social Media'}
              </h4>
              <div className="footer-social-icons">
                <a href="#" title="Facebook" className="social-icon-btn fb" aria-label="Facebook">
                  f
                </a>
                <a href="#" title="YouTube" className="social-icon-btn yt" aria-label="YouTube">
                  ▶
                </a>
                <a href="#" title="LinkedIn" className="social-icon-btn in" aria-label="LinkedIn">
                  in
                </a>
                <a href="#" title="WhatsApp" className="social-icon-btn wa" aria-label="WhatsApp">
                  💬
                </a>
              </div>
            </div>

            {/* Google Play Store Badge Box */}
            <div className="footer-app-download-block">
              <span className="app-download-label font-serif-bn">
                {language === 'bn' ? 'কৃষক মোবাইল অ্যাপ ডাউনলোড:' : 'Download Farmer Mobile App:'}
              </span>
              <a href="#" className="playstore-badge-card" title="Download on Google Play">
                <span className="playstore-icon">▶</span>
                <div className="playstore-text">
                  <span className="playstore-sub font-mono">GET IT ON</span>
                  <span className="playstore-main font-mono">Google Play</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="footer-bottom-bar font-serif-bn">
          <p>
            &copy; {new Date().getFullYear()} অঙ্কুর (Onkur Agro AI).{' '}
            <span className="text-muted-sub">
              {language === 'bn' 
                ? 'সার্বভৌম নির্ভুল কৃষি বুদ্ধিমত্তা — সর্বস্বত্ব সংরক্ষিত।' 
                : 'Sovereign precision agri-intelligence — All rights reserved.'}
            </span>
          </p>
          <p className="footer-country-tag">
            <span>{language === 'bn' ? 'বাংলাদেশের জন্য নিবেদিত' : 'Dedicated to Bangladesh'}</span>
            <span>🇧🇩</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
