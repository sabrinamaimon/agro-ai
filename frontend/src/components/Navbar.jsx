import React from 'react';
import { Sprout, Globe, ShieldCheck } from 'lucide-react';

export default function Navbar({ language, setLanguage }) {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <Sprout size={28} color="#10B981" />
        </div>
        <div>
          <h1 className="logo-title">Agro-AI</h1>
          <p className="logo-subtitle">
            {language === 'bn' ? 'কৃষি পরামর্শ ও ফিল্ড ইন্টেলিজেন্স প্ল্যাটফর্ম' : 'AI-Driven Agro-Advisory & Field Platform'}
          </p>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="badge-live">
          <ShieldCheck size={16} />
          <span>BUP CSE FEST 2026</span>
        </div>

        <button 
          className="lang-toggle-btn"
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
        >
          <Globe size={18} />
          <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
        </button>
      </div>
    </header>
  );
}
