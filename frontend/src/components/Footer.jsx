import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="app-footer-minimal mt-4">
      <div className="footer-minimal-container">
        <div className="footer-mini-brand">
          <Sprout size={16} color="#059669" />
          <span className="footer-brand-name">Agro-AI</span>
        </div>
        <span className="footer-dot">•</span>
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} Agro-AI. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All Rights Reserved.'}
        </p>
        <span className="footer-dot">•</span>
        <span className="footer-event-tag">
          {language === 'bn' 
            ? 'বিইউপি সিএসই ফেস্ট ২০২৬ হ্যাকাথন (পরিধি সহযোগিতায়)' 
            : 'BUP CSE FEST 2026 Hackathon (With Poridhi)'}
        </span>
      </div>
    </footer>
  );
}
