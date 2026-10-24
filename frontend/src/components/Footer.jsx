import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer({ language, activeTab = 'home' }) {
  // On the home screen, the seamless cinematic helpline footer is integrated into Hero.jsx
  if (activeTab === 'home') {
    return null;
  }

  return (
    <footer className="app-footer-minimal compact-footer mt-4">
      {/* Bottom Minimal Copyright */}
      <div className="footer-bottom-strip">
        <div className="footer-minimal-container">
          <div className="footer-mini-brand">
            <Sprout size={16} color="#059669" />
            <span className="footer-brand-name font-serif-bn">অঙ্কুর (Onkur)</span>
          </div>
          <span className="footer-dot">•</span>
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} অঙ্কুর (Onkur). {language === 'bn' ? 'সার্বভৌম কৃষি বুদ্ধিমত্তা প্ল্যাটফর্ম — সর্বস্বত্ব সংরক্ষিত।' : 'Sovereign Precision Agri-Intelligence — All Rights Reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
