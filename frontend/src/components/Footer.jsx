import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart, ExternalLink, Activity, Award } from 'lucide-react';

export default function Footer({ language, setActiveTab }) {
  return (
    <footer className="app-footer mt-5">
      <div className="footer-top-grid">
        {/* Col 1: Brand & Hackathon Info */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Sprout size={24} color="#10B981" />
            </div>
            <div>
              <h3 className="footer-brand-title">Agro-AI</h3>
              <p className="footer-brand-sub">
                {language === 'bn' ? 'স্মার্ট কৃষি ও ফিল্ড ইন্টেলিজেন্স' : 'Smart Agriculture & Field Intelligence'}
              </p>
            </div>
          </div>
          <p className="footer-mission-text">
            {language === 'bn'
              ? 'কৃষি কর্মকর্তা ও প্রান্তিক কৃষকদের জন্য এআই চালিত রোগ নির্ণয়, রিয়েল-টাইম আবহাওয়া ও শস্যের বাজার মূল্য সহায়তা প্ল্যাটফর্ম।'
              : 'AI-driven plant disease diagnostics, micro-climate weather forecasting, and market price intelligence for farmers.'}
          </p>
          <div className="footer-hackathon-badge">
            <Award size={16} className="text-emerald" />
            <span>
              {language === 'bn' 
                ? 'বিইউপি সিএসই ফেস্ট ২০২৬ হ্যাকাথন (পরিধি সহযোগিতায়)' 
                : 'BUP CSE FEST 2026 Hackathon (With Poridhi)'}
            </span>
          </div>
        </div>

        {/* Col 2: Quick Features Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            {language === 'bn' ? 'প্রয়োজনীয় সেবাসমূহ' : 'Quick Services'}
          </h4>
          <ul className="footer-nav-list">
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('home')}>
                {language === 'bn' ? 'হোম পেজ' : 'Home'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('aichat')}>
                {language === 'bn' ? 'ভয়েস ও এআই চ্যাট' : 'Voice & AI Chat'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('task2')}>
                {language === 'bn' ? 'পাতার রোগ নির্ণয়' : 'Crop Disease Scanner'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('task3')}>
                {language === 'bn' ? 'আবহাওয়া ও স্প্রে পরামর্শ' : 'Weather & Spray Advisory'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('task4')}>
                {language === 'bn' ? 'বাজার দর ও যাচাই' : 'Market Price Anomaly'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('task5')}>
                {language === 'bn' ? 'ডিজিটাল শস্য পাসপোর্ট' : 'Digital Crop Passport'}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Farmer Emergency Hotlines */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            {language === 'bn' ? 'কৃষক জরুরি হেল্পলাইন' : 'Farmer Helplines'}
          </h4>
          <div className="footer-helpline-cards">
            <a href="tel:16123" className="helpline-item">
              <PhoneCall size={18} className="text-emerald" />
              <div>
                <strong>16123</strong>
                <span>{language === 'bn' ? 'কৃষি কল সেন্টার (টোল ফ্রি)' : 'DAE Krishi Call Center (Toll Free)'}</span>
              </div>
            </a>
            <a href="tel:1090" className="helpline-item">
              <PhoneCall size={18} className="text-blue" />
              <div>
                <strong>1090</strong>
                <span>{language === 'bn' ? 'আবহাওয়া ও দুর্যোগ বার্তা' : 'Disaster & Weather Alert'}</span>
              </div>
            </a>
            <a href="tel:333" className="helpline-item">
              <PhoneCall size={18} className="text-amber" />
              <div>
                <strong>333</strong>
                <span>{language === 'bn' ? 'সরকারি তথ্য ও সেবা' : 'National Service Helpline'}</span>
              </div>
            </a>
          </div>
        </div>

        {/* Col 4: Team Credits */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            {language === 'bn' ? 'টিম এগ্রো-এআই' : 'Team Agro-AI'}
          </h4>
          <div className="team-credit-list">
            <div className="team-member-item">
              <div className="team-dot" />
              <div>
                <strong>Sabrina Maimon</strong>
                <span>{language === 'bn' ? 'ফ্রন্টএন্ড লিড ও সিস্টেম আর্কিটেক্ট' : 'Frontend Lead & Architecture'}</span>
              </div>
            </div>
            <div className="team-member-item">
              <div className="team-dot" />
              <div>
                <strong>Md Shifat Reza</strong>
                <span>{language === 'bn' ? 'এআই সিস্টেম ও রিজন মডেল' : 'AI Systems & Reasoning Engine'}</span>
              </div>
            </div>
            <div className="team-member-item">
              <div className="team-dot" />
              <div>
                <strong>Sadia Binte Alam</strong>
                <span>{language === 'bn' ? 'কম্পিউটার ভিশন ও প্যাথলজি' : 'Computer Vision & Crop Pathology'}</span>
              </div>
            </div>
          </div>

          <div className="footer-status-badge mt-3">
            <span className="pulse-dot"></span>
            <span>{language === 'bn' ? 'সকল এআই মডেল ও এপিআই সক্রিয়' : 'All Core Models & APIs Online'}</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="footer-bottom-strip">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} <strong>Agro-AI</strong>. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All Rights Reserved.'}{' '}
          <span className="footer-event-note">
            {language === 'bn' 
              ? 'বিইউপি সিএসই ফেস্ট ২০২৬ হ্যাকাথনের জন্য নির্মিত।' 
              : 'Built for BUP CSE FEST 2026 Hackathon in association with Poridhi.'}
          </span>
        </p>
      </div>
    </footer>
  );
}
