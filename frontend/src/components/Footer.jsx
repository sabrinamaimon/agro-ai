import React from 'react';
import { Sprout, PhoneCall } from 'lucide-react';

export default function Footer({ language, activeTab = 'home' }) {
  const isHome = activeTab === 'home';

  const helplines = [
    {
      number: '16123',
      titleBn: 'কৃষি কল সেন্টার',
      titleEn: 'DAE Krishi Call Center',
      subBn: 'টোল ফ্রি সেবা',
      subEn: 'Toll Free',
      iconColor: '#059669'
    },
    {
      number: '1090',
      titleBn: 'আবহাওয়া ও দুর্যোগ বার্তা',
      titleEn: 'Disaster & Weather Alert',
      subBn: 'জরুরি পূর্বসতর্কতা',
      subEn: 'Early Warning',
      iconColor: '#2563EB'
    },
    {
      number: '333',
      titleBn: 'সরকারি তথ্য ও সেবা',
      titleEn: 'National Service Helpline',
      subBn: 'কৃষি ও নাগরিক সেবা',
      subEn: 'Citizen Services',
      iconColor: '#D97706'
    }
  ];

  return (
    <footer className={`app-footer-minimal ${isHome ? 'mt-5' : 'compact-footer mt-4'}`}>
      {/* Farmer Emergency Helplines Strip - Only on Homepage */}
      {isHome && (
        <div className="farmer-helpline-section">
          <div className="helpline-header">
            <PhoneCall size={18} color="#059669" />
            <span className="helpline-title">
              {language === 'bn' ? 'কৃষক জরুরি হেল্পলাইন (সরাসরি কল করতে ট্যাপ করুন)' : 'Farmer Emergency Helplines (Tap to Call)'}
            </span>
          </div>

          <div className="helpline-cards-row">
            {helplines.map((item, idx) => (
              <a 
                key={idx} 
                href={`tel:${item.number}`} 
                className="helpline-pill-card"
                title={language === 'bn' ? `${item.number} এ কল করুন` : `Call ${item.number}`}
              >
                <div className="helpline-icon-wrap">
                  <PhoneCall size={16} color={item.iconColor} />
                </div>
                <div className="helpline-text-wrap">
                  <div className="helpline-number-row">
                    <strong className="helpline-num">{item.number}</strong>
                    <span className="helpline-sub">{language === 'bn' ? item.subBn : item.subEn}</span>
                  </div>
                  <span className="helpline-label">{language === 'bn' ? item.titleBn : item.titleEn}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Minimal Copyright */}
      <div className="footer-bottom-strip">
        <div className="footer-minimal-container">
          <div className="footer-mini-brand">
            <Sprout size={16} color="#059669" />
            <span className="footer-brand-name">Agro-AI</span>
          </div>
          <span className="footer-dot">•</span>
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Agro-AI. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All Rights Reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
